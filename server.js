'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const watson = require('watson-developer-cloud');
const vcapServices = require('vcap_services');
const cors = require('cors')
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const journalEntries = require('./controllers/journalEntries');
const getJournalEntries = require('./controllers/getJournalEntries');
const journalDelete = require('./controllers/journalDelete');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,        
    ssl: true,      
  }
});

// on bluemix, enable rate-limiting and force https
if (process.env.VCAP_SERVICES) {
  // enable rate-limiting
  const RateLimit = require('express-rate-limit');
  app.enable('trust proxy'); // required to work properly behind Bluemix's reverse proxy

  const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
  });

  //  apply to /api/*
  app.use('/api/', limiter);

  // force https - microphone access requires https in Chrome and possibly other browsers
  // (*.mybluemix.net domains all have built-in https support)
  const secure = require('express-secure-only');
  app.use(secure());
}

app.use(express.static(__dirname + '/static'));
app.use(cors());
app.use(bodyParser.json());

// token endpoints
// **Warning**: these endpoints should probably be guarded with additional authentication & authorization for production use

// speech to text token endpoint
var sttAuthService = new watson.AuthorizationV1(  
  Object.assign(
    {
    "url": "https://stream.watsonplatform.net/speech-to-text/api",
      username: process.env.SPEECH_TO_TEXT_USERNAME, // or hard-code credentials here
      password: process.env.SPEECH_TO_TEXT_PASSWORD      
},
    vcapServices.getCredentials('speech_to_text') // pulls credentials from environment in bluemix, otherwise returns {}
  )
);
app.use('/api/speech-to-text/token', function(req, res) {
  sttAuthService.getToken(
    {
      url: watson.SpeechToTextV1.URL
    },
    function(err, token) {
      if (err) {
        console.log('Error retrieving token: ', err);
        res.status(500).send('Error retrieving token');
        return;
      }
      res.send(token);
    }
  );
});


app.get('/', (req, res)=> { res.send(console.log("RUNNING")) })
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.post('/journal', (req, res) => { journalEntries.handleJournalEntries(req, res, db) });
//app.get('/getjournal/:username', (req, res) => { getJournalEntries.handleGetJournalEntries(req, res, db) })
app.post('/getjournal', (req, res) => { getJournalEntries.handleGetJournalEntries(req, res, db) })
app.post('/delete', (req, res) => { journalDelete.handleJournalDelete(req, res, db)})


const port = process.env.PORT || process.env.VCAP_APP_PORT || 3002
app.listen(port, function() {
  console.log('Example IBM Watson Speech JS SDK client app & token server live at http://localhost:%s/', port);
});

// Chrome requires https to access the user's microphone unless it's a localhost url so
// this sets up a basic server on port 3001 using an included self-signed certificate
// note: this is not suitable for production use
// however bluemix automatically adds https support at https://<myapp>.mybluemix.net
if (!process.env.VCAP_SERVICES) {
  const fs = require('fs');
  const https = require('https');
  const HTTPS_PORT = 3001;

  const options = {
    key: fs.readFileSync(__dirname + '/keys/localhost.pem'),
    cert: fs.readFileSync(__dirname + '/keys/localhost.cert')
  };
  https.createServer(options, app).listen(HTTPS_PORT, function() {
    console.log('Secure server live at https://localhost:%s/', HTTPS_PORT);
  });
}



const handleSignin = (db, bcrypt) => (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json('incorrect form submission');
  }
  console.log(username + " " + password);
  console.log(db);
    db.select('username', 'hash').from('login')
      //.where('username', '=', username)
      .then(data => {
        //const isValid = bcrypt.compareSync(password, data[0].hash);
        console.log("inside");
        //if (isValid) {
          if (true) {

          console.log("true"); 

          return db.select('*').from('login')
            .where('username', '=', username)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  }
  
  module.exports = {
    handleSignin: handleSignin
  }
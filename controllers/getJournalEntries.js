const handleGetJournalEntries = (req, res, db) => {
  
  var { username } = req.params;    
  username = "'" + username + "'";
  console.log(username);
    db.select('*').from('journal').where('username', {username})
      .then(entry => {
        if (entry.length) {
          res.json(entry)
        } else {
          res.status(400).json('Not found')
        }
      })
      .catch(err => res.status(400).json('error getting journalEntries'))
  }
  
  module.exports = {
    handleGetJournalEntries
  }
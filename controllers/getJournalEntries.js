const handleGetJournalEntries = (req, res, db) => {
  alert(username);
    const { username } = req.params;    
    db.select('*').from('journal').where(username, ' + {username} + ')
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
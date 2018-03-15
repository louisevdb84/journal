const handleGetJournalEntries = (req, res, db) => {
    const { id } = req.params;
    console.log(id);
    db.select('*').from('journal')//.where({id})
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
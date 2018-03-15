const handleJournalEntries = (req, res, db) => {
    const { entrydate, topic, entry, username } = req.body;
    if (!entrydate || !topic || !entry || !username) {
        return res.status(400).json('incorrect form submission');
    }      
    
    db('journal').insert({                
            entrydate: entrydate,            
            topic: topic,
            entry: entry,
            username: username 
        })
        
        .then(entry => {
            res.json(entry[0]);
        })        
        .catch(err => res.status(400).json('unable to insert journal entry'))
      }
  
  module.exports = {
    handleJournalEntries: handleJournalEntries
}

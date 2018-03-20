const handleJournalEntries = (req, res, db) => {
    const { entrydate, topic, entry, username, id } = req.body;
    if (!entrydate || !topic || !entry || !username) {
        return res.status(400).json('Entrydate, topic, entry and username is required.');
    }
    
    console.log(id);

    if (!id) {
        db('journal').insert({
            entrydate: entrydate,
            topic: topic,
            entry: entry,
            username: username
        })
        
            .then(entry => {
                res.json("Successfully added journal entry");
            })
            .catch(err => res.status(400).json('Unable to insert journal entry'))
    }
    else {
        db('journal').where('id', id)
            .update({
                entrydate: entrydate,
                topic: topic,
                entry: entry,
                username: username
        })
        
            .then(entry => {
                res.json('Successfully updated journal entry');
            })
            .catch(err => res.status(400).json('unable to edit journal entry'))
    }
}
    
  
  module.exports = {
    handleJournalEntries: handleJournalEntries
}

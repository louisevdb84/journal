const handleJournalEntries = (req, res, db) => {
    const { entrydate, topic, entry, username, id } = req.body;
    if (!entrydate || !topic || !entry || !username) {
        return res.status(400).json('Entrydate, topic and entry is required.');
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
                res.json({
                    success: true,
                    message: "Successfully added journal entry"
                });
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
                res.json({
                    id: id,
                    success: true,    
                    message: "Successfully updated journal entry"
                });
            })
            .catch(err => res.status(400).json('unable to edit journal entry'))
    }
}
    
  
  module.exports = {
    handleJournalEntries: handleJournalEntries
}

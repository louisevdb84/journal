const handleJournalDelete = (req, res, db) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json('incorrect form submission');
    }
    
    db('journal').where('id', id)
        .del()    
            .then(entry => {
                res.json(entry[0]);
            })
            .catch(err => res.status(400).json('unable to insert journal entry'))    
}    
  
  module.exports = {
    handleJournalDelete: handleJournalDelete
}

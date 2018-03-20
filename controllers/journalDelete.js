const handleJournalDelete = (req, res, db) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json('Incorrect form submission');
    }
    
    db('journal').where('id', id)
        .del()    
            .then(entry => {
                res.json('Entry deleted');
            })
            .catch(err => res.status(400).json('Unable to delete journal entry'))    
}    
  
  module.exports = {
    handleJournalDelete: handleJournalDelete
}

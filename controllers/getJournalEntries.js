const handleGetJournalEntries = (req, res, db) => {  
  const { username, searchString, searchDate } = req.body; 
  
  if (!username) {
    return res.status(400).json('Username must be supplied');
  }
  if (searchDate === "" || !searchDate)  
  {
    //db.select(db.raw('entrydate::TIMESTAMP [WITHOUT TIMEZONE]')).from('journal')
    db.select().from('journal')  
      .where('username', username)
      .andWhere('topic', 'like', '%' + searchString + '%')
      .orWhere('entry', 'like', '%' + searchString + '%')
        .andWhere('username', username)         
      .then(entry => {
        if (entry.length) {
          res.json(entry)
        } else {
          res.status(400).json('No journal entries')
        }
      })
      .catch(err => res.status(400).json('Error getting journalEntries'))
  }  
  // else if (searchDate)
  // {
  //   console.log(searchDate);
  //   db('journal').where('username', username)  
  //   .andWhere('entrydate', searchDate)
  //     .then(entry => {
  //       if (entry.length) {
  //         res.json(entry)
  //       } else {
  //         res.status(400).json('Not found')
  //       }
  //     })
  //     .catch(err => res.status(400).json('error getting journalEntries'))
  // }  
  
  }
  
  module.exports = {
    handleGetJournalEntries
  }


// const handleGetJournalEntries = (req, res, db) => {
  
//   var { username } = req.params;      
//   db('journal').where('username', username)
//       .then(entry => {
//         if (entry.length) {
//           res.json(entry)
//         } else {
//           res.status(400).json('Not found')
//         }
//       })
//       .catch(err => res.status(400).json('error getting journalEntries'))
//   }
  
//   module.exports = {
//     handleGetJournalEntries
//   }

// db.select(db.raw('to_timestamp(entrydate, ' + '\'' + 'DD MM YYYY' + '\'' + ')')).from('journal')

// select to_timestamp(entrydate, 'DD MM YYYY') FROM journal
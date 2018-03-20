const handleRegister = (req, res, db, bcrypt) => {
    const { name, surname, username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json('Username and Password are required');
    }    
  const hash = bcrypt.hashSync(password);
  
      db.transaction(trx => {
        trx.insert({          
          hash: hash,
          username: username
        })
        .into('login')
        .returning('username')
        .then(loginUser => {
          return trx('users')
            .returning('*')
            .insert({          
              username: loginUser[0],
              name: name,
              surname: surname
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('Unable to register'))
      }
      
  module.exports = {
    handleRegister: handleRegister
  };

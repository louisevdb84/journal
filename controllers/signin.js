const handleSignin = (db, bcrypt) => (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json('Username and password are required');
  }

    db.select('username', 'hash').from('login')
      .where('username', '=', username)
      .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);        
        if (isValid) {        
            
          return db.select('*').from('login')
            .where('username', '=', username)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('Unable to retrieve user'))
        } else {
          res.status(400).json('Invalid Password')
        }
      })
      .catch(err => res.status(400).json('The username and password are not valid'))
  }
  
  module.exports = {
    handleSignin: handleSignin
  }
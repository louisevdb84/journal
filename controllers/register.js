const handleRegister = (req, res, db, bcrypt) => {
    const { id, username, password } = req.body;
    if (!id || !username || !password) {
      return res.status(400).json('incorrect form submission');
    }
    console.log(id + username + password);
    const hash = bcrypt.hashSync(password);
      db.insert({
          id: id,
          hash: hash,
          username: username
        })
        .into('login')              
      .catch(err => res.status(400).json('unable to register'))
  }
  
  module.exports = {
    handleRegister: handleRegister
  };
  
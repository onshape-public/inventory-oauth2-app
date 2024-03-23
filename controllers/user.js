// Load required packages
const User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    isAdmin: false
  });

  user.save(err => {
    if (err)
    {res.send(err);}

    res.json({ message: 'User added to the system!' });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find((err, users) => {
    if (err)
    {res.send(err);}

    res.json(users);
  });
};

// Create admin user /api/create-admin-user
exports.createAdminUser = function(req, res) {
  const user = new User({
    username: process.env.ADMINUSERNAME,
    password: process.env.ADMINUSERPASSWORD,
    isAdmin: true
  });

  user.save(err => {
    if (err)
    {res.send(err);}

    res.json({ message: 'Admin user added to the system!' });
  });
};
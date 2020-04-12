// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    isAdmin: false
  });

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'User added to the system!' });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};

// Create admin user /api/create-admin-user
exports.createAdminUser = function(req, res) {
  var user = new User({
    username: process.env.ADMINUSERNAME,
    password: process.env.ADMINUSERPASSWORD,
    isAdmin: true
  });

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Admin user added to the system!' });
  });
};
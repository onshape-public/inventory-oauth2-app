// Load required packages
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy
const LocalStrategy = require('passport-local').Strategy
const Token = require('../models/token');
const Application = require('../models/application');
const User = require('../models/user');

passport.use(new BasicStrategy(
  (username, password, callback) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, (err, isMatch) => {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

passport.use('application-basic', new BasicStrategy(
  (username, password, callback) => {
    Application.findOne({ id: username }, (err, application) => {
      if (err) { return callback(err); }

      // No application found with that id or bad password
      if (!application || application.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, application);
    });
  }
));

passport.use(new BearerStrategy((accessToken, callback) => {
  Token.findOne({access: accessToken }, (err, token) => {
    if (err) { return callback(err); }

    // No token found
    if (!token) { return callback(null, false); }

    // Token expired
    const now = new Date();

    if ((Math.abs(token.dateModified.getTime() - now.getTime()) / 1000) > token.expiryTime) {
      return callback(null, false);
    }

    User.findOne({ _id: token.userId }, (err, user) => {
      if (err) { return callback(err); }

      // No user found
      if (!user) { return callback(null, false); }

      // Simple example with no scope
      callback(null, user, { scope: '*' });
    });
  });
}));

passport.use('local-part', new LocalStrategy({
  usernameField: 'client_id',
  passwordField: 'client_secret'
}, ((clientId, clientSecret, callback) => {
  Application.findOne({ clientId: clientId }, (err, application) => {
    if (err) { return callback(err); }

    // No application found with that id or bad password
    if (!application || application.clientSecret !== clientSecret) { return callback(null, false); }

    // Success
    return callback(null, application);
  });
})));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
exports.isApplicationAuthenticated = passport.authenticate('local-part', { session: false });
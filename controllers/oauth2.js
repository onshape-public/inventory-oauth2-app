// Load required packages
const oauth2orize = require('oauth2orize')
const User = require('../models/user');
const Application = require('../models/application');
const Token = require('../models/token');
const Code = require('../models/code');
const application = require('../models/application');
const { db } = require('../models/user');
const tokenTimeout = process.env.TOKENTIMEOUT || 121;

function uid (len) {
  const buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create OAuth 2.0 server
const server = oauth2orize.createServer();

// Register serialialization function
server.serializeClient((client, callback) => callback(null, client._id));

// Register deserialization function
server.deserializeClient((id, callback) => {
  Application.findOne({ _id: id }, (err, application) => {
    if (err) { return callback(err); }
    return callback(null, application);
  });
});

// Register authorization code grant type
server.grant(oauth2orize.grant.code((application, redirectUri, user, ares, callback) => {
  // Create a new authorization code
  const code = new Code({
    value: uid(16),
    applicationId: application._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  // Save the auth code and check for errors
  code.save(err => {
    if (err) { return callback(err); }

    callback(null, code.value);
  });
}));

// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code((application, code, redirectUri, callback) => {
  Code.findOne({ value: code }, (err, authCode) => {
    if (err) { return callback(err); }
    if (authCode === undefined) { return callback(null, false); }
    if (application._id.toString() !== authCode.applicationId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

    // Delete auth code now that it has been used
    authCode.remove(err => {
      if (err) { return callback(err); }

      // Create a new access token
      const token = new Token({
        access: uid(256),
        refresh: uid(256),
        applicationId: authCode.applicationId,
        userId: authCode.userId,
        expiryTime: tokenTimeout,
        dateCreated: new Date(),
        dateModified: new Date()
      });

      // Save the access token and check for errors
      token.save(err => {
        if (err) { return callback(err); }
        const params = {'expires_in': tokenTimeout} ;
        callback(null, token.access, token.refresh, params);
      });
    });
  });
}));

server.exchange(oauth2orize.exchange.refreshToken((application, refreshToken, scope, callback) => {
  Token.findOne({refresh: refreshToken}, (err, token) => {
    if (err) { return callback(err, null, null); }

    if (!token) { return callback(err, null, null); }

    const newtoken = new Token({
      access: uid(256),
      refresh: uid(256),
      applicationId: application._id,
      userId: application.userId,
      expiryTime: tokenTimeout,
      dateCreated: new Date(),
      dateModified: new Date()
    });

    token.deleteOne((err, deletedToken) => {

      if (err) {return callback(err);}
      newtoken.save(err => {
        if (err) {return callback(err, null, null);}
        const params = {'expires_in': tokenTimeout} ;
        callback(null, newtoken.access, newtoken.refresh, params);
      });
    });

  });
}));

// User authorization endpoint
exports.authorization = [
  server.authorization((applicationId, redirectUri, callback) => {
    Application.findOne({ clientId: applicationId }, (err, application) => {
      if (err) { return callback(err); }
      return callback(null, application, redirectUri);
    });
  }),
  function(req, res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, application: req.oauth2.client });
  }
];

// User decision endpoint
exports.decision = [
  server.decision()
];

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
];
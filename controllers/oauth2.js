// Load required packages
var oauth2orize = require('oauth2orize')
var User = require('../models/user');
var Application = require('../models/application');
var Token = require('../models/token');
var Code = require('../models/code');
const application = require('../models/application');
const { db } = require('../models/user');
var tokenTimeout = process.env.TOKENTIMEOUT || 121;

function uid (len) {
    var buf = []
      , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization function
server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient(function(id, callback) {
    Application.findOne({ _id: id }, function (err, application) {
        if (err) { return callback(err); }
        return callback(null, application);
    });
});

// Register authorization code grant type
server.grant(oauth2orize.grant.code(function(application, redirectUri, user, ares, callback) {
    // Create a new authorization code
    var code = new Code({
        value: uid(16),
        applicationId: application._id,
        redirectUri: redirectUri,
        userId: user._id
    });

    // Save the auth code and check for errors
    code.save(function(err) {
        if (err) { return callback(err); }

        callback(null, code.value);
    });
}));

// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(function(application, code, redirectUri, callback) {
    Code.findOne({ value: code }, function (err, authCode) {
      if (err) { return callback(err); }
      if (authCode === undefined) { return callback(null, false); }
      if (application._id.toString() !== authCode.applicationId) { return callback(null, false); }
      if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

      // Delete auth code now that it has been used
      authCode.remove(function (err) {
        if(err) { return callback(err); }

        // Create a new access token
        var token = new Token({
          access: uid(256),
          refresh: uid(256),
          applicationId: authCode.applicationId,
          userId: authCode.userId
        });

        // Save the access token and check for errors
        token.save(function (err) {
          if (err) { return callback(err); }
          const params = {"expires_in" : tokenTimeout} ;
          callback(null, token.access, token.refresh, params);
        });
      });
    });
  }));

  server.exchange(oauth2orize.exchange.refreshToken(function(application, refreshToken, scope, callback) {
    Token.findOne({refresh : refreshToken}, function(err, token) {
      if (err) { return callback(err, null, null); }

      if (!token) { return callback(err, null, null); }

      var newtoken = new Token({
        access: uid(256),
        refresh: uid(256),
        applicationId: application._id,
        userId: application.userId
      });

      token.deleteOne(function(err, deletedToken) {

        if (err) {return callback(err);}
        newtoken.save(function(err) {
          if (err) {return callback(err, null, null);}
          const params = {"expires_in" : tokenTimeout} ;
          callback(null, newtoken.access, newtoken.refresh, params);
        });
      });
       
    });
  }));

  // User authorization endpoint
exports.authorization = [
    server.authorization(function(applicationId, redirectUri, callback) {
      Application.findOne({ clientId: applicationId }, function (err, application) {
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
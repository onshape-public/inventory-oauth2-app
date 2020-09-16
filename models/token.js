// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
  access: { type: String, required: true },
  refresh: { type: String, required: false},
  userId: { type: String, required: true },
  applicationId: { type: String, required: true },
  expiryTime : {type : Number, required : false},
  dateCreated : {type : Date, required : true},
  dateModified : {type : Date, required : true}
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);
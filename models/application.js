// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var ApplicationSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  userId: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Application', ApplicationSchema);
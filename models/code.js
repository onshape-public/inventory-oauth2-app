// Load required packages
const mongoose = require('mongoose');

// Define our token schema
const CodeSchema   = new mongoose.Schema({
  value: { type: String, required: true },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
  applicationId: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Code', CodeSchema);
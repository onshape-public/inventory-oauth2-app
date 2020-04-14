// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var PartNumberSchema   = new mongoose.Schema({
  count: { type: Number, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('PartNumber', PartNumberSchema);
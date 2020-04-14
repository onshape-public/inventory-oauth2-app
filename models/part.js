// Load required packages
var mongoose = require('mongoose');

// Define our part schema
var PartSchema   = new mongoose.Schema({
  partNumber: String,
  name: String,
  quantity: Number,
  price: Number,
  revision: String,
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Part', PartSchema);
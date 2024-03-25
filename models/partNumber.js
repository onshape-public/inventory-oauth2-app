// Load required packages
const mongoose = require('mongoose');

// Define our token schema
const PartNumberSchema   = new mongoose.Schema({
  count: { type: Number, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('PartNumber', PartNumberSchema);
const mongoose = require('mongoose');

// Define a schema for the Image model
const imageSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
  },
  secureUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model for the Image schema
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

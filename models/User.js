// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

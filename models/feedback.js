const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

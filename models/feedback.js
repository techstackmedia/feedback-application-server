const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // Reference the Profile model
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

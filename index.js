const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('debug')('app:db');
const port = require('debug')('app:port');
const bug = require('debug')('app:bug');

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000; // Choose your desired port

// Middleware
app.use(bodyParser.json());

// Mongoose Schema and Model
const feedbackSchema = new mongoose.Schema({
  text: String,
  rating: Number,
  date: { type: Date, default: Date.now } // New date field with default value set to the current date and time
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
app.get('/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ date: -1 }); // Sort by date in descending order
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/feedback', async (req, res) => {
  try {
    const newFeedback = await Feedback.create({
      text: req.body.text,
      rating: req.body.rating,
      date: Date.now() // Set the current date and time when creating a new feedback entry
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (other routes remain the same)

// Connect to MongoDB and start the server
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => db('MongoDB Connected'))
  .catch((err) => bug('Error connecting to MongoDB.', err.message));

app.listen(PORT, () => port(`Server started on port ${PORT}`));

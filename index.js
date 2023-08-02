const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const db = require("debug")("app:db");
const port = require("debug")("app:port");
const bug = require("debug")("app:bug");

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT; // Choose your desired port

// Middleware
app.use(bodyParser.json());

// Mongoose Schema and Model
const feedbackSchema = new mongoose.Schema({
  text: String,
  rating: Number,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
app.get('/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ id: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/feedback', async (req, res) => {
  try {
    const newFeedback = await Feedback.create(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/feedback/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Connect to MongoDB and start the server
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => db("MongoDB Connected"))
  .catch((err) => bug('Error connecting to MongoDB.', err.message));


app.listen(PORT, () => port(`Server started on port ${PORT}`));
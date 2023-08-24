const express = require('express');
const Feedback = require('../models/feedback');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page number
    const limit = 10; // Set the number of feedback items per page
    const skip = (page - 1) * limit; // Calculate the number of items to skip
    
    const feedbackCount = await Feedback.countDocuments(); // Get the total count of feedback items
    const totalPages = Math.ceil(feedbackCount / limit); // Calculate the total number of pages
    
    const feedback = await Feedback.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      feedback,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {      
  
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

router.post('/', async (req, res) => {
  try {
    const newFeedback = await Feedback.create({
      text: req.body.text,
      rating: req.body.rating,
      date: Date.now(),
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    req.body.date = Date.now();
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

router.put('/:id', async (req, res) => {
  try {
    req.body.date = Date.now();
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const Feedback = require('../models/feedback');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ date: -1 });
    res.json(feedback);
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
      profile: req.body.profile, // Add the profile ObjectId here
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Uploads will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + originalExtension); // Use the original extension
  },
});

const upload = multer({ storage: storage }); // Define upload middleware here

router.post(
  '/upload-profile-image',
  upload.single('profileImage'),
  async (req, res) => {
    try {
      // console.log('Uploaded File:', req.file); // Log the uploaded file information

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });

      if (!result || !result.secure_url) {
        return res
          .status(500)
          .json({ error: 'Image upload to Cloudinary failed' });
      }
      const profileImageUrl = result.secure_url;
      // console.log('Profile Image URL:', profileImageUrl);

      res.status(201).json({ profileImage: profileImageUrl });
    } catch (error) {
      // console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Add this route to your backend code
router.get('/profile-image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    // Construct the Cloudinary URL based on the filename
    const profileImageUrl = cloudinary.url(filename, {
      width: 36, // Set the width to 36
      height: 36, // Set the height to 36
      crop: 'fill',
      secure: true,
      fetch_format: 'auto',
    });
    
    res.json({ profileImage: profileImageUrl });
  } catch (error) {
    console.error('Error:', error);
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

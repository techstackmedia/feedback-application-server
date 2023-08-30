const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('debug')('app:db');
const port = require('debug')('app:port');
const bug = require('debug')('app:bug');
const feedbackRoutes = require('./routes/feedback');
const cloudinary = require('cloudinary');

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Connect to MongoDB and start the server
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => db('MongoDB Connected'))
  .catch((err) => bug('Error connecting to MongoDB.', err.message));

// Routes
app.use('/feedback', feedbackRoutes);

app.listen(PORT, () => port(`Server started on port ${PORT}`));

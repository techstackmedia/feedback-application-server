const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('debug')('app:db');
const port = require('debug')('app:port');
const bug = require('debug')('app:bug');
const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/users'); // Add user routes
const qrCodeRoutes = require('./routes/qrCodeSecret'); 
const imageRoutes = require('./routes/images'); // Add user routes
const cloudinary = require('cloudinary');
const cors = require('cors');
const passport = require('passport'); // Import Passport.js
const session = require('express-session'); // Import express-session

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors()); // Apply cors middleware first
app.use(bodyParser.json());

// Initialize session middleware
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/users', userRoutes); // Use user routes
app.use('/users', qrCodeRoutes);
app.use('/users', imageRoutes);

app.listen(PORT, () => port(`Server started on port ${PORT}`));

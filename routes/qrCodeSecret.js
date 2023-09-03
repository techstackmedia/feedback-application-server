const express = require('express');
const router = express.Router();
const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Specify the field for username (email)
      passwordField: 'password', // Specify the field for password
    },
    async (email, password, done) => {
      try {
        // Find the user in your database by email
        const user = await User.findOne({ email });

        // If the user is not found or the password is incorrect, return an error
        if (!user || !user.validPassword(password)) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // If the user is found and the password is correct, return the user object
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize the user for storing in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

// Endpoint to generate a secret key for 2FA
router.get('/protected', isAuthenticated, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  try {
    // Generate a secret key for the user
    const secret = speakeasy.generateSecret({ length: 20 }).base32;

    // Securely store the secret key in your database, associated with the user's account
    const userId = req.user.id; // Assuming you have user authentication
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.otpSecret = secret; // Store the secret key in the user's document
    await user.save();

    // Return the secret key to the client (you might want to handle this securely)
    res.status(200).json({ secret });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
});

// Endpoint to generate a QR code for 2FA setup
router.get('/generate-qr-code', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  try {
    const userId = req.user.id; // Assuming you have user authentication
    const user = await User.findById(userId);

    if (!user || !user.otpSecret) {
      return res
        .status(404)
        .json({ error: 'User not found or 2FA not enabled' });
    }

    // Generate a QR code URL with the secret and user's email (or any other identifier)
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: user.otpSecret,
      label: user.email, // You can use a user identifier here
      issuer: process.env.OTP_AUTH_APP_NAME, // Your app's name
    });

    // Generate the QR code
    const qrCodeDataURL = await qrcode.toDataURL(otpAuthUrl);

    res.status(200).json({ qrCodeDataURL });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;

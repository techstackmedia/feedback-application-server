const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer'); // Import Nodemailer
const ms = require('ms'); // Import the 'ms' library

// Error handling middleware
const errorHandler = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
};

// Validation middleware
const validateSignupInput = (req, res, next) => {
  const { email, password } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Check password strength (e.g., minimum length)
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters long' });
  }

  next(); // Continue to the next middleware if validation passes
};

// Function to generate an access token with expiration time
const generateAccessToken = (userId) => {
  const expiresIn = ms('30 days'); // Set the expiration time, e.g., 1 hour
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });
  return {
    token: accessToken,
    expiresIn, // Include the expiration time in the response
  };
};

// Function to generate a refresh token with expiration time
const generateRefreshToken = () => {
  const expiresIn = ms('60 days'); // Set the expiration time, e.g., 7 days
  const refreshToken = jwt.sign({}, process.env.JWT_SECRET_KEY, { expiresIn });
  return {
    token: refreshToken,
    expiresIn, // Include the expiration time in the response
  };
};

// Function to generate a random 6-digit OTP
const generateOTP = (secret) => {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32',
  });
};

// Function to verify an OTP
const verifyOTP = (otp, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: otp,
    window: 2,
  });
};

// Function to send an email with the security key and OTP
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., 'Gmail'
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// User Sign-up
router.post('/signup', validateSignupInput, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      twoFactorEnabled: false,
    });

    await newUser.save();

    // Generate an access token and a refresh token with expiration times
    const accessTokenData = generateAccessToken(newUser._id);
    const refreshTokenData = generateRefreshToken();

    res.status(201).json({
      message: 'Registration successful',
      accessToken: accessTokenData.token,
      refreshToken: refreshTokenData.token,
      accessTokenExpiration: accessTokenData.expiresIn, // Include the access token expiration time
      refreshTokenExpiration: refreshTokenData.expiresIn, // Include the refresh token expiration time
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Check if 2FA is enabled for the user
    if (user.twoFactorEnabled) {
      // Verify the OTP
      const otpVerified = verifyOTP(otp, user.otpSecret);

      if (!otpVerified) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
    }

    // If credentials and OTP (if enabled) are valid, generate new tokens with expiration times
    const accessTokenData = generateAccessToken(user._id);
    const refreshTokenData = generateRefreshToken();

    res.status(200).json({
      message: 'Login successful',
      accessToken: accessTokenData.token,
      refreshToken: refreshTokenData.token,
      accessTokenExpiration: accessTokenData.expiresIn, // Include the access token expiration time
      refreshTokenExpiration: refreshTokenData.expiresIn, // Include the refresh token expiration time
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// Enable 2FA for a user
router.post('/enable-2fa', async (req, res) => {
  const { userId, email } = req.body; // Add email to the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a secret key for 2FA
    const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;

    // Store the secret key in your database
    user.otpSecret = otpSecret;

    // Save the user document with the new secret key

    await user.save();

    // Generate an initial OTP for the user to confirm 2FA setup
    const initialOTP = generateOTP(otpSecret);

    // Send the initialOTP to the user through email
    const subject = '2FA Setup - Initial OTP';
    const text = `Your initial OTP for 2FA setup is: ${initialOTP}`;
    await sendEmail(email, subject, text);

    res.status(200).json({ message: '2FA enabled', initialOTP });
  } catch (error) {
    errorHandler(res, error);
  }
});

// Disable 2FA for a user (for testing purposes; you might want to implement stricter controls)
router.post('/disable-2fa', async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Disable 2FA for the user
    user.twoFactorEnabled = false;
    user.otpSecret = null; // Clear the OTP secret

    await user.save();

    res.status(200).json({ message: '2FA disabled' });
  } catch (error) {
    errorHandler(res, error);
  }
});

module.exports = router;

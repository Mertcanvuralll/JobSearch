const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  }),
  authController.googleCallback
);

module.exports = router; 
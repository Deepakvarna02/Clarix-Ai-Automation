const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings.jsx');
const { adminAuth } = require('../middleware/auth.jsx');

const router = express.Router();

// Get current settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne().sort({ createdAt: -1 });
    if (!settings) {
      // Return default settings if none exist
      return res.json({
        name: 'Deepak Varma',
        email: 'kottapalli.deepakvarma2005@gmail.com',
        phone: '+91 94937 43580',
        location: 'India'
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/', adminAuth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 1 }).withMessage('Phone is required'),
  body('location').trim().isLength({ min: 1 }).withMessage('Location is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location
      },
      { upsert: true, new: true }
    );
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
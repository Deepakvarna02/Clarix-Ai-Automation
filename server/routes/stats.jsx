const express = require('express');
const { body, validationResult } = require('express-validator');
const Stats = require('../models/Stats.jsx');
const { adminAuth } = require('../middleware/auth.jsx');

const router = express.Router();

// Get current stats
router.get('/', async (req, res) => {
  try {
    const stats = await Stats.findOne().sort({ createdAt: -1 });
    if (!stats) {
      // Return default stats if none exist
      return res.json({
        stat1Number: '10+',
        stat1Label: 'AI Tools Mastered',
        stat2Number: '4',
        stat2Label: 'Core Services',
        stat3Number: '1',
        stat3Label: 'Focused Mission'
      });
    }
    res.json({
      stat1Number: stats.stat1Number,
      stat1Label: stats.stat1Label,
      stat2Number: stats.stat2Number,
      stat2Label: stats.stat2Label,
      stat3Number: stats.stat3Number,
      stat3Label: stats.stat3Label
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stats
router.put('/', adminAuth, [
  body('stat1Number').trim().isLength({ min: 1 }).withMessage('Stat 1 number is required'),
  body('stat1Label').trim().isLength({ min: 1 }).withMessage('Stat 1 label is required'),
  body('stat2Number').trim().isLength({ min: 1 }).withMessage('Stat 2 number is required'),
  body('stat2Label').trim().isLength({ min: 1 }).withMessage('Stat 2 label is required'),
  body('stat3Number').trim().isLength({ min: 1 }).withMessage('Stat 3 number is required'),
  body('stat3Label').trim().isLength({ min: 1 }).withMessage('Stat 3 label is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedStats = await Stats.findOneAndUpdate(
      {},
      {
        stat1Number: req.body.stat1Number,
        stat1Label: req.body.stat1Label,
        stat2Number: req.body.stat2Number,
        stat2Label: req.body.stat2Label,
        stat3Number: req.body.stat3Number,
        stat3Label: req.body.stat3Label
      },
      { upsert: true, new: true }
    );
    res.json(updatedStats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
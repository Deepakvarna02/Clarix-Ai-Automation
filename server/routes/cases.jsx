const express = require('express');
const { body, validationResult } = require('express-validator');
const Case = require('../models/Case.jsx');
const { adminAuth } = require('../middleware/auth.jsx');

const router = express.Router();

// Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new case
router.post('/', adminAuth, [
  body('client').trim().isLength({ min: 1 }).withMessage('Client is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('result1Number').trim().isLength({ min: 1 }).withMessage('Result 1 number is required'),
  body('result1Label').trim().isLength({ min: 1 }).withMessage('Result 1 label is required'),
  body('result2Number').trim().isLength({ min: 1 }).withMessage('Result 2 number is required'),
  body('result2Label').trim().isLength({ min: 1 }).withMessage('Result 2 label is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const caseStudy = new Case({
    client: req.body.client,
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    result1Number: req.body.result1Number,
    result1Label: req.body.result1Label,
    result2Number: req.body.result2Number,
    result2Label: req.body.result2Label,
    status: req.body.status || '',
    tools: req.body.tools || []
  });

  try {
    const newCase = await caseStudy.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a case
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: 'Case deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
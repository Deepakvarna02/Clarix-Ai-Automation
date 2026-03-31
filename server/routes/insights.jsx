const express = require('express');
const { body, validationResult } = require('express-validator');
const Insight = require('../models/Insight.jsx');
const { adminAuth } = require('../middleware/auth.jsx');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const insights = await Insight.find().sort({ createdAt: -1 });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('excerpt').trim().isLength({ min: 1 }).withMessage('Excerpt is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('readTime').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const insight = await Insight.create({
      title: req.body.title,
      excerpt: req.body.excerpt,
      readTime: req.body.readTime || '5 min read',
      category: req.body.category,
      content: req.body.content
    });

    res.status(201).json(insight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Insight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Insight deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

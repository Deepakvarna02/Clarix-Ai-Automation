const express = require('express');
const { body, validationResult } = require('express-validator');
const Tool = require('../models/Tool.jsx');
const { adminAuth } = require('../middleware/auth.jsx');

const router = express.Router();

// Get all tools
router.get('/', async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new tool
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('use').trim().isLength({ min: 1 }).withMessage('Use description is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const tool = new Tool({
    name: req.body.name,
    category: req.body.category,
    use: req.body.use
  });

  try {
    const newTool = await tool.save();
    res.status(201).json(newTool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a tool
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tool deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
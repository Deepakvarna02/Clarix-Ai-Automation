const express = require('express');
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter.jsx');

const router = express.Router();

const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }

  return true;
};

const subscribeHandler = async (req, res) => {
  if (!validateRequest(req, res)) {
    return;
  }

  try {
    const email = req.body.email.toLowerCase();

    await Newsletter.findOneAndUpdate(
      { email },
      {
        email,
        isSubscribed: true,
        subscribedAt: new Date(),
        unsubscribedAt: null
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ message: 'Failed to subscribe. Please try again.' });
  }
};

router.post('/', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], subscribeHandler);

router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], subscribeHandler);

router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  if (!validateRequest(req, res)) {
    return;
  }

  try {
    const email = req.body.email.toLowerCase();
    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found.' });
    }

    subscriber.isSubscribed = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ message: 'Failed to unsubscribe. Please try again.' });
  }
});

router.get('/status/:email', async (req, res) => {
  const email = req.params.email;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Valid email is required.' });
  }

  try {
    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.json({ isSubscribed: false, found: false });
    }

    res.json({
      found: true,
      isSubscribed: subscriber.isSubscribed,
      subscribedAt: subscriber.subscribedAt,
      unsubscribedAt: subscriber.unsubscribedAt
    });
  } catch (error) {
    console.error('Newsletter status error:', error);
    res.status(500).json({ message: 'Failed to get newsletter status.' });
  }
});

module.exports = router;
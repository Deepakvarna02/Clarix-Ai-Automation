const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }

  return true;
};

router.post('/welcome', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required')
], async (req, res) => {
  if (!validateRequest(req, res)) {
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return res.status(503).json({ message: 'Email service is not configured.' });
  }

  try {
    const { email, name } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Clarix',
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thanks for connecting with Clarix.</p>
        <p>We are excited to help you scale with practical AI solutions.</p>
      `
    });

    res.json({ message: 'Welcome email sent successfully.' });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ message: 'Failed to send welcome email.' });
  }
});

router.post('/drip', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('campaignId').trim().isLength({ min: 1 }).withMessage('Campaign ID is required')
], async (req, res) => {
  if (!validateRequest(req, res)) {
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return res.status(503).json({ message: 'Email service is not configured.' });
  }

  try {
    const { email, campaignId } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Clarix Update: ${campaignId}`,
      html: `
        <h2>Your Clarix Update</h2>
        <p>This email belongs to campaign: <strong>${campaignId}</strong>.</p>
        <p>We will send you practical AI implementation tips next.</p>
      `
    });

    res.json({ message: 'Drip email sent successfully.' });
  } catch (error) {
    console.error('Drip email error:', error);
    res.status(500).json({ message: 'Failed to send drip email.' });
  }
});

module.exports = router;

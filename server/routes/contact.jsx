const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const ContactSubmission = require('../models/ContactSubmission.jsx');

const router = express.Router();

// Create email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: (process.env.EMAIL_USER || '').trim(),
    pass: (process.env.EMAIL_PASS || '').trim()
  }
});

const contactValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('service').optional().trim(),
  body('budget').optional().trim(),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
];

const submitContactEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const submission = await ContactSubmission.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      service: req.body.service || '',
      budget: req.body.budget || '',
      message: req.body.message,
      ip: req.ip || '',
      userAgent: req.get('user-agent') || ''
    });

    // Notify business owner about the new lead.
    const ownerMailOptions = {
      from: (process.env.EMAIL_USER || '').trim(),
      to: 'kottapalli.deepakvarma2005@gmail.com', // Deepak's email
      subject: `New Contact Form Submission - ${req.body.name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${req.body.name}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Phone:</strong> ${req.body.phone || 'Not provided'}</p>
        <p><strong>Service:</strong> ${req.body.service || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${req.body.budget || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${req.body.message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send confirmation email to the user.
    const userMailOptions = {
      from: (process.env.EMAIL_USER || '').trim(),
      to: req.body.email,
      subject: 'Thanks for contacting Clarix - we received your message',
      html: `
        <h3>Thank you for reaching out, ${req.body.name}!</h3>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Your submitted details:</strong></p>
        <p><strong>Service:</strong> ${req.body.service || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${req.body.message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Regards,</p>
        <p><strong>Clarix Team</strong></p>
      `
    };

    // Send both emails before confirming success.
    try {
      await Promise.all([
        transporter.sendMail(ownerMailOptions),
        transporter.sendMail(userMailOptions)
      ]);

      submission.emailStatus = 'sent';
      await submission.save();

      return res.json({ message: 'Message sent successfully' });
    } catch (mailError) {
      submission.emailStatus = 'failed';
      submission.emailError = mailError && mailError.message ? String(mailError.message).slice(0, 500) : 'Unknown email error';
      await submission.save();

      console.error('Email delivery failed. Submission saved:', mailError);

      return res.status(202).json({
        message: 'Message received successfully. Email notification is temporarily unavailable.',
        emailDelivered: false
      });
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
};

// Support both existing client path and EmailService path.
router.post('/', contactValidation, submitContactEmail);
router.post('/email', contactValidation, submitContactEmail);

router.get('/submissions', async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit || 20);
    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    const submissions = await ContactSubmission.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email phone service message emailStatus createdAt');

    res.json({
      total: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Fetch contact submissions error:', error);
    res.status(500).json({ message: 'Failed to load contact submissions.' });
  }
});

module.exports = router;
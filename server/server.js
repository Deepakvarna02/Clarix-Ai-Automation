const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Allow CommonJS to load .jsx files for server routes/models.
if (!require.extensions['.jsx']) {
  require.extensions['.jsx'] = require.extensions['.js'];
}

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim().length < 16) {
  console.error('JWT_SECRET is missing or too short. Set a strong JWT_SECRET in server/.env before starting the server.');
  process.exit(1);
}

const normalizeOrigin = (origin) => String(origin || '').trim().replace(/\/$/, '');
const allowedOrigins = String(process.env.CORS_ORIGIN || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const corsOptions = allowedOrigins.length
  ? {
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        const normalized = normalizeOrigin(origin);
        if (allowedOrigins.includes(normalized)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      }
    }
  : { origin: true };

// Trust first proxy so rate limiter works correctly behind dev proxy/server.
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Targeted limiter for public contact endpoint.
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  message: { message: 'Too many contact attempts. Please try again in a few minutes.' }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clarix')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth.jsx'));
app.use('/api/tools', require('./routes/tools.jsx'));
app.use('/api/cases', require('./routes/cases.jsx'));
app.use('/api/insights', require('./routes/insights.jsx'));
app.use('/api/stats', require('./routes/stats.jsx'));
app.use('/api/settings', require('./routes/settings.jsx'));
app.use('/api/contact', contactLimiter, require('./routes/contact.jsx'));
app.use('/api/newsletter', require('./routes/newsletter.jsx'));
app.use('/api/email', require('./routes/email.jsx'));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing process or change PORT in server/.env.`);
    process.exit(1);
  }

  console.error('Server failed to start:', error);
  process.exit(1);
});
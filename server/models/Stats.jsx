const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  stat1Number: {
    type: String,
    required: true,
    trim: true
  },
  stat1Label: {
    type: String,
    required: true,
    trim: true
  },
  stat2Number: {
    type: String,
    required: true,
    trim: true
  },
  stat2Label: {
    type: String,
    required: true,
    trim: true
  },
  stat3Number: {
    type: String,
    required: true,
    trim: true
  },
  stat3Label: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stats', statsSchema);
const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  result1Number: {
    type: String,
    required: true,
    trim: true
  },
  result1Label: {
    type: String,
    required: true,
    trim: true
  },
  result2Number: {
    type: String,
    required: true,
    trim: true
  },
  result2Label: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['', 'live'],
    default: ''
  },
  tools: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
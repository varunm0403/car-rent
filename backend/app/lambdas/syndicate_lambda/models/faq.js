// faq.js (FAQ Model)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * FAQ Schema
 * Defines the structure and validation for FAQ documents
 */
const faqSchema = new Schema({
  // FAQ details
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true
  },

  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the FAQ model
const FAQ = mongoose.model('FAQ', faqSchema,'faq');

module.exports = FAQ;

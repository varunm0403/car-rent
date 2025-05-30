/**
 * Support Agent List Model
 * Stores emails that should be assigned the Support Agent role
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Support Agent List Schema
 */
const supportAgentListSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Support Agent List model
const SupportAgentList = mongoose.model('SupportAgentList', supportAgentListSchema);
module.exports = SupportAgentList;
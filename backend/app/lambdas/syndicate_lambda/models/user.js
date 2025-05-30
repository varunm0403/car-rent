/**
 * User Model
 * Defines the schema for user data in MongoDB
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { USER_ROLES } = require('../config/config');

/**
 * User Schema
 * Defines the structure and validation for user documents
 */
const userSchema = new Schema({
  // Authentication fields
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },

  // Personal information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },

  // Address information
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },

  // Documents
  drivingLicense: {
    number: String,
    expiryDate: Date,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    },
    uploadDate: Date
  },
  
  passport: {
    number: String,
    expiryDate: Date,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    },
    uploadDate: Date
  },

  // Profile information
  avatar: {
    type: String,
    default: 'https://application.s3.eu-central-1.amazonaws.com/img/users/default-avatar.png'
  },

  // Role and permissions
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save middleware
 * Updates the updatedAt timestamp before saving
 */
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Instance method to get full name
 * @returns {string} Full name of the user
 */
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * Instance method to get public profile
 * Returns user data without sensitive information
 * @returns {Object} User profile without sensitive data
 */
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();

  // Remove sensitive information
  delete userObject.password;

  return userObject;
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
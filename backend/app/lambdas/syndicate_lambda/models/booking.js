/**
 * Booking Model
 * Defines the schema for booking data in MongoDB
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../config/config');

/**
 * Booking Schema
 * Defines the structure and validation for booking documents
 */
const bookingSchema = new Schema({
  // Relations
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car is required']
  },
  
  // Booking details
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(endDate) {
        return endDate > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  
  // Status information
  status: {
    type: String,
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.RESERVED
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  
  // Location information
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Dropoff location is required'],
    trim: true
  },
  
  // Booking source
  createdBy: {
    type: String,
    enum: ['customer', 'support_agent'],
    default: 'customer'
  },
  agentId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Additional services
  additionalServices: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // Booking number and order details
  bookingNumber: {
    type: String,
    unique: true
  },
  
  // Notes
  notes: {
    type: String,
    trim: true
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
 * Updates the updatedAt timestamp and generates booking number if not present
 */

// Add compound index to prevent duplicate bookings
bookingSchema.index(
  { 
    user: 1, 
    car: 1, 
    startDate: 1, 
    endDate: 1,
    status: 1
  }, 
  { 
    unique: true,
    partialFilterExpression: {
      status: { 
        $in: [
          BOOKING_STATUS.RESERVED, 
          BOOKING_STATUS.RESERVED_BY_SUPPORT_AGENT,
          BOOKING_STATUS.SERVICE_STARTED
        ] 
      }
    }
  }
);

bookingSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Generate booking number if not present
  if (!this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Use a unique timestamp + random string instead of a sequential counter
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Format: YYMMDD-XXXX (year, month, day, timestamp suffix)
    this.bookingNumber = `${year}${month}${day}-${random}${timestamp % 10000}`;
  }
  
  next();
});

/**
 * Calculate duration of booking in days
 * @returns {number} Duration in days
 */
bookingSchema.methods.getDurationInDays = function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * Get formatted order details string
 * @returns {string} Formatted order details
 */
bookingSchema.methods.getOrderDetails = function() {
  const date = new Date(this.createdAt);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  
  return `#${this.bookingNumber.split('-')[1]} (${day}.${month}.${year})`;
};

// Create and export the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
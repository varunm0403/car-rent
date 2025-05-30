/**
 * Car Model
 * Defines the schema for car data in MongoDB
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Car Schema
 * Defines the structure and validation for car documents
 */
const carSchema = new Schema({
  // Basic car information
  make: {
    type: String,
    required: [true, 'Make is required'],
    trim: true
  },
  model: {
    type: String,
    required: false,
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  
  // Display model (combined make, model, year)
  displayModel: {
    type: String,
    required: false,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['AVAILABLE', 'BOOKED', 'UNAVAILABLE'],
    default: 'AVAILABLE'
  },
  
  // Technical specifications
  engineCapacity: {
    type: String,
    required: true
  },
  passengerCapacity: {
    type: String,
    required: true
  },
  fuelConsumption: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'],
    required: true
  },
  gearBoxType: {
    type: String,
    enum: ['MANUAL', 'AUTOMATIC'],
    required: true
  },
  climateControlOption: {
    type: String,
    enum: ['NONE', 'AIR_CONDITIONER', 'CLIMATE_CONTROL', 'TWO_ZONE_CLIMATE_CONTROL'],
    default: 'NONE'
  },
  
  // Rental information
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    enum: ['ECONOMY', 'LUXURY', 'SEDAN','COMFORT', 'BUSINESS', 'PREMIUM', 'CROSSOVER', 'MINIVAN', 'HATCHBACK','VAN','SUV'],
    required: true
  },
  
  // Images and location
  images: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  
  // Ratings
  carRating: {
    type: String,
    default: '0.0'
  },
  serviceRating: {
    type: String,
    default: '0.0'
  },
  
  // Popularity score for recommendations
  popularityScore: {
    type: Number,
    default: 0
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
 * Updates the updatedAt timestamp and displayModel before saving
 */
carSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.displayModel = `${this.make} ${this.model} ${this.year}`;
  next();
});

/**
 * Instance method to check if car is available for a date range
 * @param {Date} startDate - Start date of the booking
 * @param {Date} endDate - End date of the booking
 * @returns {Promise<boolean>} True if car is available
 */
carSchema.methods.isAvailableForDates = async function(startDate, endDate) {
  const Booking = mongoose.model('Booking');
  
  const conflictingBooking = await Booking.findOne({
    car: this._id,
    status: { $in: ['RESERVED', 'RESERVED_BY_SUPPORT_AGENT', 'SERVICE_STARTED'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });
  
  return !conflictingBooking && this.status === 'AVAILABLE';
};

// Create and export the Car model
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
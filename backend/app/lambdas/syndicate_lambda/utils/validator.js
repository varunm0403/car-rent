/**
 * Validator Utility
 * Handles data validation using Joi
 */

const Joi = require('joi');
const { USER_ROLES, BOOKING_STATUS, PAYMENT_STATUS } = require('../config/config');

/**
 * Validate data against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Joi schema to validate against
 * @returns {Object} Validated data
 */
const validate = (data, schema) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const validationError = new Error('Validation error');
    validationError.name = 'ValidationError';
    validationError.details = error.details.map(detail => ({
      message: detail.message,
      path: detail.path
    }));
    throw validationError;
  }
  
  return value;
};

// Define validation schemas
const schemas = {
  // Auth schemas
  signIn: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),
  
  signUp: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required'
    }),
    phoneNumber: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    street: Joi.string().allow('', null),
    postalCode: Joi.string().allow('', null)
  }),
  
  // Car schemas
  createCar: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    status: Joi.string().valid('AVAILABLE', 'BOOKED', 'UNAVAILABLE').default('AVAILABLE'),
    engineCapacity: Joi.string().required(),
    passengerCapacity: Joi.string().required(),
    fuelConsumption: Joi.string().required(),
    fuelType: Joi.string().valid('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID').required(),
    gearBoxType: Joi.string().valid('MANUAL', 'AUTOMATIC').required(),
    climateControlOption: Joi.string().valid('NONE', 'AIR_CONDITIONER', 'CLIMATE_CONTROL', 'TWO_ZONE_CLIMATE_CONTROL').default('NONE'),
    pricePerDay: Joi.number().min(0).required(),
    category: Joi.string().valid('ECONOMY', 'COMFORT', 'BUSINESS', 'PREMIUM', 'CROSSOVER', 'MINIVAN', 'ELECTRIC').required(),
    images: Joi.array().items(Joi.string()),
    location: Joi.string().required()
  }),
  
  // Booking schemas
  createBooking: Joi.object({
    carId: Joi.string().required().messages({
      'any.required': 'Car ID is required'
    }),
    startDate: Joi.date().iso().required().messages({
      'date.base': 'Start date must be a valid date',
      'any.required': 'Start date is required'
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after start date',
      'any.required': 'End date is required'
    }),
    pickupLocation: Joi.string().required().messages({
      'any.required': 'Pickup location is required'
    }),
    dropoffLocation: Joi.string().required().messages({
      'any.required': 'Dropoff location is required'
    }),
    additionalServices: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required()
      })
    ).optional()
  }),
  
  // Feedback schemas
  createFeedback: Joi.object({
    bookingId: Joi.string().required(),
    carId: Joi.string().required(),
    clientId: Joi.string().required(),
    rating: Joi.string().pattern(/^[1-5](\.[0-9])?$/).required().messages({
      'string.pattern.base': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required'
    }),
    feedbackText: Joi.string().required().messages({
      'any.required': 'Feedback text is required'
    })
  }),
  
  // Report schemas
  generateReport: Joi.object({
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso().min(Joi.ref('dateFrom')),
    locationId: Joi.string(),
    carId: Joi.string(),
    supportAgentId: Joi.string()
  }),
  
  // User schemas
  updateUser: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string().allow(''),
    country: Joi.string().allow(''),
    city: Joi.string().allow(''),
    street: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    avatar: Joi.any() // For handling file uploads
  }),
  
  // Password change schema
  changePassword: Joi.object({
    currentPassword: Joi.string().required().min(8).max(100),
    newPassword: Joi.string().required().min(8).max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({ 'any.only': 'Passwords do not match' })
  }),
};

module.exports = {
  validate,
  schemas
};
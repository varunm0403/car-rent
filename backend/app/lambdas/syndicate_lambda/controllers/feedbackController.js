/**
 * Feedback Controller
 * Handles feedback/review operations
 */

const { validate, schemas } = require('../utils/validator');
const { connectToDatabase } = require('../config/database');
const Feedback = require('../models/feedback');
const Booking = require('../models/booking');
const Car = require('../models/car');
const User = require('../models/user');
const { authenticate } = require('../middleware/auth');
const { BOOKING_STATUS } = require('../config/config');

/**
 * Create a new feedback/review
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with created feedback
 */
const createFeedback = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    
    // Parse and validate request body
    const body = JSON.parse(authenticatedEvent.body || '{}');
    
    // Set clientId to current user if not provided
    if (!body.clientId) {
      body.clientId = userId;
    }
    
    const validatedData = validate(body, schemas.createFeedback);
    
    // Connect to database
    await connectToDatabase();
    
    // Check if booking exists and belongs to the user
    const booking = await Booking.findById(validatedData.bookingId);
    if (!booking) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Booking not found' })
      };
    }
    
    // Verify booking belongs to user
    if (booking.user.toString() !== userId.toString() && 
        validatedData.clientId.toString() !== booking.user.toString()) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Not authorized to leave feedback for this booking' })
      };
    }
    
    // Verify booking is completed
    if (booking.status !== BOOKING_STATUS.COMPLETED && booking.status !== BOOKING_STATUS.SERVICE_COMPLETED) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Can only leave feedback for completed bookings' })
      };
    }
    
    // Check if user already left feedback for this booking
    const existingFeedback = await Feedback.findOne({ bookingId: validatedData.bookingId });
    if (existingFeedback) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Feedback already submitted for this booking' })
      };
    }
    
    // Create new feedback
    const feedback = new Feedback({
      clientId: validatedData.clientId,
      carId: validatedData.carId,
      bookingId: validatedData.bookingId,
      rating: validatedData.rating,
      feedbackText: validatedData.feedbackText
    });
    
    await feedback.save();
    
    // Get car details
    const car = await Car.findById(validatedData.carId);
    const carName = car ? `${car.make} ${car.model}` : 'the car';
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Thank you for your feedback on ${carName}!`
      })
    };
  } catch (error) {
    console.error('Error in createFeedback:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Validation error', details: error.details })
      };
    }
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error submitting feedback' })
    };
  }
};

/**
 * Get all feedback for a car
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with car feedback
 */
const getCarFeedback = async (event) => {
  try {
    // Extract car ID from path parameters
    const { carId } = event.pathParameters || {};
    
    if (!carId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Car ID is required' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get feedback for car
    const feedback = await Feedback.find({ carId })
      .populate('clientId', 'firstName lastName avatar')
      .sort({ createdAt: -1 });
    
    // Format feedback for response
    const formattedFeedback = feedback.map(item => {
      const client = item.clientId;
      return {
        id: item._id,
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Anonymous',
        clientAvatar: client && client.avatar ? client.avatar : null,
        rating: item.rating,
        feedbackText: item.feedbackText,
        date: new Date(item.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
    });
    
    // Calculate average rating
    let averageRating = "0.0";
    if (feedback.length > 0) {
      const sum = feedback.reduce((total, item) => total + parseFloat(item.rating), 0);
      averageRating = (sum / feedback.length).toFixed(1);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: formattedFeedback,
        averageRating: averageRating,
        count: feedback.length
      })
    };
  } catch (error) {
    console.error('Error in getCarFeedback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching feedback' })
    };
  }
};

/**
 * Get user's feedback
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with user's feedback
 */
const getUserFeedback = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    
    // Connect to database
    await connectToDatabase();
    
    // Get user's feedback
    const feedback = await Feedback.find({ clientId: userId })
      .populate('carId', 'make model year images')
      .populate('bookingId', 'startDate endDate bookingNumber')
      .sort({ createdAt: -1 });
    
    // Format feedback for response
    const formattedFeedback = feedback.map(item => {
      const car = item.carId;
      const booking = item.bookingId;
      
      return {
        id: item._id,
        carModel: car ? `${car.make} ${car.model} ${car.year}` : 'Unknown Car',
        carImage: car && car.images && car.images.length > 0 ? car.images[0] : null,
        rating: item.rating,
        feedbackText: item.feedbackText,
        bookingNumber: booking ? booking.bookingNumber : 'N/A',
        date: new Date(item.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: formattedFeedback
      })
    };
  } catch (error) {
    console.error('Error in getUserFeedback:', error);
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching user feedback' })
    };
  }
};

/**
 * Get recent feedback across all cars (public endpoint - no authentication required)
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with recent feedback
 */
const getRecentFeedback = async (event) => {
  try {
    // Extract query parameters (only limit)
    const { limit = 5 } = event.queryStringParameters || {};
    const limitNum = parseInt(limit);
    
    // Connect to database
    await connectToDatabase();
    
    // Get most recent feedback entries, sorted by creation date
    const feedback = await Feedback.find()
      .populate('clientId', 'firstName lastName avatar')
      .populate('carId', 'make model year images')
      .sort({ createdAt: -1 })
      .limit(limitNum);
    
    // Format feedback for response
    const formattedFeedback = feedback.map(item => {
      const client = item.clientId;
      const car = item.carId;
      
      // Format client name - show first name and last initial
      let clientName = 'Anonymous';
      if (client && client.firstName) {
        clientName = `${client.firstName}`;
        if (client.lastName) {
          clientName += ` ${client.lastName.charAt(0)}.`;
        }
      }
      
      return {
        id: item._id,
        clientName: clientName,
        clientAvatar: client && client.avatar ? client.avatar : null,
        carModel: car ? `${car.make} ${car.model} ${car.year}` : 'Unknown Car',
        carImage: car && car.images && car.images.length > 0 ? car.images[0] : null,
        rating: item.rating,
        feedbackText: item.feedbackText,
        date: new Date(item.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
    });
    
    // Add CORS headers for public access
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET'
    };
    
    return {
      statusCode: 200,
      headers: headers,
      body: {
        content: formattedFeedback,
        count: formattedFeedback.length
      }
    };
  } catch (error) {
    console.error('Error in getRecentFeedback:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: { message: 'Error fetching recent feedback' }
    };
  }
};

module.exports = {
  createFeedback,
  getCarFeedback,
  getUserFeedback,
  getRecentFeedback
};
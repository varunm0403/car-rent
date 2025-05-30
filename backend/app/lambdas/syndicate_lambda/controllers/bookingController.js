/**
 * Booking Controller
 * Handles booking-related operations
 */

const { validate, schemas } = require('../utils/validator');
const { connectToDatabase } = require('../config/database');
const Booking = require('../models/booking');
const Car = require('../models/car');
const User = require('../models/user');
const { authenticate, authorize } = require('../middleware/auth');
const { USER_ROLES, BOOKING_STATUS } = require('../config/config');
const mongoose = require('mongoose');

/**
* Create a new booking with duplicate prevention
* @param {Object} event - API Gateway event
* @returns {Promise<Object>} Response with created booking
*/
/**
* Create a new booking with duplicate prevention
* @param {Object} event - API Gateway event
* @returns {Promise<Object>} Response with created booking
*/
const createBooking = async (event) => {
  try {
    // Authentication and input validation
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const validatedData = validate(body, schemas.createBooking);
 
    await connectToDatabase();
 
    // Check if car exists and is available - Use lean() to avoid validation issues
    const car = await Car.findById(validatedData.carId).lean();
    if (!car) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Car not found' })
      };
    }
 
    // Check if car has required fields - use displayModel instead of model
    if (!car.make || !car.year || !car.displayModel) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Invalid car data', 
          details: 'The selected car is missing required information'
        })
      };
    }
 
    if (car.status === 'UNAVAILABLE') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Car is not available for booking' })
      };
    }
 
    // Validate dates
    const start = new Date(validatedData.startDate);
    const end = new Date(validatedData.endDate);
    const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
 
    if (durationInDays < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid booking duration' })
      };
    }
 
    // Check for existing bookings in parallel
    const [existingCarBooking, existingUserBooking] = await Promise.all([
      // Check if car is already booked for these dates
      Booking.findOne({
        car: validatedData.carId,
        status: { 
          $in: [
            BOOKING_STATUS.RESERVED, 
            BOOKING_STATUS.RESERVED_BY_SUPPORT_AGENT,
            BOOKING_STATUS.SERVICE_STARTED
          ] 
        },
        $or: [
          { startDate: { $lt: end }, endDate: { $gt: start }} // Overlapping dates
        ]
      }).lean(),
      // Check if user already has a booking for same car and dates
      Booking.findOne({
        user: userId,
        car: validatedData.carId,
        status: { 
          $in: [
            BOOKING_STATUS.RESERVED, 
            BOOKING_STATUS.RESERVED_BY_SUPPORT_AGENT,
            BOOKING_STATUS.SERVICE_STARTED
          ] 
        },
        $or: [
          { startDate: { $lt: end }, endDate: { $gt: start }} // Overlapping dates
        ]
      }).lean()
    ]);
 
    if (existingCarBooking) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Car is already booked for these dates',
          conflictingBookingId: existingCarBooking._id,
          conflictingPeriod: `${new Date(existingCarBooking.startDate).toLocaleDateString('en-US')} - ${new Date(existingCarBooking.endDate).toLocaleDateString('en-US')}`
        })
      };
    }
 
    if (existingUserBooking) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'You already have a booking for this car on these dates',
          bookingId: existingUserBooking._id,
          bookingPeriod: `${new Date(existingUserBooking.startDate).toLocaleDateString('en-US')} - ${new Date(existingUserBooking.endDate).toLocaleDateString('en-US')}`
        })
      };
    }
 
    // Calculate total price
    let totalPrice = car.pricePerDay * durationInDays;
    if (validatedData.additionalServices && validatedData.additionalServices.length > 0) {
      const additionalCost = validatedData.additionalServices.reduce((sum, service) => sum + service.price, 0);
      totalPrice += additionalCost;
    }
 
    // Create new booking
    const booking = new Booking({
      user: userId,
      car: validatedData.carId,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      totalPrice,
      status: authenticatedEvent.user.role === USER_ROLES.SUPPORT_AGENT ? 
        BOOKING_STATUS.RESERVED_BY_SUPPORT_AGENT : BOOKING_STATUS.RESERVED,
      pickupLocation: validatedData.pickupLocation,
      dropoffLocation: validatedData.dropoffLocation || validatedData.pickupLocation, // Default to pickup location if not provided
      additionalServices: validatedData.additionalServices || [],
      createdBy: authenticatedEvent.user.role === USER_ROLES.SUPPORT_AGENT ? 'support_agent' : 'customer',
      agentId: authenticatedEvent.user.role === USER_ROLES.SUPPORT_AGENT ? userId : undefined
    });
 
    // Save booking with duplicate check
    try {
      // Use a session to ensure atomicity
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        await booking.save({ session });
        
        // Update car status if needed - use findByIdAndUpdate to avoid validation issues
        if (car.status === 'AVAILABLE') {
          await Car.findByIdAndUpdate(
            validatedData.carId, 
            { status: 'BOOKED' },
            { session, runValidators: false }
          );
        }
      });
      await session.endSession();
    } catch (saveError) {
      // Check for duplicate key error
      if (saveError.code === 11000) {
        console.error('Duplicate booking detected:', saveError);
        
        // Get details about the duplicate
        const duplicateKeyInfo = saveError.keyPattern || {};
        const duplicateKeyFields = Object.keys(duplicateKeyInfo).join(', ');
        
        // Try to find the existing booking
        const existingBooking = await Booking.findOne({
          user: userId,
          car: validatedData.carId,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate
        }).lean();
        
        return {
          statusCode: 409,
          body: JSON.stringify({ 
            message: 'Duplicate booking detected',
            details: `A booking with the same ${duplicateKeyFields} already exists`,
            existingBookingId: existingBooking ? existingBooking._id : undefined,
            existingBookingPeriod: existingBooking ? 
              `${new Date(existingBooking.startDate).toLocaleDateString('en-US')} - ${new Date(existingBooking.endDate).toLocaleDateString('en-US')}` : undefined
          })
        };
      }
      throw saveError; // Re-throw if it's not a duplicate error
    }
 
    // Format success response - use lean() to avoid validation issues
    const carDetails = await Car.findById(validatedData.carId).lean();
    const userDetails = await User.findById(userId).lean();
 
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const changeDeadline = new Date(start);
    changeDeadline.setDate(changeDeadline.getDate() - 1);
    const changeDeadlineFormatted = changeDeadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const changeDeadlineDateFormatted = changeDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 
    // Use displayModel instead of concatenating make, model, year
    const carDisplayName = carDetails.displayModel || `${carDetails.make} ${carDetails.year}`;
    
    const message = `New booking was successfully created. \n${carDisplayName} is booked for ${startFormatted} - ${endFormatted} \nYou can change booking details until ${changeDeadlineFormatted} ${changeDeadlineDateFormatted}.\nYour order: ${booking.getOrderDetails()}`;
 
    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: message,
        bookingId: booking._id,
        bookingNumber: booking.bookingNumber
      })
    };
  } catch (error) {
    console.error('Error in createBooking:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Validation error', 
          details: error.details || error.message 
        })
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
      body: JSON.stringify({ 
        message: 'Error creating booking', 
        error: error.message 
      })
    };
  }
};

/**
 * Get all bookings (admin/support only)
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with bookings
 */
const getAllBookings = async (event) => {
  try {
    // Authenticate and authorize admin or support agent
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN, USER_ROLES.SUPPORT_AGENT])(event);
    
    // Extract query parameters
    const { dateFrom, dateTo, clientId } = authenticatedEvent.queryStringParameters || {};
    
    // Connect to database
    await connectToDatabase();
    
    // Build filter
    const filter = {};
    
    // Client filter
    if (clientId) filter.user = clientId;
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.$and = [];
      if (dateFrom) filter.$and.push({ startDate: { $gte: new Date(dateFrom) } });
      if (dateTo) filter.$and.push({ endDate: { $lte: new Date(dateTo) } });
    }
    
    // Get bookings
    const bookings = await Booking.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('car', 'make model year images')
      .sort({ createdAt: -1 });
    
    // Format bookings for response
    const formattedBookings = bookings.map(booking => {
      const car = booking.car;
      const user = booking.user;
      
      return {
        bookingId: booking._id,
        bookingStatus: booking.status,
        bookingNumber: booking.bookingNumber,
        bookingPeriod: `${new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        carModel: `${car.make} ${car.model} ${car.year}`,
        carImageUrl: car.images && car.images.length > 0 ? car.images[0] : null,
        clientName: `${user.firstName} ${user.lastName}`,
        date: new Date(booking.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        location: booking.pickupLocation.split(',')[1]?.trim() || booking.pickupLocation,
        madeBy: booking.createdBy === 'support' ? 'SUPPORT' : 'CLIENT',
        orderDetails: booking.getOrderDetails()
      };
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: formattedBookings
      })
    };
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    
    if (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError') {
      return {
        statusCode: error.name === 'UnauthorizedError' ? 401 : 403,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching bookings' })
    };
  }
};

/**
 * Get bookings for a specific user
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with user's bookings
 */
const getUserBookings = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    
    // Extract user ID from path parameters
    const { userId } = authenticatedEvent.pathParameters || {};
    
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User ID is required' })
      };
    }
    
    // Check authorization
    if (authenticatedEvent.user.userId.toString() !== userId && 
        authenticatedEvent.user.role !== USER_ROLES.ADMIN && 
        authenticatedEvent.user.role !== USER_ROLES.SUPPORT_AGENT) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Not authorized to view these bookings' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get user's bookings
    const bookings = await Booking.find({ user: userId })
      .populate('car', 'make model year images')
      .sort({ createdAt: -1 });
    
    // Format bookings for response
    const formattedBookings = bookings.map(booking => {
      const car = booking.car;
      
      return {
        bookingId: booking._id,
        bookingStatus: booking.status,
        carModel: `${car.make} ${car.model} ${car.year}`,
        carImageUrl: car.images && car.images.length > 0 ? car.images[0] : null,
        orderDetails: booking.getOrderDetails()
      };
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: formattedBookings
      })
    };
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching user bookings' })
    };
  }
};

/**
 * Update booking status
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with updated booking
 */
const updateBookingStatus = async (event) => {
  try {
    // Authenticate and authorize admin or support agent
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN, USER_ROLES.SUPPORT_AGENT])(event);
    
    // Extract booking ID from path parameters
    const { bookingId } = authenticatedEvent.pathParameters || {};
    
    if (!bookingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Booking ID is required' })
      };
    }
    
    // Parse request body
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const { status } = body;
    
    if (!status || !Object.values(BOOKING_STATUS).includes(status)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Valid status is required' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Booking not found' })
      };
    }
    
    // Update status
    booking.status = status;
    booking.updatedAt = new Date();
    
    await booking.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Booking status updated successfully',
        bookingId: booking._id,
        status: booking.status
      })
    };
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    
    if (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError') {
      return {
        statusCode: error.name === 'UnauthorizedError' ? 401 : 403,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating booking status' })
    };
  }
};

/**
 * Complete a booking
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with completed booking
 */
const completeBooking = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    
    // Extract booking ID from path parameters
    const { bookingId } = authenticatedEvent.pathParameters || {};
    
    if (!bookingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Booking ID is required' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find booking
    const booking = await Booking.findById(bookingId)
      .populate('car')
      .populate('user', 'firstName lastName email');
    
    if (!booking) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Booking not found' })
      };
    }
    
    // Check if user is authorized to complete this booking
    if (authenticatedEvent.user.userId.toString() !== booking.user._id.toString() && 
        ![USER_ROLES.ADMIN, USER_ROLES.SUPPORT_AGENT].includes(authenticatedEvent.user.role)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Not authorized to complete this booking' })
      };
    }
    
    // Check if booking can be completed
    if (!['SERVICE_STARTED', 'CONFIRMED'].includes(booking.status)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Cannot complete this booking. Booking must be in SERVICE_STARTED or CONFIRMED status.',
          currentStatus: booking.status
        })
      };
    }
    
    // Parse request body for additional completion data
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const { finalMileage, notes } = body;
    
    // Update booking status and completion details
    booking.status = BOOKING_STATUS.COMPLETED;
    booking.updatedAt = new Date();
    
    // Add completion notes if provided
    if (notes) {
      booking.notes = booking.notes 
        ? `${booking.notes}\n\nCompletion Notes: ${notes}` 
        : `Completion Notes: ${notes}`;
    }
    
    // Update car mileage if provided
    if (finalMileage && booking.car) {
      const car = await Car.findById(booking.car._id);
      if (car && finalMileage > car.mileage) {
        car.mileage = finalMileage;
        await car.save();
      }
    }
    
    await booking.save();
    
    // Send completion confirmation email
    try {
      const emailService = require('../utils/emailService');
      await emailService.sendBookingCompletionEmail(
        booking.user.email,
        {
          bookingNumber: booking.bookingNumber,
          carModel: `${booking.car.make} ${booking.car.model} ${booking.car.year}`,
          startDate: new Date(booking.startDate).toLocaleDateString(),
          endDate: new Date(booking.endDate).toLocaleDateString(),
          totalPrice: booking.totalPrice
        }
      );
    } catch (emailError) {
      console.error('Error sending completion email:', emailError);
      // Continue even if email fails
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Booking completed successfully',
        bookingId: booking._id,
        status: booking.status
      })
    };
  } catch (error) {
    console.error('Error in completeBooking:', error);
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error completing booking' })
    };
  }
};

/**
 * Check and update booking statuses based on dates
 * This can be run periodically via a scheduled Lambda function
 * @returns {Promise<Object>} Status update results
 */
const checkAndUpdateBookingStatuses = async () => {
  try {
    // Connect to database
    await connectToDatabase();
    
    const now = new Date();
    const results = {
      serviceStarted: 0,
      serviceCompleted: 0,
      errors: []
    };
    
    // Find bookings that should be marked as SERVICE_STARTED
    // (current date is after or equal to start date and status is CONFIRMED)
    const bookingsToStart = await Booking.find({
      startDate: { $lte: now },
      status: BOOKING_STATUS.CONFIRMED
    });
    
    // Update these bookings to SERVICE_STARTED
    for (const booking of bookingsToStart) {
      try {
        booking.status = BOOKING_STATUS.SERVICE_STARTED;
        booking.updatedAt = now;
        await booking.save();
        results.serviceStarted++;
      } catch (error) {
        results.errors.push({
          bookingId: booking._id,
          operation: 'serviceStarted',
          error: error.message
        });
      }
    }
    
    // Find bookings that should be marked as SERVICE_COMPLETED
    // (current date is after end date and status is SERVICE_STARTED)
    const bookingsToComplete = await Booking.find({
      endDate: { $lt: now },
      status: BOOKING_STATUS.SERVICE_STARTED
    });
    
    // Update these bookings to SERVICE_COMPLETED
    for (const booking of bookingsToComplete) {
      try {
        booking.status = BOOKING_STATUS.SERVICE_COMPLETED;
        booking.updatedAt = now;
        await booking.save();
        results.serviceCompleted++;
      } catch (error) {
        results.errors.push({
          bookingId: booking._id,
          operation: 'serviceCompleted',
          error: error.message
        });
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Booking statuses updated',
        results
      })
    };
  } catch (error) {
    console.error('Error in checkAndUpdateBookingStatuses:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating booking statuses' })
    };
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  completeBooking,
  checkAndUpdateBookingStatuses 
};
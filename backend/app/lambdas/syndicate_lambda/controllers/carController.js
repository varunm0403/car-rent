/**
 * Car Controller
 * Handles car-related operations
 */

const { validate, schemas } = require('../utils/validator');
const { connectToDatabase } = require('../config/database');
const Car = require('../models/car');
const Booking = require('../models/booking');
const Feedback = require('../models/feedback');
const { authenticate, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/config');

/**
 * Get all cars with optional filtering
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with cars data
 */
const getAllCars = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Extract query parameters
    const { 
      category,
      pickupLocationId,
      dropOffLocationId,
      pickupDateTime,
      dropOffDateTime,
      gearBoxType,
      fuelType,
      minPrice,
      maxPrice,
      page = 1,
      size = 8
    } = event.queryStringParameters || {};
    
    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (gearBoxType) filter.gearBoxType = gearBoxType;
    if (fuelType) filter.fuelType = fuelType;
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }
    
    // Handle location and date filters if needed
    if (pickupLocationId) {
      // Add location filtering logic
    }
    
    // Handle date availability if both dates are provided
    if (pickupDateTime && dropOffDateTime) {
      // This would require more complex logic to check availability
      // You might need to cross-reference with bookings
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const pageSize = parseInt(size);
    const skip = (pageNum - 1) * pageSize;
    
    // Get cars from database with pagination
    const cars = await Car.find(filter)
      .sort({ popularityScore: -1 })
      .skip(skip)
      .limit(pageSize);
    
    // Get total count for pagination
    const totalElements = await Car.countDocuments(filter);
    const totalPages = Math.ceil(totalElements / pageSize);
    
    // Transform to match expected response format
    const content = cars.map(car => ({
      carId: car._id,
      model: car.displayModel,
      imageUrl: car.images.length > 0 ? car.images[0] : '',
      location: car.location,
      pricePerDay: car.pricePerDay.toString(),
      carRating: car.carRating,
      serviceRating: car.serviceRating,
      status: car.status
    }));
    
    return {
      statusCode: 200,
      body: {
        content,
        pageable: {
          pageNumber: pageNum,
          pageSize: pageSize,
          totalPages: totalPages,
          totalElements: totalElements
        }
      }
    };
  } catch (error) {
    console.error('Error in getAllCars:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching cars' }
    };
  }
};

/**
 * Get car by ID
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with car data
 */
const getCarById = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Extract car ID from path parameters
    const { carId } = event.pathParameters || {};
    
    if (!carId) {
      return {
        statusCode: 400,
        body: { message: 'Car ID is required' }
      };
    }
    
    // Get car from database
    const car = await Car.findById(carId);
    
    if (!car) {
      return {
        statusCode: 404,
        body: { message: 'Car not found' }
      };
    }
    
    // Format response according to schema
    const response = {
      carId: car._id,
      model: car.displayModel,
      location: car.location,
      pricePerDay: car.pricePerDay.toString(),
      carRating: car.carRating,
      serviceRating: car.serviceRating,
      status: car.status,
      fuelType: car.fuelType,
      gearBoxType: car.gearBoxType,
      engineCapacity: car.engineCapacity,
      passengerCapacity: car.passengerCapacity,
      fuelConsumption: car.fuelConsumption,
      climateControlOption: car.climateControlOption,
      images: car.images
    };
    
    return {
      statusCode: 200,
      body: response
    };
  } catch (error) {
    console.error('Error in getCarById:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching car' }
    };
  }
};

/**
 * Get booked days for a car
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with booked days
 */
const getBookedDays = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Extract car ID from path parameters
    const { carId } = event.pathParameters || {};
    
    if (!carId) {
      return {
        statusCode: 400,
        body: { message: 'Car ID is required' }
      };
    }
    
    // Find all bookings for this car that are confirmed or pending
    const bookings = await Booking.find({
      car: carId,
      status: { $in: ['RESERVED', 'RESERVED_BY_SUPPORT_AGENT', 'SERVICE_STARTED'] }
    }).select('startDate endDate');
    
    // Extract booked dates (need to generate all dates in each range)
    const bookedDates = new Set();
    
    bookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      // Generate all dates in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        bookedDates.add(date.toISOString().split('T')[0]);
      }
    });
    
    return {
      statusCode: 200,
      body: {
        content: Array.from(bookedDates)
      }
    };
  } catch (error) {
    console.error('Error in getBookedDays:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching booked days' }
    };
  }
};

/**
 * Get reviews for a car
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with car reviews
 */
const getCarReviews = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Extract car ID from path parameters
    const { carId } = event.pathParameters || {};
    
    if (!carId) {
      return {
        statusCode: 400,
        body: { message: 'Car ID is required' }
      };
    }
    
    // Extract pagination and sorting parameters
    const { 
      page = 0, 
      size = 10,
      sort = 'DATE',
      direction = 'DESC'
    } = event.queryStringParameters || {};
    
    const pageNum = parseInt(page);
    const pageSize = parseInt(size);
    const skip = pageNum * pageSize;
    
    // Determine sort field and direction
    let sortField = 'createdAt'; // default sort by date
    if (sort === 'RATING') {
      sortField = 'rating';
    }
    
    const sortDirection = direction === 'DESC' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortField] = sortDirection;
    
    // Get reviews for this car with pagination
    const reviews = await Feedback.find({ car: carId })
      .populate('user', 'firstName lastName imageUrl')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    
    // Get total count for pagination
    const totalElements = await Feedback.countDocuments({ car: carId });
    const totalPages = Math.ceil(totalElements / pageSize);
    
    // Format reviews according to schema
    const content = reviews.map(review => ({
      id: review._id,
      clientName: `${review.user.firstName} ${review.user.lastName}`,
      clientImageUrl: review.user.imageUrl,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().split('T')[0]
    }));
    
    return {
      statusCode: 200,
      body: {
        content,
        pageable: {
          pageNumber: pageNum,
          pageSize: pageSize,
          totalPages: totalPages,
          totalElements: totalElements
        }
      }
    };
  } catch (error) {
    console.error('Error in getCarReviews:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching reviews' }
    };
  }
};

/**
 * Get popular cars
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with popular cars
 */
const getPopularCars = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Extract category filter
    const { category } = event.queryStringParameters || {};
    
    // Build filter
    const filter = { status: 'AVAILABLE' };
    if (category) filter.category = category;
    
    // Get popular cars (limit to 8)
    const cars = await Car.find(filter)
      .sort({ popularityScore: -1, carRating: -1 })
      .limit(8);
    
    // Format response
    const content = cars.map(car => ({
      carId: car._id,
      model: car.displayModel,
      imageUrl: car.images.length > 0 ? car.images[0] : '',
      location: car.location,
      pricePerDay: car.pricePerDay.toString(),
      carRating: car.carRating,
      serviceRating: car.serviceRating,
      status: car.status
    }));
    
    return {
      statusCode: 200,
      body: {
        content
      }
    };
  } catch (error) {
    console.error('Error in getPopularCars:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching popular cars' }
    };
  }
};

module.exports = {
  getAllCars,
  getCarById,
  getBookedDays,
  getCarReviews,
  getPopularCars
};
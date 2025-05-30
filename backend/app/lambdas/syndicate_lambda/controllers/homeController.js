/**
 * Home Controller
 * Handles homepage data and featured content
 */

const { connectToDatabase } = require('../config/database');
const Car = require('../models/car');
const Feedback = require('../models/feedback');

/**
 * Get featured cars and homepage data
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with homepage data
 */
const getHomeData = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get featured cars (highest popularity score)
    const featuredCars = await Car.find({ availability: true })
      .sort({ popularityScore: -1 })
      .limit(6);
    
    // Get newest cars
    const newestCars = await Car.find({ availability: true })
      .sort({ createdAt: -1 })
      .limit(6);
    
    // Get cars by category
    const luxuryCars = await Car.find({ 
      category: 'luxury',
      availability: true
    }).limit(4);
    
    const economyCars = await Car.find({ 
      category: 'economy',
      availability: true
    }).limit(4);
    
    const suvCars = await Car.find({ 
      category: 'suv',
      availability: true
    }).limit(4);
    
    // Get top-rated cars
    const topRatedCarsWithReviews = await Feedback.aggregate([
      { $group: {
        _id: '$car',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }},
      { $match: { reviewCount: { $gte: 3 } } }, // At least 3 reviews
      { $sort: { averageRating: -1 } },
      { $limit: 6 }
    ]);
    
    const topRatedCarIds = topRatedCarsWithReviews.map(item => item._id);
    const topRatedCars = await Car.find({ 
      _id: { $in: topRatedCarIds },
      availability: true
    });
    
    // Match ratings with cars
    const topRatedCarsWithRatings = topRatedCars.map(car => {
      const ratingInfo = topRatedCarsWithReviews.find(
        item => item._id.toString() === car._id.toString()
      );
      return {
        ...car.toObject(),
        averageRating: ratingInfo ? ratingInfo.averageRating : 0,
        reviewCount: ratingInfo ? ratingInfo.reviewCount : 0
      };
    });
    
    // Get promotional banner content
    const promotionalContent = [
      {
        title: 'Summer Special',
        description: 'Get 15% off on all convertible rentals this summer!',
        imageUrl: 'https://example.com/promo-summer.jpg',
        linkUrl: '/promotions/summer'
      },
      {
        title: 'Weekend Getaway',
        description: 'Book for 3 days and pay for 2 on weekend rentals',
        imageUrl: 'https://example.com/promo-weekend.jpg',
        linkUrl: '/promotions/weekend'
      }
    ];
    
    return {
      statusCode: 200,
      body: {
        message: 'Home data fetched successfully',
        featuredCars,
        newestCars,
        topRatedCars: topRatedCarsWithRatings,
        categoryHighlights: {
          luxury: luxuryCars,
          economy: economyCars,
          suv: suvCars
        },
        promotionalContent
      }
    };
  } catch (error) {
    console.error('Error in getHomeData:', error);
    return {
      statusCode: 500,
      body: { message: 'Error fetching home data' }
    };
  }
};

/**
 * Search cars by query
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with search results
 */
const searchCars = async (event) => {
  try {
    // Extract query parameters
    const { query, location, startDate, endDate } = event.queryStringParameters || {};
    
    if (!query) {
      return {
        statusCode: 400,
        body: { message: 'Search query is required' }
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Build search filter
    const searchFilter = {
      $or: [
        { make: { $regex: query, $options: 'i' } },
        { model: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    };
    
    // Add location filter if provided
    if (location) {
      searchFilter.location = { $regex: location, $options: 'i' };
    }
    
    // Get matching cars
    const cars = await Car.find(searchFilter).sort({ popularityScore: -1 });
    
    // If dates provided, filter available cars
    let availableCars = cars;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Filter cars that are available for the requested dates
      availableCars = [];
      for (const car of cars) {
        const isAvailable = await car.isAvailableForDates(start, end);
        if (isAvailable) {
          availableCars.push(car);
        }
      }
    }
    
    return {
      statusCode: 200,
      body: {
        message: 'Search results fetched successfully',
        cars: availableCars,
        count: availableCars.length,
        query,
        location,
        startDate,
        endDate
      }
    };
  } catch (error) {
    console.error('Error in searchCars:', error);
    return {
      statusCode: 500,
      body: { message: 'Error searching cars' }
    };
  }
};

module.exports = {
  getHomeData,
  searchCars
};
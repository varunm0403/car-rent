/**
 * Car Routes Handler
 * Handles routing for car-related endpoints
 */

const carController = require('../controllers/carController');

/**
 * Handle car-related requests
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */
const handleRequest = async (path, method, event) => {
  console.log(`Car route: ${method} ${path}`);

  // Get all cars with filtering
  if (path === '/cars' && method === 'GET') {
    return await carController.getAllCars(event);
  }

  // Get car by ID
  if (path.match(/^\/cars\/[a-zA-Z0-9-]+$/) && method === 'GET') {
    const carId = path.split('/')[2];
    event.pathParameters = { ...event.pathParameters, carId };
    return await carController.getCarById(event);
  }

  // Get booked days for a car
  if (path.match(/^\/cars\/[a-zA-Z0-9-]+\/booked-days$/) && method === 'GET') {
    const carId = path.split('/')[2];
    event.pathParameters = { ...event.pathParameters, carId };
    return await carController.getBookedDays(event);
  }

  // Get reviews for a car
  if (path.match(/^\/cars\/[a-zA-Z0-9-]+\/client-review$/) && method === 'GET') {
    const carId = path.split('/')[2];
    event.pathParameters = { ...event.pathParameters, carId };
    return await carController.getCarReviews(event);
  }
  
  // Get popular cars
  if (path === '/cars/popular' && method === 'GET') {
    return await carController.getPopularCars(event);
  }

  // If no route matches
  return {
    statusCode: 404,
    body: {
      message: 'Car endpoint not found',
      path,
      method
    }
  };
};

module.exports = {
  handleRequest
};
/**
 * Booking Routes Handler
 * Handles routing for booking-related endpoints
 */

const bookingController = require('../controllers/bookingController');

/**
 * Handle booking-related requests
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */
const handleRequest = async (path, method, event) => {
  console.log(`Booking route: ${method} ${path}`);

  // Create new booking
  if (path === '/bookings' && method === 'POST') {
    return await bookingController.createBooking(event);
  }

  // Get all bookings (admin/support only)
  if (path === '/bookings' && method === 'GET') {
    return await bookingController.getAllBookings(event);
  }

  // Get bookings for a user
  if (path.match(/^\/bookings\/user\/([a-zA-Z0-9]+)$/) && method === 'GET') {
    const userId = path.split('/')[3];
    event.pathParameters = { ...event.pathParameters, userId };
    return await bookingController.getUserBookings(event);
  }

  // Update booking status
  if (path.match(/^\/bookings\/([a-zA-Z0-9]+)\/status$/) && method === 'PUT') {
    const bookingId = path.split('/')[2];
    event.pathParameters = { ...event.pathParameters, bookingId };
    return await bookingController.updateBookingStatus(event);
  }
  
  // Complete booking
  if (path.match(/^\/bookings\/([a-zA-Z0-9]+)\/complete$/) && method === 'PUT') {
    const bookingId = path.split('/')[2];
    event.pathParameters = { ...event.pathParameters, bookingId };
    return await bookingController.completeBooking(event);
  }
  
  // Check and update booking statuses (admin only)
  if (path === '/bookings/check-status' && method === 'POST') {
    return await bookingController.checkAndUpdateBookingStatuses(event);
  }

  // If no route matches
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Booking endpoint not found',
      path,
      method
    })
  };
};

module.exports = {
  handleRequest
};
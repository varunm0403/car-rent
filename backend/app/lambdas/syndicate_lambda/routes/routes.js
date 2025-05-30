/**
 * Main Routes Handler
 * Processes all incoming requests and routes them to appropriate handlers
 */

const authRoutes = require('./authRoutes');
const carRoutes = require('./carRoutes');
const bookingRoutes = require('./bookingRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const homeRoutes = require('./homeRoutes');
// const reportRoutes = require('./reportRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');

/**
 * Process incoming requests and route to appropriate handler
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */
const processRequest = async (path, method, event) => {
  console.log(`Processing request: ${method} ${path}`);

  // Auth routes - /auth/*
  if (path.startsWith('/auth')) {
    return await authRoutes.handleRequest(path, method, event);
  }

    // Admin routes - /admin/*
    if (path.startsWith('/admin')) {
      return await adminRoutes.handleRequest(path, method, event);
    }
  
    // User routes - /users/*
    if (path.startsWith('/users')) {
      return await userRoutes.handleRequest(path, method, event);
    }  

  // Car routes - /cars/*
  if (path.startsWith('/cars')) {
    return await carRoutes.handleRequest(path, method, event);
  }

  // Booking routes - /bookings/*
  if (path.startsWith('/bookings')) {
    return await bookingRoutes.handleRequest(path, method, event);
  }

  // Feedback routes - /feedbacks/*
  if (path.startsWith('/feedbacks')) {
    return await feedbackRoutes.handleRequest(path, method, event);
  }

  // Home routes - /home/*
  if (path.startsWith('/home')) {
    return await homeRoutes.handleRequest(path, method, event);
  }

  // Report routes - /reports/*
  if (path.startsWith('/reports')) {
    return await reportRoutes.handleRequest(path, method, event);
  }


  // Health check endpoint
  // if (path === '/health' && method === 'GET') {
  //   return {
  //     statusCode: 200,
  //     body: { status: 'ok', message: 'Car Rental Service is running' }
  //   };
  // }

  // If no route matches
  return {
    statusCode: 404,
    body: { message: 'Endpoint not found', path, method }
  };
};

module.exports = {
  processRequest
};
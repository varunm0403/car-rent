/**
 * Admin Routes Handler
 * Handles routing for admin-related endpoints
 */

const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/config');

/**
 * Handle admin-related requests
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */
const handleRequest = async (path, method, event) => {
  console.log(`Admin route: ${method} ${path}`);

  try {
    // Authenticate and authorize admin
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN])(event);
    
    // Get support agent emails
    if (path === '/admin/support-agents' && method === 'GET') {
      return await adminController.getSupportAgentEmails(authenticatedEvent);
    }
    
    // Add support agent email
    if (path === '/admin/support-agents' && method === 'POST') {
      return await adminController.addSupportAgentEmail(authenticatedEvent);
    }
    
    // Remove support agent email
    if (path.match(/^\/admin\/support-agents\/[^\/]+$/) && method === 'DELETE') {
      authenticatedEvent.pathParameters = { 
        ...authenticatedEvent.pathParameters,
        email: path.split('/').pop()
      };
      return await adminController.removeSupportAgentEmail(authenticatedEvent);
    }
    
    // If no route matches
    return {
      statusCode: 404,
      body: {
        message: 'Admin endpoint not found',
        path,
        method
      }
    };
  } catch (error) {
    console.error('Error in admin route:', error);
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: { message: error.message || 'Unauthorized access' }
      };
    }
    
    if (error.name === 'ForbiddenError') {
      return {
        statusCode: 403,
        body: { message: error.message || 'Forbidden access' }
      };
    }
    
    return {
      statusCode: 500,
      body: { message: 'Internal server error' }
    };
  }
};

module.exports = {
  handleRequest
};
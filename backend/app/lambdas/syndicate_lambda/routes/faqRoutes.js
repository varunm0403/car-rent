/**
 * FAQ Routes Handler
 * Handles routing for FAQ-related endpoints
 */

/**
 * Handle FAQ-related requests
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */

const faqController = require('../controllers/faqController');

const handleRequest = async (path, method, event) => {
  console.log(`FAQ route: ${method} ${path}`);

  // Ensure this path matches
  if (path === '/home/faq' && method === 'GET') {
    return await faqController.getAllFAQs(); // Ensure correct function is being called
  }

  // If no route matches
  return {
    statusCode: 404,
    body: {
      message: 'FAQ endpoint not found',
      path,
      method
    }
  };
};

module.exports = {
  handleRequest
};
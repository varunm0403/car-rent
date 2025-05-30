/**
 * Feedback Routes Handler
 * Handles routing for feedback/review-related endpoints
 */

const feedbackController = require('../controllers/feedbackController');

/**
 * Handle feedback-related requests
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */
const handleRequest = async (path, method, event) => {
  console.log(`Feedback route: ${method} ${path}`);

  // Create new feedback
  if (path === '/feedbacks' && method === 'POST') {
    return await feedbackController.createFeedback(event);
  }

  // Public endpoint - no authentication required
  if (path === '/feedbacks/recent' && method === 'GET') {
    return await feedbackController.getRecentFeedback(event);
  }

  // Get feedback for a car
  if (path.match(/^\/feedbacks\/cars\/([a-zA-Z0-9]+)$/) && method === 'GET') {
    const carId = path.split('/')[3];
    event.pathParameters = { ...event.pathParameters, carId };
    return await feedbackController.getCarFeedback(event);
  }

  // Get user's feedback
  if (path === '/feedbacks/user' && method === 'GET') {
    return await feedbackController.getUserFeedback(event);
  }

  // If no route matches
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Feedback endpoint not found',
      path,
      method
    })
  };
};

module.exports = {
  handleRequest
};
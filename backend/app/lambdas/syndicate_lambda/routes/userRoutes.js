/**
 * User Routes Handler
 * Handles routing for user-related endpoints
 */

const userController = require('../controllers/userController');

/**
 * Handle user-related requests
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */
const handleRequest = async (path, method, event) => {
  console.log(`User route: ${method} ${path}`);

  // Get user profile
  if (path === '/profile' && method === 'GET') {
    return await userController.getUserProfile(event);
  }

  // Update personal information
  if (path === '/profile/personal-info' && method === 'PUT') {
    return await userController.updatePersonalInfo(event);
  }

  // Update avatar
  if (path === '/profile/avatar' && method === 'PUT') {
    return await userController.updateAvatar(event);
  }

  // Upload document (driving license or passport)
  if (path.match(/^\/profile\/documents\/(driving-license|passport)$/) && method === 'PUT') {
    const documentType = path.split('/')[3];
    event.pathParameters = { ...event.pathParameters, documentType };
    return await userController.uploadDocument(event);
  }

  // Change password
  if (path === '/profile/password' && method === 'PUT') {
    return await userController.changePassword(event);
  }

  // Get all support agents
  if (path === '/users/agents' && method === 'GET') {
    return await userController.getSupportAgents(event);
  }

  // Get all clients
  if (path === '/users/clients' && method === 'GET') {
    return await userController.getClients(event);
  }

  // Update user role (admin only)
  if (path.match(/^\/users\/[^\/]+\/role$/) && method === 'PUT') {
    const userId = path.split('/')[2];
    event.pathParameters = { ...event.pathParameters, userId };
    return await userController.updateUserRole(event);
  }

  // Get all users (admin only)
  if (path === '/users' && method === 'GET') {
    return await userController.getAllUsers(event);
  }

  // If no route matches
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'User endpoint not found',
      path,
      method
    })
  };
};

module.exports = {
  handleRequest
};
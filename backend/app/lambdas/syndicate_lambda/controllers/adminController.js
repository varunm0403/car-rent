/**
 * Admin Controller
 * Handles administrative operations
 */

const { connectToDatabase } = require('../config/database');
const SupportAgentList = require('../models/supportAgentList');
const User = require('../models/user');
const { USER_ROLES } = require('../config/config');

/**
 * Get all support agent emails
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with support agent emails
 */
const getSupportAgentEmails = async (event) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get support agent emails
    const supportAgents = await SupportAgentList.find()
      .sort({ createdAt: -1 });
    
    return {
      statusCode: 200,
      body: {
        message: 'Support agent emails retrieved successfully',
        supportAgents: supportAgents.map(agent => ({
          email: agent.email,
          addedBy: agent.addedBy,
          createdAt: agent.createdAt
        }))
      }
    };
  } catch (error) {
    console.error('Error getting support agent emails:', error);
    return {
      statusCode: 500,
      body: { message: 'Error retrieving support agent emails' }
    };
  }
};

/**
 * Add email to support agent list
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with result
 */
const addSupportAgentEmail = async (event) => {
  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { email } = body;
    
    if (!email) {
      return {
        statusCode: 400,
        body: { message: 'Email is required' }
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Check if email already exists in list
    const existingEmail = await SupportAgentList.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return {
        statusCode: 409,
        body: { message: 'Email already in support agent list' }
      };
    }
    
    // Add email to list
    const supportAgent = new SupportAgentList({
      email: email.toLowerCase(),
      addedBy: event.user?.userId
    });
    
    await supportAgent.save();
    
    // If user with this email already exists, update their role
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      existingUser.role = USER_ROLES.SUPPORT_AGENT;
      await existingUser.save();
    }
    
    return {
      statusCode: 201,
      body: { message: 'Email added to support agent list' }
    };
  } catch (error) {
    console.error('Error adding support agent email:', error);
    return {
      statusCode: 500,
      body: { message: 'Error adding support agent email' }
    };
  }
};

/**
 * Remove email from support agent list
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with result
 */
const removeSupportAgentEmail = async (event) => {
  try {
    // Get email from path parameters
    const { email } = event.pathParameters || {};
    
    if (!email) {
      return {
        statusCode: 400,
        body: { message: 'Email is required' }
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Remove email from list
    const decodedEmail = decodeURIComponent(email);
    const result = await SupportAgentList.deleteOne({ email: decodedEmail.toLowerCase() });
    
    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: { message: 'Email not found in support agent list' }
      };
    }
    
    // If user with this email exists, update their role to Client
    const existingUser = await User.findOne({ email: decodedEmail.toLowerCase() });
    if (existingUser && existingUser.role === USER_ROLES.SUPPORT_AGENT) {
      existingUser.role = USER_ROLES.CUSTOMER;
      await existingUser.save();
    }
    
    return {
      statusCode: 200,
      body: { message: 'Email removed from support agent list' }
    };
  } catch (error) {
    console.error('Error removing support agent email:', error);
    return {
      statusCode: 500,
      body: { message: 'Error removing support agent email' }
    };
  }
};

module.exports = {
  getSupportAgentEmails,
  addSupportAgentEmail,
  removeSupportAgentEmail
};
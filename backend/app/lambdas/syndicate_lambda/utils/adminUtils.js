/**
 * Admin Utilities
 * Provides functions for administrative tasks
 */

const { connectToDatabase } = require('../config/database');
const SupportAgentList = require('../models/supportAgentList');
const User = require('../models/user');
const { USER_ROLES } = require('../config/config');
const bcrypt = require('bcryptjs');

/**
 * Add email to support agent list
 * @param {string} email - Email to add
 * @param {string} adminId - ID of admin adding the email
 * @returns {Promise<Object>} Result of operation
 */

/**
 * Create a support agent user with default password
 * @param {string} email - Support agent email
 * @returns {Promise<Object>} Created user or null if error
 */
const createSupportAgentUser = async (email) => {
  try {
    // Extract name from email (before @)
    const emailName = email.split('@')[0];
    const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    
    // Create default password
    const defaultPassword = 'Support123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    
    const supportUser = new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: 'Support',
      // Change from USER_ROLES.SUPPORT_AGENT to "Support"
      role: "Support",
      imageUrl: 'https://application.s3.eu-central-1.amazonaws.com/img/users/support.png'
    });
    
    await supportUser.save();
    return supportUser;
  } catch (error) {
    console.error('Error creating support agent user:', error);
    return null;
  }
};

/**
 * Add email to support agent list
 * @param {string} email - Email to add
 * @param {string} adminId - ID of admin adding the email
 * @returns {Promise<Object>} Result of operation
 */
const addSupportAgentEmail = async (email, adminId) => {
  try {
    await connectToDatabase();
    
    // Check if email already exists in list
    const existingEmail = await SupportAgentList.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return {
        success: false,
        message: 'Email already in support agent list'
      };
    }
    
    // Add email to list
    const supportAgent = new SupportAgentList({
      email: email.toLowerCase(),
      addedBy: adminId
    });
    
    await supportAgent.save();
    
    // If user with this email already exists, update their role
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // Change from USER_ROLES.SUPPORT_AGENT to "Support"
      existingUser.role = "Support";
      await existingUser.save();
    } else {
      // Create a new user with default password
      await createSupportAgentUser(email.toLowerCase());
    }
    
    return {
      success: true,
      message: 'Email added to support agent list'
    };
  } catch (error) {
    console.error('Error adding support agent email:', error);
    return {
      success: false,
      message: 'Error adding support agent email',
      error: error.message
    };
  }
};

/**
 * Seed support agent emails
 * @param {Array<string>} emails - List of support agent emails
 * @returns {Promise<Object>} Result of operation
 */
const seedSupportAgents = async (emails = []) => {
  try {
    await connectToDatabase();
    
    // Default support agent emails if none provided
    const supportAgentEmails = emails.length > 0 ? emails : [
      'support@carental.com',
      'agent1@carental.com',
      'agent2@carental.com',
      'agent3@carental.com'
    ];
    
    // Create support agent entries
    const supportAgents = supportAgentEmails.map(email => ({
      email: email.toLowerCase()
    }));
    
    // Insert support agents (ignore duplicates)
    const result = await SupportAgentList.insertMany(supportAgents, { ordered: false });
    
    return {
      success: true,
      message: `Added ${result.length} support agents to the database`,
      agents: result
    };
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return {
        success: true,
        message: 'Some support agents were already in the database (duplicates ignored)'
      };
    }
    
    return {
      success: false,
      message: 'Error seeding support agents',
      error: error.message
    };
  }
};

/**
 * Get all support agent emails
 * @returns {Promise<Array>} List of support agent emails
 */
const getSupportAgentEmails = async () => {
  try {
    await connectToDatabase();
    
    const supportAgents = await SupportAgentList.find()
      .sort({ createdAt: -1 });
    
    return supportAgents.map(agent => ({
      email: agent.email,
      addedBy: agent.addedBy,
      createdAt: agent.createdAt
    }));
  } catch (error) {
    console.error('Error getting support agent emails:', error);
    throw error;
  }
};

module.exports = {
  addSupportAgentEmail,
  createSupportAgentUser,
  seedSupportAgents,
  getSupportAgentEmails
};
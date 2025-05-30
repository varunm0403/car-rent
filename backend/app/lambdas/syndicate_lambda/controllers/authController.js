/**
 * Authentication Controller
 * Handles user authentication operations
 */

const bcrypt = require('bcryptjs');
const { validate, schemas } = require('../utils/validator');
const { generateToken } = require('../utils/jwtHelper');
const { connectToDatabase } = require('../config/database');
const User = require('../models/user');
const SupportAgentList = require('../models/supportAgentList'); // Add this import
const { USER_ROLES } = require('../config/config');

/**
 * Determine user role based on email
 * @param {string} email - User email
 * @returns {Promise<string>} User role
 */
const determineUserRole = async (email) => {
  try {
    // Check if email is in support agent list
    const supportAgent = await SupportAgentList.findOne({ email: email.toLowerCase() });
    
    if (supportAgent) {
      return USER_ROLES.SUPPORT_AGENT;
    }
    
    // Default role is Client
    return USER_ROLES.CUSTOMER;
  } catch (error) {
    console.error('Error determining user role:', error);
    return USER_ROLES.CUSTOMER; // Default to Client on error
  }
};

/**
 * User sign-in
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with authentication token
 */
const signIn = async (event) => {
  try {
    // Parse and validate request body
    const body = JSON.parse(event.body || '{}');
    const validatedData = validate(body, schemas.signIn);
   
    // Connect to database
    await connectToDatabase();
   
    // Find user by email
    const user = await User.findOne({ email: validatedData.email.toLowerCase() });
   
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
      return {
        statusCode: 401,
        body: { 
          message: 'Invalid email or password',
          reference: 'Login error reference' // As per US-2 AC
        }
      };
    }
   
    // Generate JWT token
    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    });
   
    // Return success response with token
    return {
      statusCode: 200,
      body: {
        idToken: token,
        userId: user._id.toString(),
        username: `${user.firstName} ${user.lastName}`,
        role: user.role,
        userImageUrl: user.imageUrl || 'https://application.s3.eu-central-1.amazonaws.com/img/users/default.png',
        reference: 'Login reference' // As per US-2 AC
      }
    };
  } catch (error) {
    console.error('Error in signIn:', error);
   
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: { 
          message: 'Validation error', 
          details: error.details,
          reference: 'Login error reference' // As per US-2 AC
        }
      };
    }
   
    // Handle other errors
    return {
      statusCode: 500,
      body: { message: 'Internal server error' }
    };
  }
};

/**
 * User sign-up
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with success message
 */
const signUp = async (event) => {
  try {
    // Parse and validate request body
    const body = JSON.parse(event.body || '{}');
    console.log("Received signup request body:", event.body);
    
    const validatedData = validate(body, schemas.signUp);
    console.log("Validation passed");
   
    // Connect to database
    await connectToDatabase();
   
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return {
        statusCode: 409,
        body: { 
          message: 'User with this email already exists',
          reference: 'Registration error reference 1' // As per US-1 AC
        }
      };
    }
   
    // Determine user role based on email (US-3)
    const role = await determineUserRole(validatedData.email);
   
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
   
    // Create new user
    const newUser = new User({
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phoneNumber: validatedData.phoneNumber || null,
      country: validatedData.country || null,
      city: validatedData.city || null,
      street: validatedData.street || null,
      postalCode: validatedData.postalCode || null,
      imageUrl: 'https://application.s3.eu-central-1.amazonaws.com/img/users/default.png', // Default image
      role: role // Automatically assign role based on email
    });
   
    console.log("About to save new user:", newUser);
    await newUser.save();
    console.log("User saved successfully");
   
    // Return success response
    return {
      statusCode: 201,
      body: { 
        message: 'User successfully created',
        role: role,
        reference: 'Registration confirmation', // As per US-1 AC
        reference2: 'Registration reference 2' // As per US-1 AC
      }
    };
  } catch (error) {
    console.error('Error in signUp:', error);
   
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: { 
          message: 'Validation error', 
          details: error.details,
          reference: 'Registration error reference 1' // As per US-1 AC
        }
      };
    }
   
    // Handle other errors
    return {
      statusCode: 500,
      body: { message: 'Internal server error' }
    };
  }
};

module.exports = {
  signIn,
  signUp,
  determineUserRole // For testing purposes
};
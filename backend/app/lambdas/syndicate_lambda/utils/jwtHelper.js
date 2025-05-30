/**
 * JWT Helper Utility
 * Handles JWT token generation and verification
 */

const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('../config/config');

/**
 * Generate JWT token
 * @param {Object} payload - Data to include in token
 * @param {string} [expiresIn] - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = JWT_CONFIG.expiresIn) => {
  const secret = process.env.JWT_SECRET || JWT_CONFIG.secret;
  
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || JWT_CONFIG.secret;
  
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
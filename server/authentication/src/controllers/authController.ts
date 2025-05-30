import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import SupportAgentList from '../models/SupportAgentList';
import { generateToken, verifyToken as jwtVerifyToken } from '../utils/jwtHelper';
import { logger } from '../utils/logger';
import { USER_ROLES } from '../config/constants';

/**
 * Determine user role based on email
 */
const determineUserRole = async (email: string): Promise<string> => {
  try {
    // Check if email is in support agent list
    const supportAgent = await SupportAgentList.findOne({ email: email.toLowerCase() });
    
    if (supportAgent) {
      return USER_ROLES.SUPPORT_AGENT;
    }
    
    // Check if it's the admin email
    if (email.toLowerCase() === 'admin@carental.com') {
      return USER_ROLES.ADMIN;
    }
    
    // Default role is Client
    return USER_ROLES.CUSTOMER;
  } catch (error: any) {
    logger.error(`Error determining user role: ${error.message}`);
    return USER_ROLES.CUSTOMER; // Default to Client on error
  }
};

/**
 * User sign-in
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ 
        message: 'Invalid email or password',
        reference: 'Login error reference'
      });
      return;
    }
    
    // Generate JWT token
    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    });
    
    // Return success response with token
    res.status(200).json({
      idToken: token,
      userId: user._id.toString(),
      username: `${user.firstName} ${user.lastName}`,
      role: user.role,
      userImageUrl: user.imageUrl || 'https://application.s3.eu-central-1.amazonaws.com/img/users/default.png',
      reference: 'Login reference'
    });
  } catch (error: any) {
    logger.error(`Error in signIn: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * User sign-up
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phoneNumber, country, city, street, postalCode } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ 
        message: 'User with this email already exists',
        reference: 'Registration error reference 1'
      });
      return;
    }
    
    // Determine user role based on email
    const role = await determineUserRole(email);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber: phoneNumber || null,
      country: country || null,
      city: city || null,
      street: street || null,
      postalCode: postalCode || null,
      imageUrl: 'https://application.s3.eu-central-1.amazonaws.com/img/users/default.png',
      role
    });
    
    await newUser.save();
    
    // Return success response
    res.status(201).json({ 
      message: 'User successfully created',
      role,
      reference: 'Registration confirmation',
      reference2: 'Registration reference 2'
    });
  } catch (error: any) {
    logger.error(`Error in signUp: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Verify a JWT token and return user information
 */
export const validateToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({ valid: false, message: 'Token is required' });
      return;
    }
    
    // Verify the token
    const decoded = jwtVerifyToken(token);
    
    // Find user
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      res.status(401).json({ valid: false, message: 'User not found' });
      return;
    }
    
    // Return success response
    res.status(200).json({
      valid: true,
      user: {
        userId: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });
  } catch (error: any) {
    logger.error(`Error in validateToken: ${error.message}`);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401).json({ valid: false, message: 'Invalid or expired token' });
      return;
    }
    
    res.status(500).json({ valid: false, message: 'Token verification error' });
  }
};
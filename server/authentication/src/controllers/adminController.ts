import { Request, Response } from 'express';
import SupportAgentList from '../models/SupportAgentList';
import User, { IUser } from '../models/User';
import { logger } from '../utils/logger';
import { USER_ROLES } from '../config/constants';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

/**
 * Get all support agent emails
 */
export const getSupportAgentEmails = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const supportAgents = await SupportAgentList.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Support agent emails retrieved successfully',
      supportAgents: supportAgents.map(agent => ({
        email: agent.email,
        addedBy: agent.addedBy,
        createdAt: agent.createdAt
      }))
    });
  } catch (error: any) {
    logger.error(`Error getting support agent emails: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving support agent emails' });
  }
};

/**
 * Add email to support agent list
 */
export const addSupportAgentEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    
    // Check if email already exists in list
    const existingEmail = await SupportAgentList.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      res.status(409).json({ message: 'Email already in support agent list' });
      return;
    }
    
    // Add email to list
    const supportAgent = new SupportAgentList({
      email: email.toLowerCase(),
      addedBy: req.user.userId
    });
    
    await supportAgent.save();
    
    // If user with this email already exists, update their role
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      existingUser.role = USER_ROLES.SUPPORT_AGENT;
      await existingUser.save();
    }
    
    res.status(201).json({ message: 'Email added to support agent list' });
  } catch (error: any) {
    logger.error(`Error adding support agent email: ${error.message}`);
    res.status(500).json({ message: 'Error adding support agent email' });
  }
};

/**
 * Remove email from support agent list
 */
export const removeSupportAgentEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const { email } = req.params;
    
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    
    // Remove email from list
    const decodedEmail = decodeURIComponent(email);
    const result = await SupportAgentList.deleteOne({ email: decodedEmail.toLowerCase() });
    
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Email not found in support agent list' });
      return;
    }
    
    // If user with this email exists, update their role to Client
    const existingUser = await User.findOne({ email: decodedEmail.toLowerCase() });
    if (existingUser && existingUser.role === USER_ROLES.SUPPORT_AGENT) {
      existingUser.role = USER_ROLES.CUSTOMER;
      await existingUser.save();
    }
    
    res.status(200).json({ message: 'Email removed from support agent list' });
  } catch (error: any) {
    logger.error(`Error removing support agent email: ${error.message}`);
    res.status(500).json({ message: 'Error removing support agent email' });
  }
};

/**
 * Create a support agent user with default password
 */
export const createSupportAgentUser = async (email: string): Promise<mongoose.Document<unknown, {}, IUser> | null> => {
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
      role: USER_ROLES.SUPPORT_AGENT,
      imageUrl: 'https://application.s3.eu-central-1.amazonaws.com/img/users/support.png'
    });
    
    await supportUser.save();
    return supportUser;
  } catch (error: any) {
    logger.error(`Error creating support agent user: ${error.message}`);
    return null;
  }
};
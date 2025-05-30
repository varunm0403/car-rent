import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { logger } from '../utils/logger';
import { USER_ROLES } from '../config/constants';

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user exists in request
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Return user profile without sensitive data
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      country: user.country || '',
      city: user.city || '',
      street: user.street || '',
      postalCode: user.postalCode || '',
      imageUrl: user.imageUrl || '',
      drivingLicense: {
        number: user.drivingLicense?.number || '',
        expiryDate: user.drivingLicense?.expiryDate || '',
        documentUrl: user.drivingLicense?.documentUrl || '',
        verified: user.drivingLicense?.verified || false
      },
      passport: {
        number: user.passport?.number || '',
        expiryDate: user.passport?.expiryDate || '',
        documentUrl: user.passport?.documentUrl || '',
        verified: user.passport?.verified || false
      },
      role: user.role
    });
  } catch (error: any) {
    logger.error(`Error in getUserProfile: ${error.message}`);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

/**
 * Update user personal information
 */
export const updatePersonalInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;
    const { firstName, lastName, phoneNumber, country, city, street, postalCode } = req.body;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (country !== undefined) user.country = country;
    if (city !== undefined) user.city = city;
    if (street !== undefined) user.street = street;
    if (postalCode !== undefined) user.postalCode = postalCode;
    
    await user.save();
    
    res.status(200).json({
      message: 'Personal information updated successfully',
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || '',
      country: user.country || '',
      city: user.city || '',
      street: user.street || '',
      postalCode: user.postalCode || ''
    });
  } catch (error: any) {
    logger.error(`Error in updatePersonalInfo: ${error.message}`);
    res.status(500).json({ message: 'Error updating personal information' });
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    logger.error(`Error in changePassword: ${error.message}`);
    res.status(500).json({ message: 'Error changing password' });
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const users = await User.find().select('-password');
    
    res.status(200).json({
      message: 'Users retrieved successfully',
      users: users.map(user => user.getPublicProfile())
    });
  } catch (error: any) {
    logger.error(`Error in getAllUsers: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

/**
 * Get all clients
 */
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const clients = await User.find({ role: USER_ROLES.CUSTOMER }).select('-password');
    
    res.status(200).json({
      message: 'Clients retrieved successfully',
      clients: clients.map(client => client.getPublicProfile())
    });
  } catch (error: any) {
    logger.error(`Error in getClients: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving clients' });
  }
};

/**
 * Get all support agents
 */
export const getSupportAgents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const supportAgents = await User.find({ role: USER_ROLES.SUPPORT_AGENT }).select('-password');
    
    res.status(200).json({
      message: 'Support agents retrieved successfully',
      supportAgents: supportAgents.map(agent => agent.getPublicProfile())
    });
  } catch (error: any) {
    logger.error(`Error in getSupportAgents: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving support agents' });
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!Object.values(USER_ROLES).includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error: any) {
    logger.error(`Error in updateUserRole: ${error.message}`);
    res.status(500).json({ message: 'Error updating user role' });
  }
};
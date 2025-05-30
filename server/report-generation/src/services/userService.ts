// src/services/userService.ts
import axios from 'axios';
import config from '../config/config';
import logger from '../utils/logger';

/**
 * Get user by ID
 * @param userId User ID
 * @param token Authentication token
 * @returns User details
 */
export const getUserById = async (userId: string, token: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${config.services.authServiceUrl}/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.data.user;
  } catch (error: any) {
    logger.error(`Error fetching user ${userId}:`, error.message);
    return null;
  }
};

/**
 * Get all support agents
 * @param token Authentication token
 * @returns Array of support agents
 */
export const getSupportAgents = async (token: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${config.services.authServiceUrl}/api/users?role=SupportAgent`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.data.users || [];
  } catch (error: any) {
    logger.error('Error fetching support agents:', error.message);
    return [];
  }
};
// src/services/carService.ts
import axios from 'axios';
import config from '../config/config';
import logger from '../utils/logger';

/**
 * Get car by ID
 * @param carId Car ID
 * @param token Authentication token
 * @returns Car details
 */
export const getCarById = async (carId: string, token: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${config.services.homePageServiceUrl}/api/cars/${carId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.data.car;
  } catch (error: any) {
    logger.error(`Error fetching car ${carId}:`, error.message);
    return null;
  }
};

/**
 * Get cars by location
 * @param locationId Location ID
 * @param token Authentication token
 * @returns Array of cars
 */
export const getCarsByLocation = async (locationId: string, token: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${config.services.homePageServiceUrl}/api/cars?location=${locationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.data.cars || [];
  } catch (error: any) {
    logger.error(`Error fetching cars for location ${locationId}:`, error.message);
    return [];
  }
};
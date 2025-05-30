// src/services/bookingService.ts
import axios from 'axios';
import config from '../config/config';
import logger from '../utils/logger';

/**
 * Get bookings by date range from the booking service
 * @param startDate Start date
 * @param endDate End date
 * @param filters Additional filters
 * @param token Authentication token
 * @returns Array of bookings
 */
export const getBookingsByDateRange = async (
  startDate: Date,
  endDate: Date,
  filters: any = {},
  token: string
): Promise<any[]> => {
  try {
    // Format dates for API call
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();
    
    // Prepare request URL and headers
    const url = `${config.services.carBookingServiceUrl}/api/bookings/search`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Prepare request body
    const requestBody = {
      dateFrom: formattedStartDate,
      dateTo: formattedEndDate,
      ...filters
    };
    
    logger.info(`Fetching bookings from ${formattedStartDate} to ${formattedEndDate}`);
    
    // Make API call to booking service
    const response = await axios.post(url, requestBody, { headers });
    
    if (response.data && response.data.data && Array.isArray(response.data.data.bookings)) {
      return response.data.data.bookings;
    }
    
    logger.warn('Booking service returned unexpected response format');
    return [];
  } catch (error: any) {
    logger.error('Error fetching bookings:', error.message);
    
    // Add more detailed error information
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error('Response data:', error.response.data);
    }
    
    throw new Error('Failed to fetch bookings: ' + (error.message || 'Unknown error'));
  }
};
// src/services/feedbackService.ts
import axios from 'axios';
import config from '../config/config';
import logger from '../utils/logger';

/**
 * Get feedback by booking ID
 * @param bookingId Booking ID
 * @param token Authentication token
 * @returns Feedback details
 */
export const getFeedbackByBookingId = async (bookingId: string, token: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${config.services.carBookingServiceUrl}/api/feedback/booking/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.data.feedback;
  } catch (error: any) {
    logger.error(`Error fetching feedback for booking ${bookingId}:`, error.message);
    return null;
  }
};

/**
 * Get feedback for multiple bookings
 * @param bookingIds Array of booking IDs
 * @param token Authentication token
 * @returns Array of feedback
 */
export const getFeedbacksByBookingIds = async (bookingIds: string[], token: string): Promise<any[]> => {
  try {
    if (!bookingIds.length) return [];
    
    const response = await axios.post(
      `${config.services.carBookingServiceUrl}/api/feedback/bookings`,
      { bookingIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data.feedback || [];
  } catch (error: any) {
    logger.error('Error fetching feedback for multiple bookings:', error.message);
    return [];
  }
};
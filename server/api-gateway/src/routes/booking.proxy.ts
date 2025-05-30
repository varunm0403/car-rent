import express from 'express';
import axios from 'axios';
import { authenticate } from '../middlewares/auth.middleware';
import config from '../config/config'; // Contains bookingServiceUrl

const router = express.Router();

// POST /gateway/bookings => forwards to booking-service
router.post('/', authenticate, async (req, res) => {
  try {
    const response = await axios.post(`${config.carBookingServiceUrl}/bookings`, {
      ...req.body,
      userId: req.user?.userId // Inject user from token
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Error forwarding to booking service:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Booking service error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /gateway/bookings => forwards to booking-service to get all bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const response = await axios.get(`${config.carBookingServiceUrl}/bookings`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /gateway/bookings/user => forwards to booking-service using authenticated user's ID
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const response = await axios.get(`${config.carBookingServiceUrl}/bookings/user/${userId}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Error fetching user bookings:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error fetching user bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

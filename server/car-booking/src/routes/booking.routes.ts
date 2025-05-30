import express from 'express';
import { 
  createBooking, 
  getBookings,
  getBookingsByUserId
} from '../controllers/booking.controller';

const router = express.Router();
router.post('/', createBooking);
router.get('/', getBookings);
router.get('/user/:userId', getBookingsByUserId);

export default router;

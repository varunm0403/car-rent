import express from 'express';
import bookingRoutes from './routes/booking.routes';
import connectDB from './config/db';

const app = express();
app.use(express.json());
// Connect to MongoDB
connectDB();

// Routes
app.use('/bookings', bookingRoutes);

export default app;

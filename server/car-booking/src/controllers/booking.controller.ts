import { Request, Response } from 'express';
import Booking from '../models/booking.model';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId, pickupDate, dropoffDate, userId, pickupLocation, dropoffLocation } = req.body;
    const now = new Date();

    if (!userId) {
      res.status(400).json({ message: 'User ID missing in request' });
      return;
    }

    if (!pickupLocation || !dropoffLocation) {
      res.status(400).json({ message: 'Pickup and dropoff locations are required' });
      return;
    }

    if (new Date(pickupDate) <= now || new Date(dropoffDate) <= now) {
      res.status(400).json({ 
        message: 'Booking dates must be in the future',
        now: now.toISOString()
      });
      return;
    }

    if (new Date(pickupDate) >= new Date(dropoffDate)) {
      res.status(400).json({ message: 'Pickup date must be before dropoff date' });
      return;
    }

    const existingBooking = await Booking.findOne({
      carId,
      $or: [
        {
          pickupDate: { $lte: new Date(dropoffDate) },
          dropoffDate: { $gte: new Date(pickupDate) }
        },
        {
          pickupDate: { $gte: new Date(pickupDate), $lte: new Date(dropoffDate) }
        }
      ]
    });

    if (existingBooking) {
      res.status(409).json({
        message: 'Car is already booked for this period',
        conflict: {
          existing: {
            pickup: existingBooking.pickupDate,
            dropoff: existingBooking.dropoffDate
          },
          attempted: {
            pickup: pickupDate,
            dropoff: dropoffDate
          }
        }
      });
      return;
    }

    const booking = new Booking({
      userId,
      carId,
      pickupDate,
      dropoffDate,
      pickupLocation,
      dropoffLocation,
      status: 'Reserved',
      createdAt: now,
      updatedAt: now
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Booking creation failed', error });
  }
};


export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

export const getBookingsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const bookings = await Booking.find({ userId });

    if (!bookings.length) {
      res.status(404).json({ message: 'No bookings found for this user' });
      return;
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error });
  }
};

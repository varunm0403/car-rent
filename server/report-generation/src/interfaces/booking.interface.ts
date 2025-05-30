// src/interfaces/booking.interface.ts

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  RESERVED = 'RESERVED',
  RESERVED_BY_SUPPORT_AGENT = 'RESERVED_BY_SUPPORT_AGENT',
  SERVICE_STARTED = 'SERVICE_STARTED',
  SERVICE_COMPLETED = 'SERVICE_COMPLETED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Define the references directly in this file
export interface IUserReference {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ICarReference {
  _id: string;
  make: string;
  displayModel: string;
  year: number;
  pricePerDay: number;
  category: string;
  location: string;
}

export interface IBookingInterface {
  _id: string;
  userId: string;
  carId: string;
  agentId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  status: string;
  totalPrice?: number;
  carMileageStart?: number;
  carMileageEnd?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingWithReferences {
  _id: string;
  user: IUserReference;
  car: ICarReference;
  agent?: IUserReference;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  dropoffDate: Date;
  status: string;
  totalPrice?: number;
  carMileageStart?: number;
  carMileageEnd?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
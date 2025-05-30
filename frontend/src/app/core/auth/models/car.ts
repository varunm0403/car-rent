// src/app/core/auth/models/car.ts

export interface Car {
  carId: string;
  id:string;
  make: string;
  model: string;
  year: number;
  type: string;  // For car category filter
  fuelType: string;  // For engine type filter
  pricePerDay: string;
  engineCapacity : string;
  gearBoxType : string;
  climateControlOption : string;
  seats: number;
  features: string[];
  imageUrl: string;
  status: string;
  carRating: string;
  location: string;
  images : string[];
  displayModel: string;
}
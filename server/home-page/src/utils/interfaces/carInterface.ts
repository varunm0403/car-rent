import { Document } from 'mongoose';

export enum CarCategory {
  ECONOMY = 'ECONOMY',
  COMFORT = 'COMFORT',
  BUSINESS = 'BUSINESS',
  PREMIUM = 'PREMIUM',
  CROSSOVER = 'CROSSOVER',
  MINIVAN = 'MINIVAN',
  ELECTRIC = 'ELECTRIC',
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  HATCHBACK = 'HATCHBACK',
  LUXURY = 'LUXURY',
  VAN = 'VAN'
}

export enum CarStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID'
}

export enum GearBoxType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC'
}

export enum ClimateControlOption {
  AIR_CONDITIONER = 'AIR_CONDITIONER',
  AIR_CONDITIONING = 'AIR_CONDITIONING',
  CLIMATE_CONTROL = 'CLIMATE_CONTROL',
  TWO_ZONE_CLIMATE_CONTROL = 'TWO_ZONE_CLIMATE_CONTROL'
}

export interface ICar extends Document {
  _id: string;
  make: string;
  year: number;
  status: CarStatus;
  engineCapacity: string;
  passengerCapacity: string;
  fuelConsumption: string;
  fuelType: FuelType;
  gearBoxType: GearBoxType;
  climateControlOption: ClimateControlOption;
  pricePerDay: number;
  category: CarCategory;
  images: string[];
  location: string;
  carRating: string;
  serviceRating: string;
  displayModel: string;
  popularityScore?: number;
}


export interface ICarResponse {
  id: string;
  make: string;
  year: number;
  status: CarStatus;
  engineCapacity: string;
  passengerCapacity: string;
  fuelConsumption: string;
  fuelType: FuelType;
  gearBoxType: GearBoxType;
  climateControlOption: ClimateControlOption;
  pricePerDay: number;
  category: CarCategory;
  images: string[];
  location: string;
  carRating: string;
  serviceRating: string;
  displayModel: string;
  popularityScore?: number;
}
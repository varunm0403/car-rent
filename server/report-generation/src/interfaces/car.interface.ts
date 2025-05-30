export enum CarStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum CarCategory {
  ECONOMY = 'ECONOMY',
  COMPACT = 'COMPACT',
  MIDSIZE = 'MIDSIZE',
  FULLSIZE = 'FULLSIZE',
  LUXURY = 'LUXURY',
  SUV = 'SUV',
  VAN = 'VAN'
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  HYBRID = 'HYBRID',
  ELECTRIC = 'ELECTRIC'
}

export enum GearBoxType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC'
}

export enum ClimateControlOption {
  AC = 'AC',
  CLIMATE_CONTROL = 'CLIMATE_CONTROL',
  NONE = 'NONE'
}

export interface ICarInterface {
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
  popularityScore: number;
  createdAt: Date;
  updatedAt: Date;
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
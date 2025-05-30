import mongoose, { Schema } from 'mongoose';
import { 
  ICar, 
  CarStatus, 
  CarCategory, 
  FuelType, 
  GearBoxType, 
  ClimateControlOption 
} from '../utils/interfaces/carInterface';

const carSchema = new Schema<ICar>({
  make: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(CarStatus),
    default: CarStatus.AVAILABLE,
  },
  engineCapacity: {
    type: String,
    required: true,
  },
  passengerCapacity: {
    type: String,
    required: true,
  },
  fuelConsumption: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    enum: Object.values(FuelType),
    required: true,
  },
  gearBoxType: {
    type: String,
    enum: Object.values(GearBoxType),
    required: true,
  },
  climateControlOption: {
    type: String,
    enum: Object.values(ClimateControlOption),
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(CarCategory),
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  location: {
    type: String,
    required: true,
  },
  carRating: {
    type: String,
    default: '0.0',
  },
  serviceRating: {
    type: String,
    default: '0.0',
  },
  displayModel: {
    type: String,
    required: true,
  },
  popularityScore: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

export default mongoose.model<ICar>('Car', carSchema);
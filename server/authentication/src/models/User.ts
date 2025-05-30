import mongoose, { Document, Schema } from 'mongoose';
import { USER_ROLES } from '../config/constants';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  drivingLicense?: {
    number: string;
    expiryDate: Date;
    documentUrl: string;
    verified: boolean;
    uploadDate: Date;
  };
  passport?: {
    number: string;
    expiryDate: Date;
    documentUrl: string;
    verified: boolean;
    uploadDate: Date;
  };
  imageUrl: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  getFullName(): string;
  getPublicProfile(): Record<string, any>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  street: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  drivingLicense: {
    number: String,
    expiryDate: Date,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    },
    uploadDate: Date
  },
  passport: {
    number: String,
    expiryDate: Date,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    },
    uploadDate: Date
  },
  imageUrl: {
    type: String,
    default: 'https://application.s3.eu-central-1.amazonaws.com/img/users/default.png'
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
userSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.getPublicProfile = function(): Record<string, any> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
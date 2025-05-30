export interface IUserInterface {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  imageUrl?: string;
  role: string;
  drivingLicense?: {
    number: string;
    expiryDate: Date;
    documentUrl: string;
    verified: boolean;
  };
  passport?: {
    number: string;
    expiryDate: Date;
    documentUrl: string;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserReference {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
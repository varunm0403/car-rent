import { Document } from 'mongoose';

export interface ILocation extends Document {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

export interface ILocationResponse {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  lat: number;
  lng: number;
}
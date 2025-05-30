import { Document } from 'mongoose';

export interface IAboutUsStory extends Document {
  id: string;
  title: string;
  numericValue: string;
  description: string;
}

export interface IAboutUsResponse {
  title: string;
  numericValue: string;
  description: string;
}
import { Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface IFAQResponse {
  question: string;
  answer: string;
  isOpen: boolean;
}
import mongoose, { Schema } from 'mongoose';
import { IFAQ } from '../utils/interfaces/faqInterface';

const faqSchema = new Schema<IFAQ>({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<IFAQ>('FAQ', faqSchema);
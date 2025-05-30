import mongoose, { Schema } from 'mongoose';
import { IAboutUsStory } from '../utils/interfaces/aboutUsInterface';

const aboutUsSchema = new Schema<IAboutUsStory>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  numericValue: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model<IAboutUsStory>('AboutUs', aboutUsSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface ISupportAgentList extends Document {
  email: string;
  addedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const supportAgentListSchema = new Schema<ISupportAgentList>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SupportAgentList = mongoose.model<ISupportAgentList>('SupportAgentList', supportAgentListSchema);

export default SupportAgentList;
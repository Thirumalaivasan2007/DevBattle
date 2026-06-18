import mongoose, { Document, Schema } from 'mongoose';

export interface ILearningPath extends Document {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problems: mongoose.Types.ObjectId[];
  estimatedDuration: string; // e.g., '2 Weeks'
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const learningPathSchema = new Schema<ILearningPath>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    estimatedDuration: { type: String, default: '1 Week' },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILearningPath>('LearningPath', learningPathSchema);

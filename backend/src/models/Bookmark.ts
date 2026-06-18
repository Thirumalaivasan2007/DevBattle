import mongoose, { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetModel: 'Post' | 'Problem' | 'Solution';
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetModel: { type: String, enum: ['Post', 'Problem', 'Solution'], required: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, targetId: 1, targetModel: 1 }, { unique: true });

export default mongoose.model<IBookmark>('Bookmark', bookmarkSchema);

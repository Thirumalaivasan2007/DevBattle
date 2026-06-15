import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FollowSchema: Schema = new Schema(
  {
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate follow records
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.models.Follow || mongoose.model<IFollow>('Follow', FollowSchema);

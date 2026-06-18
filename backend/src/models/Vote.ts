import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetModel: 'Post' | 'Comment';
  voteType: number; // 1 for upvote, -1 for downvote
}

const voteSchema = new Schema<IVote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetModel: { type: String, enum: ['Post', 'Comment'], required: true },
    voteType: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

// A user can only have one vote per target
voteSchema.index({ userId: 1, targetId: 1, targetModel: 1 }, { unique: true });

export default mongoose.model<IVote>('Vote', voteSchema);

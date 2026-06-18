import mongoose, { Schema, Document } from 'mongoose';

export interface IDigestHistory extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'WEEKLY' | 'MONTHLY';
  sentAt: Date;
  metrics: {
    xpGained: number;
    ratingChange: number;
    problemsSolved: number;
  };
}

const DigestHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['WEEKLY', 'MONTHLY'],
      required: true,
    },
    sentAt: { type: Date, default: Date.now },
    metrics: {
      xpGained: { type: Number, default: 0 },
      ratingChange: { type: Number, default: 0 },
      problemsSolved: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.DigestHistory || mongoose.model<IDigestHistory>('DigestHistory', DigestHistorySchema);

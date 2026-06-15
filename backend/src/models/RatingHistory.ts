import mongoose, { Schema, Document } from 'mongoose';

export interface IRatingHistory extends Document {
  userId: mongoose.Types.ObjectId;
  oldRating: number;
  newRating: number;
  ratingChange: number;
  reason: string; // e.g., "Weekly Contest #1", "Admin Adjustment"
  createdAt: Date;
  updatedAt: Date;
}

const RatingHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    oldRating: { type: Number, required: true },
    newRating: { type: Number, required: true },
    ratingChange: { type: Number, required: true },
    reason: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RatingHistory || mongoose.model<IRatingHistory>('RatingHistory', RatingHistorySchema);

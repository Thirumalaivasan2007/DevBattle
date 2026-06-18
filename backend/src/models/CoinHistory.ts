import mongoose, { Schema, Document } from 'mongoose';

export interface ICoinHistory extends Document {
  userId: mongoose.Types.ObjectId;
  coinsEarned: number; // can be negative for purchases
  reason: string;
  metadata?: any;
  createdAt: Date;
}

const CoinHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    coinsEarned: { type: Number, required: true },
    reason: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CoinHistory || mongoose.model<ICoinHistory>('CoinHistory', CoinHistorySchema);

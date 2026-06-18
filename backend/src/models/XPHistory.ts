import mongoose, { Schema, Document } from 'mongoose';

export interface IXPHistory extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  xpEarned: number;
  metadata?: any;
  createdAt: Date;
}

const XPHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    xpEarned: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.XPHistory || mongoose.model<IXPHistory>('XPHistory', XPHistorySchema);

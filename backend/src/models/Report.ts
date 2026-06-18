import mongoose, { Document, Schema } from 'mongoose';

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetModel: 'Post' | 'Comment' | 'User';
  reason: string;
  status: ReportStatus;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetModel: { type: String, enum: ['Post', 'Comment', 'User'], required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: Object.values(ReportStatus), default: ReportStatus.PENDING },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', reportSchema);

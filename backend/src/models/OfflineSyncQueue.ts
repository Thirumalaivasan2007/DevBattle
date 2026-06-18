import mongoose, { Schema, Document } from 'mongoose';

export interface IOfflineSyncQueue extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  payload: any;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  errorReason?: string;
  retryCount: number;
  queuedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfflineSyncQueueSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['PENDING', 'PROCESSED', 'FAILED'], default: 'PENDING', index: true },
    errorReason: { type: String },
    retryCount: { type: Number, default: 0 },
    queuedAt: { type: Date, default: Date.now },
    processedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<IOfflineSyncQueue>('OfflineSyncQueue', OfflineSyncQueueSchema);

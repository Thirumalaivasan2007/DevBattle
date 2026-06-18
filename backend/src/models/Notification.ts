import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'CONTEST' | 'BATTLE' | 'COMMUNITY' | 'ACHIEVEMENT' | 'RATING' | 'SYSTEM' | 'MENTION' | 'REWARD';
  link?: string;
  isRead: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['CONTEST', 'BATTLE', 'COMMUNITY', 'ACHIEVEMENT', 'RATING', 'SYSTEM', 'MENTION', 'REWARD'],
      required: true,
    },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed }, // Dynamic data for rendering specifics
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

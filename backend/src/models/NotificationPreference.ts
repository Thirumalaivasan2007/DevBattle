import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationPreference extends Document {
  userId: mongoose.Types.ObjectId;
  emailNotifications: boolean;
  pushNotifications: boolean;
  contestAlerts: boolean;
  battleAlerts: boolean;
  communityAlerts: boolean;
  marketingEmails: boolean;
}

const NotificationPreferenceSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false }, // Foundation for Push
    contestAlerts: { type: Boolean, default: true },
    battleAlerts: { type: Boolean, default: true },
    communityAlerts: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.NotificationPreference || mongoose.model<INotificationPreference>('NotificationPreference', NotificationPreferenceSchema);

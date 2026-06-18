import mongoose, { Schema, Document } from 'mongoose';

export interface IDeviceRegistration extends Document {
  user: mongoose.Types.ObjectId;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  userAgent: string;
  preferences: {
    pushEnabled: boolean;
    syncEnabled: boolean;
  };
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceRegistrationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    },
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
    userAgent: { type: String, default: '' },
    preferences: {
      pushEnabled: { type: Boolean, default: true },
      syncEnabled: { type: Boolean, default: true }
    },
    lastActive: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<IDeviceRegistration>('DeviceRegistration', DeviceRegistrationSchema);

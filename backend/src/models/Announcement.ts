import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  type: 'UPDATE' | 'MAINTENANCE' | 'EVENT' | 'FEATURE';
  link?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['UPDATE', 'MAINTENANCE', 'EVENT', 'FEATURE'],
      required: true,
    },
    link: { type: String },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

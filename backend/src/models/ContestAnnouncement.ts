import mongoose, { Schema, Document } from 'mongoose';

export interface IContestAnnouncement extends Document {
  contestId: mongoose.Types.ObjectId;
  message: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const contestAnnouncementSchema = new Schema<IContestAnnouncement>(
  {
    contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
    message: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IContestAnnouncement>('ContestAnnouncement', contestAnnouncementSchema);

import mongoose, { Document, Schema } from 'mongoose';

export enum ChallengeType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface IChallenge extends Document {
  date: string; // YYYY-MM-DD
  problemId: mongoose.Types.ObjectId;
  type: ChallengeType;
  participants: mongoose.Types.ObjectId[]; // Users who successfully completed it
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    date: { type: String, required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    type: { type: String, enum: Object.values(ChallengeType), default: ChallengeType.DAILY },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// We only want ONE daily challenge per date
challengeSchema.index({ date: 1, type: 1 }, { unique: true });

export default mongoose.model<IChallenge>('Challenge', challengeSchema);

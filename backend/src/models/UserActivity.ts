import mongoose, { Schema, Document } from 'mongoose';

export interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: 'ACCEPTED_PROBLEM' | 'NEW_BADGE' | 'RATING_MILESTONE' | 'CONTEST_PARTICIPATION' | 'BATTLE_WIN' | 'SUBMISSION';
  metadata: {
    problemId?: mongoose.Types.ObjectId;
    problemTitle?: string;
    achievementId?: mongoose.Types.ObjectId;
    badgeName?: string;
    rating?: number;
    contestId?: mongoose.Types.ObjectId;
    battleId?: mongoose.Types.ObjectId;
  };
  createdAt: Date;
}

const UserActivitySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    activityType: {
      type: String,
      enum: ['ACCEPTED_PROBLEM', 'NEW_BADGE', 'RATING_MILESTONE', 'CONTEST_PARTICIPATION', 'BATTLE_WIN', 'SUBMISSION'],
      required: true,
    },
    metadata: {
      problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
      problemTitle: { type: String },
      achievementId: { type: Schema.Types.ObjectId, ref: 'Achievement' },
      badgeName: { type: String },
      rating: { type: Number },
      contestId: { type: Schema.Types.ObjectId, ref: 'Contest' }, // For future phases
      battleId: { type: Schema.Types.ObjectId, ref: 'Battle' }, // For future phases
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UserActivity || mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);

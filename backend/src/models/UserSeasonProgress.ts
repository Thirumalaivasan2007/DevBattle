import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSeasonProgress extends Document {
  userId: mongoose.Types.ObjectId;
  seasonId: mongoose.Types.ObjectId;
  xpEarned: number;
  level: number;
  isPremium: boolean;
  claimedFreeLevels: number[];
  claimedPremiumLevels: number[];
}

const UserSeasonProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    xpEarned: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    isPremium: { type: Boolean, default: false },
    claimedFreeLevels: [{ type: Number }],
    claimedPremiumLevels: [{ type: Number }],
  },
  {
    timestamps: true,
  }
);

UserSeasonProgressSchema.index({ userId: 1, seasonId: 1 }, { unique: true });

export default mongoose.models.UserSeasonProgress || mongoose.model<IUserSeasonProgress>('UserSeasonProgress', UserSeasonProgressSchema);

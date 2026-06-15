import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: string; // e.g. 'First Submission', '10 Solved', '7 Day Streak'
  badgeIcon: string;
  unlockedAt: Date;
}

const AchievementSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    badgeIcon: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Prevent unlocking the same exact achievement twice for the same user
AchievementSchema.index({ userId: 1, type: 1 }, { unique: true });

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);

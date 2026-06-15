import mongoose, { Schema, Document } from 'mongoose';

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  acceptedCount: number;
  wrongAnswerCount: number;
  runtimeErrors: number;
  compilationErrors: number;
  acceptanceRate: number;
  avgRuntime: number;
  avgMemory: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  longestStreak: number;
  currentStreak: number;
  languageUsage: Map<string, number>;
  solvedProblems: mongoose.Types.ObjectId[];
}

const UserStatsSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    acceptedCount: { type: Number, default: 0 },
    wrongAnswerCount: { type: Number, default: 0 },
    runtimeErrors: { type: Number, default: 0 },
    compilationErrors: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    avgRuntime: { type: Number, default: 0 },
    avgMemory: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    languageUsage: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    solvedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UserStats || mongoose.model<IUserStats>('UserStats', UserStatsSchema);

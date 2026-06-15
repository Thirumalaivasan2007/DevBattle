import mongoose, { Schema, Document } from 'mongoose';

export interface IRankingCache extends Document {
  userId: mongoose.Types.ObjectId;
  globalRank: number;
  countryRank: number;
  collegeRank: number;
  score: number; // based on rating or solved problems
  updatedAt: Date;
}

const RankingCacheSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    globalRank: { type: Number, default: 0 },
    countryRank: { type: Number, default: 0 },
    collegeRank: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RankingCache || mongoose.model<IRankingCache>('RankingCache', RankingCacheSchema);

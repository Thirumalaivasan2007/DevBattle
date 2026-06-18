import mongoose, { Document, Schema } from 'mongoose';
import { BattleType } from './Battle';

export interface IMatchmakingQueue extends Document {
  userId: mongoose.Types.ObjectId;
  rating: number;
  battleType: BattleType;
  joinedAt: Date;
}

const matchmakingQueueSchema = new Schema<IMatchmakingQueue>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rating: { type: Number, required: true },
  battleType: { type: String, enum: Object.values(BattleType), required: true },
  joinedAt: { type: Date, default: Date.now }
});

// TTL index to automatically remove players from queue if they get stuck for > 5 mins
matchmakingQueueSchema.index({ joinedAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.model<IMatchmakingQueue>('MatchmakingQueue', matchmakingQueueSchema);

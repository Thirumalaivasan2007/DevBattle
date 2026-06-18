import mongoose, { Document, Schema } from 'mongoose';

export enum BattleStatus {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS', // Match found, waiting for both to accept
  RUNNING = 'RUNNING',                         // Battle in progress
  FINISHED = 'FINISHED',                       // Battle ended
  CANCELLED = 'CANCELLED'                      // Someone declined or timed out
}

export enum BattleType {
  RANKED = 'RANKED',
  UNRANKED = 'UNRANKED',
  FRIEND = 'FRIEND'
}

export interface IBattleParticipant {
  userId: mongoose.Types.ObjectId;
  isReady: boolean;
  score: number;
  passedCount: number;
  submissionCount: number;
  timeTaken: number; // in seconds from start
  isWinner: boolean;
  ratingChange: number;
}

export interface IBattle extends Document {
  status: BattleStatus;
  battleType: BattleType;
  problemId: mongoose.Types.ObjectId;
  startTime?: Date;
  endTime?: Date;
  duration: number; // in minutes
  participants: IBattleParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IBattleParticipant>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isReady: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  passedCount: { type: Number, default: 0 },
  submissionCount: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 },
  isWinner: { type: Boolean, default: false },
  ratingChange: { type: Number, default: 0 }
});

const battleSchema = new Schema<IBattle>(
  {
    status: {
      type: String,
      enum: Object.values(BattleStatus),
      default: BattleStatus.WAITING_FOR_PLAYERS,
    },
    battleType: {
      type: String,
      enum: Object.values(BattleType),
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
      required: true,
      default: 15, // 15 mins default
    },
    participants: [participantSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IBattle>('Battle', battleSchema);

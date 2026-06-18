import mongoose, { Schema, Document } from 'mongoose';

export interface IProblemProgress {
  problemId: mongoose.Types.ObjectId;
  label: string; // A, B, C
  solved: boolean;
  submissionCount: number;
  penaltyTime: number; // Penalty for this specific problem
  acceptedTime?: number; // Minutes from contest start when accepted
}

export interface IContestStanding extends Document {
  contestId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  isVirtual: boolean;
  rank: number;
  score: number;
  solvedCount: number;
  penalty: number;
  ratingChange?: number;
  oldRating?: number;
  newRating?: number;
  problemsProgress: IProblemProgress[];
  lastSubmissionTime?: Date;
}

const contestStandingSchema = new Schema<IContestStanding>(
  {
    contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isVirtual: { type: Boolean, default: false },
    rank: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    solvedCount: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 },
    ratingChange: { type: Number },
    oldRating: { type: Number },
    newRating: { type: Number },
    problemsProgress: [
      {
        problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
        label: { type: String, required: true },
        solved: { type: Boolean, default: false },
        submissionCount: { type: Number, default: 0 },
        penaltyTime: { type: Number, default: 0 },
        acceptedTime: { type: Number }
      }
    ],
    lastSubmissionTime: { type: Date }
  },
  { timestamps: true }
);

// We need an index to quickly pull standings sorted by solvedCount and penalty
contestStandingSchema.index({ contestId: 1, isVirtual: 1, solvedCount: -1, penalty: 1 });
contestStandingSchema.index({ contestId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IContestStanding>('ContestStanding', contestStandingSchema);

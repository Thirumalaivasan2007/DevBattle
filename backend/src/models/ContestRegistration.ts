import mongoose, { Schema, Document } from 'mongoose';

export interface IContestRegistration extends Document {
  contestId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  registrationTime: Date;
  isVirtual: boolean;
  virtualStartTime?: Date;
}

const contestRegistrationSchema = new Schema<IContestRegistration>(
  {
    contestId: { type: Schema.Types.ObjectId, ref: 'Contest', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    registrationTime: { type: Date, default: Date.now },
    isVirtual: { type: Boolean, default: false },
    virtualStartTime: { type: Date }
  },
  { timestamps: true }
);

// A user can only register once for a contest
contestRegistrationSchema.index({ contestId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IContestRegistration>('ContestRegistration', contestRegistrationSchema);

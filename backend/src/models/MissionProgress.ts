import mongoose, { Schema, Document } from 'mongoose';

export interface IMissionProgress extends Document {
  userId: mongoose.Types.ObjectId;
  missionId: mongoose.Types.ObjectId;
  currentProgress: number;
  isCompleted: boolean;
  expiresAt: Date;
}

const MissionProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    missionId: { type: Schema.Types.ObjectId, ref: 'Mission', required: true },
    currentProgress: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true }, // Determines when it resets
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness per active period
MissionProgressSchema.index({ userId: 1, missionId: 1, expiresAt: 1 }, { unique: true });

export default mongoose.models.MissionProgress || mongoose.model<IMissionProgress>('MissionProgress', MissionProgressSchema);

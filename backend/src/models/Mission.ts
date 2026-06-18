import mongoose, { Schema, Document } from 'mongoose';

export enum MissionType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

export interface IMission extends Document {
  title: string;
  description: string;
  type: MissionType;
  targetAction: string; // e.g., 'SOLVE_EASY', 'SOLVE_PROBLEM', 'WIN_BATTLE'
  requiredCount: number;
  xpReward: number;
  coinReward: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: Object.values(MissionType), required: true },
    targetAction: { type: String, required: true },
    requiredCount: { type: Number, required: true, min: 1 },
    xpReward: { type: Number, required: true, default: 0 },
    coinReward: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Mission || mongoose.model<IMission>('Mission', MissionSchema);

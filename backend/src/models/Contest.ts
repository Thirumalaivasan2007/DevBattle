import mongoose, { Schema, Document } from 'mongoose';

export enum ContestType {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  SPECIAL = 'SPECIAL',
  COLLEGE = 'COLLEGE',
  PRIVATE = 'PRIVATE',
  PRACTICE = 'PRACTICE'
}

export enum ContestStatus {
  UPCOMING = 'UPCOMING',
  REGISTRATION_OPEN = 'REGISTRATION_OPEN',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum ContestVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY'
}

export interface IContest extends Document {
  title: string;
  slug: string;
  description: string;
  banner?: string;
  contestType: ContestType;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  status: ContestStatus;
  visibility: ContestVisibility;
  problems: {
    label: string; // e.g., 'A', 'B', 'C'
    problemId: mongoose.Types.ObjectId;
    score: number;
  }[];
  participantsCount: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contestSchema = new Schema<IContest>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    banner: { type: String },
    contestType: { 
      type: String, 
      enum: Object.values(ContestType), 
      default: ContestType.WEEKLY 
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { 
      type: String, 
      enum: Object.values(ContestStatus), 
      default: ContestStatus.UPCOMING 
    },
    visibility: { 
      type: String, 
      enum: Object.values(ContestVisibility), 
      default: ContestVisibility.PUBLIC 
    },
    problems: [
      {
        label: { type: String, required: true },
        problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
        score: { type: Number, default: 0 }
      }
    ],
    participantsCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IContest>('Contest', contestSchema);

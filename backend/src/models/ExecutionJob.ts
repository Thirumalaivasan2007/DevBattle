import mongoose, { Schema, Document } from 'mongoose';

export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface IExecutionJob extends Document {
  submissionId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  problemId?: mongoose.Types.ObjectId;
  language: string;
  sourceCode: string;
  status: JobStatus;
  startedAt?: Date;
  completedAt?: Date;
  runtime?: number;
  memory?: number;
  verdict?: string;
  compileOutput?: string;
  stdout?: string;
  stderr?: string;
  error?: string;
  customInput?: string;
  isCustomExecution?: boolean;
}

const ExecutionJobSchema: Schema = new Schema({
  submissionId: { type: Schema.Types.ObjectId, ref: 'Submission' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
  language: { type: String, required: true },
  sourceCode: { type: String, required: true },
  status: { type: String, enum: Object.values(JobStatus), default: JobStatus.PENDING },
  startedAt: { type: Date },
  completedAt: { type: Date },
  runtime: { type: Number },
  memory: { type: Number },
  verdict: { type: String },
  compileOutput: { type: String },
  stdout: { type: String },
  stderr: { type: String },
  error: { type: String },
  customInput: { type: String },
  isCustomExecution: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.ExecutionJob || mongoose.model<IExecutionJob>('ExecutionJob', ExecutionJobSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  language: string;
  sourceCode: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | 'Internal Error' | 'Pending' | 'Running';
  runtime: number; // in milliseconds
  memory: number; // in kilobytes
  score: number;
  submittedAt: Date;
  testCasesPassed: number;
  totalTestCases: number;
}

const SubmissionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    language: { type: String, required: true },
    sourceCode: { type: String, required: true },
    verdict: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Time Limit Exceeded',
        'Memory Limit Exceeded',
        'Compilation Error',
        'Runtime Error',
        'Internal Error',
        'Pending',
        'Running'
      ],
      default: 'Pending',
      index: true,
    },
    runtime: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now, index: true },
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
SubmissionSchema.index({ userId: 1, problemId: 1 });
SubmissionSchema.index({ userId: 1, verdict: 1 });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

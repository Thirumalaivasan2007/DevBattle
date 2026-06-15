import mongoose, { Schema, Document } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  testCases: Array<{ input: string; output: string; isHidden: boolean }>;
  hints: string[];
  editorial: string;
  tags: string[];
  companyTags: string[];
  acceptanceRate: number;
  totalSubmissions: number;
  successfulSubmissions: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true, index: true },
    description: { type: String, required: true },
    constraints: { type: String, default: '' },
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
    hints: [{ type: String }],
    editorial: { type: String, default: '' },
    tags: [{ type: String, index: true }],
    companyTags: [{ type: String, index: true }],
    acceptanceRate: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    successfulSubmissions: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for search performance
ProblemSchema.index({ title: 'text', tags: 'text', companyTags: 'text' });

export default mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);

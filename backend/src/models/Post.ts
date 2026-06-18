import mongoose, { Document, Schema } from 'mongoose';

export enum PostType {
  GENERAL = 'GENERAL',
  QUESTION = 'QUESTION',
  SOLUTION = 'SOLUTION',
  DISCUSSION = 'DISCUSSION',
}

export interface IPost extends Document {
  title: string;
  content: string; // Markdown content
  author: mongoose.Types.ObjectId;
  problemId?: mongoose.Types.ObjectId; // Optional, if tied to a specific problem
  postType: PostType;
  tags: string[];
  difficultyTags?: string[];
  languageTags?: string[];
  upvotes: number;
  downvotes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
    postType: { 
      type: String, 
      enum: Object.values(PostType), 
      default: PostType.GENERAL 
    },
    tags: [{ type: String, trim: true }],
    difficultyTags: [{ type: String, trim: true }],
    languageTags: [{ type: String, trim: true }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', postSchema);

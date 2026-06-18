import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string; // Markdown content
  author: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  parentCommentId?: mongoose.Types.ObjectId; // For nested replies
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>('Comment', commentSchema);

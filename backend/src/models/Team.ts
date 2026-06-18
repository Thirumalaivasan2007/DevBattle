import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember {
  user: mongoose.Types.ObjectId;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
  contribution: number;
}

export interface ITeam extends Document {
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  privacy: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  rating: number;
  xp: number;
  level: number;
  members: ITeamMember[];
  
  // Backwards compatibility for existing basic teams
  joinCode?: string;
  maxMembers?: number;

  // Analytics
  problemsSolved: number;
  contestsParticipated: number;
  battlesWon: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'], default: 'MEMBER' },
  joinedAt: { type: Date, default: Date.now },
  contribution: { type: Number, default: 0 }
});

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  description: { type: String, default: '', maxlength: 500 },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  privacy: { type: String, enum: ['PUBLIC', 'PRIVATE', 'INVITE_ONLY'], default: 'PUBLIC' },
  
  rating: { type: Number, default: 1200 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  
  members: [teamMemberSchema],

  joinCode: { type: String, unique: true, sparse: true },
  maxMembers: { type: Number, default: 10 },
  
  problemsSolved: { type: Number, default: 0 },
  contestsParticipated: { type: Number, default: 0 },
  battlesWon: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<ITeam>('Team', teamSchema);

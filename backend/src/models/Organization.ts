import mongoose, { Schema, Document } from 'mongoose';

export interface IOrgMember {
  user: mongoose.Types.ObjectId;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
}

export interface IOrganization extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  type: 'COLLEGE' | 'COMPANY' | 'COMMUNITY' | 'CLUB';
  owner: mongoose.Types.ObjectId;
  members: IOrgMember[];
  teams: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const orgMemberSchema = new Schema<IOrgMember>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'], default: 'MEMBER' },
  joinedAt: { type: Date, default: Date.now }
});

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  logo: { type: String, default: '' },
  description: { type: String, default: '', maxlength: 1000 },
  type: { type: String, enum: ['COLLEGE', 'COMPANY', 'COMMUNITY', 'CLUB'], required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [orgMemberSchema],
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
}, {
  timestamps: true
});

export default mongoose.model<IOrganization>('Organization', organizationSchema);

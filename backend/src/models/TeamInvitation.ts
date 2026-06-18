import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamInvitation extends Document {
  team: mongoose.Types.ObjectId;
  inviter: mongoose.Types.ObjectId;
  invitee?: mongoose.Types.ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  type: 'INVITE' | 'REQUEST';
  createdAt: Date;
  updatedAt: Date;
}

const teamInvitationSchema = new Schema<ITeamInvitation>({
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  inviter: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // For INVITE: the admin who sent it. For REQUEST: the user asking to join
  invitee: { type: Schema.Types.ObjectId, ref: 'User' }, // For INVITE: the user being invited. For REQUEST: null
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'], default: 'PENDING' },
  role: { type: String, enum: ['ADMIN', 'MODERATOR', 'MEMBER'], default: 'MEMBER' },
  type: { type: String, enum: ['INVITE', 'REQUEST'], default: 'INVITE' }
}, {
  timestamps: true
});

// Ensure a user can only have one pending invite per team
teamInvitationSchema.index({ team: 1, invitee: 1, inviter: 1, status: 1 });

export default mongoose.model<ITeamInvitation>('TeamInvitation', teamInvitationSchema);

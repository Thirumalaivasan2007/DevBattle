import { Request, Response } from 'express';
import Team from '../models/Team';
import User from '../models/User';
import TeamInvitation from '../models/TeamInvitation';

// @desc    Invite a user to a team
// @route   POST /api/teams/:id/invite
// @access  Private (Owner/Admin only)
export const inviteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const inviterId = (req as any).user._id;

    const team = await Team.findById(id);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Check if inviter is Owner or Admin
    const inviterMember = team.members.find(m => m.user.toString() === inviterId.toString());
    if (!inviterMember || (inviterMember.role !== 'OWNER' && inviterMember.role !== 'ADMIN')) {
      res.status(403).json({ message: 'Only team admins or owners can invite members' });
      return;
    }

    // Find the user to invite
    const userToInvite = await User.findOne({ username });
    if (!userToInvite) {
      res.status(404).json({ message: 'User to invite not found' });
      return;
    }

    // Check if user is already a member
    if (team.members.some(m => m.user.toString() === userToInvite._id.toString())) {
      res.status(400).json({ message: 'User is already a member of this team' });
      return;
    }

    // Check for existing pending invitation
    const existingInvite = await TeamInvitation.findOne({
      team: team._id,
      invitee: userToInvite._id,
      status: 'PENDING'
    });

    if (existingInvite) {
      res.status(400).json({ message: 'An invitation is already pending for this user' });
      return;
    }

    const invitation = await TeamInvitation.create({
      team: team._id,
      inviter: inviterId,
      invitee: userToInvite._id,
      status: 'PENDING',
      type: 'INVITE'
    });

    res.status(201).json(invitation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending invitations for logged in user
// @route   GET /api/teams/invitations/my
// @access  Private
export const getMyInvitations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const invitations = await TeamInvitation.find({ invitee: userId, status: 'PENDING', type: { $ne: 'REQUEST' } })
      .populate('team', 'name slug logo level xp rating')
      .populate('inviter', 'username profilePicture')
      .sort('-createdAt');
      
    res.status(200).json(invitations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to a team invitation
// @route   PUT /api/teams/invitations/:id/respond
// @access  Private
export const respondToInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { accept } = req.body; // boolean
    const userId = (req as any).user._id;

    const invitation = await TeamInvitation.findById(id);
    if (!invitation || invitation.status !== 'PENDING' || invitation.type !== 'INVITE') {
      res.status(404).json({ message: 'Pending invitation not found' });
      return;
    }

    if (!invitation.invitee || invitation.invitee.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Not authorized to respond to this invitation' });
      return;
    }

    if (accept) {
      invitation.status = 'ACCEPTED';
      await invitation.save();

      // Add user to team
      await Team.findByIdAndUpdate(invitation.team, {
        $push: {
          members: {
            user: userId,
            role: 'MEMBER',
            joinedAt: new Date(),
            contribution: 0
          }
        }
      });
      res.status(200).json({ message: 'Invitation accepted and joined team successfully' });
    } else {
      invitation.status = 'REJECTED';
      await invitation.save();
      res.status(200).json({ message: 'Invitation rejected' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a member or leave team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private (Owner/Admin or self)
export const removeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params;
    const requesterId = (req as any).user._id;

    const team = await Team.findById(id);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    const requesterMember = team.members.find(m => m.user.toString() === requesterId.toString());
    const isSelf = requesterId.toString() === userId.toString();

    // Must be Owner/Admin OR removing oneself (leaving)
    if (!isSelf && (!requesterMember || (requesterMember.role !== 'OWNER' && requesterMember.role !== 'ADMIN'))) {
      res.status(403).json({ message: 'Not authorized to remove members' });
      return;
    }

    // Owner cannot leave or be removed without transferring ownership first (unless they are the last member)
    const targetMember = team.members.find(m => m.user.toString() === userId.toString());
    if (targetMember?.role === 'OWNER' && team.members.length > 1) {
      res.status(400).json({ message: 'Owner must transfer ownership before leaving the team' });
      return;
    }

    team.members = team.members.filter(m => m.user.toString() !== userId.toString());
    
    // If team is empty, delete it
    if (team.members.length === 0) {
      await Team.findByIdAndDelete(id);
      res.status(200).json({ message: 'Team deleted as it has no more members' });
      return;
    }

    await team.save();
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request to join a team
// @route   POST /api/teams/:id/request
// @access  Private
export const requestToJoin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const requesterId = (req as any).user._id;

    const team = await Team.findById(id);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Check if user is already a member
    if (team.members.some(m => m.user.toString() === requesterId.toString())) {
      res.status(400).json({ message: 'You are already a member of this team' });
      return;
    }

    // Check for existing pending request or invitation
    const existingInvite = await TeamInvitation.findOne({
      team: team._id,
      $or: [
        { invitee: requesterId, status: 'PENDING' },
        { inviter: requesterId, type: 'REQUEST', status: 'PENDING' }
      ]
    });

    if (existingInvite) {
      res.status(400).json({ message: 'An invitation or request is already pending' });
      return;
    }

    const request = new TeamInvitation({
      team: team._id,
      inviter: requesterId,
      status: 'PENDING',
      type: 'REQUEST'
    });

    await request.save();
    res.status(201).json({ message: 'Join request sent successfully', request });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending join requests for a team
// @route   GET /api/teams/:id/requests
// @access  Private (Owner/Admin only)
export const getJoinRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const requesterId = (req as any).user._id;

    const team = await Team.findById(id);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Check if requester is Owner or Admin
    const requesterMember = team.members.find(m => m.user.toString() === requesterId.toString());
    if (!requesterMember || (requesterMember.role !== 'OWNER' && requesterMember.role !== 'ADMIN')) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const requests = await TeamInvitation.find({
      team: team._id,
      type: 'REQUEST',
      status: 'PENDING'
    }).populate('inviter', 'username profilePicture');

    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to a join request (Accept/Reject)
// @route   PUT /api/teams/requests/:id/respond
// @access  Private (Owner/Admin only)
export const respondToJoinRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'ACCEPT' or 'REJECT'
    const adminId = (req as any).user._id;

    const request = await TeamInvitation.findById(id).populate('team');
    if (!request || request.type !== 'REQUEST') {
      res.status(404).json({ message: 'Join request not found' });
      return;
    }

    if (request.status !== 'PENDING') {
      res.status(400).json({ message: 'Request has already been processed' });
      return;
    }

    const team: any = request.team;
    
    // Check if admin is Owner or Admin
    const adminMember = team.members.find((m: any) => m.user.toString() === adminId.toString());
    if (!adminMember || (adminMember.role !== 'OWNER' && adminMember.role !== 'ADMIN')) {
      res.status(403).json({ message: 'Not authorized to respond to requests' });
      return;
    }

    if (action === 'ACCEPT') {
      // Check if user is already a member
      if (team.members.some((m: any) => m.user.toString() === request.inviter.toString())) {
        res.status(400).json({ message: 'User is already a member' });
        return;
      }

      team.members.push({
        user: request.inviter,
        role: 'MEMBER',
        joinedAt: new Date()
      });

      await team.save();
      request.status = 'ACCEPTED';
      await request.save();

      res.status(200).json({ message: 'Join request accepted', team });
    } else if (action === 'REJECT') {
      request.status = 'REJECTED';
      await request.save();
      res.status(200).json({ message: 'Join request rejected' });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { createTeam, getTeams, getTeamBySlug, getTeamLeaderboard, updateTeam } from '../controllers/teamController';
import { inviteMember, respondToInvite, removeMember, getMyInvitations, requestToJoin, getJoinRequests, respondToJoinRequest } from '../controllers/teamInvitationController';

const router = Router();

// Public routes
router.get('/', getTeams);
router.get('/leaderboard/global', getTeamLeaderboard);
router.get('/:slug', getTeamBySlug);

// Protected routes
router.post('/', protect, createTeam);
router.put('/:id', protect, updateTeam);

// Invitation and Member routes
router.get('/invitations/my', protect, getMyInvitations);
router.post('/:id/invite', protect, inviteMember);
router.put('/invitations/:id/respond', protect, respondToInvite);
router.post('/:id/request', protect, requestToJoin);
router.get('/:id/requests', protect, getJoinRequests);
router.put('/requests/:id/respond', protect, respondToJoinRequest);
router.delete('/:id/members/:userId', protect, removeMember);

export default router;

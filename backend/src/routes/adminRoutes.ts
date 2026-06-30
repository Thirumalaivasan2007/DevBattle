import { Router } from 'express';
import { protect, admin, superAdmin } from '../middlewares/authMiddleware';
import { getAdminStats, getUsers, updateUser } from '../controllers/adminController';
import { getAdminProblems, getAdminContests, getAdminBattles, getAdminChallenges, createAdminChallenge, deleteAdminChallenge, getAdminReports, updateAdminReportStatus, deleteAdminReport, getAdminTeams, deleteAdminTeam, broadcastNotification } from '../controllers/adminEntityController';

const router = Router();

// GET /api/admin/stats
router.get('/stats', protect, admin, getAdminStats);

// GET /api/admin/users
router.get('/users', protect, admin, getUsers);

// PUT /api/admin/users/:id
router.put('/users/:id', protect, superAdmin, updateUser);

// GET /api/admin/problems
router.get('/problems', protect, admin, getAdminProblems);

// GET /api/admin/contests
router.get('/contests', protect, admin, getAdminContests);

// GET /api/admin/battles
router.get('/battles', protect, admin, getAdminBattles);

// Challenges
router.get('/challenges', protect, admin, getAdminChallenges);
router.post('/challenges', protect, admin, createAdminChallenge);
router.delete('/challenges/:id', protect, admin, deleteAdminChallenge);

// Reports
router.get('/reports', protect, admin, getAdminReports);
router.put('/reports/:id/status', protect, admin, updateAdminReportStatus);
router.delete('/reports/:id', protect, superAdmin, deleteAdminReport);

// Teams
router.get('/teams', protect, admin, getAdminTeams);
router.delete('/teams/:id', protect, superAdmin, deleteAdminTeam);

// Notifications
router.post('/notifications/broadcast', protect, admin, broadcastNotification);

export default router;

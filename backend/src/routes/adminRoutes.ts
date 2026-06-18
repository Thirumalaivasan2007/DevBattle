import { Router } from 'express';
import { protect, admin, superAdmin } from '../middlewares/authMiddleware';
import { getAdminStats, getUsers, updateUser } from '../controllers/adminController';
import { getAdminProblems, getAdminContests, getAdminBattles } from '../controllers/adminEntityController';

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

export default router;

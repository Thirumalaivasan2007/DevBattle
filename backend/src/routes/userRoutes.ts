import express from 'express';
import {
  getUserProfile,
  searchUsers,
  getUserStats,
  getUserActivity,
  getUserHeatmap,
  getUserAchievements
} from '../controllers/userController';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/profile/:username', getUserProfile);
router.get('/:username/stats', getUserStats);
router.get('/:username/activity', getUserActivity);
router.get('/:username/heatmap', getUserHeatmap);
router.get('/:username/achievements', getUserAchievements);

export default router;

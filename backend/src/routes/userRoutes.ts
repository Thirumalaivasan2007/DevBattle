import express from 'express';
import {
  getUserProfile,
  searchUsers,
  getUserStats,
  getUserActivity,
  getUserHeatmap,
  getUserAchievements,
  getUserContestHistory
} from '../controllers/userController';

const router = express.Router();

router.get('/search', searchUsers);
router.get('/profile/:username', getUserProfile);
router.get('/:username/stats', getUserStats);
router.get('/:username/activity', getUserActivity);
router.get('/:username/heatmap', getUserHeatmap);
router.get('/:username/achievements', getUserAchievements);
router.get('/:username/contests/history', getUserContestHistory);

export default router;

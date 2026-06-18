import express from 'express';
import {
  getGlobalLeaderboard,
  getCountryLeaderboard,
  getCollegeLeaderboard,
  getHallOfFame
} from '../controllers/leaderboardController';
import { cacheMiddleware } from '../services/redisService';

const router = express.Router();

router.get('/global', cacheMiddleware(30), getGlobalLeaderboard);
router.get('/country', cacheMiddleware(30), getCountryLeaderboard);
router.get('/college', getCollegeLeaderboard);
router.get('/hall-of-fame', getHallOfFame);

export default router;

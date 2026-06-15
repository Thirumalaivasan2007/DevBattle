import express from 'express';
import {
  getGlobalLeaderboard,
  getCountryLeaderboard,
  getCollegeLeaderboard,
  getHallOfFame
} from '../controllers/leaderboardController';

const router = express.Router();

router.get('/global', getGlobalLeaderboard);
router.get('/country', getCountryLeaderboard);
router.get('/college', getCollegeLeaderboard);
router.get('/hall-of-fame', getHallOfFame);

export default router;

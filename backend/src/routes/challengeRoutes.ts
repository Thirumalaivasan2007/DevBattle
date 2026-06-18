import express from 'express';
import { getDailyChallenge, getTopStreaks } from '../controllers/challengeController';

const router = express.Router();

router.get('/daily', getDailyChallenge);
router.get('/streaks', getTopStreaks);

export default router;

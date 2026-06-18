import express from 'express';
import { protect, admin, optionalAuth } from '../middlewares/authMiddleware';
import {
  getContests,
  getContestBySlug,
  registerForContest,
  getStandings,
  createContest,
  endContest
} from '../controllers/contestController';

const router = express.Router();

router.route('/')
  .get(getContests)
  .post(protect, admin, createContest);

router.route('/:slug')
  .get(optionalAuth, getContestBySlug);

router.route('/:id/register')
  .post(protect, registerForContest);

router.route('/:id/standings')
  .get(getStandings);

router.route('/:id/end')
  .post(protect, admin, endContest);

export default router;

import express from 'express';
import {
  getProblems,
  getProblemBySlug,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} from '../controllers/problemController';
import { protect, admin } from '../middlewares/authMiddleware';
import { cacheMiddleware } from '../services/redisService';

const router = express.Router();

router.route('/')
  .get(cacheMiddleware(60), getProblems)
  .post(protect, admin, createProblem);

router.route('/id/:id')
  .get(protect, admin, getProblemById);

router.route('/:slug')
  .get(getProblemBySlug);

router.route('/:id')
  .put(protect, admin, updateProblem)
  .delete(protect, admin, deleteProblem);

export default router;

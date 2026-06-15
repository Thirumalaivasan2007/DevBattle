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

const router = express.Router();

router.route('/')
  .get(getProblems)
  .post(protect, admin, createProblem);

router.route('/id/:id')
  .get(protect, admin, getProblemById);

router.route('/:slug')
  .get(getProblemBySlug);

router.route('/:id')
  .put(protect, admin, updateProblem)
  .delete(protect, admin, deleteProblem);

export default router;

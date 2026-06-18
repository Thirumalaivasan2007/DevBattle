import express from 'express';
import { submitCode, getSubmissions, getSubmissionById } from '../controllers/submissionController';
import { protect } from '../middlewares/authMiddleware';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 5 : 1000, // Higher limit for dev
  message: { message: 'Too many submissions, please try again later.' }
});

router.post('/submit', protect, submitLimiter, submitCode);
router.get('/', protect, getSubmissions);
router.get('/:id', protect, getSubmissionById);

export default router;

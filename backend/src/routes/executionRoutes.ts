import express from 'express';
import { runCode } from '../controllers/executionController';
import { protect } from '../middlewares/authMiddleware';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const runLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 10 : 1000, // Higher limit for dev
  message: { message: 'Too many execution requests, please try again later.' }
});

router.post('/run', protect, runLimiter, runCode);

export default router;

import express from 'express';
import { getSyncStatus, processSyncQueue } from '../controllers/syncController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/status', protect, getSyncStatus);
router.post('/process', protect, processSyncQueue);

export default router;

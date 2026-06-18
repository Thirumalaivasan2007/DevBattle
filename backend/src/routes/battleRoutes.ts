import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { 
  joinQueue, 
  leaveQueue, 
  getBattleById, 
  setPlayerReady, 
  resignBattle,
  getBattleHistory
} from '../controllers/battleController';

const router = express.Router();

router.post('/join-queue', protect, joinQueue);
router.post('/leave-queue', protect, leaveQueue);
router.get('/history', protect, getBattleHistory);
router.get('/:id', protect, getBattleById);
router.post('/:id/ready', protect, setPlayerReady);
router.post('/:id/resign', protect, resignBattle);

export default router;

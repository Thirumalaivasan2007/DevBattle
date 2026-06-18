import express from 'express';
import { registerDevice, unregisterDevice } from '../controllers/deviceController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', protect, registerDevice);
router.post('/unregister', protect, unregisterDevice);

export default router;

import express from 'express';
import { compareUsers } from '../controllers/compareController';

const router = express.Router();

router.get('/', compareUsers);

export default router;

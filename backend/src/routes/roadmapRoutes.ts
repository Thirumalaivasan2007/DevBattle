import express from 'express';
import { getRoadmaps, getRoadmapById } from '../controllers/roadmapController';

const router = express.Router();

router.get('/', getRoadmaps);
router.get('/:id', getRoadmapById);

export default router;

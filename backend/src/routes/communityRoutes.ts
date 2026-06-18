import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { 
  createPost, 
  getPosts, 
  getPostById, 
  createComment, 
  voteTarget 
} from '../controllers/communityController';

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);

router.post('/posts', protect, createPost);
router.post('/comments', protect, createComment);
router.post('/vote', protect, voteTarget);

export default router;

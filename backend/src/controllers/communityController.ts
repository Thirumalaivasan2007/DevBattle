import { Request, Response } from 'express';
import Post, { PostType } from '../models/Post';
import Comment from '../models/Comment';
import Vote from '../models/Vote';
import User from '../models/User';

// Helper to update reputation
const updateReputation = async (userId: string, change: number) => {
  const user = await User.findById(userId);
  if (user) {
    user.reputation += change;
    if (user.reputation < 0) user.reputation = 0;
    
    // Level logic
    if (user.reputation >= 1000) user.reputationLevel = 'Legend';
    else if (user.reputation >= 500) user.reputationLevel = 'Mentor';
    else if (user.reputation >= 200) user.reputationLevel = 'Expert';
    else if (user.reputation >= 50) user.reputationLevel = 'Contributor';
    else user.reputationLevel = 'Newcomer';
    
    await user.save();
  }
};

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, problemId, postType, tags, difficultyTags, languageTags } = req.body;
    const author = (req as any).user._id;

    const newPost = new Post({
      title,
      content,
      author,
      problemId,
      postType: postType || PostType.GENERAL,
      tags,
      difficultyTags,
      languageTags
    });

    await newPost.save();
    
    // +5 Rep for creating a post
    await updateReputation(author, 5);

    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (with filtering)
// @route   GET /api/community/posts
// @access  Public
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { problemId, postType, sort } = req.query;
    
    let filter: any = {};
    if (problemId) filter.problemId = problemId;
    if (postType) filter.postType = postType;

    let sortObj: any = { createdAt: -1 };
    if (sort === 'trending') {
      sortObj = { views: -1, upvotes: -1 };
    } else if (sort === 'top') {
      sortObj = { upvotes: -1 };
    }

    const posts = await Post.find(filter)
      .populate('author', 'username avatar reputation reputationLevel')
      .sort(sortObj)
      .limit(50);

    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post and comments
// @route   GET /api/community/posts/:id
// @access  Public
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar reputation reputationLevel');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    // Fetch comments
    const comments = await Comment.find({ postId: post._id })
      .populate('author', 'username avatar reputation reputationLevel')
      .sort({ createdAt: 1 });

    res.json({ post, comments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a comment
// @route   POST /api/community/comments
// @access  Private
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const author = (req as any).user._id;

    const newComment = new Comment({
      postId,
      content,
      author,
      parentCommentId
    });

    await newComment.save();
    
    // +2 Rep for commenting
    await updateReputation(author, 2);

    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on a post or comment
// @route   POST /api/community/vote
// @access  Private
export const voteTarget = async (req: Request, res: Response) => {
  try {
    const { targetId, targetModel, voteType } = req.body; // voteType: 1 or -1
    const userId = (req as any).user._id;

    if (![1, -1].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    let target: any;
    if (targetModel === 'Post') {
      target = await Post.findById(targetId);
    } else {
      target = await Comment.findById(targetId);
    }

    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }

    const existingVote = await Vote.findOne({ userId, targetId, targetModel });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote
        await Vote.deleteOne({ _id: existingVote._id });
        if (voteType === 1) target.upvotes -= 1;
        else target.downvotes -= 1;
        
        // Remove rep from author
        await updateReputation(target.author.toString(), voteType === 1 ? -2 : 1);
        
      } else {
        // Change vote
        existingVote.voteType = voteType;
        await existingVote.save();
        
        if (voteType === 1) {
          target.downvotes -= 1;
          target.upvotes += 1;
          // Author rep
          await updateReputation(target.author.toString(), 3); // Reversed a downvote to upvote
        } else {
          target.upvotes -= 1;
          target.downvotes += 1;
          await updateReputation(target.author.toString(), -3);
        }
      }
    } else {
      // New vote
      await Vote.create({ userId, targetId, targetModel, voteType });
      if (voteType === 1) {
        target.upvotes += 1;
        await updateReputation(target.author.toString(), 2);
      } else {
        target.downvotes += 1;
        await updateReputation(target.author.toString(), -1);
      }
    }

    await target.save();
    res.json({ message: 'Vote recorded', upvotes: target.upvotes, downvotes: target.downvotes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

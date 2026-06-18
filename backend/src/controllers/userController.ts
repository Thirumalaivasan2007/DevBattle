import { Request, Response } from 'express';
import User from '../models/User';
import UserStats from '../models/UserStats';
import UserActivity from '../models/UserActivity';
import Achievement from '../models/Achievement';
import Submission from '../models/Submission';

// GET /api/users/profile/:username
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Auto-create stats if they don't exist
    let stats = await UserStats.findOne({ userId: user._id });
    if (!stats) {
      stats = await UserStats.create({ userId: user._id });
    }

    res.status(200).json({ user, stats });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/search
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q = '', limit = '20', page = '1' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query = {
      $or: [
        { username: { $regex: q as string, $options: 'i' } },
        { fullName: { $regex: q as string, $options: 'i' } }
      ]
    };

    const users = await User.find(query)
      .select('username fullName profilePicture rating rank solvedProblems')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await User.countDocuments(query);

    res.status(200).json({ users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:username/stats
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const stats = await UserStats.findOne({ userId: user._id }).populate('solvedProblems', 'title difficulty tags slug');
    res.status(200).json(stats || {});
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:username/activity
export const getUserActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const limit = Number(req.query.limit) || 20;
    const activities = await UserActivity.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(limit);
      
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:username/heatmap
export const getUserHeatmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const submissions = await Submission.find({
      userId: user._id,
      submittedAt: { $gte: oneYearAgo }
    }).select('submittedAt verdict');

    // Aggregate by date (YYYY-MM-DD)
    const heatmapData: Record<string, { count: number; level: number }> = {};
    
    submissions.forEach(sub => {
      const dateStr = sub.submittedAt.toISOString().split('T')[0];
      if (!heatmapData[dateStr]) {
        heatmapData[dateStr] = { count: 0, level: 0 };
      }
      heatmapData[dateStr].count += 1;
      
      // Determine level (0-4) based on arbitrary scale: 1=1-2, 2=3-5, 3=6-10, 4=11+
      const c = heatmapData[dateStr].count;
      heatmapData[dateStr].level = c >= 11 ? 4 : c >= 6 ? 3 : c >= 3 ? 2 : 1;
    });

    // Format for react-activity-calendar
    const formattedData = Object.keys(heatmapData).map(date => ({
      date,
      count: heatmapData[date].count,
      level: heatmapData[date].level
    })).sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error generating heatmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:username/achievements
export const getUserAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const achievements = await Achievement.find({ userId: user._id }).sort({ unlockedAt: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user contest history
// @route   GET /api/users/:username/contests/history
// @access  Public
export const getUserContestHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // We need to import ContestStanding here dynamically or at top
    const ContestStanding = require('../models/ContestStanding').default;
    
    const history = await ContestStanding.find({ userId: user._id })
      .populate('contestId', 'title slug')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

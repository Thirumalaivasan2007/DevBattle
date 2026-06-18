import { Request, Response } from 'express';
import Challenge, { ChallengeType } from '../models/Challenge';
import User from '../models/User';

// @desc    Get Today's Daily Challenge
// @route   GET /api/challenges/daily
// @access  Public
export const getDailyChallenge = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const challenge = await Challenge.findOne({ date: today, type: ChallengeType.DAILY })
      .populate('problemId', 'title slug difficulty acceptanceRate tags')
      .populate('participants', 'username avatar');

    if (!challenge) {
      return res.status(404).json({ message: 'No daily challenge available for today yet.' });
    }

    res.json(challenge);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Top Streaks
// @route   GET /api/challenges/streaks
// @access  Public
export const getTopStreaks = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ currentStreak: { $gt: 0 } })
      .sort({ currentStreak: -1 })
      .select('username profilePicture currentStreak longestStreak reputationLevel')
      .limit(10);
      
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

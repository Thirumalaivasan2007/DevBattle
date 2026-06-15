import { Request, Response } from 'express';
import User from '../models/User';
import UserStats from '../models/UserStats';

// @desc    Compare two users
// @route   GET /api/compare
// @access  Public
export const compareUsers = async (req: Request, res: Response) => {
  try {
    const { userA, userB } = req.query;

    if (!userA || !userB) {
      res.status(400).json({ message: 'Both userA and userB usernames are required' });
      return;
    }

    const firstUser = await User.findOne({ username: { $regex: new RegExp(`^${userA}$`, 'i') } })
      .select('-password');
    const secondUser = await User.findOne({ username: { $regex: new RegExp(`^${userB}$`, 'i') } })
      .select('-password');

    if (!firstUser || !secondUser) {
      res.status(404).json({ message: 'One or both users not found' });
      return;
    }

    const firstUserStats = await UserStats.findOne({ userId: firstUser._id });
    const secondUserStats = await UserStats.findOne({ userId: secondUser._id });

    res.status(200).json({
      userA: {
        profile: firstUser,
        stats: firstUserStats
      },
      userB: {
        profile: secondUser,
        stats: secondUserStats
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error comparing users', error: error.message });
  }
};

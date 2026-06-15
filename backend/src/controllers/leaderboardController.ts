import { Request, Response } from 'express';
import User from '../models/User';
import UserStats from '../models/UserStats';
import UserActivity from '../models/UserActivity';
import mongoose from 'mongoose';

// Helper to get tier
export const getTierFromRating = (rating: number): string => {
  if (rating < 1200) return 'Beginner';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2200) return 'Candidate Master';
  if (rating < 2500) return 'Master';
  return 'Grandmaster';
};

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Public
export const getGlobalLeaderboard = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('username fullName profilePicture rating rank highestRating solvedProblems country collegeName')
      .sort({ rating: -1, solvedProblems: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching global leaderboard', error: error.message });
  }
};

// @desc    Get country leaderboard
// @route   GET /api/leaderboard/country
// @access  Public
export const getCountryLeaderboard = async (req: Request, res: Response) => {
  try {
    const { country } = req.query;
    if (!country) {
      res.status(400).json({ message: 'Country is required' });
      return;
    }

    const users = await User.find({ country: { $regex: new RegExp(`^${country}$`, 'i') } })
      .select('username fullName profilePicture rating rank highestRating solvedProblems country')
      .sort({ rating: -1, solvedProblems: -1 })
      .limit(50);

    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching country leaderboard', error: error.message });
  }
};

// @desc    Get college leaderboard
// @route   GET /api/leaderboard/college
// @access  Public
export const getCollegeLeaderboard = async (req: Request, res: Response) => {
  try {
    const { college } = req.query;
    if (!college) {
      res.status(400).json({ message: 'College name is required' });
      return;
    }

    const users = await User.find({ collegeName: { $regex: new RegExp(`^${college}$`, 'i') } })
      .select('username fullName profilePicture rating rank highestRating solvedProblems collegeName department')
      .sort({ rating: -1, solvedProblems: -1 })
      .limit(50);

    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching college leaderboard', error: error.message });
  }
};

// @desc    Get hall of fame
// @route   GET /api/leaderboard/hall-of-fame
// @access  Public
export const getHallOfFame = async (req: Request, res: Response) => {
  try {
    const topRated = await User.find({}).sort({ highestRating: -1 }).limit(3).select('username fullName profilePicture highestRating rank');
    const mostSolved = await User.find({}).sort({ solvedProblems: -1 }).limit(3).select('username fullName profilePicture solvedProblems rank');
    const longestStreak = await User.find({}).sort({ streak: -1 }).limit(3).select('username fullName profilePicture streak rank');

    res.status(200).json({
      topRated,
      mostSolved,
      longestStreak
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching hall of fame', error: error.message });
  }
};

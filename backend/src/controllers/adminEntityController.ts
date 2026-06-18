import { Request, Response } from 'express';
import Problem from '../models/Problem';
import Contest from '../models/Contest';
import Battle from '../models/Battle';

// @desc    Get all problems for admin
// @route   GET /api/admin/problems
// @access  Private/Admin
export const getAdminProblems = async (req: Request, res: Response): Promise<void> => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contests for admin
// @route   GET /api/admin/contests
// @access  Private/Admin
export const getAdminContests = async (req: Request, res: Response): Promise<void> => {
  try {
    const contests = await Contest.find().sort({ createdAt: -1 });
    res.json(contests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all battles for admin
// @route   GET /api/admin/battles
// @access  Private/Admin
export const getAdminBattles = async (req: Request, res: Response): Promise<void> => {
  try {
    const battles = await Battle.find()
      .populate('creator', 'username')
      .populate('opponent', 'username')
      .sort({ createdAt: -1 });
    res.json(battles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

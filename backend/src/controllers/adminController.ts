import { Request, Response } from 'express';
import User from '../models/User';
import Problem from '../models/Problem';
import Submission from '../models/Submission';
import Contest from '../models/Contest';
import Battle from '../models/Battle';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ currentStreak: { $gt: 0 } });
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const totalContests = await Contest.countDocuments();
    const totalBattles = await Battle.countDocuments();

    res.json({
      totalUsers,
      activeUsers,
      totalProblems,
      totalSubmissions,
      totalContests,
      totalBattles,
      systemHealth: {
        status: 'Operational',
        cpuUsage: '45%',
        memoryUsage: '60%',
        queueSize: 12,
        activeWorkers: 4
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (paginated, with search)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search ? String(req.query.search) : '';

    const query: any = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status (Ban, Role change)
// @route   PUT /api/admin/users/:id
// @access  Private/SuperAdmin
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.body.role) {
      user.role = req.body.role;
    }
    
    if (req.body.isBanned !== undefined) {
      user.isBanned = req.body.isBanned;
      user.banReason = req.body.banReason || '';
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      role: updatedUser.role,
      isBanned: updatedUser.isBanned,
      banReason: updatedUser.banReason
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

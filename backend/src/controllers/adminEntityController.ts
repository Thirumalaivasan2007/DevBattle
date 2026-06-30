import { Request, Response } from 'express';
import Problem from '../models/Problem';
import Contest from '../models/Contest';
import Battle from '../models/Battle';
import Challenge from '../models/Challenge';
import Report from '../models/Report';
import Team from '../models/Team';
import Notification from '../models/Notification';
import User from '../models/User';

// Problems
export const getAdminProblems = async (req: Request, res: Response): Promise<void> => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Contests
export const getAdminContests = async (req: Request, res: Response): Promise<void> => {
  try {
    const contests = await Contest.find().sort({ createdAt: -1 });
    res.json(contests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Battles
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

// Challenges
export const getAdminChallenges = async (req: Request, res: Response): Promise<void> => {
  try {
    const challenges = await Challenge.find()
      .populate('problemId', 'title difficulty')
      .sort({ date: -1 });
    res.json(challenges);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAdminChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Challenge removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Reports
export const getAdminReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'username email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminReportStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminReport = async (req: Request, res: Response): Promise<void> => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Teams
export const getAdminTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await Team.find()
      .populate('owner', 'username')
      .sort({ createdAt: -1 });
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Notifications (Broadcast)
export const broadcastNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, message, type, link } = req.body;
    
    // In a real production app, sending millions of notifications iteratively is bad.
    // For MVP/small scale, this works.
    const users = await User.find({}, '_id');
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || 'SYSTEM',
      link,
      isRead: false
    }));
    
    await Notification.insertMany(notifications);
    res.status(201).json({ message: `Broadcasted to ${users.length} users successfully.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
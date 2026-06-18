import { Request, Response } from 'express';
import Contest, { ContestStatus } from '../models/Contest';
import ContestRegistration from '../models/ContestRegistration';
import ContestStanding from '../models/ContestStanding';
import { emitContestUpdate } from '../services/socketService';
import { calculateContestRatings } from '../services/contestRatingService';

// GET /api/contests
export const getContests = async (req: Request, res: Response) => {
  try {
    const contests = await Contest.find()
      .select('-problems') // hide problems on list view
      .sort({ startTime: -1 });
    
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/contests/:slug
export const getContestBySlug = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findOne({ slug: req.params.slug })
      .populate('problems.problemId', 'title slug');
    
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Hide problems if contest hasn't started yet
    if (contest.status === ContestStatus.UPCOMING || contest.status === ContestStatus.REGISTRATION_OPEN) {
      contest.problems = [];
    }

    // If user is logged in, check if they are registered
    let isRegistered = false;
    if ((req as any).user) {
      const reg = await ContestRegistration.findOne({ 
        contestId: contest._id, 
        userId: (req as any).user._id 
      });
      if (reg) isRegistered = true;
    }

    res.json({ contest, isRegistered });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/contests/:id/register
export const registerForContest = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: 'Contest not found' });

    if (contest.status === ContestStatus.FINISHED || contest.status === ContestStatus.ARCHIVED) {
      return res.status(400).json({ message: 'Contest is over' });
    }

    const userId = (req as any).user._id;

    // Check if already registered
    const existing = await ContestRegistration.findOne({ contestId: contest._id, userId });
    if (existing) {
      return res.status(400).json({ message: 'Already registered' });
    }

    await ContestRegistration.create({
      contestId: contest._id,
      userId
    });

    contest.participantsCount += 1;
    await contest.save();

    // Create a standing entry initialized to 0
    const problemsProgress = contest.problems.map(p => ({
      problemId: p.problemId,
      label: p.label,
      solved: false,
      submissionCount: 0,
      penaltyTime: 0
    }));

    await ContestStanding.create({
      contestId: contest._id,
      userId,
      problemsProgress
    });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/contests/:id/standings
export const getStandings = async (req: Request, res: Response) => {
  try {
    // Sort by solvedCount DESC, then penalty ASC
    const standings = await ContestStanding.find({ contestId: req.params.id })
      .populate('userId', 'username fullName highestRating rating')
      .sort({ solvedCount: -1, penalty: 1 });

    // Assign temporary ranks for live display
    let currentRank = 1;
    const formatted = standings.map((s, index) => {
      // Logic for tied ranks could go here, but we'll do strict index+1 for now
      return {
        ...s.toObject(),
        liveRank: index + 1
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/contests (ADMIN)
export const createContest = async (req: Request, res: Response) => {
  try {
    const newContest = new Contest({
      ...req.body,
      createdBy: (req as any).user._id
    });
    
    await newContest.save();
    res.status(201).json(newContest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// POST /api/contests/:id/end (ADMIN - Trigger rating updates manually)
export const endContest = async (req: Request, res: Response) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: 'Not found' });

    contest.status = ContestStatus.FINISHED;
    await contest.save();

    // Trigger Rating Service
    await calculateContestRatings(contest._id.toString());

    emitContestUpdate(contest._id.toString(), { status: 'FINISHED' });

    res.json({ message: 'Contest ended and ratings updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

import { Request, Response } from 'express';
import Team from '../models/Team';
import slugify from 'slugify';

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, privacy } = req.body;
    const userId = (req as any).user._id;

    if (!name) {
      res.status(400).json({ message: 'Team name is required' });
      return;
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingTeam = await Team.findOne({ $or: [{ name }, { slug }] });
    if (existingTeam) {
      res.status(400).json({ message: 'Team name already exists' });
      return;
    }

    const team = new Team({
      name,
      slug,
      description,
      privacy: privacy || 'PUBLIC',
      owner: userId,
      members: [{
        user: userId,
        role: 'OWNER'
      }]
    });

    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all teams (with search, pagination)
// @route   GET /api/teams
// @access  Public
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search ? String(req.query.search) : '';

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const teams = await Team.find(query)
      .populate('owner', 'username profilePicture')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ rating: -1, xp: -1 });

    const total = await Team.countDocuments(query);

    res.json({
      teams,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team by slug
// @route   GET /api/teams/:slug
// @access  Public
export const getTeamBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = await Team.findOne({ slug: req.params.slug })
      .populate('owner', 'username profilePicture rank')
      .populate('members.user', 'username profilePicture rank rating');
      
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/teams/leaderboard/global
// @access  Public
export const getTeamLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 50;
    const teams = await Team.find({ privacy: 'PUBLIC' })
      .select('name slug logo rating xp level members problemsSolved battlesWon')
      .sort({ rating: -1, xp: -1 })
      .limit(limit);

    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, privacy, logo, banner } = req.body;
    const teamId = req.params.id;
    const userId = (req as any).user._id;

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    // Check if user is owner or admin
    const member = team.members.find(m => m.user.toString() === userId.toString());
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      res.status(403).json({ message: 'Not authorized to update this team' });
      return;
    }

    if (name) team.name = name;
    if (description) team.description = description;
    if (privacy) team.privacy = privacy;
    if (logo) team.logo = logo;
    if (banner) team.banner = banner;

    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

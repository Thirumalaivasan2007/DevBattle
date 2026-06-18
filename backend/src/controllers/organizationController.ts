import { Request, Response } from 'express';
import Organization from '../models/Organization';

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Public
export const getOrganizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, limit = 20, page = 1 } = req.query;
    
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const organizations = await Organization.find(query)
      .sort({ score: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Organization.countDocuments(query);

    res.status(200).json({
      organizations,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get organization by slug
// @route   GET /api/organizations/:slug
// @access  Public
export const getOrganizationBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const organization = await Organization.findOne({ slug })
      .populate('members.user', 'username profilePicture rating')
      .populate('teams', 'name slug logo level');

    if (!organization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }

    res.status(200).json(organization);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

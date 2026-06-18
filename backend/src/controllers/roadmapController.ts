import { Request, Response } from 'express';
import LearningPath from '../models/LearningPath';

// @desc    Get all Learning Paths
// @route   GET /api/roadmaps
// @access  Public
export const getRoadmaps = async (req: Request, res: Response) => {
  try {
    const roadmaps = await LearningPath.find().sort({ createdAt: 1 });
    res.json(roadmaps);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Learning Path by ID with problems
// @route   GET /api/roadmaps/:id
// @access  Public
export const getRoadmapById = async (req: Request, res: Response) => {
  try {
    const roadmap = await LearningPath.findById(req.params.id)
      .populate('problems', 'title slug difficulty acceptanceRate tags');
      
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

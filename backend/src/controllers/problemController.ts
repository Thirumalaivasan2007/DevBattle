import { Request, Response } from 'express';
import Problem from '../models/Problem';
import { problemSchema, updateProblemSchema } from '../validators/problemValidator';
import slugify from 'slugify';

// @desc    Get all problems (with search, filter, pagination)
// @route   GET /api/problems
// @access  Public
export const getProblems = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search as string };
    }

    // Filter by Difficulty
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    // Filter by Tags
    if (req.query.tags) {
      const tags = (req.query.tags as string).split(',');
      query.tags = { $in: tags };
    }

    // Filter by Company Tags
    if (req.query.company) {
      const company = (req.query.company as string).split(',');
      query.companyTags = { $in: company };
    }

    // Sort
    let sort: any = { createdAt: -1 }; // Default: Newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'oldest': sort = { createdAt: 1 }; break;
        case 'most_solved': sort = { successfulSubmissions: -1 }; break;
        case 'acceptance': sort = { acceptanceRate: -1 }; break;
      }
    }

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('title slug difficulty tags companyTags acceptanceRate successfulSubmissions totalSubmissions'); // Exclude heavy fields like description

    res.json({
      problems,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single problem by slug
// @route   GET /api/problems/:slug
// @access  Public
export const getProblemBySlug = async (req: Request, res: Response) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }
    res.json(problem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single problem by ID
// @route   GET /api/problems/id/:id
// @access  Private/Admin
export const getProblemById = async (req: Request, res: Response) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }
    res.json(problem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private/Admin
export const createProblem = async (req: Request, res: Response) => {
  try {
    const validatedData = problemSchema.parse(req.body);
    
    // Generate unique slug
    let slug = slugify(validatedData.title, { lower: true, strict: true });
    let existingProblem = await Problem.findOne({ slug });
    if (existingProblem) {
      slug = `${slug}-${Date.now()}`;
    }

    const problem = await Problem.create({
      ...validatedData,
      slug,
      createdBy: (req as any).user?._id,
    });

    res.status(201).json(problem);
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private/Admin
export const updateProblem = async (req: Request, res: Response) => {
  try {
    const validatedData = updateProblemSchema.parse(req.body);

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    // If title changes, maybe update slug? Better to keep slug immutable to not break links,
    // but if requested, we can handle it. For now, keep slug same.

    Object.assign(problem, validatedData);
    const updatedProblem = await problem.save();

    res.json(updatedProblem);
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private/Admin
export const deleteProblem = async (req: Request, res: Response) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    await Problem.deleteOne({ _id: problem._id });
    res.json({ message: 'Problem removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

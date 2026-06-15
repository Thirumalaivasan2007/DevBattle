import { Request, Response } from 'express';
import Submission from '../models/Submission';
import Problem from '../models/Problem';
import User from '../models/User';
import { getLanguageId, submitCodeToJudge0, mapJudge0StatusToVerdict } from '../services/judge0Service';

// @desc    Submit code against all test cases
// @route   POST /api/submissions/submit
// @access  Private
export const submitCode = async (req: Request, res: Response) => {
  try {
    const { problemId, sourceCode, language } = req.body;
    const userId = (req as any).user?._id;

    if (!problemId || !sourceCode || !language) {
      res.status(400).json({ message: 'Problem ID, source code, and language are required' });
      return;
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    const languageId = getLanguageId(language);
    
    // Combine examples and hidden test cases for full evaluation
    const allTestCases = [
      ...problem.examples.map((ex: any) => ({ input: ex.input, output: ex.output })),
      ...problem.testCases.map((tc: any) => ({ input: tc.input, output: tc.output }))
    ];

    if (allTestCases.length === 0) {
      res.status(400).json({ message: 'No test cases found for this problem' });
      return;
    }

    let finalVerdict = 'Accepted';
    let maxRuntime = 0;
    let maxMemory = 0;
    let passedCount = 0;

    for (let i = 0; i < allTestCases.length; i++) {
      const { input, output: expectedOutput } = allTestCases[i];
      
      const result = await submitCodeToJudge0(sourceCode, languageId, input, expectedOutput);
      const verdict = mapJudge0StatusToVerdict(result.status.id);

      // Update max runtime and memory
      const timeNum = parseFloat(result.time || '0') * 1000; // convert to ms
      if (timeNum > maxRuntime) maxRuntime = timeNum;
      if (result.memory && result.memory > maxMemory) maxMemory = result.memory;

      if (verdict !== 'Accepted') {
        finalVerdict = verdict;
        break; // Stop at first failure
      }

      passedCount++;
    }

    // Save submission
    const score = finalVerdict === 'Accepted' ? 100 : 0;
    
    const submission = await Submission.create({
      userId,
      problemId,
      language,
      sourceCode,
      verdict: finalVerdict,
      runtime: maxRuntime,
      memory: maxMemory,
      score,
      testCasesPassed: passedCount,
      totalTestCases: allTestCases.length,
    });

    // Update statistics
    await Problem.findByIdAndUpdate(problemId, {
      $inc: { totalSubmissions: 1, successfulSubmissions: finalVerdict === 'Accepted' ? 1 : 0 }
    });

    // The user stats and solved problems count will be updated inside statUpdater

    // Fire and forget stats and achievement update
    import('../utils/statUpdater').then(({ updateStatsAndAchievements }) => {
      updateStatsAndAchievements(userId, submission, problem);
    }).catch(err => console.error('Failed to update stats:', err));

    res.status(201).json(submission);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Submission failed' });
  }
};

// @desc    Get user submissions
// @route   GET /api/submissions
// @access  Private
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    const { problemId } = req.query;

    const filter: any = { userId };
    if (problemId) {
      filter.problemId = problemId;
    }

    const submissions = await Submission.find(filter)
      .populate('problemId', 'title slug difficulty')
      .sort({ submittedAt: -1 })
      .limit(50);

    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problemId', 'title slug')
      .populate('userId', 'username');

    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    res.json(submission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

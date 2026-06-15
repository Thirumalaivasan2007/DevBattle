import { Request, Response } from 'express';
import { getLanguageId, submitCodeToJudge0, mapJudge0StatusToVerdict } from '../services/judge0Service';

// @desc    Run code against custom input
// @route   POST /api/execution/run
// @access  Private
export const runCode = async (req: Request, res: Response) => {
  try {
    const { sourceCode, language, customInput } = req.body;

    if (!sourceCode || !language) {
      res.status(400).json({ message: 'Source code and language are required' });
      return;
    }

    const languageId = getLanguageId(language);

    // Call Judge0
    const result = await submitCodeToJudge0(sourceCode, languageId, customInput || '');

    // Prepare response
    res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      message: result.message,
      time: result.time,
      memory: result.memory,
      verdict: mapJudge0StatusToVerdict(result.status.id),
      status: result.status.description,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Execution failed' });
  }
};

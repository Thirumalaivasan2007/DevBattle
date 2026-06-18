import { Request, Response } from 'express';
import { submissionQueue } from '../queue/SubmissionQueue';
import ExecutionJob, { JobStatus } from '../models/ExecutionJob';

// @desc    Run code against custom input
// @route   POST /api/execution/run
// @access  Private
export const runCode = async (req: Request, res: Response) => {
  try {
    const { sourceCode, language, customInput } = req.body;
    const userId = (req as any).user?._id;

    if (!sourceCode || !language) {
      res.status(400).json({ message: 'Source code and language are required' });
      return;
    }

    // Submit to our Async Queue for custom execution
    const job = await submissionQueue.add('execution', {
      userId,
      language,
      sourceCode,
      customInput,
      isCustomExecution: true
    });

    // Wait for the job to complete
    let finalJob;
    let attempts = 0;
    while (attempts < 20) { // 10 seconds timeout for custom execution
      finalJob = await ExecutionJob.findById(job._id);
      if (finalJob?.status === JobStatus.COMPLETED || finalJob?.status === JobStatus.FAILED) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (!finalJob || (finalJob.status !== JobStatus.COMPLETED && finalJob.status !== JobStatus.FAILED)) {
      res.status(500).json({ message: 'Execution timed out' });
      return;
    }

    // Prepare response matching frontend expectations
    res.json({
      stdout: finalJob.stdout,
      stderr: finalJob.stderr,
      compileOutput: finalJob.compileOutput,
      message: finalJob.error || '',
      time: finalJob.runtime ? (finalJob.runtime / 1000).toFixed(3) : '0',
      memory: finalJob.memory,
      verdict: finalJob.verdict,
      status: finalJob.status,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Execution failed' });
  }
};

import { IExecutionJob, JobStatus } from '../models/ExecutionJob';
import { executeCode } from '../services/judge/JudgeEngine';

export const processExecutionJob = async (job: IExecutionJob) => {
  try {
    const result = await executeCode(job);
    
    job.status = JobStatus.COMPLETED;
    job.verdict = result.verdict;
    job.runtime = result.runtime;
    job.memory = result.memory;
    job.compileOutput = result.compileOutput;
    job.stdout = result.stdout;
    job.stderr = result.stderr;
    job.completedAt = new Date();
    
    await job.save();
  } catch (error: any) {
    console.error(`Execution failed for job ${job._id}:`, error);
    job.status = JobStatus.FAILED;
    job.verdict = 'Internal Error';
    job.error = error.message;
    job.completedAt = new Date();
    await job.save();
  }
};

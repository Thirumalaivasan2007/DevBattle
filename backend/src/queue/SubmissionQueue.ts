import ExecutionJob, { JobStatus } from '../models/ExecutionJob';
import { processExecutionJob } from './JudgeWorker';

// BullMQ-ready interface for the Queue
class SubmissionQueue {
  private isProcessing: boolean = false;

  async add(name: string, data: any) {
    // 1. Create a Job in the DB
    const job = await ExecutionJob.create({
      submissionId: data.submissionId,
      userId: data.userId,
      problemId: data.problemId,
      language: data.language,
      sourceCode: data.sourceCode,
      status: JobStatus.PENDING,
      customInput: data.customInput,
      isCustomExecution: data.isCustomExecution || false
    });

    // 2. Add to internal queue (fire and forget for now, simulates BullMQ)
    this.triggerProcessing();

    return job;
  }

  private async triggerProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (true) {
        // Find the oldest pending job
        const job = await ExecutionJob.findOneAndUpdate(
          { status: JobStatus.PENDING },
          { status: JobStatus.RUNNING, startedAt: new Date() },
          { sort: { createdAt: 1 }, new: true }
        );

        if (!job) break; // Queue is empty

        try {
          await processExecutionJob(job);
        } catch (error: any) {
          console.error(`Job ${job._id} failed:`, error);
          job.status = JobStatus.FAILED;
          job.verdict = 'Internal Error';
          job.error = error.message;
          job.completedAt = new Date();
          await job.save();
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}

export const submissionQueue = new SubmissionQueue();

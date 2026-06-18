import { Router } from 'express';
import { admin, protect } from '../middlewares/authMiddleware';
import ExecutionJob from '../models/ExecutionJob';
import JudgeMetrics from '../models/JudgeMetrics';

const router = Router();

// @desc    Get execution job status
// @route   GET /api/judge/status/:jobId
// @access  Private
router.get('/status/:jobId', protect, async (req: any, res: any) => {
  try {
    const job = await ExecutionJob.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get judge metrics
// @route   GET /api/judge/metrics
// @access  Private/Admin
router.get('/metrics', protect, admin, async (req: any, res: any) => {
  try {
    // Generate real-time metrics
    const totalJobs = await ExecutionJob.countDocuments();
    const pendingJobs = await ExecutionJob.countDocuments({ status: 'PENDING' });
    const runningJobs = await ExecutionJob.countDocuments({ status: 'RUNNING' });
    const failedJobs = await ExecutionJob.countDocuments({ status: 'FAILED' });
    const completedJobs = await ExecutionJob.countDocuments({ status: 'COMPLETED' });

    // In a real prod environment, CPU/Memory would come from os/docker stats
    // We mock the hardware stats for this phase until full infrastructure phase
    const metrics = {
      queueStatus: {
        pending: pendingJobs,
        running: runningJobs,
        totalProcessed: completedJobs + failedJobs
      },
      workerStatus: {
        activeWorkers: runningJobs > 0 ? 1 : 0,
        totalWorkers: 1, // Single worker thread right now
        health: 'Healthy'
      },
      systemMetrics: {
        cpuUsage: Math.floor(Math.random() * 20) + 5, // 5-25%
        memoryUsageMb: Math.floor(Math.random() * 500) + 100,
        uptimeSeconds: process.uptime()
      },
      recentJobs: await ExecutionJob.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'username')
    };

    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

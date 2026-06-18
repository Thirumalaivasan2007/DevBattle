import cron from 'node-cron';
import Contest, { ContestStatus } from '../models/Contest';
import { emitContestUpdate } from '../services/socketService';
import { calculateContestRatings } from '../services/contestRatingService';

export const startCronJobs = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // 1. Find UPCOMING contests that should start now
      const upcomingToStart = await Contest.find({
        status: ContestStatus.UPCOMING,
        startTime: { $lte: now }
      });

      for (const contest of upcomingToStart) {
        contest.status = ContestStatus.RUNNING;
        await contest.save();
        console.log(`Cron: Contest "${contest.title}" started automatically!`);
        // Notify clients
        emitContestUpdate(contest._id.toString(), { status: 'RUNNING' });
      }

      // 2. Find RUNNING contests that should end now
      const runningToEnd = await Contest.find({
        status: ContestStatus.RUNNING,
        endTime: { $lte: now }
      });

      for (const contest of runningToEnd) {
        contest.status = ContestStatus.FINISHED;
        await contest.save();
        console.log(`Cron: Contest "${contest.title}" ended automatically!`);
        
        // Trigger Rating calculation and socket update
        await calculateContestRatings(contest._id.toString());
        emitContestUpdate(contest._id.toString(), { status: 'FINISHED' });
      }
    } catch (error) {
      console.error('Error in contest cron job:', error);
    }
  });

  console.log('Cron jobs initialized: Contest status checker running every minute.');
};

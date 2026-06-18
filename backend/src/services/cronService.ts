import cron from 'node-cron';
import Challenge, { ChallengeType } from '../models/Challenge';
import Problem from '../models/Problem';

export const startCronJobs = () => {
  // Run every day at 00:00 UTC
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running Daily Challenge Cron Job...');
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Check if we already have a challenge for today
      const existing = await Challenge.findOne({ date: today, type: ChallengeType.DAILY });
      if (existing) {
        console.log('Daily challenge already exists for today.');
        return;
      }

      // Find a random problem
      const count = await Problem.countDocuments();
      if (count === 0) {
        console.log('No problems found in DB to assign as daily challenge.');
        return;
      }

      const random = Math.floor(Math.random() * count);
      const problem = await Problem.findOne().skip(random);

      if (problem) {
        await Challenge.create({
          date: today,
          problemId: problem._id,
          type: ChallengeType.DAILY,
          participants: []
        });
        console.log(`Daily Challenge Created: ${problem.title}`);
      }
    } catch (error) {
      console.error('Error running daily challenge cron:', error);
    }
  }, {
    timezone: "UTC"
  });

  console.log('Cron Jobs Initialized');
};

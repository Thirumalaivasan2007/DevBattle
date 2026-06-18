import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Contest from '../models/Contest';
import { connectDB } from '../config/db';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const startContest = async () => {
  try {
    await connectDB();
    
    const contest = await Contest.findOne({ slug: 'weekly-test-contest' });
    if (contest) {
      contest.status = 'RUNNING' as any;
      await contest.save();
      console.log('Contest status changed to RUNNING!');
    } else {
      console.log('Contest not found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to update contest:', error);
    process.exit(1);
  }
};

startContest();

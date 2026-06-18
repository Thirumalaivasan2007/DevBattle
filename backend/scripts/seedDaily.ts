import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge, { ChallengeType } from '../src/models/Challenge';
import Problem from '../src/models/Problem';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDaily = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected');

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const existing = await Challenge.findOne({ date: today, type: ChallengeType.DAILY });
    if (existing) {
      console.log('Daily challenge already exists for today.');
      process.exit(0);
    }

    const count = await Problem.countDocuments();
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

    process.exit(0);
  } catch (error) {
    console.error('Error seeding daily challenge:', error);
    process.exit(1);
  }
};

seedDaily();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Contest from '../models/Contest';
import ContestRegistration from '../models/ContestRegistration';
import ContestStanding from '../models/ContestStanding';
import User from '../models/User';
import Problem from '../models/Problem';
import { connectDB } from '../config/db';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedContest = async () => {
  try {
    await connectDB();
    
    // Get an admin user
    const admin = await User.findOne({ role: 'admin' }) || await User.findOne();
    if (!admin) {
      console.log('No user found to create the contest.');
      process.exit(1);
    }

    // Get some problems
    const problems = await Problem.find().limit(4);
    if (problems.length === 0) {
      console.log('No problems found. Please seed problems first.');
      process.exit(1);
    }

    // Delete existing dummy contests and related data
    const oldContests = await Contest.find({ slug: 'weekly-test-contest' });
    for (const c of oldContests) {
      await ContestRegistration.deleteMany({ contestId: c._id });
      await ContestStanding.deleteMany({ contestId: c._id });
      await Contest.findByIdAndDelete(c._id);
    }
    
    console.log('Deleted old test contest and related data.');

    // Set times: Start 2 minutes from now, run for 120 minutes
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 2);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 120);

    const contestProblems = problems.map((p, index) => ({
      label: String.fromCharCode(65 + index), // A, B, C, D
      problemId: p._id,
      score: 100 * (index + 1) // 100, 200, 300, 400
    }));

    const contest = await Contest.create({
      title: 'Weekly Test Contest',
      slug: 'weekly-test-contest',
      description: 'This is an upcoming contest generated for testing. It will start in 2 minutes. Please register now before it starts!',
      contestType: 'WEEKLY',
      startTime,
      endTime,
      duration: 120,
      status: 'UPCOMING',
      visibility: 'PUBLIC',
      problems: contestProblems,
      createdBy: admin._id
    });

    console.log('New Test contest seeded successfully!');
    console.log(`Title: ${contest.title}`);
    console.log(`Slug: ${contest.slug}`);
    console.log(`Starts At: ${startTime.toLocaleString()}`);

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed contest:', error);
    process.exit(1);
  }
};

seedContest();

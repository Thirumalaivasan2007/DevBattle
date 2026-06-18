import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LearningPath from '../src/models/LearningPath';
import Problem from '../src/models/Problem';

import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedRoadmaps = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected');

    // Get a few random problems
    const easyProblems = await Problem.find({ difficulty: 'Easy' }).limit(3);
    const mediumProblems = await Problem.find({ difficulty: 'Medium' }).limit(3);
    const hardProblems = await Problem.find({ difficulty: 'Hard' }).limit(3);

    // Create a Beginner Roadmap
    await LearningPath.create({
      title: 'Beginner DSA Path',
      description: 'Master the fundamentals of Data Structures and Algorithms with this carefully curated list for absolute beginners.',
      difficulty: 'Beginner',
      problems: easyProblems.map(p => p._id),
      estimatedDuration: '2 Weeks'
    });

    // Create an Intermediate Roadmap
    await LearningPath.create({
      title: 'FAANG Interview Prep',
      description: 'The most commonly asked medium and hard questions from top tech companies.',
      difficulty: 'Intermediate',
      problems: [...mediumProblems.map(p => p._id), ...hardProblems.map(p => p._id)],
      estimatedDuration: '1 Month'
    });

    console.log('Roadmaps seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roadmaps:', error);
    process.exit(1);
  }
};

seedRoadmaps();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User';
import UserStats from '../models/UserStats';
import { connectDB } from '../config/db';
import { getTierFromRating } from '../controllers/leaderboardController';

dotenv.config();

const dummyUsers = [
  {
    username: 'tourist',
    fullName: 'Gennady Korotkevich',
    email: 'tourist@example.com',
    rating: 3850,
    solvedProblems: 1420,
    streak: 365,
    country: 'Belarus',
    collegeName: 'ITMO University',
  },
  {
    username: 'Benq',
    fullName: 'Benjamin Qi',
    email: 'benq@example.com',
    rating: 3790,
    solvedProblems: 1200,
    streak: 210,
    country: 'USA',
    collegeName: 'MIT',
  },
  {
    username: 'jiangly',
    fullName: 'Jiang Ly',
    email: 'jiangly@example.com',
    rating: 3500,
    solvedProblems: 1100,
    streak: 150,
    country: 'China',
    collegeName: 'Tsinghua University',
  },
  {
    username: 'Errichto',
    fullName: 'Kamil Debowski',
    email: 'errichto@example.com',
    rating: 2900,
    solvedProblems: 850,
    streak: 120,
    country: 'Poland',
    collegeName: 'University of Warsaw',
  },
  {
    username: 'neal',
    fullName: 'Neal Wu',
    email: 'neal@example.com',
    rating: 2800,
    solvedProblems: 900,
    streak: 300,
    country: 'USA',
    collegeName: 'Harvard University',
  },
  {
    username: 'WilliamLin168',
    fullName: 'William Lin',
    email: 'william@example.com',
    rating: 2400,
    solvedProblems: 700,
    streak: 90,
    country: 'USA',
    collegeName: 'MIT',
  },
  {
    username: 'coding_ninja',
    fullName: 'Aniket Singh',
    email: 'aniket@example.com',
    rating: 1800,
    solvedProblems: 350,
    streak: 45,
    country: 'India',
    collegeName: 'IIT Bombay',
  },
  {
    username: 'debug_master',
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    rating: 1550,
    solvedProblems: 200,
    streak: 12,
    country: 'India',
    collegeName: 'NIT Trichy',
  },
  {
    username: 'algo_enthusiast',
    fullName: 'Alex Chen',
    email: 'alex@example.com',
    rating: 1300,
    solvedProblems: 100,
    streak: 5,
    country: 'Canada',
    collegeName: 'University of Toronto',
  },
  {
    username: 'new_coder',
    fullName: 'John Doe',
    email: 'john@example.com',
    rating: 1050,
    solvedProblems: 20,
    streak: 2,
    country: 'UK',
    collegeName: 'Imperial College London',
  }
];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    console.log('Seeding dummy users...');
    for (const u of dummyUsers) {
      let user = await User.findOne({ username: u.username });
      
      if (!user) {
        user = await User.create({
          ...u,
          password: hashedPassword,
          highestRating: u.rating,
          rank: getTierFromRating(u.rating),
        });

        // Create default user stats
        await UserStats.create({
          userId: user._id,
          totalSubmissions: Math.floor(u.solvedProblems * 1.5),
          acceptedSubmissions: u.solvedProblems,
          easySolved: Math.floor(u.solvedProblems * 0.5),
          mediumSolved: Math.floor(u.solvedProblems * 0.3),
          hardSolved: Math.floor(u.solvedProblems * 0.2),
          acceptanceRate: 66.6,
        });

        console.log(`Created user: ${u.username}`);
      } else {
        console.log(`User ${u.username} already exists, skipping.`);
      }
    }

    console.log('User seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

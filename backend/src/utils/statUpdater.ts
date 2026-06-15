import mongoose from 'mongoose';
import UserStats from '../models/UserStats';
import UserActivity from '../models/UserActivity';
import Achievement from '../models/Achievement';
import User from '../models/User';
import { ISubmission } from '../models/Submission';
import { IProblem } from '../models/Problem';

export const updateStatsAndAchievements = async (
  userId: mongoose.Types.ObjectId,
  submission: ISubmission,
  problem: IProblem
) => {
  try {
    const verdict = submission.verdict;
    
    // Find or create stats
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = new UserStats({ userId });
    }

    const isAccepted = verdict === 'Accepted';

    // Update basic counts
    if (isAccepted) {
      stats.acceptedCount += 1;
      
      // Update difficulty counts if it's a newly solved problem
      const isAlreadySolved = stats.solvedProblems.some((id: mongoose.Types.ObjectId) => id.toString() === problem._id.toString());
      if (!isAlreadySolved) {
        stats.solvedProblems.push(problem._id as mongoose.Types.ObjectId);
        if (problem.difficulty === 'Easy') stats.easySolved += 1;
        else if (problem.difficulty === 'Medium') stats.mediumSolved += 1;
        else if (problem.difficulty === 'Hard') stats.hardSolved += 1;

        // Create User Activity for accepted problem
        await UserActivity.create({
          userId,
          activityType: 'ACCEPTED_PROBLEM',
          metadata: {
            problemId: problem._id,
            problemTitle: problem.title
          }
        });

        // Increment User.solvedProblems
        await User.findByIdAndUpdate(userId, { $inc: { solvedProblems: 1 } });
      }
    } else {
      if (verdict === 'Wrong Answer') stats.wrongAnswerCount += 1;
      else if (verdict === 'Runtime Error') stats.runtimeErrors += 1;
      else if (verdict === 'Compilation Error') stats.compilationErrors += 1;
    }

    // Update language usage
    const langCount = stats.languageUsage.get(submission.language) || 0;
    stats.languageUsage.set(submission.language, langCount + 1);

    // Re-calculate acceptance rate
    const totalSubs = stats.acceptedCount + stats.wrongAnswerCount + stats.runtimeErrors + stats.compilationErrors;
    stats.acceptanceRate = totalSubs > 0 ? (stats.acceptedCount / totalSubs) * 100 : 0;

    await stats.save();

    // Check for achievements
    await checkAchievements(userId, stats);

  } catch (error) {
    console.error('Error updating stats asynchronously:', error);
  }
};

const checkAchievements = async (userId: mongoose.Types.ObjectId, stats: any) => {
  const newAchievements = [];

  // Helper
  const unlock = async (type: string, title: string, description: string, badgeIcon: string) => {
    const exists = await Achievement.findOne({ userId, type });
    if (!exists) {
      const ach = await Achievement.create({ userId, type, title, description, badgeIcon });
      await UserActivity.create({
        userId,
        activityType: 'NEW_BADGE',
        metadata: {
          achievementId: ach._id,
          badgeName: title
        }
      });
      // Increment User badgesCount
      await User.findByIdAndUpdate(userId, { $inc: { badgesCount: 1 } });
    }
  };

  const totalSubs = stats.acceptedCount + stats.wrongAnswerCount + stats.runtimeErrors + stats.compilationErrors;

  if (totalSubs === 1) {
    await unlock('FIRST_SUBMISSION', 'First Blood', 'Made your first submission.', '🩸');
  }

  if (stats.acceptedCount === 1) {
    await unlock('FIRST_ACCEPTED', 'First Success', 'Got your first Accepted verdict.', '⭐');
  }

  const solved = stats.solvedProblems.length;
  if (solved >= 10) await unlock('SOLVED_10', 'Beginner', 'Solved 10 problems.', '🥉');
  if (solved >= 50) await unlock('SOLVED_50', 'Intermediate', 'Solved 50 problems.', '🥈');
  if (solved >= 100) await unlock('SOLVED_100', 'Advanced', 'Solved 100 problems.', '🥇');
  if (solved >= 500) await unlock('SOLVED_500', 'Master', 'Solved 500 problems.', '💎');
  if (solved >= 1000) await unlock('SOLVED_1000', 'Grandmaster', 'Solved 1000 problems.', '👑');
};

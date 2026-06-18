import User from '../models/User';
import DigestHistory from '../models/DigestHistory';
import { sendEmail } from './EmailEngine';

export const generateWeeklyDigests = async () => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }); // Or filter active users

    for (const user of users) {
      // In a real app, query UserActivity between (now - 7 days) and now
      // to calculate XP gained, problems solved, etc.
      // For now, mock metrics:
      const metrics = {
        xpGained: Math.floor(Math.random() * 500),
        ratingChange: Math.floor(Math.random() * 50) - 10,
        problemsSolved: Math.floor(Math.random() * 10),
      };

      const html = `
        <h2>DevBattle Weekly Digest</h2>
        <p>Hello ${user.username}, here is your weekly progress!</p>
        <ul>
          <li>XP Gained: ${metrics.xpGained}</li>
          <li>Rating Change: ${metrics.ratingChange > 0 ? '+' : ''}${metrics.ratingChange}</li>
          <li>Problems Solved: ${metrics.problemsSolved}</li>
        </ul>
        <p>Keep grinding! Log in to view upcoming contests.</p>
      `;

      const sent = await sendEmail(
        user._id as string,
        user.email,
        'Your DevBattle Weekly Progress 🚀',
        html,
        'DIGEST'
      );

      if (sent) {
        await DigestHistory.create({
          userId: user._id,
          type: 'WEEKLY',
          metrics,
        });
      }
    }
  } catch (error) {
    console.error('Error generating weekly digests:', error);
  }
};

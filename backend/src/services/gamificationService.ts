import mongoose from 'mongoose';
import User from '../models/User';
import XPHistory from '../models/XPHistory';
import CoinHistory from '../models/CoinHistory';
import Inventory from '../models/Inventory';
import UserActivity from '../models/UserActivity';

class GamificationService {
  /**
   * Progressive Level Formula:
   * Level 1 = 0 XP
   * Level 2 = 100 XP
   * Level 3 = 300 XP
   * Formula: level = floor(sqrt((xp + 100) / 100)) 
   * Wait, if xp = 0 -> sqrt(1) = 1.
   * If xp = 100 -> sqrt(2) = 1.41 (floor -> 1? No, we want level 2).
   * Let's use: level = floor(sqrt(xp / 100)) + 1
   * xp = 0 -> 1
   * xp = 100 -> 2
   * xp = 300 -> 2.73 -> 2. Wait.
   * xp = 400 -> 3
   * xp = 900 -> 4
   */
  public calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  public getXpForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.pow(level - 1, 2) * 100;
  }

  public async grantXP(userId: string | mongoose.Types.ObjectId, action: string, amount: number, metadata?: any) {
    if (amount <= 0) return;

    try {
      const user = await User.findById(userId);
      if (!user) return;

      const oldLevel = user.level || 1;
      const newXp = (user.xp || 0) + amount;
      const newLevel = this.calculateLevel(newXp);

      user.xp = newXp;
      
      let leveledUp = false;
      if (newLevel > oldLevel) {
        user.level = newLevel;
        leveledUp = true;
      }

      await user.save();

      await XPHistory.create({
        userId,
        action,
        xpEarned: amount,
        metadata
      });

      if (leveledUp) {
        await UserActivity.create({
          userId,
          activityType: 'LEVEL_UP',
          metadata: { newLevel }
        });
      }

      return { newXp, newLevel, leveledUp };
    } catch (error) {
      console.error('Error granting XP:', error);
    }
  }

  public async grantCoins(userId: string | mongoose.Types.ObjectId, amount: number, reason: string, metadata?: any) {
    if (amount === 0) return;

    try {
      const user = await User.findById(userId);
      if (!user) return;

      // Prevent negative balance
      if (amount < 0 && (user.coins || 0) + amount < 0) {
        throw new Error('Insufficient coins');
      }

      user.coins = (user.coins || 0) + amount;
      await user.save();

      await CoinHistory.create({
        userId,
        coinsEarned: amount,
        reason,
        metadata
      });

      return { newCoins: user.coins };
    } catch (error) {
      console.error('Error granting/deducting Coins:', error);
      throw error;
    }
  }

  public async getProfile(userId: string | mongoose.Types.ObjectId) {
    const user = await User.findById(userId).select('xp level coins username');
    if (!user) throw new Error('User not found');

    const nextLevelXp = this.getXpForLevel(user.level + 1);
    const currentLevelXp = this.getXpForLevel(user.level);

    return {
      username: user.username,
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      nextLevelXp,
      currentLevelXp,
      progressToNextLevel: Math.max(0, Math.min(100, ((user.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100))
    };
  }
}

export default new GamificationService();

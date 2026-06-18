import mongoose from 'mongoose';
import Mission, { MissionType } from '../models/Mission';
import MissionProgress from '../models/MissionProgress';
import gamificationService from './gamificationService';

class MissionService {
  public async processAction(userId: mongoose.Types.ObjectId, action: string, amount: number = 1) {
    try {
      const activeMissions = await Mission.find({ isActive: true, targetAction: action });
      if (activeMissions.length === 0) return;

      const now = new Date();

      for (const mission of activeMissions) {
        // Find or create progress
        let progress = await MissionProgress.findOne({
          userId,
          missionId: mission._id,
          expiresAt: { $gt: now }
        });

        if (!progress) {
          // Determine expiration based on type
          const expiresAt = new Date();
          if (mission.type === MissionType.DAILY) {
            expiresAt.setUTCHours(23, 59, 59, 999);
          } else if (mission.type === MissionType.WEEKLY) {
            const day = expiresAt.getUTCDay();
            const diff = expiresAt.getUTCDate() - day + (day === 0 ? 0 : 7); // next Sunday
            expiresAt.setUTCDate(diff);
            expiresAt.setUTCHours(23, 59, 59, 999);
          } else if (mission.type === MissionType.MONTHLY) {
            expiresAt.setUTCMonth(expiresAt.getUTCMonth() + 1, 0); // Last day of month
            expiresAt.setUTCHours(23, 59, 59, 999);
          }

          progress = new MissionProgress({
            userId,
            missionId: mission._id,
            currentProgress: 0,
            isCompleted: false,
            expiresAt
          });
        }

        if (!progress.isCompleted) {
          progress.currentProgress += amount;
          
          if (progress.currentProgress >= mission.requiredCount) {
            progress.currentProgress = mission.requiredCount;
            progress.isCompleted = true;
            
            // Grant rewards
            if (mission.xpReward > 0) {
              await gamificationService.grantXP(userId, `MISSION_COMPLETED:${mission.title}`, mission.xpReward, { missionId: mission._id });
            }
            if (mission.coinReward > 0) {
              await gamificationService.grantCoins(userId, mission.coinReward, `Completed Mission: ${mission.title}`, { missionId: mission._id });
            }
          }
          await progress.save();
        }
      }
    } catch (error) {
      console.error('Error processing mission action:', error);
    }
  }

  public async getMissionsForUser(userId: mongoose.Types.ObjectId) {
    const now = new Date();
    
    const allActiveMissions = await Mission.find({ isActive: true });
    
    // Fetch user progress for these active missions
    const progressList = await MissionProgress.find({
      userId,
      expiresAt: { $gt: now }
    });

    const progressMap = new Map();
    progressList.forEach(p => progressMap.set(p.missionId.toString(), p));

    return allActiveMissions.map(m => {
      const prog = progressMap.get(m._id.toString());
      
      // Determine time remaining based on type if no progress exists yet
      let expiresAt = prog ? prog.expiresAt : new Date();
      if (!prog) {
        if (m.type === MissionType.DAILY) {
          expiresAt.setUTCHours(23, 59, 59, 999);
        } else if (m.type === MissionType.WEEKLY) {
          const day = expiresAt.getUTCDay();
          const diff = expiresAt.getUTCDate() - day + (day === 0 ? 0 : 7);
          expiresAt.setUTCDate(diff);
          expiresAt.setUTCHours(23, 59, 59, 999);
        } else if (m.type === MissionType.MONTHLY) {
          expiresAt.setUTCMonth(expiresAt.getUTCMonth() + 1, 0);
          expiresAt.setUTCHours(23, 59, 59, 999);
        }
      }

      return {
        ...m.toObject(),
        progress: prog ? prog.currentProgress : 0,
        isCompleted: prog ? prog.isCompleted : false,
        expiresAt
      };
    });
  }
}

export default new MissionService();

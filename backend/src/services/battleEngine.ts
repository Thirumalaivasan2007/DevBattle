import Battle, { BattleStatus } from '../models/Battle';
import User from '../models/User';
import { emitBattleUpdate } from './socketService';

// Standard Elo calculation
export const calculateElo = (rating1: number, rating2: number, score1: number /* 1 for win, 0.5 for draw, 0 for loss */) => {
  const K = 32;
  const expected1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  return Math.round(rating1 + K * (score1 - expected1));
};

export const endBattle = async (battleId: string, winnerUserId?: string) => {
  try {
    const battle = await Battle.findById(battleId).populate('participants.userId');
    if (!battle || battle.status === BattleStatus.FINISHED) return;

    battle.status = BattleStatus.FINISHED;
    battle.endTime = new Date();

    if (battle.battleType === 'RANKED') {
      const p1 = battle.participants[0];
      const p2 = battle.participants[1];

      const user1 = await User.findById(p1.userId);
      const user2 = await User.findById(p2.userId);

      if (user1 && user2) {
        let score1 = 0.5; // Draw
        if (winnerUserId === p1.userId.toString()) score1 = 1;
        else if (winnerUserId === p2.userId.toString()) score1 = 0;

        const newRating1 = calculateElo(user1.rating || 1000, user2.rating || 1000, score1);
        const newRating2 = calculateElo(user2.rating || 1000, user1.rating || 1000, 1 - score1);

        p1.ratingChange = newRating1 - (user1.rating || 1000);
        p2.ratingChange = newRating2 - (user2.rating || 1000);
        p1.isWinner = score1 === 1;
        p2.isWinner = score1 === 0;

        user1.rating = newRating1;
        user2.rating = newRating2;

        await user1.save();
        await user2.save();
      }
    } else {
      // Unranked/Friend
      if (winnerUserId) {
        battle.participants.forEach(p => {
          if (p.userId.toString() === winnerUserId) p.isWinner = true;
        });
      }
    }

    await battle.save();
    emitBattleUpdate(battleId, 'battle:end', { battle, winnerId: winnerUserId });
  } catch (error) {
    console.error('End Battle Error:', error);
  }
};

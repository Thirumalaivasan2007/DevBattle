import MatchmakingQueue from '../models/MatchmakingQueue';
import Battle, { BattleStatus, BattleType } from '../models/Battle';
import Problem from '../models/Problem';
import { emitBattleFound } from './socketService';

const MATCHMAKING_INTERVAL = 5000; // 5 seconds
const RATING_WINDOW = 200; // Initial rating difference allowed

export const startMatchmakingEngine = () => {
  setInterval(async () => {
    try {
      const queue = await MatchmakingQueue.find().sort({ joinedAt: 1 });
      if (queue.length < 2) return;

      const matchedIds = new Set<string>();

      for (let i = 0; i < queue.length; i++) {
        const p1 = queue[i];
        if (matchedIds.has(p1._id.toString())) continue;

        // Calculate expanded rating window based on time waited
        const waitedSeconds = (Date.now() - p1.joinedAt.getTime()) / 1000;
        const currentWindow = RATING_WINDOW + (waitedSeconds * 5); // expands 5 points per second

        for (let j = i + 1; j < queue.length; j++) {
          const p2 = queue[j];
          if (matchedIds.has(p2._id.toString())) continue;
          if (p1.battleType !== p2.battleType) continue;

          if (Math.abs(p1.rating - p2.rating) <= currentWindow) {
            // MATCH FOUND!
            matchedIds.add(p1._id.toString());
            matchedIds.add(p2._id.toString());

            await createBattleFromMatch(p1, p2);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Matchmaking Engine Error:', error);
    }
  }, MATCHMAKING_INTERVAL);
  
  console.log('Matchmaking Engine started.');
};

const createBattleFromMatch = async (p1: any, p2: any) => {
  try {
    // 1. Find a random problem 
    // TODO: Ideally find a problem neither has solved. For now, pick a random Medium or Easy problem.
    const problems = await Problem.find({ difficulty: { $in: ['Easy', 'Medium'] } });
    if (problems.length === 0) throw new Error('No problems available');
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];

    // 2. Create Battle
    const battle = new Battle({
      status: BattleStatus.WAITING_FOR_PLAYERS,
      battleType: p1.battleType,
      problemId: randomProblem._id,
      duration: 15, // 15 mins
      participants: [
        { userId: p1.userId, isReady: false },
        { userId: p2.userId, isReady: false }
      ]
    });

    await battle.save();

    // 3. Remove from Queue
    await MatchmakingQueue.deleteMany({ _id: { $in: [p1._id, p2._id] } });

    // 4. Emit to both users
    const battleData = { battleId: battle._id, opponentId: p2.userId };
    emitBattleFound(p1.userId.toString(), { battleId: battle._id, opponentId: p2.userId });
    emitBattleFound(p2.userId.toString(), { battleId: battle._id, opponentId: p1.userId });

    // 5. Set a timeout: if they don't accept in 15 seconds, cancel the battle
    setTimeout(async () => {
      const checkBattle = await Battle.findById(battle._id);
      if (checkBattle && checkBattle.status === BattleStatus.WAITING_FOR_PLAYERS) {
        checkBattle.status = BattleStatus.CANCELLED;
        await checkBattle.save();
        // Notify them it was cancelled
        // You would emit a battle:cancelled event here.
      }
    }, 15000);

  } catch (err) {
    console.error('Error creating battle from match:', err);
  }
};

import { Request, Response } from 'express';
import MatchmakingQueue from '../models/MatchmakingQueue';
import Battle, { BattleStatus, BattleType } from '../models/Battle';
import User from '../models/User';
import { emitBattleUpdate } from '../services/socketService';
import { endBattle } from '../services/battleEngine';

// @desc    Join matchmaking queue
// @route   POST /api/battles/join-queue
// @access  Private
export const joinQueue = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { battleType } = req.body;

    if (!Object.values(BattleType).includes(battleType)) {
      return res.status(400).json({ message: 'Invalid battle type' });
    }

    // Check if user is already in a running battle
    const activeBattle = await Battle.findOne({
      status: { $in: [BattleStatus.WAITING_FOR_PLAYERS, BattleStatus.RUNNING] },
      'participants.userId': userId
    });

    if (activeBattle) {
      return res.status(400).json({ message: 'You are already in an active battle', battleId: activeBattle._id });
    }

    // Check if user is already in queue
    let queueEntry = await MatchmakingQueue.findOne({ userId });
    
    if (queueEntry) {
      // Update existing queue entry
      queueEntry.battleType = battleType;
      queueEntry.joinedAt = new Date();
      await queueEntry.save();
    } else {
      // Create new queue entry
      const user = await User.findById(userId);
      queueEntry = await MatchmakingQueue.create({
        userId,
        rating: user?.rating || 1000,
        battleType,
      });
    }

    res.status(200).json({ message: 'Joined queue', queueId: queueEntry._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave matchmaking queue
// @route   POST /api/battles/leave-queue
// @access  Private
export const leaveQueue = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    await MatchmakingQueue.deleteOne({ userId });
    res.status(200).json({ message: 'Left queue' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get battle by ID
// @route   GET /api/battles/:id
// @access  Private
export const getBattleById = async (req: Request, res: Response) => {
  try {
    const battleId = req.params.id;
    const battle = await Battle.findById(battleId)
      .populate('problemId', 'title slug difficulty score examples inputFormat outputFormat constraints hints testCases')
      .populate('participants.userId', 'username avatar rating');

    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    res.status(200).json(battle);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark player as ready
// @route   POST /api/battles/:id/ready
// @access  Private
export const setPlayerReady = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const battleId = req.params.id;

    const battle = await Battle.findById(battleId);
    if (!battle || battle.status !== BattleStatus.WAITING_FOR_PLAYERS) {
      return res.status(400).json({ message: 'Battle not found or already started' });
    }

    let allReady = true;
    let userFound = false;

    for (let p of battle.participants) {
      if (p.userId.toString() === userId.toString()) {
        p.isReady = true;
        userFound = true;
      }
      if (!p.isReady) {
        allReady = false;
      }
    }

    if (!userFound) {
      return res.status(403).json({ message: 'You are not part of this battle' });
    }

    if (allReady) {
      battle.status = BattleStatus.RUNNING;
      battle.startTime = new Date();
      // Calculate end time
      battle.endTime = new Date(battle.startTime.getTime() + battle.duration * 60000);
      
      // Auto-end battle when duration is up
      setTimeout(async () => {
        const checkBattle = await Battle.findById(battleId);
        if (checkBattle && checkBattle.status === BattleStatus.RUNNING) {
           await endBattle(battleId.toString()); // Time is up, declare draw or calculate winner by passed cases
        }
      }, battle.duration * 60000);
    }

    await battle.save();

    if (allReady) {
      emitBattleUpdate(battleId, 'battle:start', battle);
    } else {
      emitBattleUpdate(battleId, 'battle:ready', { userId, isReady: true });
    }

    res.status(200).json(battle);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resign from battle
// @route   POST /api/battles/:id/resign
// @access  Private
export const resignBattle = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const battleId = req.params.id;

    const battle = await Battle.findById(battleId);
    if (!battle || battle.status !== BattleStatus.RUNNING) {
      return res.status(400).json({ message: 'Battle not running' });
    }

    const opponent = battle.participants.find(p => p.userId.toString() !== userId.toString());
    if (opponent) {
      await endBattle(battleId, opponent.userId.toString());
    } else {
      await endBattle(battleId);
    }

    res.status(200).json({ message: 'Resigned' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's battle history
// @route   GET /api/battles/history
// @access  Private
export const getBattleHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const history = await Battle.find({ 'participants.userId': userId, status: BattleStatus.FINISHED })
      .populate('participants.userId', 'username avatar rating')
      .populate('problemId', 'title difficulty')
      .sort({ endTime: -1 });

    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

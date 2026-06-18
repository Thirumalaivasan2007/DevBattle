import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StoreItem, { StoreItemType, StoreItemRarity } from '../models/StoreItem';
import Mission, { MissionType } from '../models/Mission';
import Season from '../models/Season';
import SeasonPass from '../models/SeasonPass';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/devbattle';

const seedGamification = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    // 1. Seed Store Items
    await StoreItem.deleteMany({});
    
    const storeItems = await StoreItem.insertMany([
      { name: 'Novice Title', type: StoreItemType.TITLE, price: 100, description: 'Show everyone you are just starting.', rarity: StoreItemRarity.COMMON },
      { name: 'Code Ninja', type: StoreItemType.TITLE, price: 500, description: 'Silent but deadly with algorithms.', rarity: StoreItemRarity.RARE },
      { name: 'Algorithm God', type: StoreItemType.TITLE, price: 2000, description: 'The ultimate title for a DevBattle champion.', rarity: StoreItemRarity.LEGENDARY },
      { name: 'Neon Frame', type: StoreItemType.FRAME, price: 300, description: 'A glowing neon frame for your avatar.', rarity: StoreItemRarity.RARE },
      { name: 'Golden Border', type: StoreItemType.FRAME, price: 1000, description: 'A premium golden border.', rarity: StoreItemRarity.EPIC },
      { name: 'Dark Mode V2', type: StoreItemType.THEME, price: 800, description: 'An exclusive dark theme for your profile.', rarity: StoreItemRarity.EPIC },
    ]);
    console.log(`Seeded ${storeItems.length} store items.`);

    // 2. Seed Missions
    await Mission.deleteMany({});

    const missions = await Mission.insertMany([
      { title: 'Daily Warmup', description: 'Solve 1 Easy problem', type: MissionType.DAILY, targetAction: 'SOLVE_EASY', requiredCount: 1, xpReward: 50, coinReward: 10 },
      { title: 'The Challenger', description: 'Solve 3 problems', type: MissionType.DAILY, targetAction: 'SOLVE_PROBLEM', requiredCount: 3, xpReward: 150, coinReward: 25 },
      { title: 'Weekly Grinder', description: 'Solve 10 problems', type: MissionType.WEEKLY, targetAction: 'SOLVE_PROBLEM', requiredCount: 10, xpReward: 500, coinReward: 100 },
      { title: 'Hardcore Coder', description: 'Solve 5 Hard problems', type: MissionType.WEEKLY, targetAction: 'SOLVE_HARD', requiredCount: 5, xpReward: 1000, coinReward: 250 },
      { title: 'Monthly Master', description: 'Solve 50 problems', type: MissionType.MONTHLY, targetAction: 'SOLVE_PROBLEM', requiredCount: 50, xpReward: 5000, coinReward: 1000 },
    ]);
    console.log(`Seeded ${missions.length} missions.`);

    // 3. Seed Season & Pass
    await Season.deleteMany({});
    await SeasonPass.deleteMany({});

    const season = await Season.create({
      name: 'Season 1: Genesis',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
      theme: 'Cyberpunk'
    });

    const levelRequirements = [];
    let currentXp = 0;
    for (let i = 1; i <= 20; i++) {
      levelRequirements.push(currentXp);
      currentXp += 100 * i; // increasing difficulty
    }

    const freeRewards = [];
    const premiumRewards = [];

    for (let i = 1; i <= 20; i++) {
      freeRewards.push({ level: i, coinReward: i * 10 });
      premiumRewards.push({ level: i, xpReward: i * 50 });
    }

    await SeasonPass.create({
      seasonId: season._id,
      levelRequirements,
      freeRewards,
      premiumRewards
    });

    console.log('Seeded Season and SeasonPass.');
    
    console.log('Gamification seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding gamification:', error);
    process.exit(1);
  }
};

seedGamification();

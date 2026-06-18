import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import gamificationService from '../services/gamificationService';
import missionService from '../services/missionService';
import StoreItem from '../models/StoreItem';
import Inventory from '../models/Inventory';
import User from '../models/User';

const router = Router();

// GET /api/gamification/profile
router.get('/profile', protect, async (req: any, res: any) => {
  try {
    const profile = await gamificationService.getProfile(req.user.id);
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/gamification/store
router.get('/store', protect, async (req: any, res: any) => {
  try {
    const items = await StoreItem.find({ isActive: true });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/gamification/store/purchase/:itemId
router.post('/store/purchase/:itemId', protect, async (req: any, res: any) => {
  try {
    const item = await StoreItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const user = await User.findById(req.user.id);
    if ((user?.coins || 0) < item.price) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    let inventory = await Inventory.findOne({ userId: req.user.id });
    if (!inventory) {
      inventory = new Inventory({ userId: req.user.id, items: [] });
    }

    if (inventory.items.some((i: any) => i.storeItemId.toString() === item._id.toString())) {
      return res.status(400).json({ message: 'You already own this item' });
    }

    // Deduct coins
    await gamificationService.grantCoins(req.user.id, -item.price, `Purchased store item: ${item.name}`, { storeItemId: item._id });

    // Add to inventory
    inventory.items.push({ storeItemId: item._id, acquiredAt: new Date() });
    await inventory.save();

    res.json({ message: 'Purchase successful', inventory });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/gamification/inventory
router.get('/inventory', protect, async (req: any, res: any) => {
  try {
    const inventory = await Inventory.findOne({ userId: req.user.id }).populate('items.storeItemId').populate('equippedTitle equippedFrame equippedTheme');
    res.json(inventory || { items: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/gamification/inventory/equip/:itemId
router.post('/inventory/equip/:itemId', protect, async (req: any, res: any) => {
  try {
    const inventory = await Inventory.findOne({ userId: req.user.id });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });

    const item = await StoreItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!inventory.items.some((i: any) => i.storeItemId.toString() === item._id.toString())) {
      return res.status(400).json({ message: 'You do not own this item' });
    }

    if (item.type === 'TITLE') inventory.equippedTitle = item._id;
    else if (item.type === 'FRAME') inventory.equippedFrame = item._id;
    else if (item.type === 'THEME') inventory.equippedTheme = item._id;

    await inventory.save();
    res.json({ message: 'Item equipped', inventory });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/gamification/missions
router.get('/missions', protect, async (req: any, res: any) => {
  try {
    const missions = await missionService.getMissionsForUser(req.user.id);
    res.json(missions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

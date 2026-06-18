import { Router, Request, Response } from 'express';
import Announcement from '../models/Announcement';

const router = Router();

// @route   GET /api/announcements
// @desc    Get active announcements
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const announcements = await Announcement.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching announcements' });
  }
});

export default router;

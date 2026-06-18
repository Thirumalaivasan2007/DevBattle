import { Router, Request, Response } from 'express';
import { protect } from '../middlewares/authMiddleware';
import Notification from '../models/Notification';
import NotificationPreference from '../models/NotificationPreference';

const router = Router();

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', protect, async (req: any, res: any): Promise<void> => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Pagination could be added later
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// @route   POST /api/notifications/read/:id
// @desc    Mark notification as read
// @access  Private
router.post('/read/:id', protect, async (req: any, res: any): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.post('/read-all', protect, async (req: any, res: any): Promise<void> => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', protect, async (req: any, res: any): Promise<void> => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- PREFERENCES ---

// @route   GET /api/notifications/preferences
// @desc    Get user's notification preferences
// @access  Private
router.get('/preferences', protect, async (req: any, res: any): Promise<void> => {
  try {
    let prefs = await NotificationPreference.findOne({ userId: req.user._id });
    if (!prefs) {
      prefs = await NotificationPreference.create({ userId: req.user._id });
    }
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching preferences' });
  }
});

// @route   PUT /api/notifications/preferences
// @desc    Update user's notification preferences
// @access  Private
router.put('/preferences', protect, async (req: any, res: any): Promise<void> => {
  try {
    const prefs = await NotificationPreference.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating preferences' });
  }
});

export default router;

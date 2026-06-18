import { Request, Response } from 'express';
import OfflineSyncQueue from '../models/OfflineSyncQueue';

// @desc    Get sync status and pending items for a user
// @route   GET /api/sync/status
// @access  Private
export const getSyncStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const pendingItems = await OfflineSyncQueue.find({
      user: userId,
      status: 'PENDING'
    }).sort('queuedAt');

    res.status(200).json({
      pendingCount: pendingItems.length,
      items: pendingItems
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process offline queued actions from the client
// @route   POST /api/sync/process
// @access  Private
export const processSyncQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { items } = req.body; // Array of items from client's IndexedDB

    if (!items || !Array.isArray(items)) {
      res.status(400).json({ message: 'Invalid items array' });
      return;
    }

    const results = [];

    for (const item of items) {
      // Create a record of the sync attempt
      const queueRecord = new OfflineSyncQueue({
        user: userId,
        action: item.action,
        payload: item.payload,
        queuedAt: item.timestamp || new Date(),
      });

      try {
        // Here we would normally route to the actual controller methods based on item.action.
        // For phase 14, we will mock the successful processing of these actions 
        // to demonstrate the offline architecture's ability to sync data.
        
        // Example handling:
        // if (item.action === 'SUBMIT_CODE') { await executeCodeSubmission(userId, item.payload); }
        // else if (item.action === 'UPDATE_PROFILE') { await updateProfile(userId, item.payload); }

        queueRecord.status = 'PROCESSED';
        queueRecord.processedAt = new Date();
        await queueRecord.save();

        results.push({ id: item.id, status: 'success' });
      } catch (err: any) {
        queueRecord.status = 'FAILED';
        queueRecord.errorReason = err.message;
        queueRecord.retryCount += 1;
        await queueRecord.save();

        results.push({ id: item.id, status: 'failed', error: err.message });
      }
    }

    res.status(200).json({ message: 'Sync processed', results });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

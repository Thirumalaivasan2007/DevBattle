import mongoose from 'mongoose';
import Notification from '../models/Notification';
import NotificationPreference from '../models/NotificationPreference';
import { emitNotification } from './socketService';

export const sendNotification = async (
  userId: string | mongoose.Types.ObjectId,
  title: string,
  message: string,
  type: 'CONTEST' | 'BATTLE' | 'COMMUNITY' | 'ACHIEVEMENT' | 'RATING' | 'SYSTEM' | 'MENTION' | 'REWARD',
  link?: string,
  metadata?: any
) => {
  try {
    // 1. Check User Preferences
    let prefs = await NotificationPreference.findOne({ userId });
    
    // If no preferences exist, default to true
    if (!prefs) {
      prefs = await NotificationPreference.create({ userId });
    }

    // Determine if we should send based on type
    let shouldSend = true;
    switch (type) {
      case 'CONTEST':
        shouldSend = prefs.contestAlerts;
        break;
      case 'BATTLE':
        shouldSend = prefs.battleAlerts;
        break;
      case 'COMMUNITY':
      case 'MENTION':
        shouldSend = prefs.communityAlerts;
        break;
      // Achievements, Rating, System, Reward cannot be opted out of easily here, or we can add fine-grained later.
    }

    if (!shouldSend) {
      return null;
    }

    // 2. Create in DB
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      link,
      metadata
    });

    // 3. Emit via Socket
    emitNotification(userId.toString(), notification);

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

import Announcement from '../models/Announcement';
import { emitGlobalAnnouncement } from './socketService';

export const createAnnouncement = async (title: string, message: string, type: 'UPDATE' | 'MAINTENANCE' | 'EVENT' | 'FEATURE', link?: string) => {
  try {
    const announcement = await Announcement.create({
      title,
      message,
      type,
      link,
    });

    // Broadcast instantly to all connected users
    emitGlobalAnnouncement(announcement);

    return announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    return null;
  }
};

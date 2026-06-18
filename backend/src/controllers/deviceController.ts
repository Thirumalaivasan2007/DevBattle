import { Request, Response } from 'express';
import DeviceRegistration from '../models/DeviceRegistration';
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

// Configure web-push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@devbattle.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// @desc    Register a new device for push notifications
// @route   POST /api/devices/register
// @access  Private
export const registerDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { subscription, deviceType, userAgent } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      res.status(400).json({ message: 'Invalid subscription object' });
      return;
    }

    // Check if device already exists
    let device = await DeviceRegistration.findOne({ endpoint: subscription.endpoint });

    if (device) {
      // Update existing device
      device.user = userId;
      device.keys = subscription.keys;
      device.deviceType = deviceType || device.deviceType;
      device.userAgent = userAgent || device.userAgent;
      device.lastActive = new Date();
      await device.save();
    } else {
      // Create new device
      device = new DeviceRegistration({
        user: userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        deviceType: deviceType || 'unknown',
        userAgent: userAgent || ''
      });
      await device.save();
    }

    // Send a welcome notification
    try {
      const payload = JSON.stringify({
        title: 'Push Notifications Enabled!',
        body: 'You will now receive updates from DevBattle.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: { url: '/' }
      });
      await webpush.sendNotification(subscription, payload);
    } catch (pushErr) {
      console.error('Failed to send welcome push notification:', pushErr);
      // We still return 201 as the device is registered
    }

    res.status(201).json({ message: 'Device registered successfully', device });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unregister a device
// @route   POST /api/devices/unregister
// @access  Private
export const unregisterDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const { endpoint } = req.body;

    if (!endpoint) {
      res.status(400).json({ message: 'Endpoint is required' });
      return;
    }

    await DeviceRegistration.findOneAndDelete({ user: userId, endpoint });

    res.status(200).json({ message: 'Device unregistered successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send push notification (internal utility, not a route)
export const sendPushNotification = async (userId: string, payload: any) => {
  try {
    const devices = await DeviceRegistration.find({ user: userId, 'preferences.pushEnabled': true });
    
    for (const device of devices) {
      try {
        const subscription = {
          endpoint: device.endpoint,
          keys: device.keys
        };
        await webpush.sendNotification(subscription, JSON.stringify(payload));
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          // Subscription has expired or is no longer valid
          await DeviceRegistration.findByIdAndDelete(device._id);
        } else {
          console.error('Push notification failed:', err);
        }
      }
    }
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
  }
};

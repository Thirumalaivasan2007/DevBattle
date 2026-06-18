"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, BellRing, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { subscribeToPush } from '@/lib/pwa';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      if (permission === 'denied') {
        toast.error("Notifications are blocked by your browser.", {
          description: "Please enable them in your browser settings."
        });
        setIsLoading(false);
        return;
      }

      // Request permission if not already granted
      if (permission === 'default') {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result !== 'granted') {
          throw new Error('Permission not granted for Notification');
        }
      }

      // Subscribe to PushManager
      const subscription = await subscribeToPush();
      
      // Send subscription to backend
      await api.post('/devices/register', {
        subscription,
        deviceType: /Mobile|Android|iP(ad|od|hone)/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent
      });

      setIsSubscribed(true);
      toast.success("Push notifications enabled!");
    } catch (error: any) {
      console.error('Failed to subscribe:', error);
      toast.error("Failed to enable notifications.", {
        description: error.message || "An unexpected error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Send unregister to backend
        await api.post('/devices/unregister', { endpoint: subscription.endpoint });
        
        // Unsubscribe from PushManager
        await subscription.unsubscribe();
        setIsSubscribed(false);
        toast.success("Push notifications disabled.");
      }
    } catch (error: any) {
      console.error('Failed to unsubscribe:', error);
      toast.error("Failed to disable notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
            <BellOff className="w-5 h-5" />
            Push Notifications Unsupported
          </CardTitle>
          <CardDescription>
            Your browser does not support push notifications. Try using Chrome, Firefox, or Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {isSubscribed ? <BellRing className="w-5 h-5 text-primary animate-pulse" /> : <Bell className="w-5 h-5" />}
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive alerts for contests, challenges, and team updates.
            </CardDescription>
          </div>
          <Switch 
            checked={isSubscribed} 
            onCheckedChange={isSubscribed ? handleUnsubscribe : handleSubscribe} 
            disabled={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent>
        {permission === 'denied' && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
            You have blocked notifications in your browser. Please allow them in your site settings to receive updates.
          </div>
        )}
        {isSubscribed && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            This device is registered for notifications.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

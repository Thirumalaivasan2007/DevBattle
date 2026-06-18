'use client';

import React, { useEffect, useState } from 'react';
import { useSocketStore } from '@/store/socketStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Swords } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function GlobalBattleListener() {
  const { socket, connect } = useSocketStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [matchData, setMatchData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }
  }, [isAuthenticated, connect]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('join_user', user._id);

    socket.on('battle:found', (data) => {
      setMatchData(data);
      setIsOpen(true);
      setTimeLeft(15);
      setHasAccepted(false);
      
      // Play a sound if possible
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio blocked by browser policy'));
      } catch (e) {}
    });

    // --- NOTIFICATION & ANNOUNCEMENT LISTENERS ---
    const { fetchNotifications, addNotification } = useNotificationStore.getState();
    
    // Initial fetch when socket connects (meaning user is authed and ready)
    fetchNotifications();

    socket.on('notification:new', (notification) => {
      addNotification(notification);
      toast.info(notification.title, {
        description: notification.message,
      });
    });

    socket.on('announcement:new', (announcement) => {
      toast('📣 Platform Announcement', {
        description: announcement.title,
        duration: 8000,
      });
    });

    return () => {
      socket.off('battle:found');
      socket.off('notification:new');
      socket.off('announcement:new');
    };
  }, [socket, user]);

  useEffect(() => {
    let timer: any;
    if (isOpen && !hasAccepted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !hasAccepted) {
      setIsOpen(false);
      setMatchData(null);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, hasAccepted]);

  const handleAccept = async () => {
    if (!matchData) return;
    setHasAccepted(true);
    try {
      await apiClient.post(`/battles/${matchData.battleId}/ready`);
      router.push(`/battles/${matchData.battleId}`);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to accept match', err);
    }
  };

  const handleDecline = async () => {
    if (!matchData) return;
    setIsOpen(false);
    setMatchData(null);
    try {
      await apiClient.post(`/battles/${matchData.battleId}/resign`);
    } catch (err) {
      console.error('Failed to decline match', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDecline()}>
      <DialogContent className="sm:max-w-md border-red-500/30 bg-gradient-to-br from-background to-red-950/20 shadow-2xl shadow-red-900/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center text-red-500">
            <Swords className="w-6 h-6 mr-2 animate-pulse" /> Match Found!
          </DialogTitle>
          <DialogDescription className="text-lg">
            An opponent is ready. Do you accept the challenge?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-5xl font-mono font-bold text-red-500 mb-4 animate-pulse">
            {timeLeft}s
          </div>
          {!hasAccepted ? (
            <p className="text-muted-foreground text-center">
              Failing to accept will cancel the battle.
            </p>
          ) : (
            <p className="text-green-500 text-center font-bold">
              Accepted! Waiting for opponent...
            </p>
          )}
        </div>

        <DialogFooter className="flex space-x-2 sm:space-x-4">
          <Button 
            variant="outline" 
            onClick={handleDecline} 
            disabled={hasAccepted}
            className="flex-1"
          >
            Decline
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleAccept} 
            disabled={hasAccepted}
            className="flex-1"
          >
            {hasAccepted ? 'Accepted' : 'Accept Battle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

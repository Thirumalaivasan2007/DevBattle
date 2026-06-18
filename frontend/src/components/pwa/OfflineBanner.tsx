"use client";

import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { processOfflineQueue } from '@/lib/pwa';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial check
    setIsOffline(!navigator.onLine);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = async () => {
      setIsOffline(false);
      setIsSyncing(true);
      await processOfflineQueue();
      setIsSyncing(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !isSyncing) return null;

  return (
    <div className={`fixed top-0 left-0 w-full z-50 text-white text-sm py-2 px-4 flex items-center justify-center gap-2 shadow-md transition-colors duration-300 ${isOffline ? 'bg-destructive/90' : 'bg-primary/90'}`}>
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span>You are currently offline. Some features may be unavailable.</span>
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Back online! Syncing your offline changes...</span>
        </>
      )}
    </div>
  );
}

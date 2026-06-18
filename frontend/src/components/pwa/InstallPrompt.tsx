"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the user already dismissed it today
    const lastDismissed = localStorage.getItem('installPromptDismissed');
    if (lastDismissed) {
      const hoursSinceDismiss = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) return; // Don't show again for 24 hours
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if already installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
      <Card className="border-primary/20 bg-card shadow-xl backdrop-blur-sm bg-card/95">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-lg shrink-0">
            <img src="/icons/icon-192x192.png" alt="DevBattle" className="w-10 h-10 rounded shadow-sm" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-1 text-foreground">Install DevBattle App</h4>
            <p className="text-xs text-muted-foreground mb-3">Install our native app for offline support, push notifications, and a better experience.</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleInstallClick} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Install
              </Button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

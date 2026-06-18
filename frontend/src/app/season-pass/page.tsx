'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import apiClient from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, Zap, Lock, Unlock, Crown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SeasonPassPage() {
  const { user, isAuthenticated } = useAuthStore();

  // For this placeholder page, we will just simulate a Season Pass UI
  // because we haven't implemented the complex backend logic for Season Pass fully yet.
  
  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  
  const levels = Array.from({ length: 20 }, (_, i) => i + 1);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Log in to view Season Pass</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 rounded-2xl border border-primary/20">
          <div>
            <Badge variant="outline" className="mb-2 bg-primary/20 text-primary border-primary/50">Season 1: Genesis</Badge>
            <h1 className="text-4xl font-bold mb-2">Battle Pass</h1>
            <p className="text-muted-foreground max-w-xl">Earn XP by solving problems and completing missions to unlock exclusive rewards, coins, and cosmetics.</p>
          </div>
          <div className="flex flex-col items-center gap-2 bg-background/50 p-6 rounded-xl border border-border/50 min-w-[250px]">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Level</div>
            <div className="text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              {currentLevel}
            </div>
            <div className="w-full mt-2">
              <Progress value={Math.min(100, (currentXp % 100) / 100 * 100)} className="h-2" />
              <div className="text-xs text-center mt-1 text-muted-foreground">{currentXp} XP</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[100px_1fr_1fr] gap-4 mb-2 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <div className="text-center">Level</div>
            <div>Free Rewards</div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" /> Premium Rewards
            </div>
          </div>

          {levels.map((level) => {
            const isUnlocked = level <= currentLevel;
            const isCurrent = level === currentLevel;
            
            return (
              <div 
                key={level} 
                className={`grid grid-cols-[100px_1fr_1fr] gap-4 items-stretch p-2 rounded-xl transition-all ${isCurrent ? 'bg-primary/10 border border-primary/50 ring-1 ring-primary/50' : 'bg-card/50 border border-border/50 hover:bg-card/80'}`}
              >
                <div className="flex flex-col items-center justify-center font-bold text-xl relative">
                  {isUnlocked && !isCurrent && <div className="absolute inset-0 bg-success/10 rounded-lg pointer-events-none" />}
                  <span className={isUnlocked ? 'text-foreground' : 'text-muted-foreground'}>{level}</span>
                  {isUnlocked ? (
                    <Unlock className="w-4 h-4 text-success mt-1" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground/50 mt-1" />
                  )}
                </div>
                
                {/* Free Reward */}
                <Card className={`border-none shadow-none ${isUnlocked ? 'bg-muted/50' : 'bg-muted/20 opacity-50'}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/20 p-2 rounded-full">
                        <Coins className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <div className="font-semibold">{level * 10} Coins</div>
                        <div className="text-xs text-muted-foreground">Free Tier</div>
                      </div>
                    </div>
                    {isUnlocked && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">Claimed</Badge>
                    )}
                  </CardContent>
                </Card>

                {/* Premium Reward */}
                <Card className={`border-none shadow-none relative overflow-hidden ${isUnlocked ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : 'bg-muted/20 opacity-50'}`}>
                  {!isUnlocked && (
                    <div className="absolute inset-0 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <Lock className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Zap className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-500">{level * 50} XP Boost</div>
                        <div className="text-xs text-yellow-500/70">Premium Tier</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

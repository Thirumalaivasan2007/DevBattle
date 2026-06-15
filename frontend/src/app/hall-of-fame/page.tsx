'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Zap, Loader2 } from 'lucide-react';
import TierBadge from '@/components/tier/TierBadge';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HallOfFamePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['hall-of-fame'],
    queryFn: async () => {
      const res = await apiClient.get('/leaderboard/hall-of-fame');
      return res.data;
    }
  });

  const renderTop3 = (users: any[], title: string, icon: any, valueLabel: string, valueField: string) => {
    const Icon = icon;
    
    if (!users || users.length === 0) return null;

    return (
      <Card className="border-border/50 bg-card/40 backdrop-blur overflow-hidden">
        <div className="bg-muted/30 p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Icon className="w-5 h-5 text-primary mr-2" /> {title}
          </h2>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border/20">
            {users.map((user, idx) => (
              <div key={user._id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                    idx === 1 ? 'bg-zinc-400/20 text-zinc-400' : 
                    'bg-amber-600/20 text-amber-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <Link href={`/users/${user.username}`} className="font-bold text-lg hover:text-primary transition-colors">
                      {user.username}
                    </Link>
                    <div className="flex items-center mt-1">
                      <TierBadge rating={user.highestRating || 1000} showIcon={false} className="text-xs px-1.5 py-0 rounded" />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-foreground">{user[valueField]}</div>
                  <div className="text-xs text-muted-foreground uppercase">{valueLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tight mb-4 flex items-center justify-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500">
            <Trophy className="w-12 h-12 text-yellow-500 mr-4" /> Hall of Fame
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Honoring the absolute best and most dedicated developers on the DevBattle platform.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data && renderTop3(data.topRated, 'Highest Rated', Trophy, 'Peak Rating', 'highestRating')}
            {data && renderTop3(data.mostSolved, 'Most Solved', Star, 'Problems', 'solvedProblems')}
            {data && renderTop3(data.longestStreak, 'Longest Streak', Zap, 'Days', 'streak')}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

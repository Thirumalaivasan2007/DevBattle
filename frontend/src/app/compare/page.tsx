'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GitCompare, Search, Loader2, Trophy, Crosshair, Target, Zap } from 'lucide-react';
import TierBadge from '@/components/tier/TierBadge';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ComparePage() {
  const [userA, setUserA] = useState('');
  const [userB, setUserB] = useState('');
  const [searchParams, setSearchParams] = useState({ a: '', b: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['compare', searchParams.a, searchParams.b],
    queryFn: async () => {
      if (!searchParams.a || !searchParams.b) return null;
      const res = await apiClient.get(`/compare?userA=${searchParams.a}&userB=${searchParams.b}`);
      return res.data;
    },
    enabled: !!searchParams.a && !!searchParams.b,
    retry: false
  });

  const handleCompare = () => {
    if (userA && userB) {
      setSearchParams({ a: userA, b: userB });
    }
  };

  const renderStatCard = (title: string, valA: number | string, valB: number | string, icon: any, inverse = false) => {
    const isAWinner = inverse ? valA < valB : valA > valB;
    const isBWinner = inverse ? valB < valA : valB > valA;
    const Icon = icon;

    return (
      <div className="flex items-center justify-between py-4 border-b border-border/20 last:border-0">
        <div className={`w-1/3 text-center font-mono text-lg ${isAWinner ? 'text-success font-bold' : 'text-muted-foreground'}`}>
          {valA}
        </div>
        <div className="w-1/3 text-center flex flex-col items-center">
          <Icon className="w-5 h-5 text-primary mb-1" />
          <span className="text-xs text-muted-foreground uppercase">{title}</span>
        </div>
        <div className={`w-1/3 text-center font-mono text-lg ${isBWinner ? 'text-success font-bold' : 'text-muted-foreground'}`}>
          {valB}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center justify-center">
            <GitCompare className="w-10 h-10 text-primary mr-4" /> Compare Developers
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pit two developers against each other to see who reigns supreme in DevBattle.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Username 1" 
              value={userA} 
              onChange={(e) => setUserA(e.target.value)}
              className="pl-9 bg-muted/20 border-border/50 text-center"
            />
          </div>
          <div className="hidden md:block font-bold text-muted-foreground">VS</div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Username 2" 
              value={userB} 
              onChange={(e) => setUserB(e.target.value)}
              className="pl-9 bg-muted/20 border-border/50 text-center"
            />
          </div>
          <Button onClick={handleCompare} disabled={!userA || !userB || isLoading} className="w-full md:w-auto">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GitCompare className="w-4 h-4 mr-2" />}
            Compare
          </Button>
        </div>

        {error && (
          <div className="text-center text-destructive p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            One or both users not found. Please check the usernames and try again.
          </div>
        )}

        {data && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* User A Card */}
              <Card className="border-border/50 bg-card/40 backdrop-blur flex flex-col items-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-3xl font-bold text-primary">
                  {data.userA.profile.fullName.charAt(0)}
                </div>
                <Link href={`/users/${data.userA.profile.username}`} className="text-2xl font-bold hover:text-primary transition-colors">
                  {data.userA.profile.username}
                </Link>
                <p className="text-muted-foreground mb-4">{data.userA.profile.fullName}</p>
                <TierBadge rating={data.userA.profile.rating || data.userA.profile.highestRating} />
              </Card>

              {/* VS Divider */}
              <div className="hidden md:flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-muted-foreground/30 italic">VS</div>
              </div>

              {/* User B Card */}
              <Card className="border-border/50 bg-card/40 backdrop-blur flex flex-col items-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mb-4 text-3xl font-bold text-secondary">
                  {data.userB.profile.fullName.charAt(0)}
                </div>
                <Link href={`/users/${data.userB.profile.username}`} className="text-2xl font-bold hover:text-secondary transition-colors">
                  {data.userB.profile.username}
                </Link>
                <p className="text-muted-foreground mb-4">{data.userB.profile.fullName}</p>
                <TierBadge rating={data.userB.profile.rating || data.userB.profile.highestRating} />
              </Card>
            </div>

            {/* Stats Comparison */}
            <Card className="border-border/50 bg-card/40 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 text-center">Head to Head Statistics</h3>
                <div className="space-y-2">
                  {renderStatCard('Rating', data.userA.profile.rating || data.userA.profile.highestRating, data.userB.profile.rating || data.userB.profile.highestRating, Trophy)}
                  {renderStatCard('Solved Problems', data.userA.profile.solvedProblems, data.userB.profile.solvedProblems, Target)}
                  {renderStatCard('Current Streak', data.userA.profile.currentStreak || 0, data.userB.profile.currentStreak || 0, Zap)}
                  {renderStatCard('Acceptance Rate', `${data.userA.stats?.acceptanceRate || 0}%`, `${data.userB.stats?.acceptanceRate || 0}%`, Crosshair)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

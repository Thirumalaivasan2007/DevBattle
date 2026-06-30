'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ActivityCalendar } from 'react-activity-calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function HeatmapLoader({ username }: { username: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['heatmap', username],
    queryFn: async () => {
      const res = await apiClient.get(`/users/${username}/heatmap`);
      return res.data;
    }
  });

  if (isLoading) return <div className="text-muted-foreground text-sm py-8">Loading heatmap...</div>;
  if (!data || data.length === 0) return <div className="text-muted-foreground text-sm py-8">No activity data yet.</div>;

  return (
    <ActivityCalendar 
      data={data} 
      theme={{
        light: ['#f0f0f0', '#c4edde', '#7ac7c4', '#f73859', '#384259'],
        dark: ['#1f1f22', '#2e3c38', '#406356', '#e06c75', '#d19a66'],
      }}
      colorScheme="dark"
      labels={{
        totalCount: '{{count}} submissions in the last year',
      }}
    />
  );
}

export default function DailyChallengePage() {
  const { user } = useAuthStore();
  const { data: challenge, isLoading: challengeLoading } = useQuery({
    queryKey: ['dailyChallenge'],
    queryFn: async () => {
      const res = await apiClient.get('/challenges/daily');
      return res.data;
    },
    retry: false
  });

  const { data: topStreaks, isLoading: streaksLoading } = useQuery({
    queryKey: ['topStreaks'],
    queryFn: async () => {
      const res = await apiClient.get('/challenges/streaks');
      return res.data;
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.username],
    queryFn: async () => {
      const res = await apiClient.get(`/users/profile/${user?.username}`);
      return res.data;
    },
    enabled: !!user?.username
  });

  const isSolved = user && challenge?.participants?.some((p: any) => p._id === user._id || p.username === user.username);

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Daily Challenge</h1>
          <p className="text-muted-foreground">Keep your streak alive by solving today's problem.</p>
        </div>
        {user && (
          <div className="flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full border border-orange-500/20">
            <Flame className="w-5 h-5" />
            <span className="font-bold">{userProfile?.user?.currentStreak || user?.currentStreak || 0} Day Streak</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-primary/50 bg-primary/5 shadow-lg shadow-primary/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2" variant="outline">Today's Problem</Badge>
                  <CardTitle className="text-2xl">
                    {challengeLoading ? 'Loading...' : challenge?.problemId?.title || 'No challenge today'}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground bg-background px-3 py-1 rounded-md border border-border">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono">Resets in 24h</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {challenge && challenge.problemId ? (
                <div className="flex gap-2 mb-6">
                  <Badge variant={challenge.problemId.difficulty === 'Easy' ? 'default' : challenge.problemId.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                    {challenge.problemId.difficulty}
                  </Badge>
                  <Badge variant="outline">Acceptance: {challenge.problemId.acceptanceRate?.toFixed(1) || '0.0'}%</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {challenge.participants?.length || 0} Solved Today
                  </Badge>
                </div>
              ) : null}
            </CardContent>
            <CardFooter>
              {challenge && challenge.problemId ? (
                isSolved ? (
                  <Button className="w-full bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/30" size="lg" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" /> Completed
                  </Button>
                ) : (
                  <Link href={`/problems/${challenge.problemId.slug}`} className="w-full">
                    <Button className="w-full" size="lg">
                      Solve Challenge <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )
              ) : (
                <Button className="w-full" size="lg" disabled>Check back tomorrow</Button>
              )}
            </CardFooter>
          </Card>

          {/* Activity Graph */}
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="flex items-center justify-center p-4 border border-border/50 rounded-lg bg-background shadow-inner overflow-x-auto">
                  <HeatmapLoader username={user.username} />
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                  Log in to see your activity
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Top Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {streaksLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {topStreaks?.map((streakUser: any, index: number) => (
                    <div key={streakUser._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-4 text-sm">{index + 1}.</span>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={streakUser.profilePicture} />
                          <AvatarFallback>{streakUser.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{streakUser.username}</p>
                          <p className="text-xs text-muted-foreground">{streakUser.reputationLevel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 font-bold">
                        {streakUser.currentStreak} <Flame className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                  {topStreaks?.length === 0 && (
                    <div className="text-muted-foreground text-sm text-center py-2">No active streaks.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

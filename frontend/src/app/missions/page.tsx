'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Target, Coins, Zap, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MissionsPage() {
  const { user, isAuthenticated } = useAuthStore();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const res = await apiClient.get('/gamification/missions');
      return res.data;
    },
    enabled: isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Log in to view missions</div>
        </div>
      </div>
    );
  }

  const dailyMissions = missions?.filter((m: any) => m.type === 'DAILY') || [];
  const weeklyMissions = missions?.filter((m: any) => m.type === 'WEEKLY') || [];

  const MissionCard = ({ mission }: { mission: any }) => {
    const percent = Math.min(100, (mission.progress / mission.requiredCount) * 100);
    
    return (
      <Card className={`relative overflow-hidden transition-all ${mission.isCompleted ? 'bg-success/5 border-success/20' : 'bg-card/50'}`}>
        {mission.isCompleted && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-success/20 -mr-8 -mt-8 rounded-full blur-xl" />
        )}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              {mission.isCompleted ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Target className="w-5 h-5 text-muted-foreground" />}
              {mission.title}
            </CardTitle>
            <div className="flex gap-2">
              {mission.xpReward > 0 && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex gap-1">
                  <Zap className="w-3 h-3" /> {mission.xpReward} XP
                </Badge>
              )}
              {mission.coinReward > 0 && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 flex gap-1">
                  <Coins className="w-3 h-3" /> {mission.coinReward}
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>{mission.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className={mission.isCompleted ? 'text-success font-bold' : 'font-medium'}>
                {mission.progress} / {mission.requiredCount}
              </span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${mission.isCompleted ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Resets {formatDistanceToNow(new Date(mission.expiresAt), { addSuffix: true })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Missions</h1>
        <p className="text-muted-foreground mb-10">Complete missions to earn XP, level up, and get coins for the reward store.</p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-orange-500/20 text-orange-500 p-1.5 rounded-md"><Zap className="w-5 h-5" /></span>
                Daily Missions
              </h2>
              {dailyMissions.length === 0 ? (
                <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">No daily missions active right now.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyMissions.map((m: any) => <MissionCard key={m._id} mission={m} />)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-500 p-1.5 rounded-md"><Target className="w-5 h-5" /></span>
                Weekly Missions
              </h2>
              {weeklyMissions.length === 0 ? (
                <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">No weekly missions active right now.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weeklyMissions.map((m: any) => <MissionCard key={m._id} mission={m} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

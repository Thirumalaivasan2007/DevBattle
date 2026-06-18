'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/axios';
import { Trophy, Target, Flame, Medal, Award, Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { formatDistanceToNow } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

function StatCard({ title, value, icon, description, className }: StatCardProps) {
  return (
    <Card className={`bg-card/50 backdrop-blur border-border/50 ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/auth/profile');
        setProfileData(res.data);
        try {
          const actRes = await apiClient.get(`/users/${res.data.username}/activity?limit=5`);
          setActivities(actRes.data);
        } catch (e) {
          console.error("Failed to fetch activities", e);
        }
      } catch (error: any) {
        toast.error('Failed to fetch profile data');
        if (error.response?.status === 401) {
          logout();
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router, logout]);

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {profileData.fullName}!</h1>
              <p className="text-muted-foreground">
                @{profileData.username} • Let's crush some code today.
              </p>
            </div>
            <div className="bg-background rounded-full px-6 py-2 border border-border shadow-sm flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-lg">{profileData.rating} Rating</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Global Rank"
            value={profileData.rank}
            icon={<Medal className="h-5 w-5 text-secondary" />}
            description="Top 15% overall"
          />
          <StatCard
            title="Problems Solved"
            value={profileData.solvedProblems}
            icon={<Target className="h-5 w-5 text-success" />}
            description="Out of 500+ problems"
          />
          <StatCard
            title="Current Streak"
            value={`${profileData.currentStreak || 0} days`}
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            description="Keep it up!"
          />
          <StatCard
            title="Contests"
            value={profileData.contestsParticipated}
            icon={<Award className="h-5 w-5 text-primary" />}
            description={`${profileData.badgesCount} badges earned`}
          />
        </div>

        {/* Gamification Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 hover:border-orange-500/50 transition-all cursor-pointer" onClick={() => router.push('/missions')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Missions</h3>
                <p className="text-sm text-muted-foreground">Complete tasks for XP</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-full"><Target className="w-6 h-6 text-orange-500" /></div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => router.push('/season-pass')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Season Pass</h3>
                <p className="text-sm text-muted-foreground">Unlock rewards</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-full"><Activity className="w-6 h-6 text-blue-500" /></div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20 hover:border-yellow-500/50 transition-all cursor-pointer" onClick={() => router.push('/store')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Store & Inventory</h3>
                <p className="text-sm text-muted-foreground">Spend your coins</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-full"><Trophy className="w-6 h-6 text-yellow-500" /></div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Activity className="h-6 w-6" /> Recent Activity
        </h2>
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-0">
            {/* Placeholder for activity list */}
            <div className="divide-y divide-border/50">
              {activities.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No recent activity found. Start coding!
                </div>
              ) : (
                activities.map((act) => (
                  <div key={act._id} className="p-6 flex items-center justify-between">
                    <div>
                      {act.activityType === 'ACCEPTED_PROBLEM' ? (
                        <>
                          <h4 className="font-semibold text-lg">Solved "{act.metadata?.problemTitle}"</h4>
                          <p className="text-sm text-muted-foreground">Problem Solving</p>
                        </>
                      ) : act.activityType === 'COMPLETED_DAILY_CHALLENGE' ? (
                        <>
                          <h4 className="font-semibold text-lg text-orange-500">Completed Daily Challenge: {act.metadata?.problemTitle}</h4>
                          <p className="text-sm text-muted-foreground">Daily Habit Tracker</p>
                        </>
                      ) : act.activityType === 'NEW_BADGE' ? (
                        <>
                          <h4 className="font-semibold text-lg text-primary">Earned "{act.metadata?.badgeName}"</h4>
                          <p className="text-sm text-muted-foreground">Achievement Unlocked</p>
                        </>
                      ) : act.activityType === 'LEVEL_UP' ? (
                        <>
                          <h4 className="font-semibold text-lg text-yellow-500">Reached Level {act.metadata?.newLevel}!</h4>
                          <p className="text-sm text-muted-foreground">Gamification</p>
                        </>
                      ) : (
                        <h4 className="font-semibold text-lg">Activity logged</h4>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

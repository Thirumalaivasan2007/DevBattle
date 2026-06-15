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
            value={`${profileData.streak} days`}
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
                      ) : act.activityType === 'NEW_BADGE' ? (
                        <>
                          <h4 className="font-semibold text-lg text-primary">Earned "{act.metadata?.badgeName}"</h4>
                          <p className="text-sm text-muted-foreground">Achievement Unlocked</p>
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

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  getUserProfile,
  getUserStats,
  getUserActivity,
  getUserHeatmap,
  getUserAchievements
} from '@/services/userService';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import SubmissionAnalytics from '@/components/profile/SubmissionAnalytics';
import CodingHeatmap from '@/components/profile/CodingHeatmap';
import ActivityFeed from '@/components/profile/ActivityFeed';
import AchievementGrid from '@/components/profile/AchievementGrid';
import { Loader2 } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [achievementsData, setAchievementsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, statsRes, activityRes, heatmapRes, achievementsRes] = await Promise.all([
          getUserProfile(username),
          getUserStats(username),
          getUserActivity(username, 10),
          getUserHeatmap(username),
          getUserAchievements(username)
        ]);

        setProfileData(profileRes.user);
        // Sometimes profileRes also returns stats if we created it. 
        // We'll prefer the detailed statsRes which might have populated fields.
        setStatsData(statsRes || profileRes.stats);
        setActivityData(activityRes);
        setHeatmapData(heatmapRes);
        setAchievementsData(achievementsRes);
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchAllData();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <div className="text-4xl font-bold text-muted-foreground">404</div>
          <p className="text-xl">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 space-y-6">
        <ProfileHeader user={profileData} stats={statsData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProfileStats stats={statsData} />
            <ActivityFeed activities={activityData} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <CodingHeatmap heatmapData={heatmapData} />
            <SubmissionAnalytics stats={statsData} />
            <AchievementGrid achievements={achievementsData} />
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Trophy, ChevronLeft, MapPin, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { EditTeamModal } from '@/components/teams/EditTeamModal';
import { TeamProvider } from './TeamContext';

export default function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestingJoin, setRequestingJoin] = useState(false);
  const { user } = useAuthStore();
  const pathname = usePathname();

  const fetchTeam = async () => {
    try {
      const response = await api.get(`/teams/${slug}`);
      setTeam(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        notFound();
      } else {
        toast.error("Error", { description: "Failed to load team data" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [slug]);

  const handleRequestJoin = async () => {
    if (!user) {
      toast.error('Authentication Required', { description: 'You need to log in to request joining a team' });
      return;
    }
    setRequestingJoin(true);
    try {
      await api.post(`/teams/${team._id}/request`);
      toast.success('Request Sent', { description: 'Your request to join has been sent to the team admins.' });
    } catch (error: any) {
      toast.error('Request Failed', { description: error.response?.data?.message || 'Failed to send join request.' });
    } finally {
      setRequestingJoin(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!team) return null;

  const currentTab = pathname.includes('/members') ? 'members' : 
                     pathname.includes('/analytics') ? 'analytics' : 'overview';

  return (
    <div className="container py-8 max-w-6xl mx-auto space-y-8">
      <Link href="/teams" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Teams
      </Link>

      {/* Team Header Banner */}
      <Card className="border-border/40 shadow-sm overflow-hidden relative">
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
          {team.banner && <img src={team.banner} alt="Banner" className="w-full h-full object-cover absolute inset-0 mix-blend-overlay" />}
        </div>
        <CardContent className="pt-0 relative px-6 md:px-10 pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-12 md:-mt-16">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-primary font-bold text-4xl shadow-md overflow-hidden shrink-0 z-10">
              {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" /> : team.name.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1 space-y-2 mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{team.name}</h1>
                {team.privacy === 'PUBLIC' && <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Public</Badge>}
                {team.privacy === 'PRIVATE' && <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Private</Badge>}
              </div>
              <p className="text-muted-foreground max-w-2xl">{team.description || "No description provided."}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5 font-medium">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  {team.rating} Rating
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="h-4 w-4" />
                  {team.members.length} Members
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4" />
                  Founded {format(new Date(team.createdAt), 'MMM yyyy')}
                </div>
              </div>
            </div>

            <div className="shrink-0 mb-2">
              {user && (team.members.find((m: any) => m.user._id === user._id)?.role === 'OWNER' || 
               team.members.find((m: any) => m.user._id === user._id)?.role === 'ADMIN') ? (
                <EditTeamModal team={team} onUpdate={fetchTeam} />
              ) : user && team.members.find((m: any) => m.user._id === user._id) ? (
                <Button variant="outline" className="w-full md:w-auto flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10">
                  Leave Team
                </Button>
              ) : (
                <Button 
                  className="w-full md:w-auto flex items-center gap-2" 
                  onClick={handleRequestJoin}
                  disabled={requestingJoin}
                >
                  {requestingJoin ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Request to Join
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={currentTab} className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 overflow-x-auto rounded-lg">
          <Link href={`/teams/${team.slug}`}>
            <TabsTrigger value="overview" className="px-6 py-2.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
          </Link>
          <Link href={`/teams/${team.slug}/members`}>
            <TabsTrigger value="members" className="px-6 py-2.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Members Roster
            </TabsTrigger>
          </Link>
          <Link href={`/teams/${team.slug}/analytics`}>
            <TabsTrigger value="analytics" className="px-6 py-2.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Analytics & Matches
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {/* Render Nested Pages */}
      <div className="mt-8">
        <TeamProvider team={team} fetchTeam={fetchTeam}>
          {children}
        </TeamProvider>
      </div>
    </div>
  );
}

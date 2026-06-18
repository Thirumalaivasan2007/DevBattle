'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Users, CalendarDays, Loader2, AlertCircle, Play } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInSeconds } from 'date-fns';
import Footer from '@/components/Footer';

export default function ContestDashboardPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['contest', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/contests/${slug}`);
      return res.data;
    },
    refetchInterval: 10000 // Refetch every 10 seconds to catch state changes
  });

  const registerMutation = useMutation({
    mutationFn: async (contestId: string) => {
      const res = await apiClient.post(`/contests/${contestId}/register`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully registered for the contest!');
      queryClient.invalidateQueries({ queryKey: ['contest', slug] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });

  // Simple countdown timer effect
  React.useEffect(() => {
    if (!data?.contest) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const start = new Date(data.contest.startTime);
      const end = new Date(data.contest.endTime);
      
      if (data.contest.status === 'UPCOMING' || data.contest.status === 'REGISTRATION_OPEN') {
        const diff = differenceInSeconds(start, now);
        if (diff > 0) {
          const d = Math.floor(diff / (3600 * 24));
          const h = Math.floor((diff % (3600 * 24)) / 3600);
          const m = Math.floor((diff % 3600) / 60);
          const s = diff % 60;
          setTimeRemaining(`${d}d ${h}h ${m}m ${s}s`);
        } else {
          setTimeRemaining('Starting now...');
          // Trigger refetch
          queryClient.invalidateQueries({ queryKey: ['contest', slug] });
        }
      } else if (data.contest.status === 'RUNNING') {
        const diff = differenceInSeconds(end, now);
        if (diff > 0) {
          const h = Math.floor(diff / 3600);
          const m = Math.floor((diff % 3600) / 60);
          const s = diff % 60;
          setTimeRemaining(`${h}h ${m}m ${s}s remaining`);
        } else {
          setTimeRemaining('Contest ended');
          queryClient.invalidateQueries({ queryKey: ['contest', slug] });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data, slug, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.contest) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Contest Not Found</h1>
        <Button onClick={() => router.push('/contests')}>Back to Contests</Button>
      </div>
    );
  }

  const { contest, isRegistered } = data;
  const isRunning = contest.status === 'RUNNING';
  const isFinished = contest.status === 'FINISHED' || contest.status === 'ARCHIVED';
  const isUpcoming = contest.status === 'UPCOMING' || contest.status === 'REGISTRATION_OPEN';

  const handleAction = () => {
    if (!isAuthenticated) {
      toast.error('Please login to register or participate');
      router.push('/auth/login');
      return;
    }

    if (isUpcoming && !isRegistered) {
      registerMutation.mutate(contest._id);
    } else if (isRunning && isRegistered) {
      router.push(`/contests/${slug}/problems`);
    } else if (isFinished) {
      router.push(`/contests/${slug}/standings`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-background to-secondary/20 border-b border-border/50 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                  isRunning ? 'bg-red-500/20 text-red-500 animate-pulse' : 
                  isFinished ? 'bg-zinc-500/20 text-zinc-400' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {contest.status}
                </span>
                <span className="text-sm font-mono text-muted-foreground uppercase">{contest.contestType}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                {contest.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {contest.description}
              </p>
            </div>

            <Card className="bg-card/60 backdrop-blur border-border/50 w-full md:w-80 shadow-xl shrink-0">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground mb-1 uppercase font-semibold">
                  {isUpcoming ? 'Starts In' : isRunning ? 'Time Remaining' : 'Status'}
                </div>
                <div className={`text-3xl font-mono font-bold mb-6 ${isRunning ? 'text-red-500' : 'text-foreground'}`}>
                  {isFinished ? 'Ended' : timeRemaining || '...'}
                </div>
                
                <Button 
                  className="w-full text-lg h-12 font-bold shadow-lg transition-transform hover:scale-[1.02]" 
                  variant={isRunning ? 'destructive' : isRegistered ? 'outline' : 'default'}
                  onClick={handleAction}
                  disabled={registerMutation.isPending || (isUpcoming && isRegistered)}
                >
                  {registerMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                  {isFinished ? 'View Final Standings' : 
                   isRunning && isRegistered ? <><Play className="w-5 h-5 mr-2 fill-current" /> Enter Arena</> :
                   isRunning && !isRegistered ? 'Registration Closed' :
                   isRegistered ? 'Registered' : 'Register Now'}
                </Button>
                
                {isRegistered && isUpcoming && (
                  <p className="text-xs text-success mt-3 flex items-center justify-center font-medium">
                    <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
                    You are registered
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/50 bg-card/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <AlertCircle className="w-5 h-5 mr-2 text-primary" /> Rules & Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none text-muted-foreground">
                <p>Welcome to <strong>{contest.title}</strong>! Please read the rules carefully before participating.</p>
                <ul>
                  <li>The contest duration is exactly <strong>{contest.duration} minutes</strong>.</li>
                  <li>Penalty for each incorrect submission is <strong>20 minutes</strong> (only applied if the problem is eventually solved).</li>
                  <li>You must not communicate with other participants or share code. Plagiarism will result in a permanent ban.</li>
                  <li>Your rating will be updated upon the completion of the contest.</li>
                </ul>
                <p>Good luck and have fun!</p>
              </CardContent>
            </Card>

            {/* Quick Standings Preview or Announcements could go here */}
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Contest Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2" /> Start</span>
                  <span className="font-medium text-sm">{format(new Date(contest.startTime), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-2" /> Duration</span>
                  <span className="font-medium text-sm">{contest.duration} mins</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-2" /> Registered</span>
                  <span className="font-medium text-sm">{contest.participantsCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Clock, Users, CalendarDays, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data: contests, isLoading } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const res = await apiClient.get('/contests');
      return res.data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UPCOMING':
      case 'REGISTRATION_OPEN':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/20 text-blue-500">UPCOMING</span>;
      case 'RUNNING':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-red-500/20 text-red-500 animate-pulse">LIVE</span>;
      case 'FINISHED':
      case 'ARCHIVED':
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-zinc-500/20 text-zinc-400">FINISHED</span>;
      default:
        return null;
    }
  };

  const renderContestList = (filteredContests: any[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" /> Loading Contests...
        </div>
      );
    }

    if (!filteredContests || filteredContests.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border/50 rounded-lg">
          No contests found in this category.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredContests.map((contest) => (
          <Card key={contest._id} className="border-border/50 bg-card/40 backdrop-blur hover:bg-card/60 transition-colors">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusBadge(contest.status)}
                  <span className="text-xs font-mono text-muted-foreground">{contest.contestType}</span>
                </div>
                <Link href={`/contests/${contest.slug}`}>
                  <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer mb-2">
                    {contest.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {format(new Date(contest.startTime), 'MMM dd, yyyy HH:mm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {contest.duration} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {contest.participantsCount} Registered
                  </span>
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-2">
                <Link href={`/contests/${contest.slug}`}>
                  <Button className="w-full md:w-32" variant={contest.status === 'RUNNING' ? 'destructive' : 'default'}>
                    {contest.status === 'RUNNING' ? 'Enter' : contest.status === 'FINISHED' ? 'Standings' : 'Register'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const upcoming = contests?.filter((c: any) => c.status === 'UPCOMING' || c.status === 'REGISTRATION_OPEN') || [];
  const running = contests?.filter((c: any) => c.status === 'RUNNING') || [];
  const past = contests?.filter((c: any) => c.status === 'FINISHED' || c.status === 'ARCHIVED') || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center">
            <Trophy className="w-10 h-10 text-primary mr-4" /> Contests
          </h1>
          <p className="text-muted-foreground text-lg">
            Compete against the best, improve your rating, and climb the global leaderboards.
          </p>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-muted/30 border border-border/50 grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="running" className="data-[state=active]:text-red-500">Live ({running.length})</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {renderContestList(upcoming)}
          </TabsContent>
          
          <TabsContent value="running">
            {renderContestList(running)}
          </TabsContent>

          <TabsContent value="past">
            {renderContestList(past)}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

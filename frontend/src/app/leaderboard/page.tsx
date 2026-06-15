'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Trophy, Search, Loader2, Globe, MapPin, GraduationCap } from 'lucide-react';
import TierBadge from '@/components/tier/TierBadge';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', activeTab, debouncedSearch],
    queryFn: async () => {
      let endpoint = '/leaderboard/global';
      if (activeTab === 'country') {
        endpoint = `/leaderboard/country?country=${debouncedSearch || 'India'}`;
      } else if (activeTab === 'college') {
        endpoint = `/leaderboard/college?college=${debouncedSearch || 'MIT'}`;
      }
      
      const res = await apiClient.get(endpoint);
      return res.data.users || res.data;
    }
  });

  const renderTable = (users: any[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" /> Loading Leaderboard...
        </div>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          No coders found. Keep grinding!
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
            <tr>
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">Coder</th>
              <th className="px-6 py-4 font-semibold">Tier</th>
              <th className="px-6 py-4 font-semibold text-right">Rating</th>
              <th className="px-6 py-4 font-semibold text-right">Solved</th>
              {activeTab === 'country' && <th className="px-6 py-4 font-semibold text-right">Country</th>}
              {activeTab === 'college' && <th className="px-6 py-4 font-semibold text-right">College</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4">
                  <span className={`font-bold ${idx < 3 ? 'text-primary text-lg' : 'text-muted-foreground'}`}>
                    #{idx + 1}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">
                  <Link href={`/users/${user.username}`} className="hover:text-primary transition-colors flex flex-col">
                    <span>{user.username}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.fullName}</span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <TierBadge rating={user.rating || user.highestRating} />
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                  {user.rating || user.highestRating}
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground">
                  {user.solvedProblems}
                </td>
                {activeTab === 'country' && <td className="px-6 py-4 text-right text-muted-foreground">{user.country}</td>}
                {activeTab === 'college' && <td className="px-6 py-4 text-right text-muted-foreground">{user.collegeName}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center">
              <Trophy className="w-10 h-10 text-primary mr-4" /> Global Leaderboard
            </h1>
            <p className="text-muted-foreground text-lg">
              See how you stack up against the best developers in the world.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/compare">
              <button className="px-4 py-2 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-md text-sm font-medium transition-colors">
                Compare Users
              </button>
            </Link>
            <Link href="/hall-of-fame">
              <button className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-md text-sm font-medium transition-colors">
                Hall of Fame
              </button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="global" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-muted/30 border border-border/50">
              <TabsTrigger value="global" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Globe className="w-4 h-4 mr-2" /> Global
              </TabsTrigger>
              <TabsTrigger value="country" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <MapPin className="w-4 h-4 mr-2" /> Country
              </TabsTrigger>
              <TabsTrigger value="college" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <GraduationCap className="w-4 h-4 mr-2" /> College
              </TabsTrigger>
            </TabsList>

            {(activeTab === 'country' || activeTab === 'college') && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/20 border-border/50"
                />
              </div>
            )}
          </div>

          <Card className="border-border/50 bg-card/40 backdrop-blur">
            <CardContent className="p-0">
              {renderTable(data?.users || data)}
            </CardContent>
          </Card>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

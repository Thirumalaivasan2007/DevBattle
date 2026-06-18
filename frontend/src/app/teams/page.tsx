"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Trophy, ChevronRight, Loader2, Plus, Shield } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { PendingInvitations } from '@/components/teams/PendingInvitations';

export default function TeamsDirectoryPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const [teamsRes, leaderboardRes] = await Promise.all([
          api.get(`/teams?search=${search}`),
          api.get('/teams/leaderboard/global?limit=5')
        ]);
        setTeams(teamsRes.data.teams);
        setLeaderboard(leaderboardRes.data);
      } catch (error: any) {
        toast.error("Error", { description: error.response?.data?.message || "Failed to load teams" });
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [search]);

  return (
    <div className="container py-10 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Teams Ecosystem</h1>
          <p className="text-lg text-muted-foreground mt-1">Join forces, compete globally, and climb the ranks.</p>
        </div>
        <Link href="/teams/create">
          <Button size="lg" className="flex items-center gap-2 font-semibold">
            <Plus className="h-5 w-5" />
            Create a Team
          </Button>
        </Link>
      </div>

      <PendingInvitations />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Teams List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search teams by name or description..." 
              className="pl-10 h-12 text-md bg-card border-border shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : teams.length === 0 ? (
            <Card className="border-border/40 bg-card/50 text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Teams Found</h3>
              <p className="text-muted-foreground mb-6">Be the first to create a team matching your search!</p>
              <Link href="/teams/create">
                <Button variant="outline">Create Team</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {teams.map((team) => (
                <Link href={`/teams/${team.slug}`} key={team._id}>
                  <Card className="border-border/40 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-2xl uppercase">
                            {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-xl" /> : team.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{team.name}</h3>
                              <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                Lvl {team.level}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground line-clamp-2 text-sm">{team.description || 'No description provided.'}</p>
                            
                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5 font-medium">
                                <Users className="h-4 w-4" />
                                {team.members.length} {team.members.length === 1 ? 'Member' : 'Members'}
                              </div>
                              <div className="flex items-center gap-1.5 font-medium">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                {team.rating} Rating
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Global Leaderboard Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm sticky top-24 bg-card/60 backdrop-blur-xl">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Global Top 5
              </CardTitle>
              <CardDescription>Highest rated teams worldwide</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {leaderboard.map((team, index) => (
                    <Link href={`/teams/${team.slug}`} key={team._id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                        index === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30' :
                        index === 2 ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{team.name}</p>
                        <p className="text-xs text-muted-foreground">{team.rating} Rating • Lvl {team.level}</p>
                      </div>
                    </Link>
                  ))}
                  {leaderboard.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No ranked teams yet.
                    </div>
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

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useSocketStore } from '@/store/socketStore';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Loader2 } from 'lucide-react';

export default function StandingsPage() {
  const { slug } = useParams();
  const { socket, connect, disconnect } = useSocketStore();
  const [standings, setStandings] = useState<any[]>([]);

  // 1. Fetch contest ID from slug
  const { data: contestData, isLoading: loadingContest } = useQuery({
    queryKey: ['contest', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/contests/${slug}`);
      return res.data;
    }
  });

  const contestId = contestData?.contest?._id;

  // 2. Fetch initial standings
  useEffect(() => {
    if (!contestId) return;
    const fetchStandings = async () => {
      try {
        const res = await apiClient.get(`/contests/${contestId}/standings`);
        setStandings(res.data);
      } catch (e) {
        console.error('Failed to fetch standings', e);
      }
    };
    fetchStandings();
  }, [contestId]);

  // 3. Setup Socket.io
  useEffect(() => {
    if (!contestId) return;

    // Connect immediately
    connect();

  }, [contestId, connect]);

  // 4. Attach Listeners
  useEffect(() => {
    if (!contestId || !socket) return;

    socket.emit('join_contest', contestId);

    socket.on('contest:update', (data) => {
      console.log('Contest update:', data);
    });

    socket.on('contest:submission', (data) => {
      console.log('Live submission:', data);
      apiClient.get(`/contests/${contestId}/standings`).then(res => setStandings(res.data));
    });

    return () => {
      if (socket) {
        socket.emit('leave_contest', contestId);
        socket.off('contest:update');
        socket.off('contest:submission');
      }
    };
  }, [contestId, socket]);

  if (loadingContest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const contest = contestData?.contest;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center mb-2">
            <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
            {contest?.title} - Live Standings
          </h1>
          <p className="text-muted-foreground text-sm flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
            Real-time updates via WebSockets
          </p>
        </div>

        <Card className="border-border/50 bg-card/40 backdrop-blur overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead className="text-center w-24">Solved</TableHead>
                  <TableHead className="text-center w-24">Penalty</TableHead>
                  {/* Dynamic Problem Columns */}
                  {contest?.problems?.map((p: any) => (
                    <TableHead key={p.label} className="text-center w-20">
                      {p.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4 + (contest?.problems?.length || 0)} className="text-center py-8 text-muted-foreground">
                      No participants yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  standings.map((standing) => (
                    <TableRow key={standing._id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="text-center font-bold font-mono">
                        {standing.liveRank}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{standing.userId?.username}</span>
                          <span className="text-xs text-muted-foreground">Rating: {standing.userId?.rating || 1000}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {standing.solvedCount}
                      </TableCell>
                      <TableCell className="text-center font-mono text-muted-foreground">
                        {standing.penalty}
                      </TableCell>
                      {/* Problem cells */}
                      {standing.problemsProgress?.map((p: any) => (
                        <TableCell key={p.label} className="text-center">
                          {p.solved ? (
                            <div className="flex flex-col items-center">
                              <span className="text-green-500 font-bold">+{p.submissionCount > 1 ? p.submissionCount - 1 : ''}</span>
                              <span className="text-xs text-muted-foreground">{p.acceptedTime}</span>
                            </div>
                          ) : p.submissionCount > 0 ? (
                            <span className="text-red-500 font-bold">-{p.submissionCount}</span>
                          ) : (
                            <span className="text-muted-foreground/30">-</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

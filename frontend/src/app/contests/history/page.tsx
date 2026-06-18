'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Activity, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ContestHistoryPage() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Find all standings for this user
        const res = await apiClient.get(`/users/${user?.username}/contests/history`);
        setHistory(res.data);
      } catch (e) {
        console.error('Failed to fetch history', e);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.username) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-grow">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center mb-2">
              <Activity className="w-8 h-8 mr-3 text-primary" />
              Contest History
            </h1>
            <p className="text-muted-foreground">Track your past performance and rating changes.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Current Rating</div>
            <div className="text-3xl font-mono font-bold text-yellow-500">{user?.rating || 1000}</div>
          </div>
        </div>

        <Card className="border-border/50 bg-card/40 backdrop-blur">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                You haven't participated in any contests yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Contest</TableHead>
                    <TableHead className="text-center">Rank</TableHead>
                    <TableHead className="text-center">Solved</TableHead>
                    <TableHead className="text-right">Rating Change</TableHead>
                    <TableHead className="text-right">New Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h: any) => (
                    <TableRow key={h._id}>
                      <TableCell className="font-medium">
                        {h.contestId?.title || 'Unknown Contest'}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {h.rank}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {h.solvedCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {h.ratingChange > 0 ? (
                          <span className="text-green-500 flex items-center justify-end font-bold">
                            <ArrowUpRight className="w-4 h-4 mr-1" /> +{h.ratingChange}
                          </span>
                        ) : h.ratingChange < 0 ? (
                          <span className="text-red-500 flex items-center justify-end font-bold">
                            <ArrowDownRight className="w-4 h-4 mr-1" /> {h.ratingChange}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-yellow-500">
                        {h.newRating}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

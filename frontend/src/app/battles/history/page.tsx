'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Swords, Calendar, Clock, Trophy, ArrowLeft, History } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export default function BattleHistoryPage() {
  const { user } = useAuthStore();

  const { data: history, isLoading } = useQuery({
    queryKey: ['battleHistory'],
    queryFn: async () => {
      const res = await apiClient.get('/battles/history');
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="min-h-screen pt-24 text-center">Loading history...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center">
              <History className="w-10 h-10 mr-4 text-primary" /> Battle History
            </h1>
          </div>
          <Link href="/battles">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Arena</Button>
          </Link>
        </div>

        <Card className="border-border/50 bg-card/40 backdrop-blur">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Opponent</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead className="text-right">Rating Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No battles fought yet. Enter the arena!
                    </TableCell>
                  </TableRow>
                ) : (
                  history?.map((battle: any) => {
                    const opponent = battle.participants.find((p: any) => p.userId._id !== user?._id);
                    const me = battle.participants.find((p: any) => p.userId._id === user?._id);
                    
                    const isWin = me?.isWinner;
                    const isDraw = !me?.isWinner && !opponent?.isWinner;

                    return (
                      <TableRow key={battle._id}>
                        <TableCell className="font-medium">
                          {new Date(battle.endTime || battle.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Swords className="w-4 h-4 text-muted-foreground" />
                            {opponent?.userId?.username || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isWin ? (
                            <span className="text-green-500 font-bold">Victory</span>
                          ) : isDraw ? (
                            <span className="text-yellow-500 font-bold">Draw</span>
                          ) : (
                            <span className="text-red-500 font-bold">Defeat</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {battle.problemId?.title || 'Unknown Problem'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold">
                          {me?.ratingChange > 0 ? (
                            <span className="text-green-500">+{me.ratingChange}</span>
                          ) : me?.ratingChange < 0 ? (
                            <span className="text-red-500">{me.ratingChange}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

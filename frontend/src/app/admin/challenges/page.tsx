"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Calendar, Target } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get('/admin/challenges');
        setChallenges(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch challenges", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await api.delete(`/admin/challenges/${id}`);
      toast.success("Challenge deleted successfully");
      setChallenges(challenges.filter(c => c._id !== id));
    } catch (error: any) {
      toast.error("Failed to delete challenge", {
        description: error.response?.data?.message || "Internal server error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges Management</h1>
          <p className="text-muted-foreground">Schedule daily and weekly coding challenges.</p>
        </div>
        <Link href="/admin/challenges/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Challenge
          </Button>
        </Link>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border-0 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challenges.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No challenges found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    challenges.map((challenge) => (
                      <TableRow key={challenge._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {challenge.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{challenge.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {challenge.problemId ? (
                            <span className="text-blue-500 hover:underline cursor-pointer" title={challenge.problemId._id}>
                              {challenge.problemId.title}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">Problem deleted</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Target className="h-4 w-4" />
                            {challenge.participants?.length || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" title="Delete Challenge" onClick={() => handleDelete(challenge._id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

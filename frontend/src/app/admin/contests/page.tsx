"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Calendar, Users } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminContestsPage() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await api.get('/admin/contests');
        setContests(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch contests", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contest Management</h1>
          <p className="text-muted-foreground">Schedule, edit, and monitor global competitions.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Contest
        </Button>
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
                    <TableHead>Contest Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No contests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    contests.map((contest) => (
                      <TableRow key={contest._id}>
                        <TableCell className="font-medium">{contest.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              contest.status === 'UPCOMING' ? 'text-blue-500 border-blue-500/20' : 
                              contest.status === 'ACTIVE' ? 'text-green-500 border-green-500/20' : 
                              'text-muted-foreground border-border'
                            }
                          >
                            {contest.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(contest.startTime), 'PPp')}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contest.duration} mins
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {contest.participants?.length || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="Edit Contest"><Edit className="h-4 w-4 text-blue-500" /></Button>
                            <Button variant="ghost" size="icon" title="Delete Contest"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </div>
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

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Users } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/admin/teams');
        setTeams(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch teams", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this team? This action is irreversible.')) return;
    try {
      await api.delete(`/admin/teams/${id}`);
      toast.success("Team deleted successfully");
      setTeams(teams.filter(t => t._id !== id));
    } catch (error: any) {
      toast.error("Failed to delete team", {
        description: error.response?.data?.message || "Internal server error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
          <p className="text-muted-foreground">Monitor and manage platform teams.</p>
        </div>
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
                    <TableHead>Team Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Privacy</TableHead>
                    <TableHead>Level / XP</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No teams found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teams.map((team) => (
                      <TableRow key={team._id}>
                        <TableCell className="font-medium">
                          {team.name}
                          <div className="text-xs text-muted-foreground">@{team.slug}</div>
                        </TableCell>
                        <TableCell>
                          {team.owner?.username || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {team.members?.length || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={team.privacy === 'PUBLIC' ? 'default' : 'outline'}>{team.privacy}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>Lv. {team.level}</span>
                            <span className="text-xs text-muted-foreground">{team.xp} XP</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" title="Delete Team" onClick={() => handleDelete(team._id)}>
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

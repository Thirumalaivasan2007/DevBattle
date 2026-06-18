"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Ban, Eye } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminBattlesPage() {
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const response = await api.get('/admin/battles');
        setBattles(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch battles", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBattles();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Battle Arena Control</h1>
          <p className="text-muted-foreground">Monitor ongoing battles and cancel toxic matches.</p>
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
                    <TableHead>Mode</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {battles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No battles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    battles.map((battle) => (
                      <TableRow key={battle._id}>
                        <TableCell>
                          <Badge variant="outline">{battle.mode}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{battle.creator?.username || 'Unknown'}</TableCell>
                        <TableCell className="font-medium">{battle.opponent?.username || 'Waiting...'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              battle.status === 'WAITING' ? 'text-yellow-500 border-yellow-500/20' : 
                              battle.status === 'IN_PROGRESS' ? 'text-blue-500 border-blue-500/20' : 
                              battle.status === 'COMPLETED' ? 'text-green-500 border-green-500/20' :
                              'text-red-500 border-red-500/20'
                            }
                          >
                            {battle.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(battle.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="View Logs"><Eye className="h-4 w-4" /></Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Cancel Battle"
                              disabled={battle.status === 'COMPLETED' || battle.status === 'CANCELLED'}
                            >
                              <Ban className="h-4 w-4 text-red-500" />
                            </Button>
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

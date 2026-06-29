"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquareOff, Trash2, Lock } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminCommunityPage() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await api.get('/community/posts'); // Existing public endpoint
        setDiscussions(response.data.posts || response.data);
      } catch (error: any) {
        toast.error("Failed to fetch community data", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Moderation</h1>
          <p className="text-muted-foreground">Manage discussions, lock toxic threads, and handle reports.</p>
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
                    <TableHead>Discussion Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Votes / Comments</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discussions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No active discussions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    discussions.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell className="font-medium max-w-[300px] truncate">{post.title}</TableCell>
                        <TableCell className="text-muted-foreground">{post.author?.username || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.postType}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {post.upvotes?.length || 0} / {post.comments?.length || 0}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="Lock Discussion"><Lock className="h-4 w-4 text-orange-500" /></Button>
                            <Button variant="ghost" size="icon" title="Delete Post"><Trash2 className="h-4 w-4 text-red-500" /></Button>
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

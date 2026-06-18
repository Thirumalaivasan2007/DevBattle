"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit, Trash2, Eye } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get('/admin/problems');
        setProblems(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch problems", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problem Management</h1>
          <p className="text-muted-foreground">Add, edit, or delete coding challenges.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Problem
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
                    <TableHead>Title</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Accepted Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No problems found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    problems.map((problem) => (
                      <TableRow key={problem._id}>
                        <TableCell className="font-medium">{problem.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              problem.difficulty === 'Easy' ? 'text-green-500 border-green-500/20' : 
                              problem.difficulty === 'Medium' ? 'text-yellow-500 border-yellow-500/20' : 
                              'text-red-500 border-red-500/20'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {problem.tags?.slice(0, 2).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                            {problem.tags?.length > 2 && <span className="text-xs text-muted-foreground">+{problem.tags.length - 2}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {problem.totalSubmissions > 0 
                            ? Math.round((problem.acceptedSubmissions / problem.totalSubmissions) * 100) 
                            : 0}%
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="View/Test Cases"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" title="Edit Problem"><Edit className="h-4 w-4 text-blue-500" /></Button>
                            <Button variant="ghost" size="icon" title="Delete Problem"><Trash2 className="h-4 w-4 text-red-500" /></Button>
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

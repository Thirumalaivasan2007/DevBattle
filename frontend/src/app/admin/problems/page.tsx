'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProblems, deleteProblem } from '@/services/problemService';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProblemsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-problems', page],
    queryFn: () => fetchProblems({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProblem,
    onSuccess: () => {
      toast.success('Problem deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete problem');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Problems</h1>
            <p className="text-muted-foreground">Create, edit, and delete coding problems</p>
          </div>
          <Link href="/admin/problems/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Problem
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Acceptance</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.problems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No problems found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.problems.map((problem) => (
                    <TableRow key={problem._id}>
                      <TableCell className="font-medium">{problem.title}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            problem.difficulty === 'Easy' ? 'default' : 
                            problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
                          }
                          className={problem.difficulty === 'Easy' ? 'bg-success hover:bg-success/80 text-success-foreground' : ''}
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{problem.acceptanceRate.toFixed(2)}%</TableCell>
                      <TableCell>{problem.totalSubmissions}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/admin/problems/edit/${problem._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(problem._id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {data && data.pagination.pages > 1 && (
              <div className="flex justify-center items-center py-4 border-t border-border gap-2">
                <Button 
                  variant="outline" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">Page {page} of {data.pagination.pages}</span>
                <Button 
                  variant="outline" 
                  disabled={page === data.pagination.pages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

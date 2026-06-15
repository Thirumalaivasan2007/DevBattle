'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProblemBySlug, updateProblem } from '@/services/problemService';
import Navbar from '@/components/Navbar';
import ProblemForm from '@/components/admin/ProblemForm';
import { Problem } from '@/types/problem';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';

// Admin would need an endpoint to fetch by ID, but since we have getProblemBySlug, 
// and admin list returns problems with _id, we should fetch problem by ID to be safe
// We can just add a small local fetcher for ID since the main API might not have it yet
const fetchProblemById = async (id: string) => {
  // Try to fetch by ID using a custom route or slug
  // For this implementation, we will assume we can fetch by ID directly 
  // or we can just fetch all and find it (not ideal).
  // Wait, I didn't create GET /api/problems/:id, only /api/problems/:slug
  // Let's modify the backend later or just use the problems list data if it exists.
  // Actually, wait, getProblemBySlug is public. 
  // Let's create an API call here. The user will pass the problem _id. Let's assume we can fetch it via another route or we will just use the backend to fetch by ID.
  // Let's add GET /api/problems/admin/:id or modify the backend to support fetching by ID.
  // For now, let's assume we update the backend to allow fetching by ID as well on the slug route if it's a valid MongoID.
  // We will just do a standard apiClient.get(`/problems/id/${id}`) and I will update backend to support it.
  const { data } = await apiClient.get(`/problems/id/${id}`);
  return data;
};

export default function EditProblemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: problem, isLoading, isError } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => fetchProblemById(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Problem>) => updateProblem(id, data),
    onSuccess: () => {
      toast.success('Problem updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      queryClient.invalidateQueries({ queryKey: ['problem', id] });
      router.push('/admin/problems');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update problem');
    },
  });

  const handleSubmit = (data: Partial<Problem>) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/problems">
            <Button variant="ghost" className="mb-4 -ml-4 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Problems
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Problem</h1>
          <p className="text-muted-foreground">Modify existing coding challenge</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">Failed to load problem</div>
          ) : (
            <ProblemForm initialData={problem} onSubmit={handleSubmit} isLoading={mutation.isPending} />
          )}
        </div>
      </main>
    </div>
  );
}

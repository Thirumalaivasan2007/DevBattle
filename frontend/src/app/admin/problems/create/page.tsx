'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProblem } from '@/services/problemService';
import Navbar from '@/components/Navbar';
import ProblemForm from '@/components/admin/ProblemForm';
import { Problem } from '@/types/problem';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CreateProblemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      toast.success('Problem created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      router.push('/admin/problems');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create problem');
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
          <h1 className="text-3xl font-bold">Create New Problem</h1>
          <p className="text-muted-foreground">Add a new coding challenge to the platform</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <ProblemForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
        </div>
      </main>
    </div>
  );
}

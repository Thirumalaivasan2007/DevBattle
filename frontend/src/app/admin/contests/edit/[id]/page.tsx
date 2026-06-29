'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContestBySlug, updateContest } from '@/services/contestService';
import Navbar from '@/components/Navbar';
import ContestForm from '@/components/admin/ContestForm';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';

const fetchContestById = async (id: string) => {
  const { data } = await apiClient.get(`/contests/id/${id}`);
  return data;
};

export default function EditContestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: contest, isLoading, isError } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => fetchContestById(id),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => updateContest(id, data),
    onSuccess: () => {
      toast.success('Contest updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['contest', id] });
      router.push('/admin/contests');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update contest');
    },
  });

  const handleSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/contests">
            <Button variant="ghost" className="mb-4 -ml-4 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contests
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Contest</h1>
          <p className="text-muted-foreground">Modify existing coding competition</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">Failed to load contest</div>
          ) : (
            <ContestForm initialData={contest} onSubmit={handleSubmit} isLoading={mutation.isPending} />
          )}
        </div>
      </main>
    </div>
  );
}

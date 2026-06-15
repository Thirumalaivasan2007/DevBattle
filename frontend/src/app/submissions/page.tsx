'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Submission {
  _id: string;
  problemId: {
    _id: string;
    title: string;
    slug: string;
    difficulty: string;
  };
  language: string;
  verdict: string;
  runtime: number;
  memory: number;
  submittedAt: string;
}

const fetchSubmissions = async (): Promise<Submission[]> => {
  const { data } = await api.get('/submissions');
  return data;
};

export default function SubmissionsPage() {
  const { data: submissions, isLoading, isError } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: fetchSubmissions,
  });

  const getVerdictColor = (verdict: string) => {
    if (verdict === 'Accepted') return 'bg-success text-success-foreground hover:bg-success/80';
    if (verdict === 'Pending' || verdict === 'Running') return 'bg-warning text-warning-foreground hover:bg-warning/80';
    return 'bg-destructive text-destructive-foreground hover:bg-destructive/80';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
          <p className="text-muted-foreground">View your recent code executions and verdicts.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-destructive bg-destructive/10 rounded-lg p-6">
            <AlertCircle className="h-6 w-6 mr-2" />
            <p>Failed to load submissions. Please try again later.</p>
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-medium mb-2">No Submissions Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't submitted any solutions yet.</p>
            <Link href="/problems">
              <span className="text-primary hover:underline cursor-pointer">Explore Problems</span>
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Time Submitted</th>
                    <th className="px-6 py-4 font-medium">Problem</th>
                    <th className="px-6 py-4 font-medium">Verdict</th>
                    <th className="px-6 py-4 font-medium">Runtime</th>
                    <th className="px-6 py-4 font-medium">Memory</th>
                    <th className="px-6 py-4 font-medium">Language</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/problems/${sub.problemId.slug}`}>
                          <span className="font-medium hover:text-primary transition-colors cursor-pointer">
                            {sub.problemId.title}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`font-mono ${getVerdictColor(sub.verdict)}`}>
                          {sub.verdict}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">
                        {sub.runtime > 0 ? `${sub.runtime} ms` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">
                        {sub.memory > 0 ? `${sub.memory} KB` : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {sub.language}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

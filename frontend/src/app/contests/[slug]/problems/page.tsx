'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ContestProblemsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['contest', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/contests/${slug}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { contest, isRegistered } = data;

  if (contest.status !== 'RUNNING' && contest.status !== 'FINISHED' && contest.status !== 'ARCHIVED') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">The contest has not started yet.</h2>
        <Button onClick={() => router.push(`/contests/${slug}`)}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!isRegistered && contest.status === 'RUNNING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">You are not registered for this contest.</h2>
        <Button onClick={() => router.push(`/contests/${slug}`)}>Go Register</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{contest.title} - Problems</h1>
            <p className="text-muted-foreground">Select a problem to solve.</p>
          </div>
          <Link href={`/contests/${slug}/standings`}>
            <Button variant="outline">Live Standings</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {contest.problems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
              No problems have been added to this contest yet.
            </div>
          ) : (
            contest.problems.map((p: any) => (
              <Card key={p.problemId._id || p.problemId} className="border-border/50 bg-card/40 backdrop-blur hover:bg-card/60 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl font-mono shrink-0">
                      {p.label}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        Problem {p.label}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" /> Score: {p.score || 100}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => router.push(`/problems/${p.problemId.slug || p.problemId}?contest=${contest._id}`)}>
                    Solve <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Just an icon wrapper since Trophy isn't imported from lucide above
const Trophy = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
)

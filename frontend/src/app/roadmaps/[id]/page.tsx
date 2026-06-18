'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RoadmapDetailsPage() {
  const { id } = useParams();
  
  const { data: roadmap, isLoading: roadmapLoading } = useQuery({
    queryKey: ['roadmap', id],
    queryFn: async () => {
      const res = await apiClient.get(`/roadmaps/${id}`);
      return res.data;
    }
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me/stats');
      return res.data;
    }
  });

  if (roadmapLoading || statsLoading) {
    return <div className="text-center py-20">Loading Path...</div>;
  }

  if (!roadmap) {
    return <div className="text-center py-20">Roadmap not found.</div>;
  }

  // Calculate progress
  const solvedProblemIds = userStats?.solvedProblems || [];
  const totalProblems = roadmap.problems.length;
  let completedCount = 0;

  roadmap.problems.forEach((p: any) => {
    if (solvedProblemIds.includes(p._id)) completedCount++;
  });

  const progressPercentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Link href="/roadmaps">
        <Button variant="ghost" size="sm" className="-ml-3 mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Roadmaps
        </Button>
      </Link>

      <div className="bg-muted/30 border border-border rounded-xl p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CheckCircle2 className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex gap-2 items-center mb-4">
            <Badge variant={roadmap.difficulty === 'Beginner' ? 'default' : roadmap.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
              {roadmap.difficulty}
            </Badge>
            <Badge variant="outline">{roadmap.estimatedDuration}</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{roadmap.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">{roadmap.description}</p>
          
          <div className="bg-background/50 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Progress</p>
                <p className="text-2xl font-bold">{progressPercentage}%</p>
              </div>
              <p className="text-sm text-muted-foreground">{completedCount} of {totalProblems} Completed</p>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-in-out" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {roadmap.problems.map((problem: any, index: number) => {
          const isSolved = solvedProblemIds.includes(problem._id);
          
          return (
            <div key={problem._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                {isSolved ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>

              <Card className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] transition-all hover:shadow-md ${isSolved ? 'border-success/50 bg-success/5' : 'hover:border-primary/50'}`}>
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                      <Badge variant={problem.difficulty === 'Easy' ? 'default' : problem.difficulty === 'Medium' ? 'secondary' : 'destructive'} className="text-[10px] px-1 py-0 h-4">
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg">{problem.title}</h3>
                  </div>
                  
                  <Link href={`/problems/${problem.slug}`} className="shrink-0 w-full sm:w-auto">
                    <Button variant={isSolved ? 'outline' : 'default'} size="sm" className="w-full sm:w-auto">
                      {isSolved ? 'Review' : 'Solve'} <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

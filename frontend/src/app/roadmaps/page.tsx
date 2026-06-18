'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, BookOpen, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RoadmapsPage() {
  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: async () => {
      const res = await apiClient.get('/roadmaps');
      return res.data;
    }
  });

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Learning Paths</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Structured roadmaps to guide your learning journey. From absolute beginner to FAANG interview ready.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(3)].map((_, i) => (
             <Card key={i} className="animate-pulse h-64 bg-muted/20"></Card>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps?.map((roadmap: any) => (
            <Card key={roadmap._id} className="hover:border-primary/50 transition-all flex flex-col cursor-pointer hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Map className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={roadmap.difficulty === 'Beginner' ? 'default' : roadmap.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <CardTitle>{roadmap.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{roadmap.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{roadmap.problems.length} Problems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{roadmap.estimatedDuration}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/roadmaps/${roadmap._id}`} className="w-full">
                  <Button className="w-full" variant="outline">
                    View Path <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

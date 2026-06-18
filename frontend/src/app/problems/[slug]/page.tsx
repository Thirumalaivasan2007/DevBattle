'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProblemBySlug } from '@/services/problemService';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Tag, Building2, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Workspace from '@/components/workspace/Workspace';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityTabContent } from '@/components/CommunityTabContent';
import React from 'react';

export default function ProblemDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState('description');

  const { data: problem, isLoading, isError } = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => fetchProblemBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-3xl font-bold text-destructive mb-4">Problem Not Found</h1>
          <p className="text-muted-foreground mb-8">The problem you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/problems')}>Go Back to Problems</Button>
        </div>
      </div>
    );
  }

  const problemDescription = (
    <div className="w-full flex flex-col h-full">
      <div className="mb-4 shrink-0">
        <Link href="/problems">
          <Button variant="ghost" size="sm" className="-ml-3 mb-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Problems List
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-3">{problem.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Badge 
            variant={
              problem.difficulty === 'Easy' ? 'default' : 
              problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
            }
            className={problem.difficulty === 'Easy' ? 'bg-success hover:bg-success/80 text-success-foreground' : ''}
          >
            {problem.difficulty}
          </Badge>
          <Badge variant="outline">
            Acceptance: {problem.acceptanceRate?.toFixed(1) || '0.0'}%
          </Badge>
          <Badge variant="outline">
            Submissions: {problem.totalSubmissions}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3 shrink-0 bg-muted/50 border-b border-border/50 rounded-none h-12 p-1">
          <TabsTrigger value="description" className="data-[state=active]:bg-background">Description</TabsTrigger>
          <TabsTrigger value="solutions" className="data-[state=active]:bg-background">Solutions</TabsTrigger>
          <TabsTrigger value="discuss" className="data-[state=active]:bg-background">Discuss</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="flex-1 overflow-y-auto pt-6 focus-visible:outline-none">
          <div className="prose prose-invert max-w-none mb-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
          </div>

          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-6 mb-10">
              <h2 className="text-xl font-bold">Examples</h2>
              {problem.examples.map((ex: any, index: number) => (
                <div key={index} className="bg-muted/30 p-4 rounded-md font-mono text-sm border border-border/50">
                  <div className="mb-2"><span className="font-bold text-foreground">Input:</span> <span className="text-muted-foreground whitespace-pre-wrap">{ex.input}</span></div>
                  <div className="mb-2"><span className="font-bold text-foreground">Output:</span> <span className="text-muted-foreground whitespace-pre-wrap">{ex.output}</span></div>
                  {ex.explanation && (
                    <div><span className="font-bold text-foreground">Explanation:</span> <span className="text-muted-foreground">{ex.explanation}</span></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem.constraints && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Constraints</h2>
              <div className="bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-muted-foreground">
                {problem.constraints}
              </div>
            </div>
          )}

          <div className="space-y-6 border-t border-border pt-6 pb-20">
            {problem.tags && problem.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold flex items-center mb-2 text-muted-foreground">
                  <Tag className="h-4 w-4 mr-2" /> Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="hover:bg-primary/20 transition-colors cursor-pointer">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {problem.companyTags && problem.companyTags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold flex items-center mb-2 text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-2" /> Company Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.companyTags.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {problem.hints && problem.hints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Hints</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {problem.hints.map((hint: string, i: number) => <li key={i}>{hint}</li>)}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="solutions" className="flex-1 overflow-y-auto pt-6 focus-visible:outline-none">
           <CommunityTabContent problemId={problem._id} postType="SOLUTION" />
        </TabsContent>

        <TabsContent value="discuss" className="flex-1 overflow-y-auto pt-6 focus-visible:outline-none">
           <CommunityTabContent problemId={problem._id} postType="QUESTION" />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Workspace problemDescription={problemDescription} />
    </div>
  );
}

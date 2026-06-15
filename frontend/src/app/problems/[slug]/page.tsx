'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProblemBySlug } from '@/services/problemService';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Tag, Building2, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Workspace from '@/components/workspace/Workspace';

export default function ProblemDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

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
    <div className="w-full">
      <div className="mb-6">
        <Link href="/problems">
          <Button variant="ghost" size="sm" className="-ml-3 mb-4 text-muted-foreground">
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
            Acceptance: {problem.acceptanceRate.toFixed(1)}%
          </Badge>
          <Badge variant="outline">
            Submissions: {problem.totalSubmissions}
          </Badge>
        </div>
      </div>

      <div className="prose prose-invert max-w-none mb-10">
        <ReactMarkdown>{problem.description}</ReactMarkdown>
      </div>

      {problem.examples && problem.examples.length > 0 && (
        <div className="space-y-6 mb-10">
          <h2 className="text-xl font-bold">Examples</h2>
          {problem.examples.map((ex, index) => (
            <div key={index} className="bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm">
              <p className="mb-2"><strong className="text-foreground">Input:</strong> <span className="text-muted-foreground">{ex.input}</span></p>
              <p className="mb-2"><strong className="text-foreground">Output:</strong> <span className="text-muted-foreground">{ex.output}</span></p>
              {ex.explanation && (
                <p className="mt-2 text-muted-foreground"><strong className="text-foreground">Explanation:</strong> {ex.explanation}</p>
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
              {problem.tags.map(tag => (
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
              {problem.companyTags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {problem.hints && problem.hints.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Hints</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {problem.hints.map((hint, i) => <li key={i}>{hint}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Workspace problemDescription={problemDescription} />
    </div>
  );
}

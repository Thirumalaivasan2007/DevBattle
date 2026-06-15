import { Problem } from '@/types/problem';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link href={`/problems/${problem.slug}`}>
      <div className="bg-card border border-border p-4 rounded-lg hover:border-primary/50 transition-colors cursor-pointer flex justify-between items-center group">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{problem.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant={
                problem.difficulty === 'Easy' ? 'default' : 
                problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
              }
              className={problem.difficulty === 'Easy' ? 'bg-success hover:bg-success/80 text-success-foreground' : ''}
            >
              {problem.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Acceptance: {problem.acceptanceRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {problem.tags?.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          {problem.tags && problem.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">+{problem.tags.length - 3}</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

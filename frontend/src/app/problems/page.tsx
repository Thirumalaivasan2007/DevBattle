'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProblems } from '@/services/problemService';
import Navbar from '@/components/Navbar';
import ProblemCard from '@/components/problems/ProblemCard';
import ProblemFilters from '@/components/problems/ProblemFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

export default function ProblemsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [sort, setSort] = useState('newest');
  const [tags, setTags] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['problems', page, search, difficulty, sort, tags],
    queryFn: () => fetchProblems({ 
      page, 
      limit: 15, 
      search, 
      difficulty: difficulty === 'all' ? undefined : difficulty,
      sort,
      tags: tags || undefined,
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
            Coding Challenges
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sharpen your coding skills with our collection of algorithm and data structure problems.
          </p>
        </div>

        <div className="mb-8 bg-card border border-border p-4 rounded-xl shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search problems, topics, or companies..." 
                className="pl-10 h-12 text-base"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg">Search</Button>
          </form>

          <ProblemFilters 
            difficulty={difficulty} setDifficulty={setDifficulty}
            sort={sort} setSort={setSort}
            tags={tags} setTags={setTags}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {data?.problems.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-xl">
                <p className="text-xl text-muted-foreground">No problems found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearch(''); setSearchInput(''); setDifficulty('all'); setTags('');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              data?.problems.map((problem) => (
                <ProblemCard key={problem._id} problem={problem} />
              ))
            )}
            
            {data && data.pagination.pages > 1 && (
              <div className="flex justify-center items-center py-8 gap-4">
                <Button 
                  variant="outline" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <span className="font-medium text-muted-foreground">
                  Page {page} of {data.pagination.pages}
                </span>
                <Button 
                  variant="outline" 
                  disabled={page === data.pagination.pages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

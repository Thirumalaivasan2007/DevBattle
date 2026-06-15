import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ProblemFiltersProps {
  difficulty: string;
  setDifficulty: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  tags: string;
  setTags: (val: string) => void;
}

export default function ProblemFilters({
  difficulty, setDifficulty, sort, setSort, tags, setTags
}: ProblemFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select value={difficulty} onValueChange={(val) => setDifficulty(val || 'all')}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Difficulties</SelectItem>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(val) => setSort(val || 'newest')}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="most_solved">Most Solved</SelectItem>
          <SelectItem value="acceptance">Highest Acceptance</SelectItem>
        </SelectContent>
      </Select>

      <Input 
        placeholder="Filter by Tags (e.g. Array, DP)" 
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full sm:max-w-xs"
      />
    </div>
  );
}

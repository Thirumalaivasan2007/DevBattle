export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemExample {
  _id?: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  examples: ProblemExample[];
  testCases?: {
    input: string;
    output: string;
    isHidden: boolean;
  }[];
  hints: string[];
  editorial: string;
  tags: string[];
  companyTags: string[];
  acceptanceRate: number;
  totalSubmissions: number;
  successfulSubmissions: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProblems {
  problems: Problem[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

import { z } from 'zod';

export const exampleSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  explanation: z.string().optional(),
});

export const problemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  constraints: z.string().optional(),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  examples: z.array(exampleSchema).min(1, 'At least one example is required'),
  testCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      isHidden: z.boolean().default(false),
    })
  ).optional(),
  hints: z.array(z.string()).optional(),
  editorial: z.string().optional(),
  tags: z.array(z.string()).optional(),
  companyTags: z.array(z.string()).optional(),
});

export const updateProblemSchema = problemSchema.partial();

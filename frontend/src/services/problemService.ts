import apiClient from '@/lib/axios';
import { Problem, PaginatedProblems } from '@/types/problem';

interface FetchProblemsParams {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  tags?: string;
  company?: string;
  sort?: string;
}

export const fetchProblems = async (params: FetchProblemsParams): Promise<PaginatedProblems> => {
  const { data } = await apiClient.get('/problems', { params });
  return data;
};

export const fetchProblemBySlug = async (slug: string): Promise<Problem> => {
  const { data } = await apiClient.get(`/problems/${slug}`);
  return data;
};

export const createProblem = async (problemData: Partial<Problem>): Promise<Problem> => {
  const { data } = await apiClient.post('/problems', problemData);
  return data;
};

export const updateProblem = async (id: string, problemData: Partial<Problem>): Promise<Problem> => {
  const { data } = await apiClient.put(`/problems/${id}`, problemData);
  return data;
};

export const deleteProblem = async (id: string): Promise<void> => {
  await apiClient.delete(`/problems/${id}`);
};

import apiClient from '@/lib/axios';

export const fetchContests = async () => {
  const { data } = await apiClient.get('/contests');
  return data;
};

export const fetchContestBySlug = async (slug: string) => {
  const { data } = await apiClient.get(`/contests/${slug}`);
  return data;
};

export const createContest = async (contestData: any) => {
  const { data } = await apiClient.post('/contests', contestData);
  return data;
};

export const updateContest = async (id: string, contestData: any) => {
  const { data } = await apiClient.put(`/contests/${id}`, contestData);
  return data;
};

export const deleteContest = async (id: string) => {
  await apiClient.delete(`/contests/${id}`);
};

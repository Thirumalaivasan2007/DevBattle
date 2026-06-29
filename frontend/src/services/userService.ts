import api from '../lib/axios';

export const getUserProfile = async (username: string) => {
  const response = await api.get(`/users/profile/${username}`);
  return response.data;
};

export const searchUsers = async (query: string, page = 1, limit = 20) => {
  const response = await api.get(`/users/search?q=${query}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserStats = async (username: string) => {
  const response = await api.get(`/users/${username}/stats`);
  return response.data;
};

export const getUserActivity = async (username: string, limit = 20) => {
  const response = await api.get(`/users/${username}/activity?limit=${limit}`);
  return response.data;
};

export const getUserHeatmap = async (username: string) => {
  const response = await api.get(`/users/${username}/heatmap`);
  return response.data;
};

export const getUserAchievements = async (username: string) => {
  const response = await api.get(`/users/${username}/achievements`);
  return response.data;
};

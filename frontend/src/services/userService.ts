import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const getUserProfile = async (username: string) => {
  const response = await axios.get(`${API_URL}/profile/${username}`);
  return response.data;
};

export const searchUsers = async (query: string, page = 1, limit = 20) => {
  const response = await axios.get(`${API_URL}/search?q=${query}&page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserStats = async (username: string) => {
  const response = await axios.get(`${API_URL}/${username}/stats`);
  return response.data;
};

export const getUserActivity = async (username: string, limit = 20) => {
  const response = await axios.get(`${API_URL}/${username}/activity?limit=${limit}`);
  return response.data;
};

export const getUserHeatmap = async (username: string) => {
  const response = await axios.get(`${API_URL}/${username}/heatmap`);
  return response.data;
};

export const getUserAchievements = async (username: string) => {
  const response = await axios.get(`${API_URL}/${username}/achievements`);
  return response.data;
};

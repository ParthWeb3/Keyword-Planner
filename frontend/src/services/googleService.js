import axiosInstance from './axiosInstance';

export const fetchGoogleTrends = async (keyword) => {
  try {
    const response = await axiosInstance.get(`/google-trends?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Google trends:', error);
    throw error;
  }
};

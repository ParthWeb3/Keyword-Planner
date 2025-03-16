import axiosInstance from './axiosInstance';

export const fetchGoogleAdsData = async () => {
  try {
    const response = await axiosInstance.get('/keywords/google-ads');
    return response.data;
  } catch (error) {
    console.error('Error fetching Google Ads data:', error);
    throw error;
  }
};

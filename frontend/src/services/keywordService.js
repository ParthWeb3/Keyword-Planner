// src/services/keywordService.js
import axiosInstance from './axiosInstance';

export const getKeywords = async () => {
  try {
    const response = await axiosInstance.get('/keywords');
    return response.data;
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error;
  }
};

export const searchKeywords = async (term) => {
  try {
    const response = await axiosInstance.get(`/keywords/suggestions?term=${term}`);
    return response.data;
  } catch (error) {
    console.error('Error searching keywords:', error);
    throw error;
  }
};

export const getKeywordByTerm = async (term) => {
  try {
    const response = await axiosInstance.get(`/keywords/${term}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching keyword details:', error);
    throw error;
  }
};

export const createKeyword = async (keywordData) => {
  try {
    const response = await axiosInstance.post('/keywords', keywordData);
    return response.data;
  } catch (error) {
    console.error('Error creating keyword:', error);
    throw error;
  }
};

export const getKeywordTrends = async (keywordId) => {
  try {
    const response = await axiosInstance.get(`/keywords/trends/${keywordId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
};
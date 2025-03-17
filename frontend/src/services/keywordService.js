// src/services/keywordService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getKeywords = async () => {
  try {
    const response = await axios.get(`${API_URL}/keywords`);
    return response.data;
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error;
  }
};

export const searchKeywords = async (term) => {
  try {
    const response = await axios.get(`${API_URL}/keywords/suggestions?term=${term}`);
    return response.data;
  } catch (error) {
    console.error('Error searching keywords:', error);
    throw error;
  }
};

export const getKeywordByTerm = async (term) => {
  try {
    const response = await axios.get(`${API_URL}/keywords/${term}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching keyword details:', error);
    throw error;
  }
};

export const createKeyword = async (keywordData) => {
  try {
    const response = await axios.post(`${API_URL}/keywords`, keywordData);
    return response.data;
  } catch (error) {
    console.error('Error creating keyword:', error);
    throw error;
  }
};

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const keywordService = {
  getKeywords: (params) => api.get('/keywords', { params }),
  getKeywordDetails: (id) => api.get(`/keywords/${id}`),
  createKeyword: (data) => api.post('/keywords', data),
  updateKeyword: (id, data) => api.put(`/keywords/${id}`, data),
  deleteKeyword: (id) => api.delete(`/keywords/${id}`),
};

export const trendsService = {
  getTrends: (params) => api.get('/trends', { params }),
  getTrendDetails: (id) => api.get(`/trends/${id}`),
  createTrend: (data) => api.post('/trends', data),
  updateTrend: (id, data) => api.put(`/trends/${id}`, data),
  deleteTrend: (id) => api.delete(`/trends/${id}`),
};

export default api; 
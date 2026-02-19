import axios from 'axios';
import { API_URL } from '../composables/apiConfig';

// Creates a shared Axios client configured with the project's base API URL.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  // Adds the auth token to outgoing requests when available.
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // Propagates request setup errors to the caller.
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  // Returns successful responses without modification.
  (response) => response,
  // Handles unauthorized responses and forwards other API errors.
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

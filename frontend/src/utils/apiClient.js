// Get the correct API base URL based on environment
const getApiBaseUrl = () => {
  // In production on Vercel, use the full backend URL
  if (import.meta.env.PROD) {
    return 'https://globe-link.onrender.com/api';
  }
  // In development, use relative path (proxy handles it)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  return response;
};

export { API_BASE_URL };

/**
 * API utility for handling base URL configuration
 * 
 * Both Development and Production:
 * - Use relative URLs (/api/*)
 * - Let proxy/rewrites handle routing to backend
 * 
 * Development (Vite):
 * - vite.config.js proxy with changeOrigin: true
 * 
 * Production (Vercel):
 * - vercel.json rewrites handle routing
 */

export const getApiBaseUrl = () => {
  // Always use relative URLs - proxying/rewrites will handle routing
  return '';
};

/**
 * Fetch helper with proper headers
 */
export const api = (endpoint, options = {}) => {
  const url = endpoint; // Relative URL - proxy will handle it

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for cross-origin requests
  });
};

export default api;

// Construct full image URL for backend files
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  // Use backend API URL from environment or default
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  return `${backendUrl}${imagePath}`;
};

// Get image with fallback
export const getImageWithFallback = (imagePath, fallback = '/api/placeholder') => {
  return imagePath ? getImageUrl(imagePath) : fallback;
};

// Check if the image is a base64 data URL
export const isBase64Image = (str) => {
  if (!str) return false;
  return str.startsWith('data:image/') || str.startsWith('data:video/');
};

// Construct full image URL for backend files or return base64 directly
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a base64 data URL, return it directly
  if (isBase64Image(imagePath)) {
    return imagePath;
  }
  
  // If it's an external URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Legacy support: Use backend API URL from environment or default
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://globe-link.onrender.com';
  // Remove trailing slash from backend URL and leading slash from imagePath
  const cleanBackendUrl = backendUrl.replace(/\/$/, '');
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${cleanBackendUrl}${cleanImagePath}`;
};

// Get image with fallback
export const getImageWithFallback = (imagePath, fallback = null) => {
  const url = getImageUrl(imagePath);
  return url || fallback;
};

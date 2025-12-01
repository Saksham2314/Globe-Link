// Get avatar based on user's gender for consistency (returns dicebear avatar as fallback)
export const getAvatarUrl = (user) => {
  // Use gender-based avatar styles for consistency
  const genderStyles = {
    male: 'pixel-art', // More masculine style
    female: 'lorelei',   // More feminine style
    other: 'avataaars'   // Neutral style
  };
  
  const style = genderStyles[user?.gender] || 'avataaars';
  const seed = user?.name || user?._id || 'default';
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&scale=80`;
};

// Color coding for user types
export const getUserColor = (userType) => {
  return userType === 'traveler' ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600';
};

// Format date in a nice way
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

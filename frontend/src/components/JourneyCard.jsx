import { MapPin, MessageCircle, User, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getImageUrl, getAvatarUrl, API_BASE_URL } from '../utils/index.js';

export default function JourneyCard({ journey }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const handleCardClick = () => {
    navigate(`/journey/${journey._id}`);
  };

  const handleSaveJourney = async (e) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (user.userType !== 'seeker') {
        alert('Only seekers can save journeys');
        return;
      }
      
      const endpoint = isSaved ? `${API_BASE_URL}/journeys/unsave` : `${API_BASE_URL}/journeys/save`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ journeyId: journey._id })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSaved(!isSaved);
      } else {
        alert(data.message || 'Failed to save journey');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="card p-3 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform"
    >
      {/* Images Preview */}
      {journey.images && journey.images.length > 0 && (
        <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden h-32 sm:h-48 bg-gray-200">
          <img 
            src={getImageUrl(journey.images[0])} 
            alt={journey.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Title and Budget */}
      <div className="flex justify-between items-start mb-2 sm:mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-bold text-gray-900 line-clamp-2">{journey.title}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{journey.duration} days</p>
        </div>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap ${
          journey.budget === 'budget' ? 'bg-green-100 text-green-800' :
          journey.budget === 'moderate' ? 'bg-blue-100 text-blue-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {journey.budget}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-2">{journey.description}</p>
      
      {/* Location */}
      <div className="flex items-center gap-2 mb-2 sm:mb-4 text-xs sm:text-sm text-gray-600">
        <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="truncate">{journey.startLocation} → {journey.endLocation}</span>
      </div>

      {/* Views */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
        <Eye size={14} className="sm:w-4 sm:h-4" />
        <span>{journey.views || 0} views</span>
      </div>
      
      {/* Highlights */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
        {journey.highlights?.slice(0, 2).map((highlight, idx) => (
          <span key={idx} className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium line-clamp-1">
            {highlight}
          </span>
        ))}
        {journey.highlights?.length > 2 && (
          <span className="text-gray-500 text-xs">+{journey.highlights.length - 2}</span>
        )}
      </div>
      
      {/* Footer with Traveler and Actions */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
        {/* Traveler Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img 
            src={journey.traveler?.profileImage ? getImageUrl(journey.traveler.profileImage) : getAvatarUrl(journey.traveler)} 
            alt={journey.traveler?.name}
            className="w-6 sm:w-8 h-6 sm:h-8 rounded-full flex-shrink-0 object-cover"
            onError={(e) => {
              e.target.src = getAvatarUrl(journey.traveler);
            }}
          />
          <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{journey.traveler?.name}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={handleSaveJourney}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
              isSaved 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
            }`}
            title={isSaved ? 'Unsave journey' : 'Save journey'}
          >
            <Heart size={16} className="sm:w-4 sm:h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/journey/${journey._id}`);
            }}
            className="flex items-center gap-1 sm:gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors flex-shrink-0 text-xs sm:text-sm font-semibold"
          >
            <MessageCircle size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">View</span>
          </button>
        </div>
      </div>
    </div>
  );
}

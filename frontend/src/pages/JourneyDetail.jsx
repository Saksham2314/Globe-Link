import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, MessageCircle, Loader, Play, ImageIcon } from 'lucide-react';
import { getImageUrl, getAvatarUrl } from '../utils/index.js';

export default function JourneyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const viewCountedRef = useRef(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!viewCountedRef.current) {
      fetchJourney();
      viewCountedRef.current = true;
    }
  }, [id]);

  const fetchJourney = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/journeys/${id}`, {
        method: 'GET',
        headers
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch journey');
      }

      setJourney(data.journey);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setCreatingChat(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantId: journey.traveler._id,
          journeyId: id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create chat');
      }

      // Navigate to chats page with the new chat selected
      navigate('/chats');
    } catch (err) {
      alert('Error starting chat: ' + err.message);
    } finally {
      setCreatingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
          {error || 'Journey not found'}
        </div>
      </div>
    );
  }

  const startDate = new Date(journey.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const endDate = new Date(journey.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const hasMedia = (journey.images && journey.images.length > 0) || (journey.videos && journey.videos.length > 0);
  const allMedia = [...(journey.images || []), ...(journey.videos || [])];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Media Section */}
          {hasMedia && (
            <div className="relative bg-black">
              <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
                <img 
                  src={getImageUrl(allMedia[selectedImage])} 
                  alt="Journey" 
                  className="max-h-96 max-w-full object-contain"
                  onError={(e) => e.target.src = '/api/placeholder'}
                />
              </div>
              
              {/* Media Navigation */}
              {allMedia.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {allMedia.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === selectedImage ? 'bg-white w-8' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Media Thumbnails */}
              {allMedia.length > 1 && (
                <div className="bg-black p-3 flex gap-2 overflow-x-auto">
                  {allMedia.map((media, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 relative rounded border-2 transition-colors ${
                        idx === selectedImage ? 'border-blue-500' : 'border-gray-600'
                      }`}
                    >
                      <img 
                        src={getImageUrl(media)} 
                        alt="Thumbnail" 
                        className="w-16 h-16 object-cover"
                        onError={(e) => e.target.src = '/api/placeholder'}
                      />
                      {media.includes('mp4') || media.includes('webm') || media.includes('mov') ? (
                        <Play size={20} className="absolute inset-0 m-auto text-white" />
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">{journey.title}</h1>
            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{journey.startLocation} → {journey.endLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>{startDate} to {endDate}</span>
              </div>
              <span className={`px-4 py-1 rounded-full font-semibold ${
                journey.budget === 'budget' ? 'bg-green-500' :
                journey.budget === 'moderate' ? 'bg-blue-500' :
                'bg-purple-500'
              }`}>
                {journey.budget?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Journey</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{journey.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                <p className="text-2xl font-bold text-blue-600">{journey.duration} days</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                <h3 className="font-semibold text-gray-900 mb-2">Views</h3>
                <p className="text-2xl font-bold text-green-600">{journey.views}</p>
              </div>
              {journey.rating && (
                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
                  <h3 className="font-semibold text-gray-900 mb-2">Rating</h3>
                  <p className="text-2xl font-bold text-yellow-600">⭐ {journey.rating}/5</p>
                </div>
              )}
            </div>

            {/* Highlights */}
            {journey.highlights && journey.highlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
                <div className="flex flex-wrap gap-3">
                  {journey.highlights.map((highlight, idx) => (
                    <span key={idx} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full font-medium hover:shadow-md transition-shadow">
                      ✓ {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Transportation */}
            {journey.transportation && journey.transportation.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Transportation</h2>
                <div className="flex flex-wrap gap-3">
                  {journey.transportation.map((transport, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
                      🚗 {transport}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Traveler Info & Chat */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet the Traveler</h2>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl border-2 border-blue-200">
                <img
                  src={getImageUrl(journey.traveler?.profileImage) || getAvatarUrl(journey.traveler)}
                  alt={journey.traveler?.name}
                  className="w-24 h-24 rounded-full shadow-lg object-cover"
                  onError={(e) => e.target.src = getAvatarUrl(journey.traveler)}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{journey.traveler?.name}</h3>
                  {journey.traveler?.bio && (
                    <p className="text-gray-600 mt-2">{journey.traveler.bio}</p>
                  )}
                  {journey.traveler?.location && (
                    <p className="text-gray-500 flex items-center gap-2 mt-3">
                      <MapPin size={18} />
                      <span>{journey.traveler.location}</span>
                    </p>
                  )}
                  {journey.traveler?.gender && (
                    <p className="text-gray-500 mt-2">
                      <span className="font-medium">Gender:</span> {journey.traveler.gender}
                    </p>
                  )}
                </div>
                
                {/* Chat Button - Only show for seekers or non-travelers */}
                {currentUser?.userType === 'seeker' || currentUser?.id !== journey.traveler?._id ? (
                  <button 
                    onClick={startChat}
                    disabled={creatingChat}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <MessageCircle size={22} />
                    <span>{creatingChat ? 'Starting...' : 'Chat with Traveler'}</span>
                  </button>
                ) : (
                  <div className="text-gray-600 italic">This is your journey</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

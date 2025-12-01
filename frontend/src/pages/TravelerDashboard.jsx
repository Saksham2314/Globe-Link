import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plane, MessageSquare, Eye, Trash2, Edit2 } from 'lucide-react';
import { getImageUrl, getAvatarUrl } from '../utils/index.js';
import { getApiBaseUrl } from '../utils/api';

export default function TravelerDashboard() {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [stats, setStats] = useState({
    totalJourneys: 0,
    totalViews: 0,
    totalMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      
      // Fetch journeys
      const journeyResponse = await fetch(`${baseUrl}/api/journeys/my-journeys`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const journeyData = await journeyResponse.json();
      if (!journeyResponse.ok) throw new Error(journeyData.message);

      setJourneys(journeyData.journeys || []);
      
      // Fetch chats to count messages
      const chatResponse = await fetch(`${baseUrl}/api/chats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const chatData = await chatResponse.json();
      
      // Calculate stats
      let totalViews = 0;
      let totalMessages = 0;
      
      journeyData.journeys?.forEach(journey => {
        totalViews += journey.views || 0;
      });
      
      // Count total messages from all chats
      if (chatData.chats && Array.isArray(chatData.chats)) {
        chatData.chats.forEach(chat => {
          totalMessages += chat.messages?.length || 0;
        });
      }

      setStats({
        totalJourneys: journeyData.journeys?.length || 0,
        totalViews,
        totalMessages
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteJourney = async (id) => {
    if (!confirm('Are you sure you want to delete this journey?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/journeys/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete');
      setJourneys(journeys.filter(j => j._id !== id));
    } catch (err) {
      alert('Error deleting journey: ' + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Traveler Dashboard</h1>
        <p className="text-xs sm:text-base text-gray-600 mb-6 sm:mb-10">Manage and track your journeys</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Journeys</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalJourneys}</p>
              </div>
              <Plane className="text-blue-500 w-8 sm:w-10 h-8 sm:h-10 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Views</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalViews}</p>
              </div>
              <Eye className="text-green-500 w-8 sm:w-10 h-8 sm:h-10 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Messages</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalMessages}</p>
              </div>
              <MessageSquare className="text-purple-500 w-8 sm:w-10 h-8 sm:h-10 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Journeys List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Journeys</h2>
          </div>

          {journeys.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-base">
              <p>No journeys yet. <a href="/post-journey" className="text-blue-600 font-semibold">Post your first journey</a></p>
            </div>
          ) : (
            <div className="divide-y">
              {journeys.map(journey => (
                <div key={journey._id} className="p-3 sm:p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{journey.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-base text-gray-600 flex-wrap">
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <MapPin size={14} className="sm:w-4 sm:h-4" />
                          <span className="truncate">{journey.startLocation} → {journey.endLocation}</span>
                        </div>
                        <span className="flex-shrink-0">{journey.duration} days</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                          <span>{journey.views} views</span>
                        </div>
                      </div>
                      {journey.images && journey.images.length > 0 && (
                        <div className="flex gap-1.5 sm:gap-2 mt-3 overflow-x-auto">
                          {journey.images.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={getImageUrl(img)} 
                              alt="Journey" 
                              className="w-12 sm:w-16 h-12 sm:h-16 rounded object-cover flex-shrink-0" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                      <button 
                        onClick={() => navigate(`/edit-journey/${journey._id}`)}
                        className="p-1.5 sm:p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                        title="Edit journey"
                      >
                        <Edit2 size={18} className="sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        onClick={() => deleteJourney(journey._id)}
                        className="p-1.5 sm:p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                        title="Delete journey"
                      >
                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

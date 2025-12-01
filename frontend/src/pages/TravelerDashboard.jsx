import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plane, MessageSquare, Eye, Trash2, Edit2 } from 'lucide-react';
import { getImageUrl, getAvatarUrl } from '../utils/index.js';

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
      
      // Fetch journeys
      const journeyResponse = await fetch('/api/journeys/my-journeys', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const journeyData = await journeyResponse.json();
      if (!journeyResponse.ok) throw new Error(journeyData.message);

      setJourneys(journeyData.journeys || []);
      
      // Fetch chats to count messages
      const chatResponse = await fetch('/api/chats', {
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
      const response = await fetch(`/api/journeys/${id}`, {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Traveler Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage and track your journeys</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Journeys</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalJourneys}</p>
              </div>
              <Plane className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <Eye className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMessages}</p>
              </div>
              <MessageSquare className="text-purple-500" size={40} />
            </div>
          </div>
        </div>

        {/* Journeys List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Your Journeys</h2>
          </div>

          {journeys.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No journeys yet. <a href="/post-journey" className="text-blue-600 font-semibold">Post your first journey</a></p>
            </div>
          ) : (
            <div className="divide-y">
              {journeys.map(journey => (
                <div key={journey._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{journey.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{journey.startLocation} → {journey.endLocation}</span>
                        </div>
                        <span>{journey.duration} days</span>
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          <span>{journey.views} views</span>
                        </div>
                      </div>
                      {journey.images && journey.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {journey.images.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={getImageUrl(img)} 
                              alt="Journey" 
                              className="w-16 h-16 rounded object-cover" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/edit-journey/${journey._id}`)}
                        className="p-2 hover:bg-blue-100 rounded text-blue-600"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => deleteJourney(journey._id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 size={20} />
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

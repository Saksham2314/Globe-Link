import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import { getImageUrl, getAvatarUrl } from '../utils/index.js';
import { getApiBaseUrl } from '../utils/api';

export default function SeekerDashboard() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalJourneysViewed: 0,
    totalFavorites: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh dashboard every 3 seconds to show updated message counts
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      
      // Fetch chats
      const chatResponse = await fetch(`${baseUrl}/api/chats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const chatData = await chatResponse.json();
      if (!chatResponse.ok) throw new Error(chatData.message);

      // Fetch fresh message data for each chat
      const chatsWithMessages = await Promise.all(
        (chatData.chats || []).map(async (chat) => {
          try {
            const messageResponse = await fetch(`${baseUrl}/api/chats/${chat._id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const messageData = await messageResponse.json();
            if (messageResponse.ok) {
              return { ...chat, messages: messageData.chat?.messages || chat.messages || [] };
            }
          } catch (err) {
            console.error(`Error fetching messages for chat ${chat._id}:`, err);
          }
          return chat;
        })
      );

      setChats(chatsWithMessages);
      
      // Fetch saved journeys count
      const savedResponse = await fetch(`${baseUrl}/api/journeys/saved/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const savedData = await savedResponse.json();
      const totalFavorites = savedData.count || 0;
      
      // Fetch viewed journeys count
      const viewedResponse = await fetch(`${baseUrl}/api/journeys/viewed/count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const viewedData = await viewedResponse.json();
      const totalJourneysViewed = viewedData.count || 0;
      
      setStats({
        totalChats: chatsWithMessages?.length || 0,
        totalJourneysViewed,
        totalFavorites
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Seeker Dashboard</h1>
        <p className="text-xs sm:text-base text-gray-600 mb-6 sm:mb-10">Track your journey discoveries and connections</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Active Chats</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalChats}</p>
              </div>
              <MessageSquare className="text-blue-500 w-8 sm:w-10 h-8 sm:h-10 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Journeys Viewed</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalJourneysViewed}</p>
              </div>
              <TrendingUp className="text-orange-500 w-8 sm:w-10 h-8 sm:h-10 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Saved Journeys</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalFavorites}</p>
              </div>
              <Heart className="text-red-500 w-8 sm:w-10 h-8 sm:h-10 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Chats List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Conversations</h2>
          </div>

          {chats.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-base">
              <p>No chats yet. <a href="/journeys" className="text-blue-600 font-semibold">Browse journeys</a> and start chatting!</p>
            </div>
          ) : (
            <div className="divide-y">
              {chats.map(chat => {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const otherParticipant = chat.participants?.find(p => p._id !== currentUser.id);
                const messageCount = Array.isArray(chat.messages) ? chat.messages.length : 0;
                
                return (
                  <div key={chat._id} className="p-3 sm:p-6 hover:bg-gray-50 transition cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          {otherParticipant && (
                            <>
                              <img 
                                src={otherParticipant?.profileImage ? getImageUrl(otherParticipant.profileImage) : getAvatarUrl(otherParticipant)} 
                                alt={otherParticipant?.name}
                                className="w-8 sm:w-8 h-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = getAvatarUrl(otherParticipant);
                                }}
                              />
                              <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">{otherParticipant?.name}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {messageCount} message{messageCount !== 1 ? 's' : ''}
                        </p>
                        {chat.messages && chat.messages.length > 0 && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-1">
                            {chat.messages[chat.messages.length - 1]?.content?.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => navigate('/chats', { state: { chatId: chat._id } })}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 sm:p-2 rounded-lg transition flex-shrink-0"
                      >
                        <MessageSquare size={20} className="sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

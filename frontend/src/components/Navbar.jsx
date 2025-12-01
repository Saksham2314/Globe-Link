import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { MapPin, MessageSquare, LogOut, Plus, BarChart3, Moon, Sun } from 'lucide-react';
import { getImageUrl, getAvatarUrl } from '../utils/index.js';
import { ThemeContext } from '../context/ThemeContext';
import { getApiBaseUrl } from '../utils/api';

export default function Navbar({ user, onLogout }) {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.isDark || false;
  const toggleTheme = themeContext?.toggleTheme || (() => {});
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Refresh unread count every 3 seconds
      const interval = setInterval(fetchUnreadCount, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/chats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok && data.chats) {
        let totalMessages = 0;
        data.chats.forEach(chat => {
          totalMessages += chat.messages?.length || 0;
        });
        setUnreadCount(totalMessages);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };
  
  const getDashboardLink = () => {
    if (!user) return null;
    return user.userType === 'traveler' ? '/dashboard/traveler' : '/dashboard/seeker';
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 dark:text-blue-400">
            <MapPin size={28} />
            <span>Globe Link</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/journeys" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Journeys
            </Link>
            {user && (
              <>
                <Link to="/chats" className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  <MessageSquare size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to={getDashboardLink()} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  <BarChart3 size={20} />
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user?.userType === 'traveler' && (
              <Link to="/post-journey" className="flex items-center gap-2 btn-primary text-sm">
                <Plus size={18} />
                Post Journey
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <img 
                  src={user.profileImage ? getImageUrl(user.profileImage) : getAvatarUrl(user)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400 hover:border-blue-700 dark:hover:border-blue-500 transition-colors cursor-default"
                  onError={(e) => {
                    e.target.src = getAvatarUrl(user);
                  }}
                />
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

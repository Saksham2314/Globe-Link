import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { MapPin, MessageSquare, LogOut, Plus, BarChart3, Moon, Sun, Menu, X } from 'lucide-react';
import { getImageUrl, getAvatarUrl } from '../utils/index.js';
import { ThemeContext } from '../context/ThemeContext';
import { getApiBaseUrl } from '../utils/api';

export default function Navbar({ user, onLogout }) {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.isDark || false;
  const toggleTheme = themeContext?.toggleTheme || (() => {});
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-blue-600 dark:text-blue-400" onClick={closeMobileMenu}>
            <MapPin size={24} className="sm:w-28 sm:h-28" />
            <span className="hidden sm:inline">Globe Link</span>
          </Link>
          
          {/* Desktop Menu */}
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
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
              title="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4 space-y-3">
            <Link 
              to="/journeys" 
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              onClick={closeMobileMenu}
            >
              Journeys
            </Link>

            {user && (
              <>
                <Link 
                  to="/chats" 
                  className="flex items-center justify-between px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                <Link 
                  to={getDashboardLink()} 
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>

                {user.userType === 'traveler' && (
                  <Link 
                    to="/post-journey" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    onClick={closeMobileMenu}
                  >
                    <Plus size={18} />
                    Post Journey
                  </Link>
                )}

                <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                  <div className="flex items-center gap-3 px-4 py-2 mb-3">
                    <img 
                      src={user.profileImage ? getImageUrl(user.profileImage) : getAvatarUrl(user)}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400"
                      onError={(e) => {
                        e.target.src = getAvatarUrl(user);
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      onLogout();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            )}

            {!user && (
              <Link 
                to="/login" 
                className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

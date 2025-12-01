import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Loader, X, Send } from 'lucide-react';
import { getImageUrl, getAvatarUrl } from '../utils/index.js';
import { getApiBaseUrl } from '../utils/api';

export default function Chats() {
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chats.length > 0 && location.state?.chatId) {
      const chat = chats.find(c => c._id === location.state.chatId);
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [chats, location.state?.chatId]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      // Refresh messages every 2 seconds to get new messages
      const interval = setInterval(() => {
        fetchMessages(selectedChat._id);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/chats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch chats');
      }

      setChats(data.chats || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.chat?.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/chats/${selectedChat._id}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newMessage })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages([...messages, data.message]);
        setNewMessage('');
        // Refresh chats list to update message count
        fetchChats();
      }
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants?.find(p => p._id !== currentUser.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 h-[calc(100vh-120px)] sm:h-[calc(100vh-150px)]">
          {/* Chats List */}
          <div className={`bg-white rounded-lg shadow overflow-hidden flex flex-col ${selectedChat && 'hidden md:flex'}`}>
            <div className="p-3 sm:p-4 border-b">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h2>
            </div>

            {error && (
              <div className="bg-red-50 border-b border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                {error}
              </div>
            )}

            {chats.length > 0 ? (
              <div className="flex-1 overflow-y-auto">
                {chats.map(chat => {
                  const other = getOtherParticipant(chat);
                  const isSelected = selectedChat?._id === chat._id;
                  return (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-2.5 sm:p-4 border-b cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                    <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={other?.profileImage ? getImageUrl(other.profileImage) : getAvatarUrl(other)}
                          alt={other?.name}
                          className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = getAvatarUrl(other);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{other?.name}</p>
                          <p className="text-xs text-gray-500 truncate line-clamp-1">
                            {chat.messages?.length > 0 
                              ? chat.messages[chat.messages.length - 1]?.content 
                              : 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-xs sm:text-base">
                <p>No conversations yet</p>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className={`md:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col ${!selectedChat && 'hidden md:flex'}`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-2.5 sm:p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <img
                      src={getOtherParticipant(selectedChat)?.profileImage ? getImageUrl(getOtherParticipant(selectedChat).profileImage) : getAvatarUrl(getOtherParticipant(selectedChat))}
                      alt={getOtherParticipant(selectedChat)?.name}
                      className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = getAvatarUrl(getOtherParticipant(selectedChat));
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{getOtherParticipant(selectedChat)?.name}</p>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-1 sm:gap-2 ${msg.sender?._id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender?._id !== currentUser.id && (
                          <img
                            src={msg.sender?.profileImage ? getImageUrl(msg.sender.profileImage) : getAvatarUrl(msg.sender)}
                            alt={msg.sender?.name}
                            className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = getAvatarUrl(msg.sender);
                            }}
                          />
                        )}
                        <div
                          className={`max-w-xs sm:max-w-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${
                            msg.sender?._id === currentUser.id
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                        </div>
                        {msg.sender?._id === currentUser.id && (
                          <img
                            src={currentUser.profileImage ? getImageUrl(currentUser.profileImage) : getAvatarUrl(currentUser)}
                            alt={currentUser.name}
                            className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = getAvatarUrl(currentUser);
                            }}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-base">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-2.5 sm:p-4 border-t flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-2.5 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    <Send size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-base">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

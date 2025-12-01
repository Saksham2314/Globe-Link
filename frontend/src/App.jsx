import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJourney from './pages/PostJourney';
import EditJourney from './pages/EditJourney';
import JourneyDetail from './pages/JourneyDetail';
import Chats from './pages/Chats';
import TravelerDashboard from './pages/TravelerDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Listen for storage changes (profile updates)
    const handleStorageChange = (e) => {
      if (e.key === 'user' && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journeys" element={<Home />} />
        <Route path="/journey/:id" element={<JourneyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-journey" element={<PostJourney />} />
        <Route path="/edit-journey/:id" element={<EditJourney />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/dashboard/traveler" element={<TravelerDashboard />} />
        <Route path="/dashboard/seeker" element={<SeekerDashboard />} />
      </Routes>
    </Router>
  );
}

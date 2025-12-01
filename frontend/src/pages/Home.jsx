import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import JourneyCard from '../components/JourneyCard';
import { Loader } from 'lucide-react';
import { getApiBaseUrl } from '../utils/api';

export default function Home() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/journeys${params ? '?' + params : ''}`;
      console.log('Fetching with filters:', filters);
      console.log('Generated URL:', url);
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch journeys');
      }

      setJourneys(data.journeys);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    fetchJourneys(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Hero />

      <div id="search-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin" size={40} />
          </div>
        ) : journeys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map(journey => (
              <JourneyCard key={journey._id} journey={journey} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No journeys found. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Search, Filter, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ onSearch, onFilter }) {
  const [search, setSearch] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [filterMode, setFilterMode] = useState('keyword'); // 'keyword' or 'location'

  const handleSearch = (e) => {
    e.preventDefault();
    if (filterMode === 'keyword') {
      if (search.trim()) {
        console.log('Sending keyword search:', { search: search.trim() });
        onSearch({ search: search.trim() });
      } else {
        console.log('Sending empty search');
        onSearch({});
      }
    } else {
      // Use startLocation and endLocation for from->to filtering
      const filters = {};
      if (fromLocation.trim()) filters.fromLocation = fromLocation.trim();
      if (toLocation.trim()) filters.toLocation = toLocation.trim();
      
      console.log('Sending location filters:', filters);
      // If both or at least one is filled, send the filter
      if (Object.keys(filters).length > 0) {
        onSearch(filters);
      } else {
        // If nothing is filled, fetch all
        console.log('No filters, fetching all');
        onSearch({});
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setFilterMode('keyword')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterMode === 'keyword'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Search className="inline mr-2" size={16} />
          Search by Keyword
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('location')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterMode === 'location'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <MapPin className="inline mr-2" size={16} />
          Filter by Route
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {filterMode === 'keyword' ? (
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search journeys by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="From (e.g., India, USA)..."
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="To (e.g., Switzerland, Japan)..."
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button type="submit" className="btn-primary">
              Filter Routes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

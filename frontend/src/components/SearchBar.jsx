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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 sm:p-6 mb-6 sm:mb-8">
      {/* Filter Mode Buttons */}
      <div className="mb-4 flex gap-2 flex-col sm:flex-row">
        <button
          type="button"
          onClick={() => setFilterMode('keyword')}
          className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
            filterMode === 'keyword'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
          }`}
        >
          <Search className="inline mr-2" size={16} />
          <span className="hidden sm:inline">Search by Keyword</span>
          <span className="sm:hidden">Keyword</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('location')}
          className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
            filterMode === 'location'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
          }`}
        >
          <MapPin className="inline mr-2" size={16} />
          <span className="hidden sm:inline">Filter by Route</span>
          <span className="sm:hidden">Route</span>
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
        {filterMode === 'keyword' ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search journeys..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full input-field pl-10 py-2.5 sm:py-3 text-sm sm:text-base"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button type="submit" className="w-full sm:w-auto btn-primary py-2.5 sm:py-3 text-sm sm:text-base font-medium">
              Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="From (e.g., India)..."
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full input-field pl-10 py-2.5 sm:py-3 text-sm sm:text-base"
              />
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="To (e.g., Switzerland)..."
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full input-field pl-10 py-2.5 sm:py-3 text-sm sm:text-base"
              />
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button type="submit" className="w-full sm:w-auto btn-primary py-2.5 sm:py-3 text-sm sm:text-base font-medium">
              Filter
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="flex flex-col gap-4 mb-6" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full px-4 py-3 text-base border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 transition-all"
        placeholder="Enter username"
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          if (val.trim() === '') {
            onSearch('');
          }
        }}
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="w-full px-4 py-3 text-base font-medium text-white bg-[#4a90e2] rounded hover:bg-[#357abd] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed transition-all" 
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;

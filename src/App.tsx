import { useState } from 'react';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import './index.css';

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
  owner: {
    login: string;
  };
}

function App() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      setSearchQuery('');
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setHasSearched(true);

    const cacheKey = `github_search_${query.toLowerCase()}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      setUsers(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      // Fetch up to 5 users based on query
      const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=5`);

      if (!response.ok) {
        throw new Error('Gagal mengambil data dari GitHub API. Mungkin terkena rate limit.');
      }

      const data = await response.json();
      const usersData = data.items || [];
      setUsers(usersData);
      sessionStorage.setItem(cacheKey, JSON.stringify(usersData));
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 py-6 min-h-screen text-[#333] font-sans">
      <main>
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="text-[#d32f2f] mb-4 text-sm">
            {error}
          </div>
        )}

        {hasSearched && !loading && !error && (
          <p className="text-[#666] text-sm mb-4">
            Showing users for "{searchQuery}"
          </p>
        )}

        <UserList users={users} loading={loading} />
      </main>
    </div>
  );
}

export default App;

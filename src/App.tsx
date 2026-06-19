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
}

function App() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

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
    <div className="app-container">
      <main className="main-content">
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {hasSearched && !loading && !error && (
          <p className="search-result-text">
            Showing users for "{searchQuery}"
          </p>
        )}

        <UserList users={users} loading={loading} />
      </main>
    </div>
  );
}

export default App;

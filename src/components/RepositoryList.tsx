import React, { useState, useEffect } from 'react';
import { GitHubRepo } from '../App';

interface RepositoryListProps {
  username: string;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ username }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        // Using per_page=100 as an upper bound. 
        // GitHub API defaults to 30, max is 100.
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const data = await response.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching repos');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  if (loading) {
    return <div className="repo-loading">Loading repositories...</div>;
  }

  if (error) {
    return <div className="repo-error">{error}</div>;
  }

  if (repos.length === 0) {
    return <div className="repo-empty">No repositories found.</div>;
  }

  return (
    <div 
      className="repository-list"
      style={repos.length > 20 ? { maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' } : undefined}
    >
      {repos.map((repo) => (
        <div key={repo.id} className="repo-card">
          <div className="repo-header">
            <h3 className="repo-title">{repo.name}</h3>
            <div className="repo-stars">
              <span>{repo.stargazers_count}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
          {repo.description && (
            <p className="repo-description">{repo.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RepositoryList;

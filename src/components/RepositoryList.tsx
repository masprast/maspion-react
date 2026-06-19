import React, { useState, useEffect } from 'react';
import { GitHubRepo } from '../App';
import RepoDetailModal from './RepoDetailModal';

interface RepositoryListProps {
  username: string;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ username }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      const cacheKey = `github_repos_${username.toLowerCase()}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        setRepos(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

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
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err: any) {
        setError(err.message || 'Error fetching repos');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

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
    <>
      <div
        className="repository-list"
        style={repos.length > 20 ? { maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' } : undefined}
      >
        {repos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => setSelectedRepo(repo)}
            className="repo-card"
            role="button"
            tabIndex={0}
          >
            <div className="repo-header">
              <h3 className="repo-title">{repo.name}</h3>
              <div className="repo-stars">
                <span>{repo.stargazers_count}</span>
                <i className="fas fa-star"></i>
              </div>
            </div>
            {repo.description && (
              <p className="repo-description">{repo.description}</p>
            )}
          </div>
        ))}
      </div>

      {selectedRepo && (
        <RepoDetailModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </>
  );
};

export default RepositoryList;

import React, { useState, useEffect } from 'react';
import { GitHubRepo } from '../App';
import RepoDetailModal from './RepoDetailModal';
import { githubFetch } from '../utils/githubApi';

interface RepositoryListProps {
  username: string;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ username }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sortedData = (repo: GitHubRepo[]) => {
    return repo.sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count);
  }

  useEffect(() => {
    const fetchRepos = async () => {
      const cacheKey = `github_repos_${username.toLowerCase()}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setRepos(sortedData(parsedData));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Using per_page=100 as an upper bound. 
        // GitHub API defaults to 30, max is 100.
        const response = await githubFetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        setRepos(sortedData(data));
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
    return <div className="text-sm text-[#666] py-2">Loading repositories...</div>;
  }

  if (error) {
    return <div className="text-sm text-[#666] py-2">{error}</div>;
  }

  if (repos.length === 0) {
    return <div className="text-sm text-[#666] py-2">No repositories found.</div>;
  }

  return (
    <>
      <div
        className="flex flex-col gap-2 mt-2"
        style={repos.length > 20 ? { maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' } : undefined}
      >
        {repos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => setSelectedRepo(repo)}
            className="bg-[#d5d5d5] p-4 rounded cursor-pointer hover:-translate-y-[2px] hover:shadow-md transition-all duration-200 block no-underline"
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-base font-bold text-[#333] m-0 break-words pr-2">{repo.name}</h3>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#333] shrink-0">
                <span>{repo.stargazers_count}</span>
                <i className="fas fa-star"></i>
              </div>
            </div>
            {repo.description && (
              <p className="text-sm text-[#333] m-0 line-clamp-2">{repo.description}</p>
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

import React from 'react';
import { GitHubRepo } from '../App';

interface RepoDetailModalProps {
  repo: GitHubRepo;
  onClose: () => void;
}

const RepoDetailModal: React.FC<RepoDetailModalProps> = ({ repo, onClose }) => {
  return (
    <div className="mobile-page-overlay">
      <div className="mobile-page-header">
        <button className="back-button" onClick={onClose}>
          <i className="fas fa-arrow-left"></i>
          Kembali
        </button>
        <h2 className="mobile-page-title">{repo.name}</h2>
      </div>
      <div className="mobile-page-content">
        <p><strong>Deskripsi:</strong> {repo.description || 'Tidak ada deskripsi.'}</p>
        <p><strong>Bintang:</strong> {repo.stargazers_count}</p>
        <p className="iframe-warning">
          <em>Catatan: Karena pembatasan keamanan GitHub, situs asli tidak dapat ditampilkan langsung di dalam aplikasi (iframe).</em>
        </p>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="search-button external-link-btn"
          style={{ display: 'inline-block', textAlign: 'center', marginTop: '16px', textDecoration: 'none' }}
        >
          Buka di GitHub Asli (Tab Baru)
        </a>
      </div>
    </div>
  );
};

export default RepoDetailModal;

import React, { useState } from 'react';
import { GitHubUser } from '../App';
import RepositoryList from './RepositoryList';

interface UserAccordionProps {
  user: GitHubUser;
}

const UserAccordion: React.FC<UserAccordionProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={toggleAccordion} aria-expanded={isOpen}>
        <span className="user-login">{user.login}</span>
        <svg 
          className={`chevron ${isOpen ? 'rotated' : ''}`} 
          width="20" height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <div className="accordion-content">
          <RepositoryList username={user.login} />
        </div>
      )}
    </div>
  );
};

export default UserAccordion;

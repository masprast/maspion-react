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
        <i className={`fas fa-chevron-down chevron ${isOpen ? 'rotated' : ''}`}></i>
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

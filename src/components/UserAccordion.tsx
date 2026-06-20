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
    <div className="bg-[#e0e0e0] rounded overflow-hidden transition-all duration-300">
      <button 
        className="w-full flex justify-between items-center px-4 py-4 bg-transparent border-none cursor-pointer text-base text-[#333] text-left hover:bg-black/5" 
        onClick={toggleAccordion} 
        aria-expanded={isOpen}
      >
        <span className="font-medium">{user.login}</span>
        <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4">
          <RepositoryList username={user.login} />
        </div>
      )}
    </div>
  );
};

export default UserAccordion;

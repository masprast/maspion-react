import React from 'react';
import { GitHubUser } from '../App';
import UserAccordion from './UserAccordion';

interface UserListProps {
  users: GitHubUser[];
  loading: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, loading }) => {
  if (loading) {
    return <div className="loading-state">Loading users...</div>;
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserAccordion key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;

import React from 'react';
import { GitHubUser } from '../App';
import UserAccordion from './UserAccordion';

interface UserListProps {
  users: GitHubUser[];
  loading: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, loading }) => {
  if (loading) {
    return <div className="text-center p-6 text-[#666]">Loading users...</div>;
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserAccordion key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;

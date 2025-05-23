import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center">
      <div className="relative group">
        <button className="flex items-center space-x-2 focus:outline-none">
          <img 
            src={user.picture} 
            alt={user.name} 
            className="w-8 h-8 rounded-full border-2 border-deep-purple"
          />
          <span className="text-white hidden md:inline">{user.name}</span>
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-dark-bg border border-gray-700 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

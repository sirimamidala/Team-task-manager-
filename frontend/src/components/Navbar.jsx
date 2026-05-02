import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">Team Task Manager</h1>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <div className="bg-primary-100 p-2 rounded-full text-primary-600">
            <User size={20} />
          </div>
          <span className="font-medium text-gray-700">{user?.name}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{user?.role}</span>
        </div>
        <button onClick={logout} className="text-sm text-red-600 hover:text-red-800 font-medium ml-4">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

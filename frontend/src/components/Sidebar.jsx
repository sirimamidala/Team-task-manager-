import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { to: '/tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    ...(user?.role === 'Admin' ? [{ to: '/team', icon: <Users size={20} />, label: 'Team' }] : []),
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen shadow-2xl relative z-20">
      <div className="p-8 pb-4">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <CheckSquare size={24} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TEAM TASK
          </span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-600/20 to-transparent border-l-4 border-primary-500 text-white shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            <span className="transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-all cursor-pointer px-4 py-2 group">
          <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-medium text-sm">Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

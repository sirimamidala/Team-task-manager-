import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, UserPlus } from 'lucide-react';

const Team = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Team Management</h2>
          <p className="text-slate-500 font-medium">Manage your organization's human capital and access roles.</p>
        </div>
        {isAdmin && (
          <button 
            className="btn-primary flex items-center space-x-2 group"
          >
            <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((member) => (
          <div key={member._id} className="group relative bg-white rounded-[2rem] p-8 shadow-premium hover:shadow-2xl transition-all duration-500 border border-slate-50 flex flex-col items-center text-center overflow-hidden">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary-600 to-primary-400 p-1 shadow-xl group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center text-primary-600 font-black text-3xl">
                  {member.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-50">
                <Shield size={20} className={member.role === 'Admin' ? 'text-primary-500' : 'text-slate-400'} />
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{member.name}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">{member.email}</p>
            
            <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
              member.role === 'Admin' 
                ? 'bg-primary-50 text-primary-600 border-primary-100' 
                : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              {member.role}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 w-full flex justify-around">
              <div className="flex flex-col text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Status</span>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex flex-col text-center border-l border-slate-50 pl-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Joined</span>
                <span className="text-xs font-bold text-slate-600">May 2026</span>
              </div>
            </div>
            
            {/* Decorative Accent */}
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-700"></div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <User size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              {isAdmin ? 'No team members discovered yet' : 'Restricted Access Profile'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;

import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Users } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '', members: [] });

  useEffect(() => {
    fetchProjects();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      setShowModal(false);
      fetchProjects();
      setFormData({ title: '', description: '', deadline: '', members: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMemberChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, members: value });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Hub</h2>
          <p className="text-slate-500 font-medium">Coordinate and monitor team projects and milestones.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project._id} className="group relative bg-white rounded-[2rem] p-8 shadow-premium hover:shadow-2xl transition-all duration-500 border border-slate-50 flex flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Users size={24} />
              </div>
              {isAdmin && (
                <button onClick={() => handleDelete(project._id)} className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{project.title}</h3>
            <p className="text-slate-500 text-sm font-medium flex-1 mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
            
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Team Size</span>
                <div className="flex items-center text-slate-900 font-bold text-sm">
                  {project.members?.length || 0} Members
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Deadline</span>
                <span className="text-primary-600 font-black text-sm">
                  {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {/* Decorative Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/5 to-transparent rounded-bl-[4rem] -mr-8 -mt-8"></div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No projects currently active</p>
          </div>
        )}
      </div>

      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Initialize Project</h3>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Project Title</label>
                <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" 
                  placeholder="E.g. Q4 Growth Strategy"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Project Description</label>
                <textarea className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium min-h-[100px]" 
                  placeholder="Define the project scope and objectives..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Target Deadline</label>
                  <input type="date" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" 
                    value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Assign Core Team</label>
                  <select multiple className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium min-h-[100px]" onChange={handleMemberChange}>
                    {users.map(u => (
                      <option key={u._id} value={u._id} className="py-1">{u.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 ml-1">Hold Ctrl/Cmd to multi-select</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] btn-primary py-4 text-sm uppercase tracking-widest font-black">Launch Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

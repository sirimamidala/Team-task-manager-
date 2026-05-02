import React, { useEffect, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Calendar, User as UserIcon, Loader2, ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'To Do', dueDate: '', project: '', assignedTo: '' });

  const fetchTasks = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    if (isAdmin) {
      fetchProjects();
      fetchUsers();
    }
  }, [isAdmin, fetchTasks, fetchProjects, fetchUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.post('/tasks', formData);
      toast.success('Task created successfully');
      setShowModal(false);
      setFormData({ title: '', description: '', status: 'To Do', dueDate: '', project: '', assignedTo: '' });
      fetchTasks(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const originalTasks = [...tasks];
      // Optimistic update
      setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
      
      await api.put(`/tasks/${id}`, { status });
      toast.success(`Task marked as ${status}`);
      fetchTasks(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
      fetchTasks(); // Revert on error
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const isOverdue = (task) => {
    return task.status !== 'Completed' && new Date(task.dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tasks Management</h2>
          <p className="text-slate-500 font-medium">Track, manage and update your team's daily activities.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.map((task) => {
          const status = isOverdue(task) && task.status !== 'Overdue' ? 'Overdue' : task.status;
          return (
            <div key={task._id} className="group relative bg-white rounded-[2rem] p-8 shadow-premium hover:shadow-2xl transition-all duration-500 border border-slate-50 flex flex-col overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(status)}`}>
                  {status}
                </span>
                {isAdmin && (
                  <button onClick={() => handleDelete(task._id)} className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{task.title}</h3>
              <p className="text-slate-500 text-sm font-medium flex-1 mb-6 line-clamp-3 leading-relaxed">{task.description}</p>
              
              <div className="space-y-3 mb-8">
                {task.project && (
                  <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                      <ListTodo size={12} className="text-slate-500" />
                    </div>
                    {task.project.title}
                  </div>
                )}
                {task.assignedTo && (
                  <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                      <UserIcon size={12} className="text-slate-500" />
                    </div>
                    {task.assignedTo.name}
                  </div>
                )}
                <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                    <Calendar size={12} className="text-slate-500" />
                  </div>
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Update Status</span>
                <select 
                  className="text-xs font-bold border-none bg-slate-50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none transition-all cursor-pointer"
                  value={task.status}
                  onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/5 to-transparent rounded-bl-[4rem] -mr-8 -mt-8"></div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <ListTodo size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No tasks discovered yet</p>
          </div>
        )}
      </div>

      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Task Title</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" 
                    placeholder="E.g. Design System Update"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                  <textarea className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium min-h-[120px]" 
                    placeholder="Describe the task details..."
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Due Date</label>
                  <input type="date" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" 
                    value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Project</label>
                  <select required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium appearance-none"
                    value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})}>
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Assign To Team Member</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium appearance-none"
                    value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                    <option value="">Select User</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="flex-[2] btn-primary py-4 text-sm uppercase tracking-widest font-black shadow-primary-500/30 flex items-center justify-center disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {actionLoading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CheckCircle, Clock, AlertTriangle, ListTodo, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/activities')
        ]);
        
        setStats(statsRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSubmitAssessment = async () => {
    try {
      setSubmitting(true);
      const res = await api.post('/assessments/submit');
      if (res.data.success) {
        toast.success(res.data.message || 'Assessment submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to submit assessment', err);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statCards = [
    { title: 'Total Tasks', value: stats.total, icon: <ListTodo size={24} />, color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/20' },
    { title: 'Completed', value: stats.completed, icon: <CheckCircle size={24} />, color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-500/20' },
    { title: 'In Progress', value: stats.pending, icon: <Clock size={24} />, color: 'from-amber-600 to-amber-400', shadow: 'shadow-amber-500/20' },
    { title: 'Overdue', value: stats.overdue, icon: <AlertTriangle size={24} />, color: 'from-rose-600 to-rose-400', shadow: 'shadow-rose-500/20' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Synchronizing Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
        <p className="text-slate-500 font-medium">Welcome back! Here's what's happening with your projects today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden bg-white rounded-3xl p-6 shadow-premium hover:shadow-2xl transition-all duration-300 group`}>
            <div className="relative z-10 flex flex-col space-y-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-premium p-8 border border-slate-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <button className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">View All</button>
          </div>
          <div className="space-y-6">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity._id} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  <Clock size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{activity.action}: {activity.details || activity.targetType}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {new Date(activity.createdAt).toLocaleString()} • By {activity.user?.name || 'Unknown'}
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">No recent activities found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-black mb-6 tracking-tight">Assignment Status</h3>
            <div className="space-y-6 flex-1">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Readiness</span>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Ready</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {['Authentication', 'Project Management', 'Team Tracking', 'RBAC System'].map((item) => (
                  <div key={item} className="flex items-center space-x-3 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle size={12} />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={handleSubmitAssessment}
              disabled={submitting}
              className="w-full mt-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-50 transition-colors shadow-xl flex items-center justify-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : 'Submit Assessment'}
            </button>
          </div>
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

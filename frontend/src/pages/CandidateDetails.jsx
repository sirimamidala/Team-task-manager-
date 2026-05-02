import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, GraduationCap, ChevronRight } from 'lucide-react';

const CandidateDetails = () => {
  const [details, setDetails] = useState({ name: '', email: '', college: '', studentId: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('candidateDetails', JSON.stringify(details));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary-600 to-primary-400 shadow-2xl mb-6">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Assignment <span className="gradient-text">Portal</span>
          </h1>
          <p className="text-slate-400 mt-3 font-medium text-lg">
            Complete your profile to start the technical assessment.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">College/University</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <GraduationCap size={18} />
                </div>
                <input
                  required
                  type="text"
                  placeholder="University Name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                  value={details.college}
                  onChange={(e) => setDetails({ ...details, college: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-5 mt-4 text-sm uppercase tracking-widest font-black flex items-center justify-center group"
            >
              Start Assessment
              <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;

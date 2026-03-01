import React from 'react';
import { FiTrendingUp, FiUsers, FiBarChart2, FiTrendingDown, FiMessageSquare } from 'react-icons/fi';

const Analytics = () => {
  return (
    <div className="animate-fade-in p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Property Stats</h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">View how your properties are performing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Views', value: '45,231', change: '+12.5%', icon: FiTrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Inquiries', value: '128', change: '+3.2%', icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Success Rate', value: '2.4%', change: '+0.8%', icon: FiBarChart2, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Messages', value: '312', change: '+15%', icon: FiMessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white p-5 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-slate-100 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-inner`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-50`}>
                {stat.change}
              </span>
            </div>
            <div className="relative">
              <h3 className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[48px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] h-[400px] flex items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 opacity-80"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
        
        <div className="text-center relative">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform duration-700">
            <FiBarChart2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2">Analytics Report</h3>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            Collecting and showing you the latest property trends and user activities.
          </p>
          <div className="mt-8 flex justify-center space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 w-8 rounded-full bg-slate-100 animate-pulse delay-${i * 200}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

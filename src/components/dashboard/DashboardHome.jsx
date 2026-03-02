import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiChevronRight, FiBriefcase, FiMessageCircle } from 'react-icons/fi';
import { fetchDashboardStats } from '../../store/slices/propertySlice';
import { fetchPartners } from '../../store/slices/partnerSlice';
import { fetchTestimonials } from '../../store/slices/testimonialSlice';
import { PROPERTY_STATUS } from '../../constants/statuses';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { dashboardStats: statsData, statsLoading: loading } = useSelector(s => s.property);
  const { list: partners } = useSelector(s => s.partner);
  const { list: testimonials } = useSelector(s => s.testimonial);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchPartners());
    dispatch(fetchTestimonials({ all: true }));
  }, [dispatch]);

  const stats = [
    { icon: FiHome, label: 'Properties', value: statsData?.totalProperties || '0', gradient: 'from-blue-600 to-indigo-600' },
    { icon: FiMail, label: 'Inquiries', value: statsData?.totalInquiries || '0', gradient: 'from-blue-600 to-sky-600' },
    { icon: FiBriefcase, label: 'Partners', value: partners.length || '0', gradient: 'from-emerald-600 to-teal-600' },
    { icon: FiMessageCircle, label: 'Testimonials', value: testimonials.length || '0', gradient: 'from-indigo-600 to-purple-600' },
  ];

  const recentProperties = statsData?.recentProperties || [];

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Dashboard Overview</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.1em]">Property statistics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-700 group cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none group-hover:bg-primary/5 transition-colors duration-700"></div>
                
                <div className="mb-6 relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                </div>
                
                <div className="relative">
                    <div className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                    <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
            </div>
          );
        })}
      </div>

      {/* Recent Properties Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center bg-slate-50/20 gap-4">
          <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Recent Properties</h2>
          </div>
          <Link to="/dashboard/properties" className="group flex items-center space-x-2 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] hover:text-primary transition-colors">
            <span>View All Properties</span>
            <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                <FiChevronRight className="w-2.5 h-2.5 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white">
                <th className="text-left py-4 px-8 text-slate-400 font-black text-[9px] uppercase tracking-widest">Property</th>
                <th className="text-left py-4 px-8 text-slate-400 font-black text-[9px] uppercase tracking-widest">Status</th>
                <th className="text-center py-4 px-8 text-slate-400 font-black text-[9px] uppercase tracking-widest">Stats</th>
                <th className="text-right py-4 px-8 text-slate-400 font-black text-[9px] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center font-black text-slate-300 uppercase tracking-widest text-xs animate-pulse">Loading properties...</td>
                </tr>
              ) : recentProperties.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400 font-bold">No properties found.</td>
                </tr>
              ) : (
                recentProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="py-5 px-8">
                      <div className="font-black text-slate-900 text-[14px] group-hover:text-primary transition-colors cursor-pointer tracking-tight">{property.title}</div>
                      <div className="flex items-center mt-1 space-x-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">ID: #{property._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                        property.status === PROPERTY_STATUS.ACTIVE
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500'
                          : 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex justify-center items-center space-x-6">
                        <div className="text-center">
                          <div className="text-base font-black text-slate-900 tracking-tight">{property.views}</div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-base font-black text-slate-900 tracking-tight">{property.inquiries}</div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">Inquiries</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <Link 
                        to={`/property/${property._id}`} 
                        className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-[16px] text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-500"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

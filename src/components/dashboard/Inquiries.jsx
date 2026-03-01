import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiMail, FiPhone, FiEye, FiTrash2, FiSearch, 
  FiChevronDown, FiCalendar, FiUser, FiMessageSquare, 
  FiCheckCircle, FiClock, FiAlertCircle, FiHome, FiRefreshCcw
} from 'react-icons/fi';
import { inquiryService } from '../../services/api';
import toast from 'react-hot-toast';
import { getInitials, formatDate } from '../../utils/formatters';
import { INQUIRY_STATUS, CRM_STATUS } from '../../constants/statuses';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const { data } = await inquiryService.getInquiries();
        if (data.success) {
          setInquiries(data.data);
        }
      } catch (err) {
        console.error('Error fetching inquiries:', err);
        toast.error('Failed to load inquiries from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (i.property?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            i.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || i.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  const deleteInquiry = async (id) => {
    try {
      await inquiryService.deleteInquiry(id);
      setInquiries(inquiries.filter(i => i._id !== id));
      toast.success('Inquiry record deleted.');
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      toast.error('Failed to delete inquiry.');
    }
  };

  const markContacted = async (id) => {
    try {
      const { data } = await inquiryService.updateInquiryStatus(id, 'contacted');
      if (data.success) {
        setInquiries(inquiries.map(i => i._id === id ? data.data : i));
        toast.success('Inquiry marked as contacted.');
      }
    } catch (err) {
      console.error('Error updating inquiry:', err);
      toast.error('Failed to update inquiry status.');
    }
  };

  const handleRetrySync = async (id) => {
    try {
      toast.loading('Retrying CRM Sync...', { id: 'sync-toast' });
      const { data } = await inquiryService.retrySync(id);
      if (data.success) {
        setInquiries(inquiries.map(i => i._id === id ? data.data : i));
        toast.success('CRM Sync Successful!', { id: 'sync-toast' });
      }
    } catch (err) {
      console.error('Error retrying sync:', err);
      toast.error(err.response?.data?.message || 'Sync failed again.', { id: 'sync-toast' });
    }
  };

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Inquiry Intel</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Monitor and resolve global customer intelligence</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative group w-full md:w-80">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search intelligence dossiers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-[13px] shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-56 appearance-none pl-6 pr-12 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-black text-[9px] uppercase tracking-widest cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-slate-600"
            >
              <option value="All">All Intelligence</option>
              <option value="New">Unprocessed</option>
              <option value="Contacted">Resolved</option>
            </select>
            <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Inquiry List */}
      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-16 h-16 border-[6px] border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredInquiries.map((inquiry, idx) => (
            <div 
              key={inquiry._id} 
              className="group bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 p-8 md:p-10 relative overflow-hidden"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50 group-hover:bg-primary/5 transition-colors duration-700"></div>

              <div className="flex flex-col xl:flex-row gap-12 relative">
                {/* Profile & Status */}
                <div className="flex xl:flex-col items-center justify-between xl:justify-start xl:w-48 gap-5 xl:pr-8 xl:border-r border-slate-50">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center font-black text-3xl shadow-inner border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    {getInitials(inquiry.name)}
                  </div>
                  <div className="text-center xl:text-left flex-1 xl:flex-initial">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{inquiry.name}</h3>
                    <div className="flex items-center justify-center xl:justify-start text-[9px] font-black text-slate-400 mt-1.5 space-x-2 uppercase tracking-widest">
                      <FiCalendar className="text-primary w-3 h-3" />
                      <span>{formatDate(inquiry.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                      inquiry.status === INQUIRY_STATUS.NEW ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {inquiry.status === INQUIRY_STATUS.NEW ? 'Strategic New' : 'Intel Resolved'}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm flex items-center justify-center gap-1 ${
                      inquiry.crmSyncStatus === CRM_STATUS.SUCCESS ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      inquiry.crmSyncStatus === CRM_STATUS.FAILED ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`} title={inquiry.crmError}>
                      {inquiry.crmSyncStatus === CRM_STATUS.SUCCESS ? (
                        <><FiCheckCircle className="w-2.5 h-2.5" /> Bigin Synced</>
                      ) : inquiry.crmSyncStatus === CRM_STATUS.FAILED ? (
                        <><FiAlertCircle className="w-2.5 h-2.5" /> Bigin Failed</>
                      ) : (
                        <><FiClock className="w-2.5 h-2.5" /> Bigin Pending</>
                      )}
                    </span>
                      {inquiry.crmSyncStatus === CRM_STATUS.FAILED && inquiry.crmError && (
                        <p className="text-[7px] font-bold text-rose-400 uppercase text-center max-w-[120px] leading-tight transition-all group-hover:text-rose-500">
                          Error: {inquiry.crmError}
                        </p>
                      )}
                      {inquiry.crmSyncStatus === CRM_STATUS.FAILED && (
                        <button 
                          onClick={() => handleRetrySync(inquiry._id)}
                          className="mt-1 flex items-center gap-1.5 px-2 py-1 bg-slate-900 text-white rounded-lg hover:bg-primary transition-all group/retry"
                        >
                          <FiRefreshCcw className="w-2.5 h-2.5 group-hover/retry:rotate-180 transition-transform duration-500" />
                          <span className="text-[7px] font-black uppercase tracking-widest">Retry Sync</span>
                        </button>
                      )}
                    </div>
                  </div>

                {/* Inquiry Content */}
                <div className="flex-1 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Objective Asset</label>
                      <div className="flex items-center text-slate-900 font-bold text-[13px] bg-slate-50/50 px-3.5 py-2.5 rounded-xl border border-transparent group-hover:border-slate-100 transition-all">
                        <FiHome className="text-primary mr-2.5 w-3.5 h-3.5" />
                        {inquiry.property?.title || 'Unknown Property'}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Channel</label>
                      <div className="flex items-center text-slate-900 font-bold text-[13px] bg-slate-50/50 px-3.5 py-2.5 rounded-xl border border-transparent group-hover:border-slate-100 transition-all">
                        <FiMail className="text-primary mr-2.5 w-3.5 h-3.5" />
                        {inquiry.email}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Secure Line</label>
                      <div className="flex items-center text-slate-900 font-bold text-[13px] bg-slate-50/50 px-3.5 py-2.5 rounded-xl border border-transparent group-hover:border-slate-100 transition-all">
                        <FiPhone className="text-primary mr-2.5 w-3.5 h-3.5" />
                        {inquiry.phone}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary/20 rounded-full"></div>
                    <div className="pl-5 py-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Decrypted Message</label>
                      <p className="text-slate-600 font-medium text-sm leading-relaxed italic">
                        "{inquiry.message}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex xl:flex-col items-center justify-center gap-3 xl:pl-8 xl:border-l border-slate-50">
                  {inquiry.status === INQUIRY_STATUS.NEW && (
                    <button 
                      onClick={() => markContacted(inquiry._id)}
                      className="w-full xl:w-16 h-14 xl:h-16 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex flex-col items-center justify-center space-y-1 group/btn"
                      title="Mark Contacted"
                    >
                      <FiCheckCircle className="text-xl group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[7px] font-black uppercase tracking-tighter">Resolve</span>
                    </button>
                  )}
                  <button 
                    onClick={() => deleteInquiry(inquiry._id)}
                    className="w-full xl:w-16 h-14 xl:h-16 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex flex-col items-center justify-center space-y-1 group/btn"
                    title="Purge Intel"
                  >
                    <FiTrash2 className="text-xl group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[7px] font-black uppercase tracking-tighter">Purge</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredInquiries.length === 0 && (
            <div className="py-40 text-center bg-white rounded-[56px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FiAlertCircle className="text-5xl text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">No Inquiry Intelligence Found</h3>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-10">Reset filtering criteria to visualize archived records</p>
              <button 
                onClick={() => {setSearchTerm(''); setStatusFilter('All');}} 
                className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-2xl transition-all"
              >
                Reset Dossier Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inquiries;

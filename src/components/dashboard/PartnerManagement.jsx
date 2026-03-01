import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiBriefcase, FiLink } from 'react-icons/fi';
import { partnerService } from '../../services/api';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', icon: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data } = await partnerService.getPartners();
      if (data.success) {
        setPartners(data.data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.icon) {
        toast.error('Please fill in all fields');
        return;
    }
    
    try {
      setAdding(true);
      const { data } = await partnerService.addPartner(newPartner);
      if (data.success) {
        setPartners([data.data, ...partners]);
        setNewPartner({ name: '', icon: '' });
        toast.success('Partner added successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding partner');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    try {
      const { data } = await partnerService.deletePartner(id);
      if (data.success) {
        setPartners(partners.filter(p => p._id !== id));
        toast.success('Partner deleted successfully!');
      }
    } catch (error) {
      toast.error('Error deleting partner');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Partners...</div>;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Partners</h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Edit your company partners and sponsors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Add Partner Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] sticky top-32 transition-all">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
                <FiPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">New Partner</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Partner details</p>
              </div>
            </div>
            
            <form onSubmit={handleAddPartner} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Partner Name</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. EcoBuild Holdings"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Icon or Emoji</label>
                <div className="relative">
                  <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. 🏢 or brand_logo.png"
                    value={newPartner.icon}
                    onChange={(e) => setNewPartner({ ...newPartner, icon: e.target.value })}
                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:shadow-slate-900/20 transform hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {adding ? 'Saving...' : 'Add Partner'}
              </button>
            </form>
          </div>
        </div>

        {/* Partners List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.length > 0 ? (
              partners.map((partner) => (
                <div key={partner._id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-700"></div>
                    
                    <div className="flex items-center space-x-5 relative">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                          {partner.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">{partner.name}</h3>
                          <div className="flex items-center mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Partner</p>
                          </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDeleteClick(partner._id)}
                        className="w-10 h-10 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm flex items-center justify-center relative opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 bg-white rounded-[56px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
                <FiBriefcase className="w-16 h-16 mb-6 opacity-20" />
                <p className="font-black text-xs uppercase tracking-[0.3em]">No partners found</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">Add your first partner above</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Partner?"
        message="Are you sure you want to remove this partner from your list?"
      />
    </div>
  );
};

export default PartnerManagement;

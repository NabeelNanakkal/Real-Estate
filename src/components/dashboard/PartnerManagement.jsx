import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiTrash2, FiBriefcase, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';
import { getImageUrl } from '../../utils/imageUtils';
import {
  fetchPartners,
  addPartner,
  deletePartner,
  resetPartnerMutation,
} from '../../store/slices/partnerSlice';

const PartnerManagement = () => {
  const dispatch = useDispatch();
  const { list: partners, loading, mutationLoading: adding, mutationSuccess, mutationError } = useSelector(s => s.partner);

  const [newPartner, setNewPartner] = useState({ name: '' });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  useEffect(() => {
    if (mutationSuccess) {
      toast.success('Operation completed successfully!');
      setNewPartner({ name: '' });
      setIconFile(null);
      setIconPreview(null);
      dispatch(resetPartnerMutation());
    }
    if (mutationError) {
      toast.error(mutationError);
      dispatch(resetPartnerMutation());
    }
  }, [mutationSuccess, mutationError, dispatch]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if the file is an SVG
    if (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg')) {
      toast.error('Only SVG logo files are allowed for partners.');
      fileInputRef.current.value = '';
      return;
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleAddPartner = (e) => {
    e.preventDefault();
    if (!newPartner.name || !iconFile) {
      toast.error('Please fill in all fields and select a logo');
      return;
    }
    const fd = new FormData();
    fd.append('name', newPartner.name);
    fd.append('icon', iconFile);
    dispatch(addPartner(fd));
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    dispatch(deletePartner(deleteModal.id));
    toast.success('Partner deleted successfully!');
    setDeleteModal({ isOpen: false, id: null });
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
                <div className="flex justify-between items-baseline">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Partner Logo</label>
                  <span className="text-[9px] font-bold text-slate-400 mr-2 uppercase">Only SVG Supported</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleIconChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full flex items-center gap-4 px-5 py-3.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group"
                >
                  {iconPreview ? (
                    <img src={iconPreview} alt="preview" className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                      <FiUpload className="w-4 h-4" />
                    </div>
                  )}
                  <span className="font-bold text-[13px] text-slate-400 group-hover:text-slate-600 transition-colors">
                    {iconFile ? iconFile.name : 'Click to upload logo'}
                  </span>
                </button>
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
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden p-2">
                          <img src={getImageUrl(partner.icon)} alt={partner.name} className="w-full h-full object-contain" />
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

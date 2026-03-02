import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiInfo, FiHelpCircle, FiMapPin, FiMail, FiPhone, FiClock, FiShare2, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { contactService } from '../../services/api';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const ContactManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    mapUrl: '',
    workingHours: '',
    faqs: [],
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data } = await contactService.getContactContent();
      if (data.success && data.data) {
        const d = data.data;
        setFormData({
          phone: d.phone || '',
          email: d.email || '',
          address: d.address || '',
          mapUrl: d.mapUrl || '',
          workingHours: d.workingHours || '',
          faqs: d.faqs || [],
          socialLinks: {
            facebook: '', twitter: '', instagram: '', linkedin: '',
            ...(d.socialLinks || {})
          }
        });
      }
    } catch (error) {
      console.error('Error fetching contact content:', error);
      toast.error('Failed to load contact content');
    } finally {
      setLoading(false);
    }
  };

  const handleFAQChange = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [{ question: '', answer: '' }, ...formData.faqs]
    });
    toast.success('New FAQ input added');
  };

  const handleRemoveClick = (index) => {
    setDeleteModal({ isOpen: true, index });
  };

  const confirmDelete = () => {
    const { index } = deleteModal;
    const newFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: newFaqs });
    toast.success('FAQ removed from list');
    setDeleteModal({ isOpen: false, index: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await contactService.updateContactContent(formData);
      if (data.success) {
        setFormData(data.data);
        toast.success('Contact content updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating contact content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Content...</div>;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Contact Page</h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Edit your contact info and FAQs</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Core Info Section */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
          
          <div className="flex items-center space-x-3 mb-8 relative">
            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
              <FiInfo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Contact Details</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone, email, and address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Phone Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="+1 (800) ESTATE"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="concierge@estatehub.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Office Address</label>
              <div className="relative group">
                <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="Sixth Avenue, Manhattan, NY"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Working Hours</label>
              <div className="relative group">
                <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="Mon - Fri: 08:00 - 20:00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-2 relative">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Google Maps Link</label>
            <textarea
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              rows="4"
              className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none text-[13px]"
              placeholder="https://www.google.com/maps/embed?pb=..."
              required
            ></textarea>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
          
          <div className="flex items-center space-x-3 mb-8 relative">
            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
              <FiShare2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Social Media</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Links to your social pages</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Facebook Link</label>
              <div className="relative group">
                <FiFacebook className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.socialLinks?.facebook}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value } 
                  })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">X (Twitter) Link</label>
              <div className="relative group">
                <FiTwitter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.socialLinks?.twitter}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value } 
                  })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Instagram Link</label>
              <div className="relative group">
                <FiInstagram className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.socialLinks?.instagram}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value } 
                  })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">LinkedIn Link</label>
              <div className="relative group">
                <FiLinkedin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.socialLinks?.linkedin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value } 
                  })}
                  className="w-full bg-slate-50 border-none px-12 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all outline-none text-[13px]"
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
                <FiHelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">FAQs</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manage common questions and answers</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addFAQ}
              className="group flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:shadow-xl transition-all"
            >
              <FiPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-slate-50/50 rounded-[24px] relative group border-2 border-transparent hover:border-slate-100 hover:bg-white transition-all duration-500">
                <button
                  type="button"
                  onClick={() => handleRemoveClick(index)}
                  className="absolute top-6 right-6 w-8 h-8 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 gap-6 max-w-[92%]">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                      className="w-full bg-white border-none px-5 py-3 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px] shadow-sm"
                      placeholder="Enter question protocol..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                      rows="3"
                      className="w-full bg-white border-none px-5 py-3 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px] shadow-sm resize-none"
                      placeholder="Enter definitive answer..."
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
            {formData.faqs.length === 0 && (
                <div className="py-20 text-center text-slate-300">
                    <FiHelpCircle className="w-16 h-16 mx-auto mb-6 opacity-20" />
                    <p className="font-black text-xs uppercase tracking-[0.3em]">No FAQs found</p>
                </div>
            )}
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end sticky bottom-10 z-40">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_60px_rgba(59,130,246,0.3)] hover:shadow-primary/50 transform hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiSave className="text-lg" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, index: null })}
        onConfirm={confirmDelete}
        title="Remove FAQ?"
        message="Are you sure you want to remove this FAQ? You still need to click 'Save Changes' to make it permanent."
      />
    </div>
  );
};

export default ContactManagement;

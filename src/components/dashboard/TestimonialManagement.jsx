import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiMessageCircle, FiUser, FiStar, FiUpload, FiCheck, FiX, FiCamera } from 'react-icons/fi';
import { testimonialService } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const MAX_CONTENT = 300;

const EMPTY_FORM = { name: '', role: '', content: '', rating: 5, isActive: true };

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
          s <= value ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-300 hover:bg-amber-100'
        }`}
      >
        <FiStar className={`w-3.5 h-3.5 ${s <= value ? 'fill-white' : ''}`} />
      </button>
    ))}
  </div>
);

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [imageFile, setImageFile]       = useState(null);    // File object
  const [imagePreview, setImagePreview] = useState('');      // preview URL
  const [deleteModal, setDeleteModal]   = useState({ isOpen: false, id: null });
  const fileInputRef = useRef(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const { data } = await testimonialService.getTestimonials(true);
      if (data.success) setTestimonials(data.data);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setForm({ name: t.name, role: t.role, content: t.content, rating: t.rating, isActive: t.isActive });
    setImageFile(null);
    setImagePreview(getImageUrl(t.image) || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    clearImage();
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name',     form.name.trim());
    fd.append('role',     form.role.trim());
    fd.append('content',  form.content.trim());
    fd.append('rating',   form.rating);
    fd.append('isActive', form.isActive);
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.content.trim()) {
      toast.error('Name, role and content are required');
      return;
    }
    try {
      setSaving(true);
      const fd = buildFormData();

      if (editingId) {
        const { data } = await testimonialService.updateTestimonial(editingId, fd);
        if (data.success) {
          setTestimonials((prev) => prev.map((t) => (t._id === editingId ? data.data : t)));
          toast.success('Testimonial updated!');
          cancelEdit();
        }
      } else {
        const { data } = await testimonialService.addTestimonial(fd);
        if (data.success) {
          setTestimonials([data.data, ...testimonials]);
          setForm(EMPTY_FORM);
          clearImage();
          toast.success('Testimonial added!');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (t) => {
    try {
      const { data } = await testimonialService.updateTestimonial(t._id, { isActive: !t.isActive });
      if (data.success) {
        setTestimonials((prev) => prev.map((x) => (x._id === t._id ? data.data : x)));
        toast.success(data.data.isActive ? 'Testimonial visible on site' : 'Testimonial hidden from site');
      }
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    try {
      const { data } = await testimonialService.deleteTestimonial(id);
      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
        if (editingId === id) cancelEdit();
        toast.success('Testimonial deleted');
      }
    } catch {
      toast.error('Error deleting testimonial');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Testimonials...</div>;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Testimonials</h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Manage client testimonials shown on the homepage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Form ── */}
        <div className="lg:col-span-1">
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] sticky top-32">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
                {editingId ? <FiEdit2 className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                </h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ── Profile Photo Upload ── */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {/* Avatar preview */}
                  <div className="relative flex-shrink-0">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
                        >
                          <FiX className="w-2.5 h-2.5" />
                        </button>
                      </>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <FiUser className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="testimonial-image"
                    />
                    <label
                      htmlFor="testimonial-image"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group"
                    >
                      <FiCamera className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-primary uppercase tracking-widest transition-colors">
                        {imagePreview ? 'Change Photo' : 'Upload Photo'}
                      </span>
                    </label>
                    <p className="text-[9px] text-slate-300 font-bold text-center mt-1.5">JPG, PNG, WEBP · Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Client Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. Sarah Johnson"
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Role / Title</label>
                <div className="relative">
                  <FiMessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. First-time Buyer"
                    maxLength={100}
                    value={form.role}
                    onChange={(e) => setField('role', e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Testimonial</label>
                  <span className={`text-[9px] font-black ${form.content.length > MAX_CONTENT * 0.9 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {form.content.length}/{MAX_CONTENT}
                  </span>
                </div>
                <textarea
                  placeholder="Write the client's testimonial..."
                  maxLength={MAX_CONTENT}
                  rows={4}
                  value={form.content}
                  onChange={(e) => setField('content', e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] resize-none"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Rating</label>
                <StarPicker value={form.rating} onChange={(v) => setField('rating', v)} />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Visible on site</span>
                <button
                  type="button"
                  onClick={() => setField('isActive', !form.isActive)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 focus:outline-none ${form.isActive ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:shadow-slate-900/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
                  ) : (
                    <><FiUpload className="w-3.5 h-3.5" />{editingId ? 'Save Changes' : 'Add Testimonial'}</>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ── List ── */}
        <div className="lg:col-span-2 space-y-4">
          {testimonials.length === 0 ? (
            <div className="py-40 bg-white rounded-[56px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
              <FiMessageCircle className="w-16 h-16 mb-6 opacity-20" />
              <p className="font-black text-xs uppercase tracking-[0.3em]">No testimonials yet</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Add your first testimonial using the form</p>
            </div>
          ) : (
            testimonials.map((t) => {
              const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=3b82f6&color=fff&size=64`;
              return (
                <div
                  key={t._id}
                  className={`group bg-white rounded-[28px] border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden ${
                    !t.isActive ? 'opacity-60' : ''
                  } ${editingId === t._id ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100'}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-700 pointer-events-none"></div>

                  <div className="flex items-start gap-4 relative">
                    <img
                      src={getImageUrl(t.image) || avatarFallback}
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-slate-100"
                      onError={(e) => { e.target.src = avatarFallback; }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-black text-slate-900 text-[15px] tracking-tight leading-tight">{t.name}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{t.role}</p>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FiStar key={s} className={`w-3 h-3 ${s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-600 text-[13px] leading-relaxed mt-3 line-clamp-3">
                        &ldquo;{t.content}&rdquo;
                      </p>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">
                        {t.content.length}/{MAX_CONTENT} chars
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                    <button
                      onClick={() => toggleActive(t)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        t.isActive
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {t.isActive ? <FiCheck className="w-3 h-3" /> : <FiX className="w-3 h-3" />}
                      {t.isActive ? 'Visible' : 'Hidden'}
                    </button>

                    <div className="flex-1"></div>

                    <button
                      onClick={() => startEdit(t)}
                      className="w-9 h-9 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: t._id })}
                      className="w-9 h-9 bg-slate-50 border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Testimonial?"
        message="This testimonial will be permanently removed from your site."
      />
    </div>
  );
};

export default TestimonialManagement;

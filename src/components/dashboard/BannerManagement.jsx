import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiImage, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { bannerService } from '../../services/api';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null); // null = add mode
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', order: 0, isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await bannerService.getAll();
      setBanners(data.data || []);
    } catch (err) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAdd = () => {
    setEditBanner(null);
    setForm({ title: '', subtitle: '', order: banners.length, isActive: true });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEdit = (banner) => {
    setEditBanner(banner);
    setForm({ title: banner.title, subtitle: banner.subtitle || '', order: banner.order || 0, isActive: banner.isActive });
    setImageFile(null);
    setImagePreview(banner.image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditBanner(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editBanner && !imageFile) {
      toast.error('Please select a banner image');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('subtitle', form.subtitle);
      fd.append('order', form.order);
      fd.append('isActive', form.isActive);
      if (imageFile) fd.append('image', imageFile);

      if (editBanner) {
        await bannerService.update(editBanner._id, fd);
        toast.success('Banner updated!');
      } else {
        await bannerService.create(fd);
        toast.success('Banner added!');
      }
      closeModal();
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await bannerService.delete(id);
      toast.success('Banner deleted');
      fetchBanners();
    } catch {
      toast.error('Failed to delete banner');
    }
  };

  const toggleActive = async (banner) => {
    try {
      const fd = new FormData();
      fd.append('isActive', !banner.isActive);
      await bannerService.update(banner._id, fd);
      toast.success(`Banner ${!banner.isActive ? 'activated' : 'deactivated'}`);
      fetchBanners();
    } catch {
      toast.error('Failed to update banner');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Banner Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage the homepage hero carousel banners.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/30"
        >
          <FiPlus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-semibold">No banners yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-lg ${banner.isActive ? 'border-primary/30' : 'border-gray-200 opacity-60'}`}
            >
              {/* Image */}
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img
                  src={banner.image || FALLBACK_IMG}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Active badge */}
                <span className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-1 rounded-full ${banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {banner.isActive ? 'Active' : 'Hidden'}
                </span>
                <span className="absolute top-3 left-3 text-[10px] font-black text-white/80 bg-black/40 px-2 py-0.5 rounded-full">
                  Order #{banner.order}
                </span>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-black text-gray-900 text-base truncate">{banner.title}</h3>
                {banner.subtitle && <p className="text-gray-500 text-xs mt-1 truncate">{banner.subtitle}</p>}
              </div>
              {/* Actions */}
              <div className="px-4 pb-4 flex items-center gap-2">
                <button
                  onClick={() => openEdit(banner)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <FiEdit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => toggleActive(banner)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${banner.isActive ? 'bg-amber-50 hover:bg-amber-100 text-amber-700' : 'bg-green-50 hover:bg-green-100 text-green-700'}`}
                >
                  {banner.isActive ? <><FiEyeOff className="w-3.5 h-3.5" /> Hide</> : <><FiEye className="w-3.5 h-3.5" /> Show</>}
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">{editBanner ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image {!editBanner && <span className="text-red-500">*</span>}</label>
                <label className="relative cursor-pointer block">
                  <div className={`h-44 rounded-xl overflow-hidden border-2 border-dashed transition-all ${imagePreview ? 'border-primary/40' : 'border-gray-200 hover:border-primary/40'} bg-gray-50 flex items-center justify-center`}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiImage className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {editBanner && !imageFile && <p className="text-xs text-gray-400 mt-1">Leave empty to keep current image.</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. Luxury Villas in Dubai"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. Find your dream home today"
                />
              </div>

              {/* Order + Active Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer pb-2.5">
                    <div
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${form.isActive ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><FiCheck className="w-4 h-4" /> {editBanner ? 'Save Changes' : 'Add Banner'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;

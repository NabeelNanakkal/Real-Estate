import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiLayers, FiHome, FiShoppingBag, FiTrendingUp, FiExternalLink, FiMaximize } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import { categoryService } from '../../services/api';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const iconOptions = [
  { key: 'FiHome', icon: FiHome, label: 'Home' },
  { key: 'FaBuilding', icon: FaBuilding, label: 'Building' },
  { key: 'FiShoppingBag', icon: FiShoppingBag, label: 'Shopping Bag' },
  { key: 'FiTrendingUp', icon: FiTrendingUp, label: 'Trending Up' },
  { key: 'FiLayers', icon: FiLayers, label: 'Layers' }
];

const gradientOptions = [
  { value: 'from-blue-500 to-cyan-500', label: 'Blue Cyan' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple Pink' },
  { value: 'from-orange-500 to-red-500', label: 'Orange Red' },
  { value: 'from-green-500 to-teal-500', label: 'Green Teal' },
  { value: 'from-amber-500 to-orange-500', label: 'Amber Orange' },
  { value: 'from-indigo-500 to-blue-500', label: 'Indigo Blue' }
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    count: '',
    description: '',
    link: '',
    iconKey: 'FiHome',
    gradient: 'from-blue-500 to-cyan-500'
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await categoryService.getCategories();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      title: category.title,
      count: category.count,
      description: category.description,
      link: category.link,
      iconKey: category.iconKey,
      gradient: category.gradient
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      count: '',
      description: '',
      link: '',
      iconKey: 'FiHome',
      gradient: 'from-blue-500 to-cyan-500'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        const { data } = await categoryService.updateCategory(editingId, formData);
        if (data.success) {
          setCategories(categories.map(c => c._id === editingId ? data.data : c));
          toast.success('Category updated successfully!');
        }
      } else {
        const { data } = await categoryService.addCategory(formData);
        if (data.success) {
          setCategories([...categories, data.data]);
          toast.success('Category added successfully!');
        }
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteModal;
    try {
      const { data } = await categoryService.deleteCategory(id);
      if (data.success) {
        setCategories(categories.filter(c => c._id !== id));
        toast.success('Category deleted successfully!');
      }
    } catch (error) {
      toast.error('Error deleting category');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Categories...</div>;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Categories</h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Manage how properties are grouped</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] sticky top-32">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
                {editingId ? <FiEdit2 className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">{editingId ? 'Edit Category' : 'New Category'}</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{editingId ? 'Changing details' : 'Category Name'}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category Name</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                  placeholder="e.g. Apartments"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Property Count</label>
                  <input
                    type="text"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                    placeholder="e.g. 500+"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Select Icon</label>
                  <select
                    value={formData.iconKey}
                    onChange={(e) => setFormData({ ...formData, iconKey: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px] appearance-none cursor-pointer"
                  >
                    {iconOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                  placeholder="e.g. Luxury family homes"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Link</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                  placeholder="/properties?category=..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Color Theme</label>
                <select
                  value={formData.gradient}
                  onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px] appearance-none cursor-pointer"
                >
                  {gradientOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              
              <div className="pt-6 flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:shadow-slate-900/20 transform hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Category'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full py-4 bg-slate-100 text-slate-500 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Discard Changes
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => {
              const IconComp = iconOptions.find(o => o.key === category.iconKey)?.icon || FiLayers;
              return (
                <div key={category._id} className="group bg-white p-7 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-700"></div>
                    
                    <div className="flex items-start justify-between mb-6 relative">
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                            <IconComp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleEdit(category)}
                                className="w-9 h-9 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm flex items-center justify-center"
                                title="Edit"
                            >
                                <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(category._id)}
                                className="w-9 h-9 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm flex items-center justify-center"
                                title="Delete"
                            >
                                <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{category.title}</h3>
                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600 mb-3">{category.count}</p>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{category.description}</p>
                    </div>

                    <div className="mt-6 flex items-center text-primary font-black text-[9px] uppercase tracking-[0.2em] group-hover:opacity-100 opacity-60 transition-opacity">
                        <span className="mr-2">View Category</span>
                        <FiExternalLink className="w-3 h-3" />
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This will affect property groupings."
      />
    </div>
  );
};

export default CategoryManagement;

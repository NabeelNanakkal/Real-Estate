import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  FiEdit2, FiTrash2, FiEye, FiSearch, FiChevronLeft, FiChevronRight, 
  FiPlus, FiX, FiCheck, FiLayers, FiMapPin, FiHome, FiUpload, 
  FiCheckSquare, FiImage, FiFilter, FiChevronDown, FiAlertCircle 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { propertyService, categoryService } from '../../services/api';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';
import { AMENITIES } from '../../constants/amenities';
import { getImageUrl } from '../../utils/imageUtils';
import { PROPERTY_TYPES, DEFAULT_PROPERTY_TYPE } from '../../constants/propertyTypes';
import { PROPERTY_STATUS, LISTING_TYPE, STATUS_FILTER_ALL } from '../../constants/statuses';
import { SORT_OPTIONS, SORT, DEFAULT_SORT } from '../../constants/sortOptions';
import { useAuth } from '../../context/AuthContext';

const PropertyManagement = () => {
  const { formatPrice, activeCurrency } = useAuth();
  // --- STATE ---
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER_ALL);
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Drawer & Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' | 'edit'
  const [formData, setFormData] = useState({
    _id: null, title: '', description: '', propertyType: '', category: '', listingType: LISTING_TYPE.SALE, price: '',
    location: '', city: '', mapUrl: '', bedrooms: '', bathrooms: '', area: '',
    parking: '', amenities: [], images: [], nearby: []
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch Properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data } = await propertyService.getProperties();
        if (data.success) {
          setProperties(data.data);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to sync properties from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fetch categories for the dropdown
  useEffect(() => {
    categoryService.getCategories()
      .then(({ data }) => { if (data.success) setCategories(data.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // --- LOGIC ---
  const filteredProperties = useMemo(() => {
    let result = properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === STATUS_FILTER_ALL || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortOption === SORT.PRICE_HIGH) result.sort((a, b) => b.price - a.price);
    if (sortOption === SORT.PRICE_LOW)  result.sort((a, b) => a.price - b.price);
    if (sortOption === SORT.VIEWS)      result.sort((a, b) => b.views - a.views);
    if (sortOption === SORT.NEWEST)     result.sort((a, b) => b._id.localeCompare(a._id));

    return result;
  }, [properties, searchTerm, statusFilter, sortOption]);

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const determineListingType = (categoryTitle) => {
    if (!categoryTitle) return LISTING_TYPE.SALE;
    const title = categoryTitle.toLowerCase();
    if (title.includes('rent')) return 'rent';
    if (title.includes('commercial')) return 'commercial';
    return 'sale';
  };

  // Drawer Handlers
  const handleOpenAdd = () => {
    setDrawerMode('add');
    setFormData({
      _id: null,
      listingId: `EH-${Math.floor(1000 + Math.random() * 9000)}`,
      title: '', description: '', propertyType: DEFAULT_PROPERTY_TYPE, listingType: LISTING_TYPE.SALE, price: '',
      location: '', city: '', mapUrl: '', category: '',
      bedrooms: '', bathrooms: '', area: '',
      parking: '', amenities: [], images: [], nearby: []
    });
    setPreviews([]);
    setImageFiles([]);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (property) => {
    setDrawerMode('edit');
    setFormData({
      _id: property._id,
      listingId: property.listingId || `EH-${Math.floor(1000 + Math.random() * 9000)}`,
      title: property.title,
      description: property.description || '',
      propertyType: property.propertyType || property.type || '',
      listingType: property.listingType || (property.category?.title ? determineListingType(property.category.title) : LISTING_TYPE.SALE),
      category: property.category?._id || property.category || '',
      price: property.price,
      location: property.location,
      city: property.city || '',
      mapUrl: property.mapUrl || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.area || '',
      parking: property.parking || '',
      amenities: property.amenities || [],
      images: property.images || [],
      nearby: property.nearby || []
    });
    setPreviews(property.images || []);
    setImageFiles([]);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (property) => {
    setDrawerMode('view');
    setFormData({
      _id: property._id,
      title: property.title,
      description: property.description || '',
      propertyType: property.propertyType || property.type || '',
      listingType: property.listingType || (property.category?.title ? determineListingType(property.category.title) : LISTING_TYPE.SALE),
      category: property.category?._id || property.category || '',
      price: property.price,
      location: property.location,
      city: property.city || '',
      mapUrl: property.mapUrl || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.area || '',
      parking: property.parking || '',
      amenities: property.amenities || [],
      images: property.images || []
    });
    setIsDrawerOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    // If it's an existing image (string URL)
    if (typeof previews[index] === 'string' && previews[index].startsWith('http')) {
       setFormData(prev => ({
         ...prev,
         images: prev.images.filter((_, i) => i !== index)
       }));
    } else {
       // Find relative index in imageFiles
       const existingImagesCount = formData.images.length;
       const fileIndex = index - existingImagesCount;
       const newFiles = [...imageFiles];
       newFiles.splice(fileIndex, 1);
       setImageFiles(newFiles);
    }

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submitData = new FormData();
      
      // Append core fields
      Object.keys(formData).forEach(key => {
        if (key === '_id' || key === 'images') return; 
        if (key === 'amenities' || key === 'nearby') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key] === null || formData[key] === undefined ? '' : formData[key]);
        }
      });

      // Handle existing images
      submitData.append('existingImages', JSON.stringify(formData.images || []));

      // Append new files
      imageFiles.forEach(file => {
        if (file instanceof File) {
          submitData.append('images', file);
        }
      });

      if (drawerMode === 'add') {
        const { data } = await propertyService.createProperty(submitData);
        if (data.success) {
          setProperties([data.data, ...properties]);
          toast.success('Property created successfully!');
        }
      } else {
        const { data } = await propertyService.updateProperty(formData._id, submitData);
        if (data.success) {
          setProperties(properties.map(p => 
            p._id === formData._id ? data.data : p
          ));
          toast.success('Property updated successfully!');
        }
      }
      setIsDrawerOpen(false);
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to save property changes.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity) => {
    const exists = formData.amenities.find(a => a.name === amenity.name);
    setFormData(prev => ({
      ...prev,
      amenities: exists
        ? prev.amenities.filter(a => a.name !== amenity.name)
        : [...prev.amenities, amenity]
    }));
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await propertyService.deleteProperty(deleteConfirmId);
      setProperties(properties.filter(p => p._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      toast.success('Property deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-12 pb-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Portfolio Registry</h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Manage your high-value assets</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Search */}
          <div className="relative group w-full md:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-[13px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            />
          </div>
          
          <div className="grid grid-cols-2 md:flex items-center gap-4 w-full md:w-auto">
            {/* Filter Status */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto appearance-none pl-5 pr-10 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-black text-[9px] uppercase tracking-widest cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-slate-600"
              >
                <option value={STATUS_FILTER_ALL}>All Status</option>
                {Object.values(PROPERTY_STATUS).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5" />
            </div>

            {/* Sorting */}
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full md:w-auto appearance-none pl-5 pr-10 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-black text-[9px] uppercase tracking-widest cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-slate-600"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>

          <button 
            onClick={handleOpenAdd}
            className="w-full md:w-auto bg-[#0F172A] text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 flex items-center justify-center space-x-2 transform hover:-translate-y-1 transition-all"
          >
            <FiPlus className="text-base" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* Assets Card Area */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Portfolio Listing</th>
                <th className="px-6 py-5 text-center">Infrastructure</th>
                <th className="px-6 py-5">Valuation</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProperties.map((p, idx) => (
                <tr key={p._id} className="group hover:bg-slate-50/40 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-lg group-hover:shadow-primary/10 transition-shadow">
                        <img src={getImageUrl(p.images?.[0])} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-base group-hover:text-primary transition-colors tracking-tight">{p.title}</h4>
                        <div className="flex items-center text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">
                          <FiMapPin className="mr-1 text-primary" />
                          {p.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center items-center space-x-3">
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-sm font-black text-slate-900">{p.bedrooms}</div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Beds</div>
                        </div>
                        <div className="w-px h-6 bg-slate-100"></div>
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-sm font-black text-slate-900">{p.bathrooms}</div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Baths</div>
                        </div>
                        <div className="w-px h-6 bg-slate-100"></div>
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="text-sm font-black text-slate-900">{p.area?.toLocaleString() || '0'}</div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Sqft</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-black text-slate-900 text-lg tracking-tight">{formatPrice(p.price || 0)}</div>
                    <div className="text-[9px] font-black text-emerald-500 tracking-widest mt-0.5 uppercase opacity-80">Market Value</div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      p.status === PROPERTY_STATUS.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500' :
                      p.status === PROPERTY_STATUS.SOLD   ? 'bg-slate-50 text-slate-400 border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900' :
                      'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2.5">
                       <button onClick={() => handleOpenView(p)} className="w-9 h-9 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center">
                         <FiEye className="w-3.5 h-3.5" />
                       </button>
                       <button onClick={() => handleOpenEdit(p)} className="w-9 h-9 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm flex items-center justify-center">
                         <FiEdit2 className="w-3.5 h-3.5" />
                       </button>
                       <button onClick={() => setDeleteConfirmId(p._id)} className="w-9 h-9 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm flex items-center justify-center">
                         <FiTrash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedProperties.length === 0 && (
            <div className="py-32 text-center">
               <div className="text-slate-300 font-black text-xs uppercase tracking-[0.3em] mb-4">No matching assets in registry</div>
               <button onClick={() => {setSearchTerm(''); setStatusFilter('All');}} className="text-primary font-black text-[10px] uppercase tracking-widest border-b-2 border-primary/20 hover:border-primary transition-all">Reset global filters</button>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="mt-auto p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50 bg-slate-50/20">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Displaying {paginatedProperties.length} of {filteredProperties.length} Registered Assets
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 disabled:opacity-30 hover:shadow-xl transition-all group"
            >
              <FiChevronLeft className="group-hover:-translate-x-1 transition-transform w-4 h-4" />
            </button>
            <div className="flex items-center bg-white px-1.5 py-1.5 rounded-2xl border border-slate-100 shadow-sm">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl text-[9px] font-black transition-all duration-300 ${
                      currentPage === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 disabled:opacity-30 hover:shadow-xl transition-all group"
            >
              <FiChevronRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- SIDE DRAWER --- */}
      {createPortal(
        <div className={`fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl transition-transform duration-500 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {drawerMode === 'add' ? 'Add New Property' : drawerMode === 'edit' ? 'Edit Property' : 'Property Details'}
                  </h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                    {drawerMode === 'view' ? 'Read-Only Access' : 'Management Console'}
                  </p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-white hover:bg-gray-100 rounded-2xl transition-all shadow-sm group">
                  <FiX className="text-xl text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Drawer Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Property Title</label>
                    <input 
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      readOnly={drawerMode === 'view'}
                      className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-primary focus:ring-4 focus:ring-primary/5' : 'cursor-default'}`}
                      placeholder="e.g. Modern Sunset Villa"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Price ({activeCurrency.symbol})</label>
                    <input 
                      type="number" required value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      readOnly={drawerMode === 'view'}
                      className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-primary focus:ring-4 focus:ring-primary/5' : 'cursor-default'}`}
                      placeholder="e.g. 250000"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Property Type</label>
                    <select 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      disabled={drawerMode === 'view'}
                      className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm appearance-none ${drawerMode !== 'view' ? 'focus:border-primary focus:ring-4 focus:ring-primary/5 cursor-pointer' : 'cursor-default'}`}
                      required
                    >
                      <option value="">Select Type</option>
                      {PROPERTY_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Category <span className="text-red-400">*</span></label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        const cat = categories.find(c => c._id === val);
                        let lt = formData.listingType;
                        if (cat) {
                          lt = determineListingType(cat.title);
                        }
                        setFormData({...formData, category: val, listingType: lt});
                      }}
                      disabled={drawerMode === 'view'}
                      required
                      className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm appearance-none ${drawerMode !== 'view' ? 'focus:border-primary focus:ring-4 focus:ring-primary/5 cursor-pointer' : 'cursor-default'}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                      ))}
                    </select>
                    {categories.length === 0 && drawerMode !== 'view' && (
                      <p className="text-[10px] text-amber-500 font-bold ml-2 mt-1">⚠ No categories yet. Add them from Categories section.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">City</label>
                    <input 
                      type="text" required value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      readOnly={drawerMode === 'view'}
                      className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5' : 'cursor-default'}`}
                      placeholder="e.g. New York"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Full Address</label>
                    <input 
                      type="text" required value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      readOnly={drawerMode === 'view'}
                      className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5' : 'cursor-default'}`}
                      placeholder="e.g. 123 Luxury Lane"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Google Maps Embed URL</label>
                  <input
                    type="url" value={formData.mapUrl || ''}
                    onChange={(e) => setFormData({...formData, mapUrl: e.target.value})}
                    readOnly={drawerMode === 'view'}
                    className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5' : 'cursor-default'}`}
                    placeholder="Paste Google Maps embed src URL"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-50">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Beds</label>
                    <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} readOnly={drawerMode === 'view'} className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5' : 'cursor-default'}`} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Baths</label>
                    <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} readOnly={drawerMode === 'view'} className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5' : 'cursor-default'}`} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">SQFT</label>
                    <input type="number" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} readOnly={drawerMode === 'view'} className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5' : 'cursor-default'}`} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Garage</label>
                    <input type="number" value={formData.parking} onChange={(e) => setFormData({...formData, parking: e.target.value})} readOnly={drawerMode === 'view'} className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm ${drawerMode !== 'view' ? 'focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5' : 'cursor-default'}`} />
                  </div>
                </div>

                {/* Amenities */}
                <div className="pt-6 border-t border-gray-50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-6 block">Premium Amenities</label>
                  <div className="grid grid-cols-2 gap-4">
                    {AMENITIES.map((amenity) => (
                      <label 
                        key={amenity.name} 
                        className={`flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all border-2 ${
                          formData.amenities.find(a => a.name === amenity.name)
                            ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md shadow-orange-500/10'
                            : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50 shadow-sm'
                        } ${drawerMode === 'view' ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}
                      >
                        <input
                          type="checkbox"
                          checked={!!formData.amenities.find(a => a.name === amenity.name)}
                          onChange={() => drawerMode !== 'view' && toggleAmenity(amenity)}
                          className="hidden"
                          disabled={drawerMode === 'view'}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Narratives */}
                <div className="pt-6 border-t border-gray-50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Narrative Flow</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    readOnly={drawerMode === 'view'}
                    className={`w-full bg-white px-6 py-4 rounded-2xl outline-none border border-gray-100 shadow-sm transition-all font-bold text-sm min-h-[160px] resize-none ${drawerMode !== 'view' ? 'focus:ring-4 focus:ring-primary/10 focus:border-primary' : 'cursor-default'}`}
                    placeholder="Capture the unique essence of this high-value asset..."
                    required
                  />
                </div>

                {/* Visuals Gallery */}
                <div className="pt-6 border-t border-gray-50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-6 block">Visual Assets Portfolio</label>
                  
                  {previews && previews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {previews.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                          <img
                            src={getImageUrl(img)}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                          {drawerMode !== 'view' && (
                            <button 
                              type="button"
                              onClick={() => removePreview(idx)}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <FiX className="text-sm" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {drawerMode !== 'view' && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-16 border-4 border-dashed border-gray-50 rounded-[40px] text-center bg-gray-50/20 group hover:border-primary/20 transition-all cursor-pointer"
                    >
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <FiImage className="text-2xl text-primary" />
                      </div>
                      <h4 className="font-black text-gray-900 text-sm">Upload Property Images</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Architectural Renderings & Media</p>
                    </div>
                  )}
                  
                  {drawerMode === 'view' && (!previews || previews.length === 0) && (
                    <div className="p-16 border-4 border-dashed border-gray-50 rounded-[40px] text-center bg-gray-50/20">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
                        <FiImage className="text-2xl text-gray-300" />
                      </div>
                      <h4 className="font-black text-gray-400 text-sm">No Visual Assets Available</h4>
                    </div>
                  )}
                </div>
              </form>

              {/* Drawer Footer */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-6">
                <button 
                  type="button"
                  onClick={() => setIsDrawerOpen(false)} 
                  className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors"
                >
                  {drawerMode === 'view' ? 'Close Dossier' : 'Discard Draft'}
                </button>
                {drawerMode !== 'view' ? (
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="gradient-primary text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{drawerMode === 'add' ? 'Confirm Addition' : 'Save Changes'}</span>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={() => setDrawerMode('edit')}
                    className="bg-gray-900 text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/40 transform hover:-translate-y-1 transition-all"
                  >
                    Transition to Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- CONFIRMATION MODAL --- */}
      <DeleteConfirmModal 
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Property?"
        message="Are you sure you want to remove this property listing? This action cannot be undone."
      />
    </div>
  );
};

export default PropertyManagement;

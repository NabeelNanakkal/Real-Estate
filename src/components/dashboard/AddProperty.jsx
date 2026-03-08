import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome, FiMapPin, FiCheckCircle, FiCamera,
  FiArrowLeft, FiTrash2, FiSave, FiPlus, FiLayers
} from 'react-icons/fi';
import { propertyService, categoryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  apartment: {
    emoji: '🏢',
    label: 'Apartment',
    desc: 'Urban living space',
    specs: ['bedrooms', 'bathrooms', 'area', 'floor', 'totalFloors', 'parking'],
    extras: ['furnished'],
    amenities: ['Swimming Pool', 'Gym', 'Security System', 'Elevator', 'Balcony', 'Air Conditioning', 'Concierge Service', 'Laundry Room'],
  },
  villa: {
    emoji: '🏖️',
    label: 'Villa',
    desc: 'Luxury private estate',
    specs: ['bedrooms', 'bathrooms', 'area', 'plotSize', 'parking'],
    extras: [],
    amenities: ['Swimming Pool', 'Garden', 'Gym', 'Security System', 'Home Theater', 'Garage', 'BBQ Area', 'Sauna'],
  },
  house: {
    emoji: '🏠',
    label: 'House',
    desc: 'Family home',
    specs: ['bedrooms', 'bathrooms', 'area', 'houseFloors', 'parking'],
    extras: ['furnished'],
    amenities: ['Garden', 'Garage', 'Security System', 'Swimming Pool', 'Balcony', 'Air Conditioning', 'Basement', 'Attic'],
  },
  office: {
    emoji: '🏬',
    label: 'Office',
    desc: 'Commercial workspace',
    specs: ['area', 'floor', 'totalFloors', 'parking'],
    extras: [],
    amenities: ['Meeting Rooms', 'Cafeteria', 'Security System', 'Elevator', 'Reception Area', 'Server Room', 'Parking', 'Lounge'],
  },
  land: {
    emoji: '🌿',
    label: 'Land',
    desc: 'Raw land parcel',
    specs: ['area', 'plotSize'],
    extras: ['roadAccess', 'zoning'],
    amenities: [],
  },
};

const SPEC_FIELDS = {
  bedrooms:    { label: 'Bedrooms',          placeholder: '0' },
  bathrooms:   { label: 'Bathrooms',         placeholder: '0' },
  area:        { label: 'Area (sq ft)',       placeholder: '0' },
  floor:       { label: 'Floor No.',         placeholder: '1' },
  totalFloors: { label: 'Total Floors',      placeholder: '0' },
  parking:     { label: 'Parking Spaces',    placeholder: '0' },
  plotSize:    { label: 'Plot Size (sq ft)', placeholder: '0' },
  houseFloors: { label: 'No. of Floors',     placeholder: '1' },
};

const LISTING_TYPES = [
  { value: 'sale',       label: 'For Sale' },
  { value: 'rent',       label: 'For Rent' },
  { value: 'commercial', label: 'Commercial' },
];

const ZONING_OPTIONS = [
  { value: 'residential',  label: 'Residential' },
  { value: 'commercial',   label: 'Commercial' },
  { value: 'mixed',        label: 'Mixed Use' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'industrial',   label: 'Industrial' },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const { activeCurrency } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: '',
    listingType: 'sale', price: '', location: '', city: '',
    category: '',
    bedrooms: '', bathrooms: '', area: '', parking: '',
    floor: '', totalFloors: '', plotSize: '', houseFloors: '',
    furnished: false, roadAccess: false, zoning: '',
    yearBuilt: new Date().getFullYear(),
    amenities: [], nearby: [],
    listingId: `EH-${Math.floor(1000 + Math.random() * 9000)}`
  });
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    categoryService.getCategories()
      .then(({ data }) => { if (data.success) setCategories(data.data); })
      .catch(() => {});
  }, []);

  const selectedType = formData.propertyType ? TYPE_CONFIG[formData.propertyType] : null;

  const handleTypeSelect = (typeVal) => {
    setFormData(prev => ({ ...prev, propertyType: typeVal, amenities: [] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const cat = categories.find(c => c._id === value);
      let newListingType = formData.listingType;
      if (cat) {
        const title = cat.title.toLowerCase();
        if (title.includes('rent')) newListingType = 'rent';
        else if (title.includes('commercial')) newListingType = 'commercial';
        else if (title.includes('sell') || title.includes('sale') || title.includes('buy')) newListingType = 'sale';
      }
      setFormData(prev => ({ ...prev, [name]: value, listingType: newListingType }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'amenities' || key === 'nearby') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          const val = formData[key];
          submitData.append(key, val === null || val === undefined ? '' : val);
        }
      });
      imageFiles.forEach(file => {
        if (file instanceof File) submitData.append('images', file);
      });
      const { data } = await propertyService.createProperty(submitData);
      if (data.success) {
        toast.success('Property added successfully.');
        navigate('/dashboard/properties');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-20 space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/dashboard/properties')}
          className="flex items-center space-x-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Properties</span>
        </button>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Add New Property</h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
          {selectedType ? `Adding a ${selectedType.label} — fill in the details below` : 'Select a property type to begin'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Step 1: Property Type Cards */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50" />
          <div className="flex items-center space-x-3 mb-8 relative">
            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
              <FiHome className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Property Type</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">What kind of property is this?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
            {Object.entries(TYPE_CONFIG).map(([val, cfg]) => {
              const isSelected = formData.propertyType === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleTypeSelect(val)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-[1.03]'
                      : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  <span className="text-3xl mb-2">{cfg.emoji}</span>
                  <span className="font-black text-[11px] uppercase tracking-wider">{cfg.label}</span>
                  <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{cfg.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rest of form revealed after type selection */}
        {selectedType && (
          <>
            {/* General Info */}
            <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-8 relative">
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
                  <FiLayers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">General Info</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Basic details and pricing</p>
                </div>
              </div>

              {/* Listing type pills */}
              <div className="mb-6">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 block mb-3">Listing Type</label>
                <div className="flex space-x-2 flex-wrap gap-2">
                  {LISTING_TYPES.map(lt => (
                    <button
                      key={lt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, listingType: lt.value }))}
                      className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        formData.listingType === lt.value
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Property Title</label>
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange} required
                    placeholder={`e.g. Modern ${selectedType.label} in Dubai Marina`}
                    className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange} rows="4" required
                    placeholder={`Describe the ${selectedType.label.toLowerCase()} here...`}
                    className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all resize-none text-[13px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Price ({activeCurrency.symbol})</label>
                  <input
                    type="number" name="price" value={formData.price} onChange={handleChange} required
                    placeholder="0"
                    className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                  />
                </div>

                {/* Category selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category" value={formData.category} onChange={handleChange} required
                    className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px] appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-[10px] text-amber-500 font-bold ml-3">⚠ No categories found. Add categories first from the dashboard.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Year Built</label>
                  <input
                    type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange}
                    min="1900" max={new Date().getFullYear()}
                    className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                  />
                </div>
              </div>
            </div>

            {/* Location & Specs */}
            <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none opacity-50" />
              <div className="flex items-center space-x-3 mb-8 relative">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Location & Specs</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Address, size & {selectedType.label.toLowerCase()} details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Address</label>
                  <input
                    type="text" name="location" value={formData.location} onChange={handleChange} required
                    placeholder="Full address"
                    className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">City</label>
                  <input
                    type="text" name="city" value={formData.city} onChange={handleChange} required
                    placeholder="e.g. Dubai"
                    className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                  />
                </div>

                {/* Dynamic spec fields per type */}
                {selectedType.specs.map(specKey => (
                  <div key={specKey} className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">
                      {SPEC_FIELDS[specKey].label}
                    </label>
                    <input
                      type="number" name={specKey} value={formData[specKey]} onChange={handleChange}
                      placeholder={SPEC_FIELDS[specKey].placeholder} min="0"
                      className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                    />
                  </div>
                ))}

                {/* Furnished toggle — apartment, house */}
                {selectedType.extras.includes('furnished') && (
                  <div className="flex items-center justify-between bg-slate-50 px-6 py-4 rounded-xl">
                    <div>
                      <p className="font-black text-[11px] uppercase tracking-widest text-slate-700">Furnished</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">Comes with furniture</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('furnished')}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${formData.furnished ? 'bg-slate-900' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${formData.furnished ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                )}

                {/* Road Access toggle — land */}
                {selectedType.extras.includes('roadAccess') && (
                  <div className="flex items-center justify-between bg-slate-50 px-6 py-4 rounded-xl">
                    <div>
                      <p className="font-black text-[11px] uppercase tracking-widest text-slate-700">Road Access</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">Direct road access available</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('roadAccess')}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${formData.roadAccess ? 'bg-slate-900' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${formData.roadAccess ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                )}

                {/* Zoning select — land */}
                {selectedType.extras.includes('zoning') && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Zoning</label>
                    <select
                      name="zoning" value={formData.zoning} onChange={handleChange}
                      className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px] appearance-none"
                    >
                      <option value="">Select Zoning</option>
                      {ZONING_OPTIONS.map(z => (
                        <option key={z.value} value={z.value}>{z.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities — only shown for types that have them */}
            {selectedType.amenities.length > 0 && (
              <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shadow-inner">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Amenities</h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Select {selectedType.label.toLowerCase()} features
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedType.amenities.map(amenity => {
                    const active = formData.amenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all border ${
                          active
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox" className="hidden"
                          checked={active}
                          onChange={() => handleAmenityChange(amenity)}
                        />
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                          active ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200'
                        }`}>
                          {active && <FiCheckCircle className="w-3 h-3" />}
                        </div>
                        <span className="font-bold text-[11px] uppercase tracking-wider">{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Photos */}
            <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50" />
              <div className="flex items-center space-x-3 mb-8 relative">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shadow-inner">
                  <FiCamera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Photos</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Upload property images</p>
                </div>
              </div>
              <div className="space-y-6 relative">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-44 border-4 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50 hover:bg-white hover:border-orange-200 transition-all cursor-pointer group"
                >
                  <input type="file" multiple className="hidden" id="image-upload" onChange={handleImageChange} accept="image/*" />
                  <FiPlus className="text-3xl text-slate-300 mb-2 group-hover:scale-110 group-hover:text-orange-400 transition-all" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to Add Images</span>
                  <span className="text-[9px] text-slate-400 mt-1">PNG, JPG, WEBP supported</span>
                </label>
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews.map((src, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group shadow-sm border border-slate-100">
                        <img src={src} alt="preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <button
                          type="button" onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit" disabled={loading}
                className="group flex items-center space-x-3 px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:shadow-primary/30 hover:bg-primary transition-all disabled:opacity-50 transform hover:-translate-y-1"
              >
                {loading ? (
                  <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSave className="text-lg" />
                    <span>Save Property</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AddProperty;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUpload, FiX, FiHome, FiMapPin, FiLayers, 
  FiCheckSquare, FiImage, FiPlus, FiArrowLeft, 
  FiCheckCircle, FiTrash2, FiSave, FiCamera
} from 'react-icons/fi';
import { propertyService } from '../../services/api';
import toast from 'react-hot-toast';
import { AMENITIES } from '../../constants/amenities';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    listingType: 'sale',
    price: '',
    location: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    parking: '',
    amenities: [],
    nearby: [
      { name: 'Central School', distance: '0.5 miles', type: 'school' },
      { name: 'City Hospital', distance: '1.2 miles', type: 'hospital' }
    ],
    yearBuilt: new Date().getFullYear(),
    listingId: `EH-${Math.floor(1000 + Math.random() * 9000)}`
  });
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
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
          submitData.append(key, formData[key] === null || formData[key] === undefined ? '' : formData[key]);
        }
      });
      imageFiles.forEach(file => {
        if (file instanceof File) {
          submitData.append('images', file);
        }
      });

      const { data } = await propertyService.createProperty(submitData);
      if (data.success) {
        toast.success('Property added successfully.');
        navigate('/dashboard/properties');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to persist property.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="animate-fade-in pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <button 
            onClick={() => navigate('/dashboard/properties')}
            className="flex items-center space-x-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Assets</span>
          </button>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Add New Property</h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Enter property details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Intelligence */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
          
          <div className="flex items-center space-x-3 mb-8 relative">
            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
              <FiHome className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">General Information</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Basic property details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Property Title</label>
              <input
                type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                placeholder="e.g. Modern Villa" required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Property Description</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange} rows="4"
                className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all resize-none text-[13px]"
                placeholder="Describe the property here..." required
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Property Type</label>
              <select
                name="propertyType" value={formData.propertyType} onChange={handleChange}
                className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all appearance-none text-[13px]"
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Price ($)</label>
              <input
                type="number" name="price" value={formData.price} onChange={handleChange}
                className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 transition-all text-[13px]"
                placeholder="0.00" required
              />
            </div>
          </div>
        </div>

        {/* Spatial Infrastructure */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mb-24 pointer-events-none opacity-50"></div>
          
          <div className="flex items-center space-x-3 mb-8 relative">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
              <FiMapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Location & size</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Address and measurements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Base Address</label>
              <input
                type="text" name="location" value={formData.location} onChange={handleChange}
                className="w-full bg-slate-50 border-none px-6 py-3.5 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                placeholder="Full operational coordinate" required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:col-span-2">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">City</label>
                <input
                  type="text" name="city" value={formData.city} onChange={handleChange}
                  className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                  placeholder="e.g. Dubai" required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Bedrooms</label>
                <input
                  type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange}
                  className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                  placeholder="0" required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Bathrooms</label>
                <input
                  type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange}
                  className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                  placeholder="0" required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Area (sq ft)</label>
                <input
                  type="number" name="area" value={formData.area} onChange={handleChange}
                  className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/5 transition-all text-[13px]"
                  placeholder="0" required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Amenities */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shadow-inner">
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Amenities</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select property features</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AMENITIES.map(({ name }) => (
              <label
                key={name}
                className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all border ${
                  formData.amenities.includes(name)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox" className="hidden"
                  checked={formData.amenities.includes(name)}
                  onChange={() => handleAmenityChange(name)}
                />
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                  formData.amenities.includes(name)
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-white border-slate-200'
                }`}>
                  {formData.amenities.includes(name) && <FiCheckCircle className="w-3 h-3" />}
                </div>
                <span className="font-bold text-[11px] uppercase tracking-wider">{name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Visual Portfolio */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
          
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
            <div className="flex flex-col items-center justify-center h-48 border-4 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50 hover:bg-white hover:border-orange-200 transition-all group">
              <input
                type="file" multiple className="hidden" id="image-upload"
                onChange={handleImageChange} accept="image/*"
              />
              <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
                <FiPlus className="text-3xl text-slate-300 mb-2 group-hover:scale-110 group-hover:text-orange-400 transition-all" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Images</span>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="aspect-square rounded-2xl overflow-hidden relative group shadow-sm border border-slate-100">
                    <img src={preview} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <button
                      type="button" onClick={() => removeImage(index)}
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

        {/* Action Threshold */}
        <div className="flex justify-end pt-8">
          <button
            type="submit" disabled={loading}
            className="group flex items-center space-x-3 px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:shadow-primary/30 hover:bg-primary transition-all disabled:opacity-50 transform hover:-translate-y-1"
          >
            {loading ? (
              <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiSave className="text-lg" />
                <span>Save Property</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;

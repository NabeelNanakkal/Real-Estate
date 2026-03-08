import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { 
  FiMapPin, FiMaximize2, FiShare2, FiPhone, FiMail,
  FiCalendar, FiCheckCircle, FiChevronRight, FiX, FiChevronLeft
} from 'react-icons/fi';
import { FaBath, FaBed } from 'react-icons/fa';
import { propertyService, inquiryService } from '../services/api';
import { FEATURE_ICON_MAP } from '../constants/iconMap';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { formatPrice } = useAuth();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = React.useRef(null);

  // Close share popup when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data } = await propertyService.getProperty(id);
        if (data.success) {
          setProperty(data.data);
          
          // Fetch similar properties by type
          const { data: similarData } = await propertyService.getProperties({ 
            propertyType: data.data.propertyType,
            limit: 10 
          });
          if (similarData.success) {
            // Filter out current property and prioritize same city if available
            const filtered = similarData.data.filter(p => p._id !== id);
            
            // Optional: Sort so same city comes first
            const sorted = filtered.sort((a, b) => {
              if (a.city === data.data.city && b.city !== data.data.city) return -1;
              if (a.city !== data.data.city && b.city === data.data.city) return 1;
              return 0;
            });

            setSimilarProperties(sorted.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !property) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-bold">{error || 'Property not found.'}</div>;

  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone || !inquiryForm.message) {
      return toast.error('Please fill in all fields');
    }

    try {
      setInquiryLoading(true);
      const { data } = await inquiryService.createInquiry({
        ...inquiryForm,
        property: id
      });

      if (data.success) {
        toast.success('Inquiry sent successfully! Our agent will contact you soon.');
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (err) {
      console.error('Inquiry error:', err);
      toast.error(err.response?.data?.message || 'Failed to send inquiry.');
    } finally {
      setInquiryLoading(false);
    }
  };

  const scrollToInquiry = () => {
    const element = document.getElementById('inquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const propertyUrl = `${window.location.origin}/property/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl).then(() => {
      toast.success('Link copied to clipboard!');
      setShareOpen(false);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Check out this property: ${propertyUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    setShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumbs & Title Section */}
      <div className="pt-28 pb-8 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <FiChevronRight className="mx-2" />
            <Link to="/properties" className="hover:text-primary">Properties</Link>
            <FiChevronRight className="mx-2" />
            <span className="text-gray-900 font-medium">{property.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {property.type}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-500">
                <FiMapPin className="mr-2 text-primary" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl md:text-4xl font-black text-primary mb-2">
                {formatPrice(property.price)}
              </div>
              <div className="flex items-center md:justify-end space-x-3">
                <div className="relative" ref={shareRef}>
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-semibold"
                  >
                    <FiShare2 /> <span>Share</span>
                  </button>

                  {/* Share Dropdown */}
                  {shareOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 10h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </span>
                        Copy Link
                      </button>
                      <div className="h-px bg-gray-100" />
                      <button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 transition-colors"
                      >
                        <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.101.546 4.073 1.5 5.787L0 24l6.389-1.674A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.844 0-3.576-.476-5.079-1.31l-.364-.214-3.792.993 1.012-3.698-.234-.38A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                        </span>
                        WhatsApp
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Grid Gallery Section */}
      <div className="container-custom py-8">
        <div className={`grid gap-4 h-[400px] md:h-[600px] rounded-3xl overflow-hidden animate-fade-in ${
          property.images?.length === 1 ? 'grid-cols-1' :
          property.images?.length === 2 ? 'grid-cols-2' :
          property.images?.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-1 md:grid-cols-4'
        }`}>
          {/* Main Large Image */}
          <div className={`${
            property.images?.length === 1 ? 'col-span-1' :
            property.images?.length === 2 ? 'col-span-1' :
            property.images?.length === 3 ? 'md:col-span-2' :
            'md:col-span-2'
          } h-full`}>
            <img 
              src={getImageUrl(property.images?.[0])} 
              alt="Main" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
              onClick={() => openGallery(0)}
            />
          </div>

          {/* Secondary Images Column */}
          {property.images?.length >= 2 && (
            <div className={`grid gap-4 h-full ${
              property.images.length === 2 ? 'grid-rows-1' :
              property.images.length === 3 ? 'grid-rows-2' :
              property.images.length === 4 ? 'grid-rows-1' :
              'grid-rows-2'
            }`}>
              <img 
                src={getImageUrl(property.images[1])} 
                alt="Interior" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
                onClick={() => openGallery(1)}
              />
              {(property.images.length === 3 || property.images.length >= 5) && (
                <img 
                  src={getImageUrl(property.images[2])} 
                  alt="Bedroom" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
                  onClick={() => openGallery(2)}
                />
              )}
            </div>
          )}

          {/* Tertiary Images Column */}
          {property.images?.length >= 4 && (
            <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-4 h-full">
              <img 
                src={getImageUrl(property.images[property.images.length === 4 ? 2 : 3])} 
                alt="Kitchen" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
                onClick={() => openGallery(property.images.length === 4 ? 2 : 3)}
              />
              <div className="relative h-full">
                <img 
                  src={getImageUrl(property.images[property.images.length === 4 ? 3 : 4])} 
                  alt="Exterior" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
                  onClick={() => openGallery(property.images.length === 4 ? 3 : 4)}
                />
                {property.images.length > 5 && (
                  <button 
                    onClick={() => openGallery(0)}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white font-bold hover:bg-black/60 transition-colors"
                  >
                    <span className="text-2xl">+{property.images.length - 5}</span>
                    <span className="text-sm">View All Photos</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
              {[
                { label: 'Bedrooms', value: property.bedrooms, icon: FaBed },
                { label: 'Bathrooms', value: property.bathrooms, icon: FaBath },
                { label: 'Area', value: `${property.area} sqft`, icon: FiMaximize2 },
                { label: 'Built', value: property.yearBuilt, icon: FiCalendar }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                      <Icon className="text-xl" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">{stat.value || '0'}</span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Description Tab Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['overview', 'amenities', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-5 text-sm font-bold capitalize transition-all relative ${
                      activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-bold mb-4">Property Description</h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-8">
                      {property.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                      <div>
                        <span className="text-sm text-gray-400 block mb-1 uppercase tracking-widest font-bold">Listing ID</span>
                        <span className="font-bold text-gray-800">{property.listingId}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400 block mb-1 uppercase tracking-widest font-bold">Property Type</span>
                        <span className="font-bold text-gray-800">Villa / Residential</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'amenities' && (
                  <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                    {property.amenities?.map((item, idx) => {
                      const Icon = FEATURE_ICON_MAP[item.iconKey] || FiCheckCircle;
                      return (
                        <div key={idx} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-50 bg-gray-50/50">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                            <Icon />
                          </div>
                          <span className="font-bold text-gray-700">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {activeTab === 'location' && (
                  <div className="animate-fade-in">
                    {property.mapUrl ? (
                      <div className="h-[400px] rounded-3xl overflow-hidden border-8 border-gray-50 grayscale hover:grayscale-0 transition-all duration-700 cursor-crosshair">
                        <iframe
                          src={property.mapUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          title="Property Location"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="h-[400px] rounded-3xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                        <FiMapPin className="w-12 h-12 mb-3 opacity-30" />
                        <p className="font-semibold text-sm">No map location added</p>
                        <p className="text-xs mt-1 opacity-60">The agent hasn't added a map embed URL for this property.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="w-2 h-8 bg-primary rounded-full mr-3"></span>
                Nearby Places
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {property.nearby?.map((place, idx) => {
                  const Icon = FEATURE_ICON_MAP[place.type] || FiMapPin;
                  return (
                    <div key={idx} className="flex items-center space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <Icon className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight">{place.name}</h4>
                        <p className="text-xs text-gray-500 font-semibold uppercase">{place.distance}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Agent */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-8 sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Agent</h3>
              


              <div className="grid grid-cols-1 gap-4 mb-8">
                <a href={`tel:${property.agent.phone}`} className="flex items-center justify-center space-x-2 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5">
                  <FiPhone /> <span>Call Agent</span>
                </a>
                <a href={`mailto:${property.agent.email}`} className="flex items-center justify-center space-x-2 py-3 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all transform hover:-translate-y-0.5">
                  <FiMail /> <span>Email Agent</span>
                </a>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-300">
                  <span className="bg-white px-4">Or Quick Inquiry</span>
                </div>
              </div>

              <form id="inquiry-form" onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-gray-400" 
                  />
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-gray-400" 
                  />
                </div>
                <div className="relative">
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-gray-400" 
                  />
                </div>
                <textarea 
                  placeholder="How can we help?" 
                  rows="4" 
                  required
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-gray-400 resize-none"
                ></textarea>
                <button 
                  type="submit" 
                  disabled={inquiryLoading}
                  className="w-full py-4 gradient-primary text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {inquiryLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Inquiry Now</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Preview */}
      <div className="bg-gray-900 py-20 mt-12">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 underline decoration-primary underline-offset-8">Similar Listings</h2>
              <p className="text-gray-400">Hand-picked properties near Beverly Hills that you might love.</p>
            </div>
            <Link to="/properties" className="text-primary font-bold hover:underline flex items-center">
              Explore All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {similarProperties.map((prop, idx) => (
              <Link key={prop._id} to={`/property/${prop._id}`} className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors">
                <div className="h-48 overflow-hidden">
                  <img src={getImageUrl(prop.images?.[0])} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-1">{prop.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <FiMapPin className="mr-1" /> {prop.city}, {prop.location}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary font-black">{formatPrice(prop.price)}</span>
                    <button className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">View Details →</button>
                  </div>
                </div>
              </Link>
            ))}
            {similarProperties.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 font-bold border border-dashed border-white/10 rounded-3xl">
                No similar listings found in this area.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-6 flex justify-between items-center text-white">
            <span className="font-bold text-lg">
              {currentImageIndex + 1} / {property.images.length}
            </span>
            <button 
              onClick={closeGallery}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            <button 
              onClick={prevImage}
              className="absolute left-8 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-10"
            >
              <FiChevronLeft className="text-2xl text-white" />
            </button>
            
            <img 
              src={getImageUrl(property.images?.[currentImageIndex])} 
              alt="Gallery Full" 
              className="max-w-full max-h-full object-contain rounded-lg animate-scale-in shadow-2xl"
            />

            <button 
              onClick={nextImage}
              className="absolute right-8 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-10"
            >
              <FiChevronRight className="text-2xl text-white" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="p-8 flex justify-center space-x-4 overflow-x-auto">
            {property.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  currentImageIndex === idx ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(img)} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;


import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiMapPin, FiMaximize2, FiShare2, FiPhone, FiMail, 
  FiCalendar, FiHash, FiCheckCircle, FiChevronRight,
  FiStar, FiClock, FiShoppingBag, FiTruck, FiX, FiChevronLeft
} from 'react-icons/fi';
import { FaBath, FaBed, FaParking, FaSwimmingPool, FaWifi, FaDumbbell, FaSchool } from 'react-icons/fa';

const PropertyDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Enhanced Mock Data
  const property = {
    id: 1,
    title: 'Modern Luxury Villa',
    location: 'Beverly Hills, CA',
    price: 1250000,
    type: 'For Sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    yearBuilt: 2022,
    listingId: 'EH-89241',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', // Living Room
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', // Bedroom
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', // Exterior
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', // Kitchen
      'https://images.unsplash.com/photo-1507089947368-19c1da977535?w=800', // Pool
    ],
    description: 'This stunning modern villa represents the pinnacle of luxury living in Beverly Hills. Boasting an open-concept design with floor-to-ceiling windows, the property is flooded with natural light and offers seamless indoor-outdoor flow. Every detail has been meticulously crafted with premium finishes, including Italian marble flooring, a chef-grade kitchen with Sub-Zero appliances, and a primary suite that rivals the world\'s finest hotels.',
    amenities: [
      { name: 'Swimming Pool', icon: FaSwimmingPool },
      { name: 'Private Gym', icon: FaDumbbell },
      { name: 'Smart Home', icon: FiCheckCircle },
      { name: 'High-speed WiFi', icon: FaWifi },
      { name: 'Secure Parking', icon: FaParking },
      { name: 'Security System', icon: FiCheckCircle },
    ],
    nearby: [
      { name: 'Highland School', distance: '1.2 miles', icon: FaSchool },
      { name: 'Century City Mall', distance: '2.5 miles', icon: FiShoppingBag },
      { name: 'Public Transit', distance: '0.5 miles', icon: FiTruck },
    ],
    agent: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      phone: '+1 (555) 123-4567',
      email: 'sarah.j@estatehub.com',
      listings: 12,
      rating: 4.9
    }
  };

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
                <span className="flex items-center text-yellow-500 font-semibold space-x-1">
                  <FiStar className="fill-current" />
                  <span>4.8 (24 Reviews)</span>
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
                ${property.price.toLocaleString()}
              </div>
              <div className="flex items-center md:justify-end space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-semibold">
                  <FiShare2 /> <span>Share</span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Gallery Section */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[600px] rounded-3xl overflow-hidden animate-fade-in">
          <div className="md:col-span-2 h-full">
            <img 
              src={property.images[0]} 
              alt="Main" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
              onClick={() => openGallery(0)}
            />
          </div>
          <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-4 col-span-1 h-full">
            <img 
              src={property.images[1]} 
              alt="Interior" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
              onClick={() => openGallery(1)}
            />
            <img 
              src={property.images[2]} 
              alt="Bedroom" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
              onClick={() => openGallery(2)}
            />
          </div>
          <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-4 col-span-1 h-full">
            <img 
              src={property.images[3]} 
              alt="Kitchen" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
              onClick={() => openGallery(3)}
            />
            <div className="relative h-full">
              <img 
                src={property.images[4]} 
                alt="Pool" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
                onClick={() => openGallery(4)}
              />
              <button 
                onClick={() => openGallery(0)}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white font-bold hover:bg-black/60 transition-colors"
              >
                <span className="text-2xl">+{property.images.length}</span>
                <span className="text-sm">View All Photos</span>
              </button>
            </div>
          </div>
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
                    <span className="text-xl font-bold text-gray-900">{stat.value}</span>
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
                    {property.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-50 bg-gray-50/50">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                          <item.icon />
                        </div>
                        <span className="font-bold text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'location' && (
                  <div className="animate-fade-in">
                    <div className="h-[400px] rounded-3xl overflow-hidden border-8 border-gray-50 grayscale hover:grayscale-0 transition-all duration-700 cursor-crosshair">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.715226221469!2d-118.40296768478496!3d34.07362048060595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c37927bd4436!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1620311746524!5m2!1sen!2sus" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy"
                        title="Property Location"
                      ></iframe>
                    </div>
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
                {property.nearby.map((place, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <place.icon className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{place.name}</h4>
                      <p className="text-xs text-gray-500 font-semibold uppercase">{place.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Agent */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-8 sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Agent</h3>
              
              <div className="flex items-center space-x-4 mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <img src={property.agent.image} alt={property.agent.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-gray-200" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">{property.agent.name}</h4>
                  <p className="text-sm text-gray-500 mb-1 font-medium italic">Premium Realtor</p>
                  <div className="flex items-center text-yellow-500 text-sm font-bold">
                    <FiStar className="fill-current mr-1" />
                    <span>{property.agent.rating} / 5</span>
                  </div>
                </div>
              </div>

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

              <form className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="Full Name" className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-gray-400" />
                </div>
                <div className="relative">
                  <input type="email" placeholder="Email Address" className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-gray-400" />
                </div>
                <textarea placeholder="How can we help?" rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-medium placeholder:text-gray-400 resize-none"></textarea>
                <button type="submit" className="w-full py-4 gradient-primary text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Send Inquiry Now
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
            {[
              { title: 'Sunset Penthouse', price: '950,000', loc: 'Los Angeles, CA', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600' },
              { title: 'Oakwood Estate', price: '2,100,000', loc: 'Malibu, CA', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' },
              { title: 'Azure Beach House', price: '1,450,000', loc: 'Santa Monica, CA', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600' }
            ].map((prop, idx) => (
              <div key={idx} className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors">
                <div className="h-48 overflow-hidden">
                  <img src={prop.img} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-1">{prop.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <FiMapPin className="mr-1" /> {prop.loc}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary font-black">${prop.price}</span>
                    <button className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">View Details →</button>
                  </div>
                </div>
              </div>
            ))}
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
              src={property.images[currentImageIndex]} 
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
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;


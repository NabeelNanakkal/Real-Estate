import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiMapPin, FiMaximize2, FiSearch, FiCheck } from 'react-icons/fi';
import { FaBath, FaBed } from 'react-icons/fa';

const PropertyList = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [properties, setProperties] = useState([]);

  // Mock data - will be replaced with API call
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: 'Modern Luxury Villa',
        location: 'Beverly Hills, CA',
        price: 1250000,
        bedrooms: 4,
        bathrooms: 3,
        area: 3500,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        type: 'sale',
        propertyType: 'villa',
        badge: 'Featured',
        agent: {
          name: 'Sarah Jen',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        }
      },
      {
        id: 2,
        title: 'Downtown Apartment',
        location: 'Manhattan, NY',
        price: 850000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        type: 'sale',
        propertyType: 'apartment',
        badge: 'New',
        agent: {
          name: 'Mike Ross',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
        }
      },
      {
        id: 3,
        title: 'Beachfront Condo',
        location: 'Miami, FL',
        price: 2100000,
        bedrooms: 3,
        bathrooms: 3,
        area: 2500,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        type: 'sale',
        propertyType: 'condo',
        badge: 'Hot',
        agent: {
          name: 'Emily Chen',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
        }
      },
      {
        id: 4,
        title: 'Country Cottage',
        location: 'Austin, TX',
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        type: 'sale',
        propertyType: 'house',
        badge: '',
        agent: {
          name: 'David Kim',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        }
      },
      // Add more mock properties as needed
    ];
    setProperties(mockProperties);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative pt-32 pb-20 bg-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900"></div>
        </div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Dream {searchParams.get('type') === 'rent' ? 'Rental' : 'Home'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover a wide range of properties {searchParams.get('type') === 'rent' ? 'for rent' : 'for sale'} in the most desirable locations.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiFilter className="mr-2 text-primary" />
                  Filters
                </h3>
                <button className="text-sm text-gray-500 hover:text-primary transition-colors">
                  Reset
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search location..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {['Any', '1', '2', '3', '4+'].map((num) => (
                    <button key={num} className={`px-3 py-1.5 text-sm rounded-full border transition-all ${num === 'Any' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type</label>
                <div className="space-y-2">
                  {['House', 'Apartment', 'Condo', 'Villa'].map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center group-hover:border-primary transition-colors">
                        {/* Checkbox state logic would go here */}
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn-primary w-full py-3 shadow-lg shadow-primary/30">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:w-3/4">
            {/* View Toggle & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-gray-600 mb-4 sm:mb-0">
                Showing <span className="font-bold text-gray-900">{properties.length}</span> properties
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>

                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
                  <option>Sort by: Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            {/* Properties */}
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2' : 'grid-cols-1'} gap-8`}>
              {properties.map((property) => (
                <Link
                  key={property.id}
                  to={`/property/${property.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                       {property.badge && (
                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                          {property.badge}
                        </span>
                       )}
                       <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                         {property.type}
                       </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                       <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                         View Details
                       </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center text-gray-500 text-sm mb-1">
                          <FiMapPin className="w-4 h-4 mr-1 text-primary" />
                          {property.location}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        ${property.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-1" title="Bedrooms">
                          <FaBed className="w-4 h-4" />
                          <span className="text-sm font-medium">{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center space-x-1" title="Bathrooms">
                          <FaBath className="w-4 h-4" />
                          <span className="text-sm font-medium">{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center space-x-1" title="Area">
                          <FiMaximize2 className="w-4 h-4" />
                          <span className="text-sm font-medium">{property.area} sqft</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <img src={property.agent.image} alt={property.agent.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                        <span className="text-sm text-gray-600 font-medium">Listed by {property.agent.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">2 days ago</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;

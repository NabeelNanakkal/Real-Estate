import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiHome, FiMaximize2, FiGrid, FiList, FiChevronRight } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';
import { fetchProperties } from '../store/slices/propertySlice';
import EmptyState from '../components/common/EmptyState';
import { getImageUrl } from '../utils/imageUtils';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { BEDROOM_OPTIONS, PROPERTY_TYPE_FILTERS } from '../constants/propertyTypes';
import { LISTING_TYPE } from '../constants/statuses';

const PropertyList = () => {
  const { formatPrice } = useAuth();
  const dispatch = useDispatch();
  const { list: properties, loading, error, pagination } = useSelector(s => s.property);
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');

  // Filter state
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    propertyType: []
  });

  const buildParams = useCallback((page = 1) => ({
    type: filters.type || undefined,
    bedrooms: filters.bedrooms || undefined,
    city: filters.city || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    propertyType: filters.propertyType.length > 0 ? filters.propertyType.join(',') : undefined,
    page,
    limit: 10,
  }), [filters]);

  useEffect(() => {
    dispatch(fetchProperties(buildParams(1)));
  }, [filters.type, filters.bedrooms, filters.city, dispatch]); // eslint-disable-line

  const handleApplyFilters = () => {
    dispatch(fetchProperties(buildParams(1)));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchProperties(buildParams(newPage)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePropertyType = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type.toLowerCase())
        ? prev.propertyType.filter(t => t !== type.toLowerCase())
        : [...prev.propertyType, type.toLowerCase()]
    }));
  };

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
            Find Your Dream {searchParams.get('type') === LISTING_TYPE.RENT ? 'Rental' : 'Home'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover a wide range of properties {searchParams.get('type') === LISTING_TYPE.RENT ? 'for rent' : 'for sale'} in the most desirable locations.
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
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" 
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" 
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((num) => (
                    <button 
                      key={num} 
                      onClick={() => setFilters({...filters, bedrooms: num === 'Any' ? '' : num.replace('+', '')})}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                        (num === 'Any' && !filters.bedrooms) || (filters.bedrooms === num.replace('+', '')) 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type</label>
                <div className="space-y-2">
                  {PROPERTY_TYPE_FILTERS.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer group" onClick={() => togglePropertyType(type)}>
                      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                        filters.propertyType.includes(type.toLowerCase()) ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'
                      }`}>
                        {filters.propertyType.includes(type.toLowerCase()) && (
                           <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                           </svg>
                        )}
                      </div>
                      <span className={`text-gray-600 group-hover:text-gray-900 transition-colors ${filters.propertyType.includes(type.toLowerCase()) ? 'text-gray-900 font-medium' : ''}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleApplyFilters}
                className="btn-primary w-full py-3 shadow-lg shadow-primary/30"
              >
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
            {properties.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2' : 'grid-cols-1'} gap-8`}>
              {properties.map((property) => (
                <Link
                  key={property._id}
                  to={`/property/${property._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getImageUrl(property.images?.[0])}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                       {property.featured && (
                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                          Featured
                        </span>
                       )}
                       <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                         {property.propertyType}
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
                          {property.city}, {property.location}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(property.price)}
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
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          {property.agent?.avatar ? (
                            <img src={property.agent.avatar} alt={property.agent.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <FiHome className="text-gray-400 w-4 h-4" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">Listed by {property.agent?.name || 'Agent'}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(property.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
        ) : (
          <EmptyState />
        )}

        {/* Pagination UI - Always at bottom */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-2 w-full">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              Previous
            </button>
            
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-lg border transition-all font-bold ${
                  pagination.currentPage === i + 1
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.pages}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              Next
            </button>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiHome, FiDollarSign } from 'react-icons/fi';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    listingType: 'sale',
    minPrice: '',
    maxPrice: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.propertyType) params.append('propertyType', searchData.propertyType);
    if (searchData.listingType) params.append('type', searchData.listingType);
    if (searchData.minPrice) params.append('minPrice', searchData.minPrice);
    if (searchData.maxPrice) params.append('maxPrice', searchData.maxPrice);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSearchData({ ...searchData, listingType: 'sale' })}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            searchData.listingType === 'sale'
              ? 'bg-white text-primary shadow-lg'
              : 'text-white hover:bg-white/20'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSearchData({ ...searchData, listingType: 'rent' })}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            searchData.listingType === 'rent'
              ? 'bg-white text-primary shadow-lg'
              : 'text-white hover:bg-white/20'
          }`}
        >
          Rent
        </button>
        <button
          onClick={() => setSearchData({ ...searchData, listingType: 'commercial' })}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            searchData.listingType === 'commercial'
              ? 'bg-white text-primary shadow-lg'
              : 'text-white hover:bg-white/20'
          }`}
        >
          Commercial
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={searchData.location}
            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Property Type */}
        <div className="relative">
          <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={searchData.propertyType}
            onChange={(e) => setSearchData({ ...searchData, propertyType: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="office">Office</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="relative">
          <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={searchData.minPrice}
            onChange={(e) => setSearchData({ ...searchData, minPrice: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="">Min Price</option>
            <option value="50000">$50,000</option>
            <option value="100000">$100,000</option>
            <option value="200000">$200,000</option>
            <option value="500000">$500,000</option>
            <option value="1000000">$1,000,000</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center space-x-2"
        >
          <FiSearch className="w-5 h-5" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

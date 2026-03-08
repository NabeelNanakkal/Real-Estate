import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiHome } from 'react-icons/fi';
import { PROPERTY_TYPES } from '../../constants/propertyTypes';
import { useAuth } from '../../context/AuthContext';

const SearchBar = () => {
  const navigate = useNavigate();
  const { list: categories } = useSelector(s => s.category);
  const { activeCurrency } = useAuth();

  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    category: '',
    minPrice: '',
  });

  // Set default selected category to first one when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !searchData.category) {
      setSearchData(prev => ({ ...prev, category: categories[0].title }));
    }
  }, [categories]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.category) params.append('category', searchData.category);
    if (searchData.location) params.append('city', searchData.location);
    if (searchData.propertyType) params.append('propertyType', searchData.propertyType);
    if (searchData.minPrice) params.append('minPrice', searchData.minPrice);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setSearchData({ ...searchData, category: cat.title })}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                searchData.category === cat.title
                  ? 'bg-white text-primary shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {cat.title}
            </button>
          ))
        ) : (
          ['Buy', 'Rent', 'Commercial'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSearchData({ ...searchData, category: tab })}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                searchData.category === tab
                  ? 'bg-white text-primary shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))
        )}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Property Type */}
        <div className="relative">
          <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={searchData.propertyType}
            onChange={(e) => setSearchData({ ...searchData, propertyType: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="">Property Type</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold text-sm">
            {activeCurrency?.symbol || '$'}
          </span>
          <input
            type="number"
            min="0"
            value={searchData.minPrice}
            onChange={(e) => setSearchData({ ...searchData, minPrice: e.target.value })}
            className="w-full pl-14 pr-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-primary"
            placeholder="Min Price"
          />
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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMaximize2 } from 'react-icons/fi';
import { FaBath, FaBed } from 'react-icons/fa';
import { fetchFeaturedProperties } from '../../store/slices/propertySlice';
import { getImageUrl } from '../../utils/imageUtils';
import { useAuth } from '../../context/AuthContext';

const FeaturedProperties = () => {
  const { formatPrice } = useAuth();
  const dispatch = useDispatch();
  const { featured: properties, featuredLoading: loading } = useSelector(s => s.property);

  useEffect(() => {
    dispatch(fetchFeaturedProperties());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Featured Properties</h2>
            <p className="text-gray-500 font-medium">Handpicked properties just for you</p>
          </div>
          <Link to="/properties" className="text-primary font-black text-xs uppercase tracking-[0.2em] border-b-2 border-primary/20 pb-1 hover:border-primary transition-all hidden md:block">
            View All Assets
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link
              key={property._id}
              to={`/property/${property._id}`}
              className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={getImageUrl(property.images?.[0])}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Featured
                </div>
                
                <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-1.5 rounded-xl text-sm font-black shadow-xl">
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <FiMapPin className="w-3 h-3 mr-1 text-primary" />
                  <span>{property.city}, {property.location.split(',').pop()}</span>
                </div>
                
                <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {property.title}
                </h3>

                <div className="mt-auto flex items-center justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-gray-50">
                  <div className="flex items-center">
                    <FaBed className="w-3 h-3 mr-1.5 text-blue-500" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="w-3 h-3 mr-1.5 text-emerald-500" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <FiMaximize2 className="w-3 h-3 mr-1.5 text-orange-500" />
                    <span>{property.area} Sqft</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[48px] border border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-400">No synchronized properties available.</h3>
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Link to="/properties" className="gradient-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
            View All Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

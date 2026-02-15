import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMaximize2 } from 'react-icons/fi';
import { FaBath, FaBed } from 'react-icons/fa';

const FeaturedProperties = () => {
  // Mock data - will be replaced with API data
  const properties = [
    {
      id: 1,
      title: 'Modern Luxury Villa',
      location: 'Beverly Hills, CA',
      price: 1250000,
      bedrooms: 4,
      bathrooms: 3,
      area: 3500,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      featured: true,
      type: 'sale'
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
      featured: true,
      type: 'sale'
    },
    {
      id: 3,
      title: 'Beachfront Property',
      location: 'Miami, FL',
      price: 2100000,
      bedrooms: 5,
      bathrooms: 4,
      area: 4200,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      featured: true,
      type: 'sale'
    },
    {
      id: 4,
      title: 'Cozy Family House',
      location: 'Austin, TX',
      price: 650000,
      bedrooms: 3,
      bathrooms: 2,
      area: 2100,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      featured: true,
      type: 'sale'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600">Handpicked properties just for you</p>
          </div>
          <Link to="/properties" className="btn-secondary hidden md:block">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="card card-hover group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {property.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>

                <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <FaBed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaBath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiMaximize2 className="w-4 h-4" />
                    <span>{property.area} sqft</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-2xl font-bold text-gradient">
                    ${property.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/properties" className="btn-primary">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

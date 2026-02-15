import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

const PropertyCategories = () => {
  const categories = [
    {
      icon: FiHome,
      title: 'Residential',
      count: '500+',
      description: 'Apartments, Villas & Houses',
      link: '/properties?category=residential',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaBuilding,
      title: 'Commercial',
      count: '200+',
      description: 'Offices & Retail Spaces',
      link: '/properties?category=commercial',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: FiShoppingBag,
      title: 'For Rent',
      count: '300+',
      description: 'Rental Properties',
      link: '/properties?type=rent',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: FiTrendingUp,
      title: 'New Projects',
      count: '50+',
      description: 'Latest Developments',
      link: '/properties?featured=true',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect property type that suits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                to={category.link}
                className="group card card-hover p-6 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-3xl font-bold text-gradient mb-2">{category.count}</p>
                  <p className="text-gray-600">{category.description}</p>
                  
                  <div className="mt-4 text-primary font-semibold flex items-center space-x-2 group-hover:translate-x-2 transition-transform">
                    <span>Explore</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;

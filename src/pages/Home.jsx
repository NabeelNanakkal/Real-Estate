import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiHome, FiDollarSign, FiTrendingUp, FiAward, FiUsers, FiCheckCircle } from 'react-icons/fi';
import SearchBar from '../components/home/SearchBar';
import FeaturedProperties from '../components/home/FeaturedProperties';
import PropertyCategories from '../components/home/PropertyCategories';
import Stats from '../components/home/Stats';
import HeroCarousel from '../components/home/HeroCarousel';
import Testimonials from '../components/home/Testimonials';
import Partners from '../components/home/Partners';

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Section with Carousel */}
      <HeroCarousel />
      
      {/* Trusted Partners */}
      <Partners />

      {/* Property Categories */}
      <PropertyCategories />

      {/* Featured Properties */}
      <FeaturedProperties />

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EstateHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide the best service to help you find your perfect property with ease and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                <FiCheckCircle className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
              <p className="text-gray-600">Every property is thoroughly checked and verified for your peace of mind.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-secondary transition-colors duration-300">
                <FiAward className="w-10 h-10 text-accent-secondary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-600">Access the finest selection of luxury properties in prime locations.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors duration-300">
                <FiUsers className="w-10 h-10 text-green-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-600">Our dedicated team of professionals is here to guide you 24/7.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <FiTrendingUp className="w-10 h-10 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Market Insights</h3>
              <p className="text-gray-600">Get valuable data and trends to make informed investment decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Background */}
      <div className="relative py-20 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)' }}>
        <div className="absolute inset-0 bg-gray-900/85"></div>
        <div className="relative z-10">
          <Stats />
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#1a1a1a] to-[#0F0F0F]"></div>

        {/* Floating Background Effects */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float delay-500"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="glass max-w-4xl mx-auto rounded-3xl p-8 md:p-10 text-center transform hover:scale-[1.01] transition-transform duration-500 border border-white/10 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Unlock Your Dream Lifestyle
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              Don't just look for a place to live. Find a place to <span className="text-primary font-semibold">thrive</span>.
              Join our exclusive network of homeowners today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/properties" className="group relative px-6 py-3 bg-white text-primary rounded-xl font-bold text-base overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                <span className="relative z-10 group-hover:text-primary-dark transition-colors">Start Browsing</span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-primary/10"></div>
              </Link>
              
              <Link to="/contact" className="group px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold text-base hover:bg-white/20 transition-all hover:border-white/50">
                Contact an Agent
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center items-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-accent" /> <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-accent" /> <span>Verified Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-accent" /> <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners } from '../../store/slices/partnerSlice';

const Partners = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.partner);

  const defaultPartners = [
    { name: 'TechHome', icon: '🏠' },
    { name: 'EcoBuild', icon: '🌿' },
    { name: 'UrbanDesign', icon: '🏙️' },
    { name: 'SmartLiving', icon: '💡' },
    { name: 'FutureSpace', icon: '🚀' },
    { name: 'GreenHouse', icon: '🌲' },
    { name: 'SkyHigh', icon: '☁️' },
    { name: 'ModernEst', icon: '🏢' },
  ];

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const partners = list.length > 0 ? list : defaultPartners;

  if (loading) {
    return (
      <div className="py-16 bg-white animate-pulse">
        <div className="container-custom flex justify-center space-x-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 w-32 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white border-b border-gray-100 overflow-hidden relative">
      <div className="container-custom">
        <p className="text-center text-gray-400 font-semibold mb-12 uppercase tracking-[0.2em] text-sm">Trusted by Industry Leaders</p>
        
        <div className="relative w-full overflow-hidden mask-linear-fade">
          {/* Gradient Masks */}
          <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div className="flex w-max animate-scroll pause-on-hover">
            {/* First Set */}
            <div className="flex items-center gap-16 px-8">
              {partners.map((partner, index) => (
                <div key={`p1-${index}`} className="flex items-center space-x-3 group cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{partner.icon}</span>
                  <span className="text-xl font-bold text-gray-400 group-hover:text-primary transition-colors">{partner.name}</span>
                </div>
              ))}
            </div>
            {/* Duplicate Set for Infinite Scroll */}
            <div className="flex items-center gap-16 px-8">
              {partners.map((partner, index) => (
                <div key={`p2-${index}`} className="flex items-center space-x-3 group cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{partner.icon}</span>
                  <span className="text-xl font-bold text-gray-400 group-hover:text-primary transition-colors">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;



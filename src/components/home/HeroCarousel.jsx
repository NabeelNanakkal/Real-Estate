import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroAssets = async () => {
      try {
        setLoading(true);
        const { data } = await propertyService.getProperties();
        if (data.success && data.data.length > 0) {
          const heroSlides = data.data.slice(0, 3).map(p => ({
            _id: p._id,
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
            title: p.title,
            subtitle: `${p.city} • ${p.propertyType.charAt(0).toUpperCase() + p.propertyType.slice(1)} • $${p.price.toLocaleString()}`
          }));
          setSlides(heroSlides);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroAssets();
  }, []);

  if (loading) return (
    <div className="h-[600px] md:h-[700px] bg-gray-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  return (
    <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-100 group-hover:scale-110"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
              </div>
 
              {/* Content */}
              <div className="relative h-full container-custom flex flex-col justify-center items-center text-center z-10 pt-20">
                <div className="mb-6 animate-fade-in-up">
                  <span className="px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                    Exclusive Listing
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up tracking-tighter drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl animate-fade-in-up delay-100 font-bold uppercase tracking-widest drop-shadow-lg">
                  {slide.subtitle}
                </p>
                
                {/* Search Bar Container */}
                <div className="w-full max-w-4xl animate-fade-in-up delay-200">
                  <SearchBar />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroCarousel;

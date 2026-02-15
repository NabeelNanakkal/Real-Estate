import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroCarousel = () => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600596542815-e495e91f0747?auto=format&fit=crop&w=1920&q=80',
      title: 'Find Your Dream Home',
      subtitle: 'Discover luxury properties in prime locations'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      title: 'Modern Living Spaces',
      subtitle: 'Experience the best in modern architecture'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80',
      title: 'Exclusive Villas',
      subtitle: 'Live the life you deserve with our premium villas'
    }
  ];

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
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Content */}
              <div className="relative h-full container-custom flex flex-col justify-center items-center text-center z-10 pt-20">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fade-in-up delay-100">
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

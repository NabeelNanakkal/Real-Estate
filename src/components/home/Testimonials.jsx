import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FiMessageCircle, FiStar } from 'react-icons/fi';
import { fetchTestimonials } from '../../store/slices/testimonialSlice';
import { getImageUrl } from '../../utils/imageUtils';

import 'swiper/css';
import 'swiper/css/pagination';

const StarRating = ({ rating }) => (
  <div className="flex items-center space-x-0.5 mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const dispatch = useDispatch();
  const { list: testimonials, loading } = useSelector(s => s.testimonial);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 to-blue-900 text-white relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
            <FiMessageCircle className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Read success stories from our satisfied clients who found their perfect property with us.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-blue-200 py-10 font-semibold animate-pulse">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-blue-200 py-10">No testimonials yet.</div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonial-swiper pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t._id}>
                <div className="glass rounded-2xl p-8 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
                  {/* Stars */}
                  <StarRating rating={t.rating} />

                  {/* Quote */}
                  <p className="text-gray-100 italic leading-relaxed flex-1 line-clamp-5 mb-6">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                    <img
                      src={getImageUrl(t.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=3b82f6&color=fff&size=64`}
                      alt={t.name}
                      className="w-12 h-12 rounded-full border-2 border-accent object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=3b82f6&color=fff&size=64`;
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-base leading-tight">{t.name}</h3>
                      <p className="text-blue-200 text-xs mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Testimonials;

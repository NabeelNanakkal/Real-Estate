import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FiMessageCircle } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Homeowner',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      content: "I couldn't be happier with the service provided by EstateHub. They helped me find my dream home in record time!"
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Investor',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      content: "The professional insights and market analysis from the team were invaluable. Highly recommended for any serious investor."
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'First-time Buyer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      content: "As a first-time buyer, I was nervous, but the team guided me through every step. The process was smooth and transparent."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 to-blue-900 text-white relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

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

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="h-auto">
              <div className="glass p-8 rounded-2xl h-full flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-accent object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-blue-200 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-100 italic leading-relaxed flex-grow">"{testimonial.content}"</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;

import React from 'react';
import { FiCheck, FiUsers, FiTarget, FiAward } from 'react-icons/fi';
import Counter from '../components/common/Counter';

const About = () => {
  const stats = [
    { label: 'Years of Experience', value: 15, suffix: '+' },
    { label: 'Properties Sold', value: 2500, suffix: '+' },
    { label: 'Happy Clients', value: 5000, suffix: '+' },
    { label: 'Awards Won', value: 25, suffix: '+' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    {
      name: 'Emily Davis',
      role: 'Senior Agent',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    },
    {
      name: 'David Wilson',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600" 
            alt="Office" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900"></div>
        </div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Redefining Real Estate
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up delay-100">
            We are more than just a real estate agency. We are your partners in finding the perfect place to call home.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 animate-fade-in-up">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800" 
                alt="Meeting" 
                className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-1/2 animate-fade-in-up delay-200">
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-12 h-1 bg-primary rounded-full"></span>
                <span className="text-primary font-bold uppercase tracking-wider">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Helping You Find Your <span className="text-primary">Perfect Match</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At EstateHub, we believe that finding a home is more than just a transaction. It's about finding a space where memories are made and dreams are realized. Our mission is to simplify the real estate process through technology, transparency, and personalized service.
              </p>
              <ul className="space-y-4">
                {[
                  'Transparent and honest dealings',
                  'Client-first approach',
                  'Expert market knowledge',
                  'Dedicated support team'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 group cursor-default">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <FiCheck className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-primary font-bold uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Why Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FiUsers,
                title: 'Client Focused',
                desc: 'Your needs are our top priority. We listen, understand, and deliver results that exceed expectations.',
              },
              {
                icon: FiTarget,
                title: 'Market Experts',
                desc: 'Deep local knowledge combined with data-driven insights to give you the competitive edge.',
              },
              {
                icon: FiAward,
                title: 'Excellence',
                desc: 'We strive for excellence in every interaction, ensuring a seamless and professional experience.',
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-primary font-bold uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Meet The Experts</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;


import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiStar, FiGlobe, FiAtSign } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px] animate-bounce-slow"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-purple-400/5 rounded-full blur-[130px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 z-10">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
              <FiGlobe className="animate-spin-slow" />
              <span>Available Worldwide</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight animate-fade-in-up">
              Let's Start Your <br />
              <span className="text-gradient">Premier Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100 italic">
              "Excellence is not an act, but a habit." Reach out to our award-winning team for personalized real estate solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom relative z-10 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Information (Left Column) */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in-up delay-200">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Directly</h2>
              <p className="text-gray-500 font-medium">Our concierges are standing by 24/7 to assist with your inquiries.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: FiPhone,
                  title: 'Direct Line',
                  details: ['+1 (234) 567 8900', '+1 (234) 890 1234'],
                  color: 'bg-blue-500/10 text-blue-600',
                  label: '24/7 Support'
                },
                {
                  icon: FiAtSign,
                  title: 'Email Suite',
                  details: ['concierge@estatehub.com', 'press@estatehub.com'],
                  color: 'bg-primary/10 text-primary',
                  label: 'Instant Response'
                },
                {
                  icon: FiMapPin,
                  title: 'Global HQ',
                  details: ['Fifth Avenue, Empire State Suite', 'New York, NY 10001, USA'],
                  color: 'bg-emerald-500/10 text-emerald-600',
                  label: 'Visit Us'
                },
                {
                  icon: FiClock,
                  title: 'Premier Hours',
                  details: ['Mon - Fri: 08:00 - 20:00', 'Weekends by Appointment'],
                  color: 'bg-orange-500/10 text-orange-600',
                  label: 'Flexible Scheduling'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                    <div className="relative flex items-center p-6 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl hover:bg-white/60 transition-all duration-300">
                      <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 mr-5 shadow-inner`}>
                        <Icon className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide">{item.title}</h3>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100/50 px-2 py-0.5 rounded-full">{item.label}</span>
                        </div>
                        {item.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm font-medium">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


          </div>

          {/* Contact Form (Right Column) */}
          <div className="lg:col-span-7 animate-fade-in-up delay-300">
            <div className="bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-white relative overflow-hidden group">
              {/* Corner Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-focus-within:bg-primary/10 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Send an Inquiry</h2>
                  <p className="text-gray-500 font-medium">Please fill out the form below and our concierge will contact you within the hour.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Identity</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-bold placeholder:text-gray-300"
                        placeholder="e.g. Alexander Hamilton"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Digital Mail</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-bold placeholder:text-gray-300"
                        placeholder="Hamilton@office.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-bold placeholder:text-gray-300"
                      placeholder="e.g. Penthouse Viewing Request"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Personal Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all resize-none font-bold placeholder:text-gray-300"
                      placeholder="How can we elevate your experience?"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full gradient-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                  >
                    <FiSend className="text-lg" />
                    <span>Initiate Contact</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="relative py-24 bg-[#0F172A] overflow-hidden">
        {/* Abstract Background for Map */}
        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-[#FDFEFF] to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 animate-fade-in-up">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-black text-white mb-3">Experience Excellence In Person</h2>
              <p className="text-gray-400 max-w-xl font-medium">Join us at our Manhattan headquarters for a private consultation and a panoramic view of the skyline.</p>
            </div>
            <a 
              href="https://goo.gl/maps/EmpireStateBuilding" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white hover:bg-primary hover:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl"
            >
              <FiMapPin className="text-lg" />
              <span>Launch Navigation</span>
            </a>
          </div>
          
          <div className="relative h-[600px] rounded-[50px] overflow-hidden border-[12px] border-white/5 shadow-inner animate-fade-in-up delay-200 group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.472227123985!2d-73.98471968459422!3d40.7484405793284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620311746524!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Office Location"
              className="grayscale invert-[0.9] opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-1000"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

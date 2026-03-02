import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiStar, FiGlobe, FiAtSign, FiChevronDown, FiCheckCircle } from 'react-icons/fi';
import { fetchContactContent } from '../store/slices/contactSlice';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group focus:outline-none"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
          {question}
        </span>
        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-500 font-medium leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const Contact = () => {
  const dispatch = useDispatch();
  const { content, loading } = useSelector(s => s.contact);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContactContent());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const defaultContent = {
    phone: '+1 (800) REAL EST',
    email: 'concierge@estatehub.com',
    address: 'Fifth Avenue, Manhattan, NY',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.472227123985!2d-73.98471968459422!3d40.7484405793284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620311746524!5m2!1sen!2sus',
    workingHours: 'Mon - Fri: 08:00 - 20:00',
    faqs: [
      {
        question: "How quickly can I schedule a property viewing?",
        answer: "We typically arrange viewings within 24-48 hours of your request."
      }
    ]
  };

  const activeContent = content || defaultContent;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] bg-purple-400/5 rounded-full blur-[130px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 z-10">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span>Always Here For You</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight animate-fade-in-up">
              Connect With <br />
              <span className="text-gradient">Our Experts</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              Find the perfect space with the help of our dedicated real estate professionals.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom relative z-10 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Information (Left Column) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Direct Channels</h2>
              <p className="text-gray-500 font-medium">Choose your preferred way to reach our award-winning concierge team.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  icon: FiPhone,
                  title: 'Luxury Hotline',
                  detail: activeContent.phone,
                  color: 'bg-blue-500/10 text-blue-600',
                  description: 'Priority support for all clients'
                },
                {
                  icon: FiMail,
                  title: 'Email Suite',
                  detail: activeContent.email,
                  color: 'bg-primary/10 text-primary',
                  description: 'Response within 60 minutes'
                },
                {
                  icon: FiMapPin,
                  title: 'Global HQ',
                  detail: activeContent.address,
                  color: 'bg-emerald-500/10 text-emerald-600',
                  description: 'Open for private viewings'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="group p-1 rounded-[32px] bg-gradient-to-r from-transparent to-transparent hover:from-primary/20 hover:to-blue-500/20 transition-all duration-500">
                    <div className="flex items-center p-6 bg-white border border-gray-100 rounded-[30px] shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                      <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 mr-5`}>
                        <Icon className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-0.5">{item.title}</h3>
                        <p className="text-lg font-black text-gray-900 tracking-tight">{item.detail}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ Section Integrated Inline for mobile, or below info on desktop */}
            <div className="mt-16 bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Common Inquiries</h3>
              <div className="space-y-2">
                {(activeContent.faqs || []).map((faq, index) => (
                  <FAQItem key={index} {...faq} />
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Floating Badge */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center p-4 z-20 animate-bounce-slow border border-gray-50">
                <FiStar className="text-4xl text-yellow-400" />
              </div>

              <div className="bg-white rounded-[50px] shadow-2xl shadow-gray-200/50 p-8 md:p-14 border border-gray-100 relative overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]"></div>
                
                {isSubmitted ? (
                  <div className="py-20 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <FiCheckCircle className="text-5xl" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Message Initiated!</h2>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto">
                      Thank you for choosing EstateHub. Our premier concierge will reach out to you within the hour.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-10 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <div className="mb-12">
                      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Send an Inquiry</h2>
                      <p className="text-gray-500 font-medium">Elevate your real estate experience with a private consultation.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Identity</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-50 focus:bg-white focus:border-primary px-6 py-4 rounded-[20px] outline-none transition-all font-bold"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Preferred Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-50 focus:bg-white focus:border-primary px-6 py-4 rounded-[20px] outline-none transition-all font-bold"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Subject of Interest</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border-2 border-gray-50 focus:bg-white focus:border-primary px-6 py-4 rounded-[20px] outline-none transition-all font-bold"
                          placeholder="e.g. Modern Villa Inquiry"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Detailed Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="5"
                          className="w-full bg-gray-50 border-2 border-gray-50 focus:bg-white focus:border-primary px-6 py-4 rounded-[20px] outline-none transition-all resize-none font-bold"
                          placeholder="Tell us about your requirements..."
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 gradient-primary text-white rounded-[20px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <FiSend className="text-lg" />
                            <span>Initiate Contact</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="relative py-32 bg-gray-900 mt-20 overflow-hidden">
        {/* Abstract Background for Map */}
        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-[#FDFEFF] to-transparent"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Experience Excellence <br />In Person</h2>
            <p className="text-gray-400 max-w-xl mx-auto font-medium">Visit our world-class headquarters in the heart of Manhattan for a private session with our senior partners.</p>
          </div>
          
          <div className="relative h-[600px] rounded-[60px] overflow-hidden border-[15px] border-white/5 shadow-2xl animate-fade-in-up group">
            <iframe 
              src={activeContent.mapUrl || ''} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Office Location"
              className="grayscale invert-[0.9] opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-1000"
            ></iframe>
            
            {/* Map Overlay Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
              <div className="bg-white/10 backdrop-blur-xl px-10 py-5 rounded-full border border-white/20 text-white font-black uppercase tracking-widest text-xs flex items-center space-x-3">
                <FiMapPin className="text-primary" />
                <span>Hover to Reveal Office</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

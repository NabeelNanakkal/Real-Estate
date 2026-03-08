import { lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiAward, FiUsers, FiCheckCircle } from 'react-icons/fi';

const HeroCarousel       = lazy(() => import('../components/home/HeroCarousel'));
const Partners           = lazy(() => import('../components/home/Partners'));
const PropertyCategories = lazy(() => import('../components/home/PropertyCategories'));
const FeaturedProperties = lazy(() => import('../components/home/FeaturedProperties'));
const Stats              = lazy(() => import('../components/home/Stats'));
const Testimonials       = lazy(() => import('../components/home/Testimonials'));

/* ── Scroll-reveal hook ──────────────────────────────────────────────── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
};

const WHY_ITEMS = [
  {
    icon: FiCheckCircle,
    title: 'Verified Listings',
    desc: 'Every property is thoroughly checked and verified for your peace of mind.',
    bg: 'bg-blue-50',
    hoverBg: 'group-hover:bg-primary',
    color: 'text-primary',
    hoverColor: 'group-hover:text-white',
    glow: 'rgba(225,173,66,0.3)',
  },
  {
    icon: FiAward,
    title: 'Premium Quality',
    desc: 'Access the finest selection of luxury properties in prime locations.',
    bg: 'bg-purple-50',
    hoverBg: 'group-hover:bg-purple-500',
    color: 'text-purple-500',
    hoverColor: 'group-hover:text-white',
    glow: 'rgba(168,85,247,0.3)',
  },
  {
    icon: FiUsers,
    title: 'Expert Support',
    desc: 'Our dedicated team of professionals is here to guide you 24/7.',
    bg: 'bg-green-50',
    hoverBg: 'group-hover:bg-green-500',
    color: 'text-green-500',
    hoverColor: 'group-hover:text-white',
    glow: 'rgba(34,197,94,0.3)',
  },
  {
    icon: FiTrendingUp,
    title: 'Market Insights',
    desc: 'Get valuable data and trends to make informed investment decisions.',
    bg: 'bg-orange-50',
    hoverBg: 'group-hover:bg-orange-500',
    color: 'text-orange-500',
    hoverColor: 'group-hover:text-white',
    glow: 'rgba(249,115,22,0.3)',
  },
];

const Home = () => {
  useReveal();

  return (
    <div className="pt-20">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-[600px] bg-gray-900 animate-pulse" />}>
        <HeroCarousel />
      </Suspense>

      {/* ── Partners ─────────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-24 bg-white animate-pulse" />}>
        <Partners />
      </Suspense>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-64 bg-white animate-pulse" />}>
        <PropertyCategories />
      </Suspense>

      {/* ── Featured Properties ──────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <FeaturedProperties />
      </Suspense>

      {/* ── Why Choose Us ────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        {/* Floating bg blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-float-slow pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 animate-float pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Section header */}
          <div className="text-center mb-16 reveal">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.25em] rounded-full mb-4">
              Why Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Why Choose{' '}
              <span className="animate-shimmer">EstateHub?</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              We provide the best service to help you find your perfect property with ease and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`reveal stagger-${i + 1} text-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden cursor-default`}
                  style={{ '--glow': item.glow }}
                >
                  {/* Card shimmer line on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  </div>

                  <div className={`relative w-20 h-20 ${item.bg} ${item.hoverBg} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}>
                    <Icon className={`w-10 h-10 ${item.color} ${item.hoverColor} transition-colors duration-300`} />
                    {/* Ping ring */}
                    <span className="absolute inset-0 rounded-2xl animate-ping-slow opacity-30 bg-current" />
                  </div>

                  <h3 className="text-xl font-black mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div
        className="relative py-24 bg-fixed bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)' }}
      >
        <div className="absolute inset-0 bg-gray-900/80" />
        {/* Animated lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-0 w-full h-px bg-white/5 animate-pulse" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-white/5 animate-pulse delay-300" />
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/5 animate-pulse delay-200" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/5 animate-pulse delay-400" />
        </div>
        <div className="relative z-10 reveal">
          <Suspense fallback={<div className="h-48 animate-pulse" />}>
            <Stats />
          </Suspense>
        </div>
      </div>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <Testimonials />
      </Suspense>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#1a1a1a] to-[#0F0F0F]" />

        {/* Animated blobs */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-primary/25 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-[28rem] h-[28rem] bg-accent/20 rounded-full blur-3xl animate-float-slow delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-spin-slow" />
        </div>

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)' }}
        />

        <div className="container-custom relative z-10">
          <div className="reveal-scale max-w-4xl mx-auto rounded-3xl p-8 md:p-12 text-center border border-white/10 shadow-2xl bg-white/5 backdrop-blur-sm hover:bg-white/8 transition-all duration-500">
            {/* Badge */}
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-xs font-black uppercase tracking-[0.25em] rounded-full mb-6 animate-fade-in-up">
              Get Started Today
            </span>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight animate-fade-in-up delay-100">
              Unlock Your{' '}
              <span className="animate-shimmer">Dream Lifestyle</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up delay-200">
              Don't just look for a place to live. Find a place to{' '}
              <span className="text-primary font-semibold">thrive</span>.
              Join our exclusive network of homeowners today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
              <Link
                to="/properties"
                className="group relative px-8 py-4 bg-primary text-white rounded-xl font-bold text-base overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(225,173,66,0.5)] hover:scale-105"
              >
                <span className="relative z-10">Start Browsing</span>
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>

              <Link
                to="/contact"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold text-base hover:bg-white/20 transition-all hover:border-white/60 hover:scale-105"
              >
                Contact an Agent
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 text-sm text-white/50 animate-fade-in-up delay-400">
              {['No Hidden Fees', 'Verified Listings', '24/7 Support'].map((label) => (
                <div key={label} className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <FiCheckCircle className="text-primary w-4 h-4" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

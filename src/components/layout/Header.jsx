import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import { fetchCategories } from '../../store/slices/categorySlice';

const Header = () => {
  const { user, publicProfile } = useAuth();
  const activeProfile = user || publicProfile;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { list: categories } = useSelector(s => s.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path.includes('?category=')) {
      const linkCategory = new URLSearchParams(path.split('?')[1]).get('category');
      const currentCategory = new URLSearchParams(location.search).get('category');
      return location.pathname === '/properties' && linkCategory === currentCategory;
    }
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname.startsWith(path);
  };



  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            {activeProfile?.companyLogo ? (
              <div className="w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-sm">
                <img src={getImageUrl(activeProfile.companyLogo)} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-sm">
                <span className="text-white font-bold text-xl">{activeProfile?.company?.charAt(0) || 'E'}</span>
              </div>
            )}
            <span className="text-2xl font-bold text-gradient">{activeProfile?.company || 'EstateHub'}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
            <NavLink to="/about" isActive={isActive('/about')}>About</NavLink>
            {categories.map((cat) => {
              const href = cat.link || `/properties?category=${encodeURIComponent(cat.title)}`;
              const catActive =
                location.pathname + location.search === cat.link ||
                (location.pathname === '/properties' &&
                  new URLSearchParams(location.search).get('category') === cat.title);
              return (
                <NavLink key={cat._id} to={href} isActive={catActive}>
                  {cat.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">

            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink to="/" isActive={isActive('/')} onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/about" isActive={isActive('/about')} onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
              {categories.map((cat) => {
                const href = cat.link || `/properties?category=${encodeURIComponent(cat.title)}`;
                const catActive =
                  location.pathname + location.search === cat.link ||
                  (location.pathname === '/properties' &&
                    new URLSearchParams(location.search).get('category') === cat.title);
                return (
                  <MobileNavLink key={cat._id} to={href} isActive={catActive} onClick={() => setIsMenuOpen(false)}>
                    {cat.title}
                  </MobileNavLink>
                );
              })}
              <Link to="/contact" className="btn-primary inline-block text-center" onClick={() => setIsMenuOpen(false)}>
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ to, children, isActive }) => (
  <Link to={to} className="relative group py-2">
    <span className={`font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>
      {children}
    </span>
    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
  </Link>
);

const MobileNavLink = ({ to, children, isActive, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`block px-4 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary/10 text-primary font-bold' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
    }`}
  >
    {children}
  </Link>
);

export default Header;

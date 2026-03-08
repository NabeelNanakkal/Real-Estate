import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { categoryService, contactService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { user, publicProfile } = useAuth();
  const activeProfile = user || publicProfile;
  const [categories, setCategories] = React.useState([]);
  const [contactInfo, setContactInfo] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, contactRes] = await Promise.all([
          categoryService.getCategories(),
          contactService.getContactContent()
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (contactRes.data.success) setContactInfo(contactRes.data.data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-dark text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {activeProfile?.companyLogo ? (
                <div className="w-12 h-12 flex items-center justify-center p-1">
                   <img src={activeProfile.companyLogo.startsWith('http') ? activeProfile.companyLogo : `http://localhost:5000${activeProfile.companyLogo}`} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{activeProfile?.company?.charAt(0) || 'E'}</span>
                </div>
              )}
              <span className="text-2xl font-bold">{activeProfile?.company || 'EstateHub'}</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in finding the perfect property. Discover your dream home with us.
            </p>
            <div className="flex space-x-4">
              <a 
                href={contactInfo?.socialLinks?.facebook || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a 
                href={contactInfo?.socialLinks?.twitter || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a 
                href={contactInfo?.socialLinks?.instagram || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a 
                href={contactInfo?.socialLinks?.linkedin || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    to={cat.link || `/properties?category=${encodeURIComponent(cat.title)}`}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.slice(0, 4).map((cat) => (
                  <li key={cat._id}>
                    <Link to={cat.link} className="text-gray-400 hover:text-primary transition-colors">
                      {cat.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link to="/properties?propertyType=apartment" className="text-gray-400 hover:text-primary transition-colors">
                      Apartments
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties?propertyType=villa" className="text-gray-400 hover:text-primary transition-colors">
                      Villas
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties?propertyType=house" className="text-gray-400 hover:text-primary transition-colors">
                      Houses
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties?propertyType=office" className="text-gray-400 hover:text-primary transition-colors">
                      Offices
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400">{contactInfo?.address || '123 Real Estate St, City, Country'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-400">{contactInfo?.phone || '+1 234 567 8900'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-400">{contactInfo?.email || 'info@estatehub.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {activeProfile?.company || 'EstateHub'}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Developed by <span className="text-primary font-semibold">GQ Real Estate</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

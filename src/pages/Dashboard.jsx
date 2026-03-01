import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlus, FiList, FiBarChart2, FiMail, FiInfo, FiSettings, FiLogOut, FiBriefcase, FiLayers, FiMessageSquare, FiChevronLeft, FiChevronRight, FiMoreVertical } from 'react-icons/fi';
import DashboardHome from '../components/dashboard/DashboardHome';
import PropertyManagement from '../components/dashboard/PropertyManagement';
import AddProperty from '../components/dashboard/AddProperty';
import Analytics from '../components/dashboard/Analytics';
import Inquiries from '../components/dashboard/Inquiries';
import Settings from '../components/dashboard/Settings';
import AboutManagement from '../components/dashboard/AboutManagement';
import PartnerManagement from '../components/dashboard/PartnerManagement';
import CategoryManagement from '../components/dashboard/CategoryManagement';
import ContactManagement from '../components/dashboard/ContactManagement';
import LogoutConfirmModal from '../components/dashboard/LogoutConfirmModal';

const Dashboard = () => {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(288); // Default 72 (288px)
  const [isResizing, setIsResizing] = React.useState(false);

  const minWidth = isSidebarMinimized ? 80 : 200;
  const maxWidth = 400;

  const startResizing = React.useCallback((e) => {
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback((e) => {
    if (isResizing && !isSidebarMinimized) {
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing, isSidebarMinimized, minWidth, maxWidth]);

  React.useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const toggleMinimize = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
    if (!isSidebarMinimized) {
      setSidebarWidth(80);
    } else {
      setSidebarWidth(288);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Overview', exact: true },
    { path: '/dashboard/properties', icon: FiList, label: 'Properties' },
    { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/dashboard/inquiries', icon: FiMail, label: 'Inquiries' },
    { path: '/dashboard/about', icon: FiInfo, label: 'About Page' },
    { path: '/dashboard/partners', icon: FiBriefcase, label: 'Partners' },
    { path: '/dashboard/categories', icon: FiLayers, label: 'Categories' },
    { path: '/dashboard/contact', icon: FiMessageSquare, label: 'Contact Page' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF]">
      <div className="flex">
        {/* Sidebar */}
        <aside 
          className="bg-[#0F172A] h-screen fixed left-0 top-0 z-40 shadow-[20px_0_80px_rgba(15,23,42,0.1)] transition-all duration-300 ease-in-out group/sidebar"
          style={{ 
            width: sidebarWidth,
            transition: isResizing ? 'none' : 'width 0.3s ease-in-out, transform 0.3s ease-in-out'
          }}
        >
          {/* Resize Handle - Outside scroll area */}
          {!isSidebarMinimized && (
            <div 
              onMouseDown={startResizing}
              className="absolute right-0 top-0 w-1.5 h-full cursor-col-resize z-[100] group/resizer hover:bg-primary/20 transition-colors"
              title="Drag to resize"
            >
              <div className="absolute right-0 top-0 w-[1px] h-full bg-white/10 group-hover/resizer:bg-primary/50 transition-colors"></div>
            </div>
          )}

          <div className={`p-6 flex flex-col h-full relative overflow-y-auto overflow-x-hidden custom-scrollbar ${isSidebarMinimized ? 'items-center px-4' : ''}`}>
            {/* Sidebar Glow Effect */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            
            <div className={`mb-10 relative flex flex-col ${isSidebarMinimized ? 'items-center' : ''}`}>
              <div className={`flex items-center ${isSidebarMinimized ? 'justify-center' : 'space-x-3 w-full'}`}>
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                  <span className="text-white font-black text-lg">E</span>
                </div>
                {!isSidebarMinimized && (
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-black text-white tracking-tight uppercase truncate">EstateHub</h2>
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] -mt-0.5">Admin Dashboard</p>
                  </div>
                )}
              </div>
              
              {/* Minimize Toggle Button - Integrated Under Logo */}
              <button 
                onClick={toggleMinimize}
                className={`mt-6 flex items-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-xl border border-white/5 ${isSidebarMinimized ? 'w-9 h-9 justify-center' : 'w-full py-3 px-4 space-x-3'}`}
                title={isSidebarMinimized ? "Expand Menu" : "Collapse Menu"}
              >
                {isSidebarMinimized ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
                {!isSidebarMinimized && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Collapse Menu</span>}
              </button>
            </div>

            <nav className="flex-1 space-y-2 relative">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-500 group relative ${
                      isSidebarMinimized ? 'justify-center' : 'space-x-3'
                    } ${
                      active
                        ? 'bg-primary text-white shadow-[0_8px_30px_rgba(59,130,246,0.3)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={isSidebarMinimized ? item.label : ''}
                  >
                    {active && !isSidebarMinimized && (
                      <div className="absolute left-0 w-1 h-5 bg-white rounded-full shadow-[0_0_15px_#fff]"></div>
                    )}
                    <Icon className={`w-4.5 h-4.5 transition-all duration-500 flex-shrink-0 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:scale-110 group-hover:text-primary'}`} />
                    {!isSidebarMinimized && (
                      <span className="font-bold text-[13px] tracking-wide truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className={`mt-auto pt-8 border-t border-white/5 space-y-2 relative ${isSidebarMinimized ? 'pt-6' : ''}`}>
              <Link
                to="/dashboard/settings"
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-500 group ${
                  isSidebarMinimized ? 'justify-center' : 'space-x-3'
                } ${
                  isActive('/dashboard/settings')
                    ? 'bg-primary text-white shadow-[0_8px_30px_rgba(59,130,246,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={isSidebarMinimized ? "Settings" : ""}
              >
                <FiSettings className="w-4.5 h-4.5 flex-shrink-0 group-hover:rotate-90 transition-transform duration-700" />
                {!isSidebarMinimized && <span className="font-bold text-[13px] tracking-wide">Settings</span>}
              </Link>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className={`w-full flex items-center px-4 py-3 text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all group font-bold text-[13px] tracking-wide ${
                  isSidebarMinimized ? 'justify-center' : 'space-x-3'
                }`}
                title={isSidebarMinimized ? "Logout" : ""}
              >
                <FiLogOut className="w-4.5 h-4.5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                {!isSidebarMinimized && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className="flex-1 min-h-screen relative p-8 md:p-10 transition-all duration-300 ease-in-out"
          style={{ marginLeft: sidebarWidth }}
        >
            {/* Background Aesthetic Blobs */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[100px] -ml-20 -mb-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/properties" element={<PropertyManagement />} />
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/inquiries" element={<Inquiries />} />
                    <Route path="/about" element={<AboutManagement />} />
                    <Route path="/partners" element={<PartnerManagement />} />
                    <Route path="/categories" element={<CategoryManagement />} />
                    <Route path="/contact" element={<ContactManagement />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </main>
      </div>
      
      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}
      />
    </div>
  );
};

export default Dashboard;

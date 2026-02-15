import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlus, FiList, FiBarChart2, FiMail, FiSettings, FiLogOut } from 'react-icons/fi';
import DashboardHome from '../components/dashboard/DashboardHome';
import PropertyManagement from '../components/dashboard/PropertyManagement';
import AddProperty from '../components/dashboard/AddProperty';
import Analytics from '../components/dashboard/Analytics';
import Inquiries from '../components/dashboard/Inquiries';
import Settings from '../components/dashboard/Settings';

const Dashboard = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Overview', exact: true },
    { path: '/dashboard/properties', icon: FiList, label: 'Properties' },
    { path: '/dashboard/add-property', icon: FiPlus, label: 'Add Property' },
    { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/dashboard/inquiries', icon: FiMail, label: 'Inquiries' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600">Manage your properties</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                to="/dashboard/settings"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiSettings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/properties" element={<PropertyManagement />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

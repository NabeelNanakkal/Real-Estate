import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiDollarSign, FiEye, FiMail, FiTrendingUp, FiPlus } from 'react-icons/fi';

const DashboardHome = () => {
  const stats = [
    { icon: FiHome, label: 'Total Properties', value: '24', change: '+3', color: 'from-blue-500 to-cyan-500' },
    { icon: FiDollarSign, label: 'Total Revenue', value: '$125K', change: '+12%', color: 'from-green-500 to-teal-500' },
    { icon: FiEye, label: 'Total Views', value: '1,234', change: '+23%', color: 'from-purple-500 to-pink-500' },
    { icon: FiMail, label: 'Inquiries', value: '45', change: '+8', color: 'from-orange-500 to-red-500' },
  ];

  const recentProperties = [
    { id: 1, title: 'Modern Luxury Villa', status: 'Active', views: 234, inquiries: 12 },
    { id: 2, title: 'Downtown Apartment', status: 'Active', views: 189, inquiries: 8 },
    { id: 3, title: 'Beachfront Property', status: 'Pending', views: 156, inquiries: 15 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your properties</p>
        </div>
        <Link to="/dashboard/add-property" className="btn-primary flex items-center space-x-2">
          <FiPlus className="w-5 h-5" />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 text-sm font-semibold">
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Properties */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Properties</h2>
          <Link to="/dashboard/properties" className="text-primary font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Property</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Views</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Inquiries</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.map((property) => (
                <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{property.title}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      property.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{property.views}</td>
                  <td className="py-4 px-4 text-gray-600">{property.inquiries}</td>
                  <td className="py-4 px-4 text-right">
                    <Link to={`/property/${property.id}`} className="text-primary hover:underline font-semibold">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([
    { id: 1, title: 'Modern Luxury Villa', location: 'Beverly Hills, CA', price: 1250000, status: 'Active', views: 234 },
    { id: 2, title: 'Downtown Apartment', location: 'Manhattan, NY', price: 850000, status: 'Active', views: 189 },
    { id: 3, title: 'Beachfront Property', location: 'Miami, FL', price: 2100000, status: 'Sold', views: 156 },
    { id: 4, title: 'Cozy Family House', location: 'Austin, TX', price: 650000, status: 'Active', views: 98 },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-1">Manage all your listed properties</p>
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search properties..."
            className="input-field w-64"
          />
          <select className="input-field">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Sold</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Property</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Location</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Price</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Status</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Views</th>
                <th className="text-right py-4 px-6 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{property.title}</td>
                  <td className="py-4 px-6 text-gray-600">{property.location}</td>
                  <td className="py-4 px-6 text-gray-900 font-semibold">${property.price.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      property.status === 'Active' ? 'bg-green-100 text-green-700' :
                      property.status === 'Sold' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{property.views}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors">
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
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

export default PropertyManagement;

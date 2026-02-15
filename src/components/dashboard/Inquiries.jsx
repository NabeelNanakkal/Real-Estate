import React, { useState } from 'react';
import { FiMail, FiPhone, FiEye, FiTrash2 } from 'react-icons/fi';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 234 567 8900', property: 'Modern Luxury Villa', message: 'Interested in scheduling a viewing', status: 'new', date: '2026-02-14' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234 567 8901', property: 'Downtown Apartment', message: 'Would like more information', status: 'contacted', date: '2026-02-13' },
    { id: 3, name: 'Mike Brown', email: 'mike@example.com', phone: '+1 234 567 8902', property: 'Beachfront Property', message: 'Interested in making an offer', status: 'new', date: '2026-02-12' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-1">Manage customer inquiries</p>
        </div>
        <select className="input-field">
          <option>All Status</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Closed</option>
        </select>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{inquiry.name}</h3>
                <p className="text-sm text-gray-600">Inquiry for: {inquiry.property}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                inquiry.status === 'contacted' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <FiMail className="w-4 h-4" />
                <span>{inquiry.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FiPhone className="w-4 h-4" />
                <span>{inquiry.phone}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">{inquiry.message}</p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{inquiry.date}</span>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">
                  Mark as Contacted
                </button>
                <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inquiries;

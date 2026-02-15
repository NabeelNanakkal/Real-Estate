import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const Analytics = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your property performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Total Views</div>
            <div className="flex items-center text-green-600 text-sm">
              <FiTrendingUp className="w-4 h-4 mr-1" />
              +23%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">12,345</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Inquiries</div>
            <div className="flex items-center text-green-600 text-sm">
              <FiTrendingUp className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">456</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Avg. Time on Page</div>
            <div className="flex items-center text-red-600 text-sm">
              <FiTrendingDown className="w-4 h-4 mr-1" />
              -5%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">3:45</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <div className="flex items-center text-green-600 text-sm">
              <FiTrendingUp className="w-4 h-4 mr-1" />
              +8%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">3.7%</div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chart visualization will be added here</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

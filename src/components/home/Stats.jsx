import React from 'react';
import { FiHome, FiUsers, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import Counter from '../common/Counter';

const Stats = () => {
  const stats = [
    {
      icon: FiHome,
      value: 1000,
      suffix: '+',
      label: 'Properties Listed',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiUsers,
      value: 500,
      suffix: '+',
      label: 'Happy Clients',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FiMapPin,
      value: 50,
      suffix: '+',
      label: 'Cities Covered',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: FiTrendingUp,
      value: 95,
      suffix: '%',
      label: 'Success Rate',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group hover:transform hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;


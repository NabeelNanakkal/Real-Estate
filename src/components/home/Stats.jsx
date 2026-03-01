import React, { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import Counter from '../common/Counter';
import { propertyService } from '../../services/api';

const Stats = () => {
  const [statsData, setStatsData] = useState({
    totalProperties: 0,
    citiesCovered: 5, // Mock fallback
    happyClients: 500,
    successRate: 98
  });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const { data } = await propertyService.getStats();
        if (data.success) {
          // We can also infer cities by fetching all properties and unique-ing the 'city' field
          // but for now we'll use the total count
          setStatsData(prev => ({
            ...prev,
            totalProperties: data.data.totalProperties || 0,
          }));
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchLiveStats();
  }, []);

  const stats = [
    {
      icon: FiHome,
      value: statsData.totalProperties,
      suffix: statsData.totalProperties > 100 ? '+' : '',
      label: 'Portfolio Assets',
      color: 'bg-blue-500 shadow-blue-200 text-blue-600'
    },
    {
      icon: FiUsers,
      value: statsData.happyClients,
      suffix: '+',
      label: 'Global Clients',
      color: 'bg-purple-500 shadow-purple-200 text-purple-600'
    },
    {
      icon: FiMapPin,
      value: statsData.citiesCovered,
      suffix: '+',
      label: 'Prime Cities',
      color: 'bg-emerald-500 shadow-emerald-200 text-emerald-600'
    },
    {
      icon: FiTrendingUp,
      value: statsData.successRate,
      suffix: '%',
      label: 'Capital Growth',
      color: 'bg-orange-500 shadow-orange-200 text-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="relative p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                <div className={`w-16 h-16 rounded-2xl ${stat.color.split(' shadow')[0]} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;


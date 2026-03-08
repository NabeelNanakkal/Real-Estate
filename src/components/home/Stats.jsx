import React, { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiMapPin, FiTrendingUp, FiStar, FiAward, FiTarget, FiGlobe, FiBarChart2 } from 'react-icons/fi';
import Counter from '../common/Counter';
import { statsService } from '../../services/api';

const ICON_MAP = {
  FiHome, FiUsers, FiMapPin, FiTrendingUp, FiStar, FiAward, FiTarget, FiGlobe, FiBarChart2
};

const Stats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const { data } = await statsService.getStats();
        setStats(data?.data || []);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchLiveStats();
  }, []);

  const allStats = stats;
  const colsClass = allStats.length <= 2 ? 'grid-cols-2'
    : allStats.length === 3 ? 'grid-cols-3'
    : 'grid-cols-2 lg:grid-cols-4';

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className={`grid ${colsClass} gap-8`}>
          {allStats.map((stat, index) => {
            const Icon = ICON_MAP[stat.iconKey] || FiTrendingUp;
            return (
              <div key={index} className="relative p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                <div className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
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

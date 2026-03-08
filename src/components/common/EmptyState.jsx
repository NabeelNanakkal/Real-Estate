import React from 'react';
import Lottie from 'lottie-react';

const EmptyState = ({ 
  title = "No properties found", 
  message = "We couldn't find any properties matching your current filters. Try adjusting your search criteria.",
  animationUrl = "https://lottie.host/f88d4474-0f32-473d-9860-af608d0b28a8/mP1iR4Wd4u.json" // Stable empty search animation
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-64 h-64 mb-8">
        <Lottie 
          animationData={null} // We'll fetch this from URL or use a local one
          path={animationUrl}
          loop={true}
        />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-8 px-6 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default EmptyState;

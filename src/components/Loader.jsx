// src/components/Loader.jsx
import React from 'react';
import './Loader.css'; // We'll add this CSS for the animation

function Loader() {
  return (
    // Full screen overlay for the loader
    <div className="fixed inset-0 flex items-center justify-center bg-[#070707] z-[9999] opacity-100 transition-opacity duration-700 ease-out loader-fade-out">
      {/* The pulsating circle */}
      <div className="w-16 h-16 rounded-full border-4 border-t-4 border-gray-600 border-t-[#FF3C00] animate-pulse-loader"></div>
    </div>
  );
}

export default Loader;
import React from 'react';

const GrainOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.05] mix-blend-overlay">
      <svg className='w-full h-full'>
        <filter id='noiseFilter'>
          <feTurbulence 
            type='fractalNoise' 
            baseFrequency='0.8' 
            numOctaves='3' 
            stitchTiles='stitch'
          />
        </filter>
        <rect width='100%' height='100%' filter='url(#noiseFilter)' />
      </svg>
    </div>
  );
};

export default GrainOverlay;
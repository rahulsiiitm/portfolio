import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MouseSpotlight = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for the spotlight movement
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Update motion values directly for performance
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden mix-blend-screen"
      aria-hidden="true"
    >
      <motion.div
        className="absolute rounded-full opacity-20"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: "600px", // Size of the glow
          height: "600px",
          background: "radial-gradient(circle, rgba(255, 71, 15, 0.4) 0%, rgba(255, 71, 15, 0.05) 40%, transparent 70%)"
        }}
      />
    </motion.div>
  );
};

export default MouseSpotlight;
// src/components/ExpandableSection.jsx
import React, { useState, useEffect, useRef } from 'react';

function ExpandableSection({ children, className, scrollTrigger = 0.5, ...props }) {
  const sectionRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bgColor, setBgColor] = useState('bg-transparent'); // Initial background is transparent

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const { top, height } = sectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress within the section.
        // This measures how much of the section's top edge has passed the viewport's top.
        const scrollProgressWithinSection = (-top) / height;

        if (scrollProgressWithinSection > scrollTrigger && !isExpanded) {
          // If scrolled past the trigger point and not yet expanded
          setIsExpanded(true);
          setBgColor('bg-gray-700'); // Change to opaque background when expanded
        } else if (scrollProgressWithinSection <= scrollTrigger && isExpanded) {
          // If scrolled back up above the trigger point and currently expanded
          // Ensure it only contracts if it's still somewhat visible
          if (scrollProgressWithinSection > -0.5) { // Prevent contracting when completely out of view below
             setIsExpanded(false);
             setBgColor('bg-transparent'); // Revert to transparent
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded, scrollTrigger]); // Dependencies for useEffect

  return (
    <div
      ref={sectionRef} // Attach the ref to this div
      className={`relative z-20 ${className} 
                  transition-all duration-700 ease-in-out transform mx-auto 
                  ${isExpanded ? 'w-full' : 'w-[70%]'} ${bgColor}`} // Dynamic width and background
      {...props} // Pass through other props like mt-[...]
    >
      {children}
    </div>
  );
}

export default ExpandableSection;
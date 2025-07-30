// src/components/ScrollSection.jsx
import React, { useState, useEffect, useRef } from 'react';

function ScrollSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.offsetTop;
      const viewportHeight = window.innerHeight;
      
      // Expand when 30% through the section for smoother transition
      const scrolledIntoSection = scrollY + viewportHeight - sectionTop;
      const expansionPoint = viewportHeight * 0.3;
      
      setIsExpanded(scrolledIntoSection >= expansionPoint);
    }
  }, [scrollY]);

  // Smoother trigger - start appearing after one screen, with gentle transition
  const triggerPoint = window.innerHeight;
  const slideProgress = Math.max(0, Math.min(1, (scrollY - triggerPoint) / 300));
  
  // Width calculation - starts at 70% when visible, expands to 100%
  const getWidth = () => {
    if (isExpanded) return '100vw';
    return slideProgress > 0 ? '70vw' : '70vw'; // Always 70% when section is in view
  };

  const getTransform = () => {
    if (scrollY < triggerPoint) return 'translateY(100vh)'; // Hidden below screen
    const translateY = (1 - slideProgress) * 50; // Reduced movement for smoothness
    return `translateY(${translateY}px)`;
  };

  return (
    <div 
      ref={sectionRef}
      className="relative z-30 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-1000 ease-out mx-auto"
      style={{
        width: getWidth(),
        transform: getTransform(),
        boxShadow: isExpanded ? 'none' : '0 -10px 30px rgba(0,0,0,0.3)',
        borderRadius: isExpanded ? '0' : '16px 16px 0 0'
      }}
    >
      <div className="relative h-full py-20 px-8 md:px-16">
        {/* Clean main content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Simple header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-8 text-white">
              About Me
            </h2>
            <div className="w-16 h-px bg-orange-400 mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Creating intelligent solutions that bridge technology and human experience.
            </p>
          </div>

          {/* Clean content grid */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
            {/* Left - Text */}
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-light mb-6 text-orange-300">My Approach</h3>
                <p className="text-gray-300 leading-relaxed mb-6 font-light">
                  Specializing in AI and user-centered design, I create solutions that are 
                  technically robust and intuitively accessible.
                </p>
                <p className="text-gray-300 leading-relaxed font-light">
                  Combining machine learning with human-centered design principles 
                  to deliver meaningful impact.
                </p>
              </div>

              {/* Clean skills list */}
              <div>
                <h4 className="text-lg font-light mb-6 text-orange-300">Expertise</h4>
                <div className="space-y-3">
                  {[
                    'Machine Learning & AI',
                    'User Experience Design', 
                    'Full-Stack Development',
                    'Data Science & Analytics'
                  ].map((skill) => (
                    <div key={skill} className="text-gray-300 font-light">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Simple visual */}
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-light text-orange-300 mb-2">Innovation Focused</h4>
                  <p className="text-gray-400 text-sm font-light">
                    Exploring emerging technologies
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple stats */}
          <div className="grid md:grid-cols-3 gap-12 pt-16 border-t border-gray-800">
            <div className="text-center">
              <div className="text-3xl font-light text-orange-400 mb-2">3+</div>
              <div className="text-gray-400 font-light">Years</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-orange-400 mb-2">50+</div>
              <div className="text-gray-400 font-light">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-orange-400 mb-2">100%</div>
              <div className="text-gray-400 font-light">Satisfaction</div>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="text-center mt-16">
            <button className="px-10 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-md text-white font-light hover:from-orange-600 hover:to-red-600 transition-all duration-300">
              Let's Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollSection;
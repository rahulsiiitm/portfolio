// src/components/ExperienceSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { experiences } from './experienceData';

function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

  // Intersection Observer for main section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Individual item visibility observer
  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => {
              if (!prev.includes(index)) {
                return [...prev, index].sort((a, b) => a - b);
              }
              return prev;
            });
          }
        },
        { 
          threshold: 0.3,
          rootMargin: '-10% 0px -10% 0px'
        }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  // Optimized scroll progress with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking && sectionRef.current) {
        requestAnimationFrame(() => {
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Simplified calculation
          const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (rect.height + windowHeight)));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen bg-transparent px-8 md:px-[60px] py-20 relative overflow-hidden flex items-center justify-center"
    >
      {/* Optimized background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent"></div>
      <div 
        className="absolute top-1/4 left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollProgress * 30}px, 0)`,
        }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-20 w-80 h-80 bg-orange-600/3 rounded-full blur-3xl will-change-transform"
        style={{
          transform: `translate3d(0, ${-scrollProgress * 20}px, 0)`,
        }}
      ></div>

      {/* Reduced floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/20 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 10}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center">

        {/* Section Header with enhanced animations */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-10'
        }`}>
          <div 
            className="text-stone-300 text-4xl md:text-5xl font-normal font-['Dancing_Script'] mb-2 transition-all duration-1000"
            style={{ 
              animationDelay: '0.2s',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            My
          </div>
          <div 
            className="text-[#ff470f] text-5xl md:text-7xl font-semibold font-['Lufga'] leading-tight tracking-[2px] [text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)] mb-6 transition-all duration-1000"
            style={{ 
              animationDelay: '0.4s',
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'
            }}
          >
            <div className="hover:tracking-[4px] transition-all duration-700 ease-out cursor-default">
              Experience
            </div>
          </div>
          <div 
            className="w-24 h-1 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-full mx-auto mb-6 transition-all duration-1000"
            style={{ 
              animationDelay: '0.6s',
              width: isVisible ? '96px' : '0px',
              opacity: isVisible ? 1 : 0
            }}
          ></div>
          <p 
            className="text-stone-400 text-lg max-w-2xl mx-auto transition-all duration-1000"
            style={{ 
              animationDelay: '0.8s',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            A journey through innovative projects and challenging roles that have shaped my expertise in AI, development, and design.
          </p>
        </div>

        {/* Timeline Container with better positioning */}
        <div className="relative w-full">
          {/* Background timeline line - always visible and centered */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-zinc-600/60 rounded-full transform -translate-x-1/2 z-0"></div>
          
          {/* Animated Timeline Line - grows with scroll */}
          <div 
            ref={timelineRef}
            className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-[#FF4500] to-[#FF6B35] rounded-full transform -translate-x-1/2 z-10"
            style={{
              height: `${scrollProgress * 100}%`,
              opacity: 0.9,
              transition: 'height 0.1s ease-out',
              boxShadow: '0 0 15px rgba(255, 69, 0, 0.4)'
            }}
          ></div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div 
                key={index}
                ref={el => itemRefs.current[index] = el}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-end' : 'justify-start'
                } transition-all duration-1000 ease-out ${
                  visibleItems.includes(index)
                    ? 'opacity-100 transform translate-y-0 translate-x-0'
                    : `opacity-0 transform translate-y-8 ${
                        index % 2 === 0 ? 'translate-x-8' : '-translate-x-8'
                      }`
                }`}
                style={{ 
                  transitionDelay: `${visibleItems.includes(index) ? index * 0.2 : 0}s`
                }}
              >
                {/* Optimized Timeline Dot */}
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#FF4500] rounded-full border-4 border-zinc-900 z-10 transition-transform duration-500 ${
                    visibleItems.includes(index) 
                      ? 'scale-100' 
                      : 'scale-0'
                  }`}
                  style={{
                    transitionDelay: `${visibleItems.includes(index) ? (index * 0.15) + 0.2 : 0}s`,
                  }}
                >
                  {/* Simplified pulsing effect */}
                  {visibleItems.includes(index) && (
                    <div className="absolute inset-0 bg-[#FF4500] rounded-full animate-ping opacity-75" style={{ animationDuration: '2s' }}></div>
                  )}
                </div>

                {/* Optimized Experience Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-300 group">
                    
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[#FF4500] text-xl font-semibold group-hover:text-[#FF6B35] transition-colors duration-300">
                          {exp.title}
                        </h3>
                        <span className="text-stone-400 text-sm bg-zinc-800/50 px-3 py-1 rounded-full group-hover:bg-zinc-700/70 transition-colors duration-300">
                          {exp.period}
                        </span>
                      </div>
                      <div className="flex items-center text-stone-300 mb-1 group-hover:text-stone-200 transition-colors duration-300">
                        <span className="font-medium">{exp.company}</span>
                        <span className="mx-2 text-[#FF4500]">•</span>
                        <span className="text-stone-400 group-hover:text-stone-300 transition-colors duration-300">{exp.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-stone-400 leading-relaxed mb-4 group-hover:text-stone-300 transition-colors duration-300">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    <div className="mb-4">
                      <h4 className="text-stone-300 font-medium mb-2 group-hover:text-white transition-colors duration-300">
                        Key Achievements:
                      </h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li 
                            key={achIndex} 
                            className="text-stone-400 text-sm flex items-start group-hover:text-stone-300 transition-colors duration-300"
                          >
                            <span className="text-[#FF4500] mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-stone-300 font-medium mb-2 group-hover:text-white transition-colors duration-300">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 bg-zinc-800/50 border border-[#FF4500]/30 rounded-full text-xs text-stone-300 hover:border-[#FF4500]/80 hover:text-[#FF4500] transition-all duration-300 cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimized Bottom Summary */}
        <div 
          className={`text-center mt-16 transition-all duration-800 ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-10'
          }`} 
          style={{ transitionDelay: '1.2s' }}
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto hover:bg-white/8 transition-all duration-300 group">
            <h3 className="text-stone-300 text-2xl font-semibold mb-4 group-hover:text-white transition-colors duration-300">
              Ready to bring expertise to your next project
            </h3>
            <p className="text-stone-400 leading-relaxed mb-6 group-hover:text-stone-300 transition-colors duration-300">
              With a proven track record of delivering innovative AI solutions and exceptional user experiences, 
              I'm passionate about tackling complex challenges and driving meaningful results.
            </p>
            <button className="group/btn px-8 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-lg text-white font-medium hover:from-[#FF6B35] hover:to-[#FF4500] transition-all duration-300 transform hover:scale-105">
              Let's Work Together
              <svg className="w-5 h-5 inline-block ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Optimized CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default ExperienceSection;
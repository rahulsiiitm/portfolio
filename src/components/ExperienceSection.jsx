import React, { useEffect, useRef, useState } from 'react';
import { experiences } from './experienceData';

function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedCards, setExpandedCards] = useState({}); // Track expanded state for each card
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

  // Function to toggle card expansion
  const toggleCardExpansion = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Check if screen is mobile (you might want to adjust this breakpoint)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Fixed scroll progress calculation for accurate timeline
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking && sectionRef.current) {
        requestAnimationFrame(() => {
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const sectionHeight = rect.height;

          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;

          let progress = 0;

          if (sectionTop <= 0 && sectionBottom > 0) {
            const scrolledDistance = Math.abs(sectionTop);
            const totalScrollDistance = sectionHeight - windowHeight;
            progress = Math.min(1, scrolledDistance / totalScrollDistance);
          } else if (sectionBottom <= 0) {
            progress = 1;
          }

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
      className="bg-transparent px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16 relative overflow-hidden"
    >
      {/* Subtle background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/3 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto">

        {/* Section Header - Enhanced responsiveness */}
        <div className={`text-center mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 ${
          isVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-10'
        }`}>
          <div
            className="text-stone-300 text-xl sm:text-2xl lg:text-3xl font-normal font-['Dancing_Script'] mb-1 sm:mb-2 transition-all duration-1000"
            style={{
              animationDelay: '0.2s',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            My
          </div>
          <div
            className="text-[#ff470f] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold font-['Lufga'] leading-tight tracking-wide lg:tracking-[1px] [text-shadow:_2px_2px_10px_rgb(0_0_0_/_0.8)] mb-3 sm:mb-4 transition-all duration-1000"
            style={{
              animationDelay: '0.4s',
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'
            }}
          >
            <div className="hover:tracking-[2px] lg:hover:tracking-[3px] transition-all duration-700 ease-out cursor-default font-['Lufga']">
              Experience
            </div>
          </div>
          <div
            className="w-12 sm:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-full mx-auto mb-3 sm:mb-4 transition-all duration-1000"
            style={{
              animationDelay: '0.6s',
              width: isVisible ? 'auto' : '0px',
              opacity: isVisible ? 1 : 0
            }}
          ></div>
          <p
            className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-md sm:max-w-lg lg:max-w-xl mx-auto transition-all duration-1000 font-['Montserrat'] px-4"
            style={{
              animationDelay: '0.8s',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            A journey through innovative projects and challenging roles.
          </p>
        </div>

        {/* Timeline Container - Enhanced for all screen sizes */}
        <div className="relative w-full">
          {/* Background timeline line - responsive positioning */}
          <div className="absolute left-3 sm:left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-600/60 rounded-full transform lg:-translate-x-1/2 z-0"></div>

          {/* Animated Timeline Line - grows with scroll */}
          <div
            ref={timelineRef}
            className="absolute left-3 sm:left-4 lg:left-1/2 top-0 w-0.5 bg-gradient-to-b from-[#FF4500] to-[#FF6B35] rounded-full transform lg:-translate-x-1/2 z-10 transition-all duration-200"
            style={{
              height: `${scrollProgress * 100}%`,
              opacity: 0.9,
              boxShadow: '0 0 8px rgba(255, 69, 0, 0.3)'
            }}
          ></div>

          {/* Experience Items - Clean responsive layout */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {experiences.map((exp, index) => {
              const isExpanded = expandedCards[index] || false;
              
              return (
                <div
                  key={index}
                  ref={el => itemRefs.current[index] = el}
                  className={`relative flex items-start lg:items-center justify-start lg:justify-center w-full transition-all duration-1000 ease-out ${
                    visibleItems.includes(index)
                      ? 'opacity-100 transform translate-y-0'
                      : 'opacity-0 transform translate-y-6'
                  }`}
                  style={{
                    transitionDelay: `${visibleItems.includes(index) ? index * 0.15 : 0}s`
                  }}
                >
                  {/* Timeline Dot - Consistent positioning */}
                  <div
                    className={`absolute left-3 sm:left-4 lg:left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FF4500] rounded-full border-2 border-zinc-900 z-10 transition-all duration-500 ${
                      visibleItems.includes(index) ? 'scale-100' : 'scale-0'
                    }`}
                    style={{
                      top: '1rem',
                      transitionDelay: `${visibleItems.includes(index) ? (index * 0.1) + 0.3 : 0}s`,
                    }}
                  >
                    {/* Subtle pulse effect */}
                    {visibleItems.includes(index) && (
                      <div className="absolute inset-0 bg-[#FF4500] rounded-full animate-ping opacity-60" style={{ animationDuration: '3s' }}></div>
                    )}
                  </div>

                  {/* Experience Card - Responsive positioning */}
                  <div className={`w-full lg:w-5/12 ml-6 sm:ml-8 lg:ml-0 ${
                    index % 2 === 0 
                      ? 'lg:mr-auto lg:pr-8 xl:pr-12' 
                      : 'lg:ml-auto lg:pl-8 xl:pl-12'
                  }`}>
                    <div className="bg-black/[0.15] backdrop-blur-sm border border-white/[0.12] rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-500 group">

                      {/* Header - Clean responsive layout */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                          <div className="flex flex-col mb-2 sm:mb-0">
                              <h3 className="text-[#FF4500] text-base sm:text-lg lg:text-xl font-semibold group-hover:text-[#FF6B35] transition-colors duration-300 font-['Lufga'] leading-tight">
                                  {exp.title}
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:items-center text-stone-200 mt-1 font-['Montserrat'] text-xs sm:text-sm">
                                  <span className="font-medium">{exp.company}</span>
                                  <span className="hidden sm:inline mx-2 text-stone-400">•</span>
                                  <span className="text-stone-300 sm:mt-0">{exp.location}</span>
                              </div>
                          </div>
                          <span className="text-stone-200 text-xs bg-zinc-700/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium font-['Montserrat'] whitespace-nowrap border border-white/[0.1]">
                              {exp.period}
                          </span>
                      </div>

                      {/* Description - Responsive text */}
                      <p className="text-stone-200 leading-relaxed mb-4 sm:mb-5 group-hover:text-stone-100 transition-colors duration-300 font-['Montserrat'] text-xs sm:text-sm">
                        {exp.description}
                      </p>

                      {/* Content sections - Clean spacing with conditional rendering for mobile */}
                      <div className={`space-y-3 sm:space-y-4 transition-all duration-500 ease-in-out ${
                        isMobile && !isExpanded ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-none opacity-100'
                      }`}>
                          {/* Key Achievements */}
                          <div>
                              <h4 className="text-stone-200 font-medium mb-2 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm font-['Lufga']">
                                  Key Achievements
                              </h4>
                              <ul className="space-y-1 sm:space-y-1.5 font-['Montserrat']">
                                  {exp.achievements.map((achievement, achIndex) => (
                                      <li key={achIndex} className="text-stone-200 text-xs flex items-start group-hover:text-stone-100 transition-colors duration-300 leading-relaxed">
                                          <span className="text-[#FF4500] mr-2 mt-0.5 font-bold text-xs">•</span>
                                          <span className="flex-1">{achievement}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                          
                          {/* Technologies */}
                          <div>
                              <h4 className="text-stone-200 font-medium mb-2 group-hover:text-white transition-colors duration-300 text-xs sm:text-sm font-['Lufga']">
                                  Technologies
                              </h4>
                              <div className="flex flex-wrap gap-1 sm:gap-1.5 font-['Montserrat']">
                                  {exp.technologies.map((tech, techIndex) => (
                                      <span key={techIndex} className="px-2 sm:px-2.5 py-1 bg-zinc-700/50 border border-[#FF4500]/30 rounded-full text-xs text-stone-200 hover:border-[#FF4500]/60 hover:text-[#FF4500] hover:bg-zinc-700/70 transition-all duration-300 cursor-default font-medium">
                                          {tech}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* View More/Less button - Only show on mobile */}
                      {isMobile && (
                        <div className="mt-4 pt-3 border-t border-white/[0.1]">
                          <button
                            onClick={() => toggleCardExpansion(index)}
                            className="flex items-center justify-center w-full text-[#FF4500] hover:text-[#FF6B35] transition-colors duration-300 font-medium text-sm font-['Montserrat'] group/btn"
                          >
                            <span className="mr-2">
                              {isExpanded ? 'View Less' : 'View More'}
                            </span>
                            <svg 
                              className={`w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110 ${
                                isExpanded ? 'rotate-180' : 'rotate-0'
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
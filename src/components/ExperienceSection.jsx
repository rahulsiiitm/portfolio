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
            <div className="hover:tracking-[4px] transition-all duration-700 ease-out cursor-default font-['Lufga']">
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
            className="text-stone-400 text-lg max-w-2xl mx-auto transition-all duration-1000 font-['Montserrat']"
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
          {/* Background timeline line - always visible and positioned for mobile */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-zinc-600/60 rounded-full transform -translate-x-1/2 z-0"></div>

          {/* Animated Timeline Line - grows with scroll */}
          <div
            ref={timelineRef}
            className="absolute left-6 md:left-1/2 top-0 w-1 bg-gradient-to-b from-[#FF4500] to-[#FF6B35] rounded-full transform -translate-x-1/2 z-10"
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
                className={`relative flex items-center justify-start md:justify-end md:w-full ${
                  index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
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
                  className={`absolute left-6 transform -translate-x-1/2 w-4 h-4 bg-[#FF4500] rounded-full border-4 border-zinc-900 z-10 transition-transform duration-500 md:left-1/2 ${
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
                <div className={`w-full md:w-6/12 pl-12 md:pr-12 ${index % 2 !== 0 && 'md:pl-12 md:pr-0'}`}>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-300 group">

                    <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div class="flex flex-col">
                            <h3 class="text-[#FF4500] text-xl font-semibold group-hover:text-[#FF6B35] transition-colors duration-300 font-['Lufga']">
                                {exp.title}
                            </h3>
                            <div class="flex items-center text-stone-300 mt-1 mb-2 font-['Montserrat']">
                                <span class="font-medium">{exp.company}</span>
                                <span class="mx-2">•</span>
                                <span class="text-stone-400">{exp.location}</span>
                            </div>
                        </div>
                        <span class="text-stone-400 text-sm bg-zinc-800/50 px-3 py-1.5 rounded-full md:mt-0 mt-2 font-medium font-['Montserrat']">
                            {exp.period}
                        </span>
                    </div>

                    <p class="text-stone-400 leading-relaxed mb-6 group-hover:text-stone-300 transition-colors duration-300 font-['Montserrat']">
                      {exp.description}
                    </p>

                    <div class="grid grid-cols-1 gap-6">
                        {/* Key Achievements */}
                        <div>
                            <h4 class="text-stone-300 font-medium mb-3 group-hover:text-white transition-colors duration-300 text-lg font-['Lufga']">
                                Key Achievements:
                            </h4>
                            <ul class="space-y-2 font-['Montserrat']">
                                {exp.achievements.map((achievement, achIndex) => (
                                    <li key={achIndex} class="text-stone-400 text-sm flex items-start group-hover:text-stone-300 transition-colors duration-300 leading-relaxed">
                                        <span class="text-[#FF4500] mr-3 mt-0.5 font-bold">•</span>
                                        <span>{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Technologies */}
                        <div>
                            <h4 class="text-stone-300 font-medium mb-3 group-hover:text-white transition-colors duration-300 text-lg font-['Lufga']">
                                Technologies:
                            </h4>
                            <div class="flex flex-wrap gap-2 font-['Montserrat']">
                                {exp.technologies.map((tech, techIndex) => (
                                    <span key={techIndex} class="px-3 py-1.5 bg-zinc-800/50 border border-[#FF4500]/30 rounded-full text-xs text-stone-300 hover:border-[#FF4500]/80 hover:text-[#FF4500] transition-all duration-300 cursor-default font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
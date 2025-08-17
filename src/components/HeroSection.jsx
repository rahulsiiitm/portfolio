// src/components/HeroSection.jsx
import React, { useEffect, useState } from 'react';

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple fade out effect
  const opacity = Math.max(0, 1 - scrollY / 400);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Rahul_Resume (1).pdf';
    link.download = 'Rahul_Resume (1).pdf';
    link.click();
  };

  // Function to scroll to the bottom of the page
  const scrollToContact = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className="relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-[60px] py-6 sm:py-8 flex-grow ml-2 sm:ml-4 md:ml-8 lg:ml-16 -mt-4 sm:-mt-6 md:-mt-8 lg:mt-8"
      style={{
        opacity: opacity
      }}
    >

      {/* Hero Text Section - Mobile Optimized */}
      <div className="max-w-4xl animate-fade-up" style={{
        transform: window.innerWidth < 768 ? 'scale(1)' : 'scale(0.85)',
        transformOrigin: 'left center',
        animationDelay: '0.3s'
      }}>

        {/* Greeting Text */}
        <div className="text-stone-300 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-normal font-['Dancing_Script'] mb-3 sm:mb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          I'm
        </div>

        {/* Name Section */}
        <div className="mb-4 sm:mb-6">
          <div className="text-[#ff470f] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold font-['Lufga'] leading-tight sm:leading-tight md:leading-tight lg:leading-[117.45px] tracking-[1px] sm:tracking-[2px] md:tracking-[2px] lg:tracking-[3.66px] [text-shadow:_2px_2px_10px_rgb(0_0_0_/_0.8)] sm:[text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)] animate-scale-in" style={{ animationDelay: '0.8s' }}>
            <div className="-mb-1 sm:-mb-2 md:-mb-2 lg:-mb-4 hover:tracking-[2px] sm:hover:tracking-[3px] md:hover:tracking-[4px] transition-all duration-700 ease-out">
              Rahul
            </div>
            <div className="hover:tracking-[2px] sm:hover:tracking-[3px] md:hover:tracking-[4px] transition-all duration-700 ease-out">
              Sharma
            </div>
          </div>
        </div>

        {/* Enhanced Tagline - Mobile Optimized */}
        <div className="mb-6 sm:mb-8 md:mb-10 space-y-2 sm:space-y-3 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="justify-start text-stone-300 text-xl sm:text-2xl md:text-4xl lg:text-6xl font-normal font-['Nanum_Brush_Script'] hover:text-[#ff470f] hover:tracking-[0.5px] sm:hover:tracking-[1px] transition-all duration-500 ease-out leading-tight">
            AI/ML Engineer & UI/UX Designer
          </div>
          <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl leading-relaxed hover:text-stone-200 transition-colors duration-400">
            Crafting intelligent solutions through machine learning and creating beautiful,
            user-centered experiences that bridge technology and human needs.
          </p>
        </div>

        {/* Enhanced Call-to-Action Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 animate-slide-up-subtle items-start" style={{ animationDelay: '1.2s' }}>

          {/* Get in Touch Button */}
          <button
            onClick={scrollToContact}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-zinc-950 rounded-lg outline outline-offset-[-1px] outline-[#ff470f] inline-flex justify-center items-center gap-2 sm:gap-3 transition-all duration-400 transform hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden">
            {/* Sliding background layer */}
            <div className="absolute inset-0 bg-[#ff470f] transform scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300 ease-out z-0"></div>
            {/* Content */}
            <div className="relative z-10 flex justify-center items-center gap-2 sm:gap-3 group-hover:scale-[1.05] transition-transform duration-300">
              <span className="text-stone-300 text-lg sm:text-xl font-medium font-[Poppins] group-hover:text-white transition-colors duration-300">
                Get in Touch
              </span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            {/* Animated underline */}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff470f] transform origin-left transition-transform duration-500 ease-in-out delay-100 scale-x-0 group-hover:scale-x-100 z-0"></span>
          </button>

          {/* Download CV Button */}
          <button
            onClick={downloadResume}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-transparent rounded-lg border-2 border-[#ff470f] inline-flex justify-center items-center gap-2 sm:gap-3 transition-all duration-400 transform hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden"
          >
            {/* Sliding background layer */}
            <div className="absolute inset-0 bg-[#ff470f] transform scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300 ease-out z-0"></div>
            {/* Content */}
            <div className="relative z-10 flex justify-center items-center gap-2 sm:gap-3 group-hover:scale-[1.05] transition-transform duration-300">
              <span className="text-[#ff470f] text-lg sm:text-xl font-medium font-[Poppins] group-hover:text-white transition-colors duration-300">
                Download CV
              </span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff470f] group-hover:text-white group-hover:translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {/* Animated underline */}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff470f] transform origin-left transition-transform duration-500 ease-in-out delay-100 scale-x-0 group-hover:scale-x-100 z-0"></span>
          </button>
        </div>

        {/* Skills/Expertise Tags - Mobile Optimized */}
        <div className="flex flex-wrap gap-2 sm:gap-3 animate-fade-in justify-center sm:justify-start" style={{ animationDelay: '1.4s' }}>
          {[
            'Machine Learning',
            'Deep Learning',
            'UI/UX Design',
            'Python',
            'React'
          ].map((skill, index) => (
            <span
              key={index}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900/50 border border-[#ff470f]/30 rounded-full text-xs sm:text-sm text-stone-300 backdrop-blur-sm hover:bg-[#ff470f]/10 hover:border-[#ff470f]/60 hover:text-[#ff470f] hover:-translate-y-1 transition-all duration-300 cursor-default font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

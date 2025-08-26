import React, { useEffect, useRef, useState } from 'react';

function AboutMeIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({});
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start counter animation only once
          if (!hasAnimated.current) {
            hasAnimated.current = true;
            setTimeout(() => {
              animateCounters();
            }, 800); // Delay to sync with fade-in animation
          }
        } else {
          // Optionally reset if you want animation to repeat on scroll up
          // setIsVisible(false);
        }
      },
      { threshold: 0.2 } // Trigger when 20% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const personalStats = [
    { number: '3rd Year', label: 'B.Tech CSE', numericValue: 3, suffix: 'rd Year' },
    { number: '6+', label: 'Projects Built', numericValue: 6, suffix: '+' },
    { number: '5+', label: 'Hackathons Participated', numericValue: 5, suffix: '+' },
    { number: '1', label: 'Startup Idea Presented', numericValue: 1, suffix: '' }
  ];

  // Counter animation function
  const animateCounters = () => {
    personalStats.forEach((stat, index) => {
      let current = 0;
      const target = stat.numericValue;
      const increment = target / 30; // 30 frames for smooth animation
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        setCounters(prev => ({
          ...prev,
          [index]: Math.floor(current)
        }));
      }, 20); // 20ms intervals for smooth animation
    });
  };

  const getDisplayValue = (stat, index) => {
    const animatedValue = counters[index];
    if (animatedValue === undefined) return '0';
    
    if (stat.suffix === 'rd Year') {
      return animatedValue === 3 ? '3rd Year' : `${animatedValue}${animatedValue === 1 ? 'st' : animatedValue === 2 ? 'nd' : 'rd'} Year`;
    }
    
    return `${animatedValue}${stat.suffix}`;
  };

  return (
    <section
      id="about-intro"
      ref={sectionRef}
      className="min-h-screen bg-transparent px-4 sm:px-6 md:px-8 lg:px-[60px] pt-16 sm:pt-20 pb-0 relative overflow-hidden flex items-center justify-center"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-40 h-40 sm:w-80 sm:h-80 bg-orange-600/3 rounded-full blur-3xl"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">

        {/* Main Content Grid */}
        <div className="bg-white/5 backdrop-blur-md border border-t-white/50 border-l-white/50 rounded-t-2xl p-4 sm:p-6 md:p-8 lg:p-12">

          {/* Section Header - Mobile First */}
          <div className={`text-center mb-8 sm:mb-12 lg:hidden ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex justify-center items-center gap-2">
              <div className="text-stone-300 text-2xl sm:text-3xl font-normal font-['Dancing_Script']">
                About
              </div>
              <div className="text-[#ff470f] text-3xl sm:text-4xl font-semibold font-['Lufga'] leading-tight tracking-[1px] sm:tracking-[2px] [text-shadow:_2px_2px_10px_rgb(0_0_0_/_0.8)]">
                <div className="hover:tracking-[2px] sm:hover:tracking-[4px] transition-all duration-700 ease-out">Me</div>
              </div>
            </div>
            <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-[#ff470f] to-[#ff470f] rounded-full mx-auto mt-3 sm:mt-4"></div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-start">

            {/* Left Column - Profile Image */}
            <div className={`lg:col-span-2 flex flex-col items-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="w-48 h-60 sm:w-56 sm:h-70 md:w-64 md:h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-600/50 shadow-2xl flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-stone-300 text-base sm:text-lg">
                  <img src="../My_photo2.jpg" alt="Rahul Sharma" className="w-full h-full object-cover align-top" />
                </span>
              </div>

              {/* Personal Stats - Below Image */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 w-full max-w-xs sm:max-w-sm font-['Montserrat']">
                {personalStats.map((stat, index) => (
                  <div key={index} className="text-center p-2 sm:p-3 lg:p-4 bg-black/20 rounded-lg sm:rounded-xl border border-white/10 group hover:scale-105 transition-all duration-300 hover:bg-black/30">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#ff470f] mb-0.5 sm:mb-1 group-hover:text-[#ff6b2f] transition-colors min-h-[1.5em] flex items-center justify-center">
                      {getDisplayValue(stat, index)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-stone-200 group-hover:text-stone-100 transition-colors leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - About Content */}
            <div className={`lg:col-span-3 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>

              {/* Desktop Header - Hidden on Mobile */}
              <div className={`text-center mb-8 lg:mb-12 hidden lg:block ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                <div className="flex justify-center items-center gap-2">
                  <div className="text-stone-300 text-4xl md:text-5xl font-normal font-['Dancing_Script']">
                    About
                  </div>
                  <div className="text-[#ff470f] text-5xl md:text-7xl font-semibold font-['Lufga'] leading-tight tracking-[2px] [text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)]">
                    <div className="hover:tracking-[4px] transition-all duration-700 ease-out">Me</div>
                  </div>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-[#ff470f] to-[#ff470f] rounded-full mx-auto mt-4"></div>
              </div>

              {/* Tagline */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-stone-200 text-lg sm:text-xl md:text-2xl lg:text-4xl font-normal font-['Nanum_Brush_Script'] leading-relaxed text-center lg:text-left">
                  Building AI that actually works (most of the time)
                </h3>
              </div>

              {/* Main Content */}
              <div className="space-y-4 sm:space-y-6 font-['Montserrat']">
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-stone-100 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    My name is Rahul Sharma and I'm a third-year CS student at IIIT Manipur with a passion for building AI-powered systems that are practical and easy to use. Recently, I developed AgriHive, a multilingual farming assistant that helps farmers make smarter decisions. My workflow is a mix of design and development, whether it's tweaking Flutter UIs, setting up Firebase backends, training AI models, or prototyping chatbots with Gemini. It's organized chaos in the best way possible: if something's blinking, broken, or confusing, I'm probably already experimenting with it, fixing it, or reimagining it 😎.
                  </p>
                </div>

                {/* Skills/Expertise Tags */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                  <h4 className="text-stone-200 text-sm sm:text-base font-medium mb-3 sm:mb-4">Core Expertise</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['Artificial Intelligence', 'UX Design', 'Machine Learning', 'React Development', 'Data Visualization', 'Product Strategy'].map((skill, index) => (
                      <span key={index} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#ff470f]/20 to-[#ff470f]/20 border border-[#ff470f]/30 rounded-full text-[10px] sm:text-xs text-stone-200 hover:border-[#ff470f]/50 hover:text-[#ff470f] transition-all duration-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMeIntro;
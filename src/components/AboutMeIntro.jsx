// src/components/AboutMeIntro.jsx
import React, { useEffect, useRef, useState } from 'react';

function AboutMeIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
    { number: '50+', label: 'Projects Completed' },
    { number: '5+', label: 'Years Experience' },
    { number: '20+', label: 'Happy Clients' },
    { number: '15+', label: 'Awards Won' }
  ];

  return (
    <section
      id="about-intro"
      ref={sectionRef}
      className="min-h-screen bg-transparent px-8 md:px-[60px] pt-20 pb-0 relative overflow-hidden flex items-center justify-center"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-600/3 rounded-full blur-3xl"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Main Content Grid */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12">
          
          {/* Header Section - Inside Card */}
          
        <div className="grid lg:grid-cols-5 gap-12 items-start">
            
            {/* Left Column - Profile Image */}
            <div className={`lg:col-span-2 flex flex-col items-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-700/50 shadow-2xl flex items-center justify-center mb-6">
                <span className="text-stone-400 text-lg">
                  <img src="../src/assets/My_photo.jpg" alt="Rahul Sharma" className="w-full h-full object-cover align-top" />
                </span>
              </div>
              
              {/* Personal Stats - Below Image */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm font-['Montserrat']">
                {personalStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-black/20 rounded-xl border border-white/5 group hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-[#FF4500] mb-1 group-hover:text-[#FF6B35] transition-colors">
                      {stat.number}
                    </div>
                    <div className="text-xs text-stone-400 group-hover:text-stone-300 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - About Content */}
            <div className={`lg:col-span-3 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex justify-center items-center gap-2">
              <div className="text-stone-300 text-4xl md:text-5xl font-normal font-['Dancing_Script']">
                About
              </div>
              <div className="text-[#ff470f] text-5xl md:text-7xl font-semibold font-['Lufga'] leading-tight tracking-[2px] [text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)]">
                <div className="hover:tracking-[4px] transition-all duration-700 ease-out">Me</div>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-full mx-auto mt-4"></div>
          </div>
              
              {/* Tagline */}
              <div className="mb-8">
                <h3 className="text-stone-300 text-2xl md:text-4xl font-normal font-['Nanum_Brush_Script'] leading-relaxed">
                  Passionate about bridging AI and human experience
                </h3>
              </div>
              
              {/* Main Content */}
              <div className="space-y-4 font-['Montserrat']">
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-stone-300 text-base leading-relaxed mb-4">
                    I'm a creative technologist who thrives at the intersection of artificial intelligence and user experience design. 
                    With over 5 years of experience, I've helped organizations transform complex data into intelligent, 
                    user-friendly solutions.
                  </p>
                  
                  <p className="text-stone-400 text-sm leading-relaxed mb-4">
                    My journey began with a fascination for how machines can learn and adapt, which led me to pursue advanced studies 
                    in AI. Along the way, I discovered that the most powerful technology means nothing without thoughtful design 
                    that puts humans first.
                  </p>
                  
                  <p className="text-stone-400 text-sm leading-relaxed">
                    When I'm not training neural networks or crafting user interfaces, you'll find me exploring new coffee shops, 
                    hiking mountain trails, or experimenting with generative art. I believe the best innovations come from 
                    diverse experiences and fresh perspectives.
                  </p>
                </div>

                {/* Skills/Expertise Tags */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-stone-300 text-base font-medium mb-3">Core Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Artificial Intelligence', 'UX Design', 'Machine Learning', 'React Development', 'Data Visualization', 'Product Strategy'].map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-[#FF4500]/20 to-[#FF6B35]/20 border border-[#FF4500]/30 rounded-full text-xs text-stone-300 hover:border-[#FF4500]/50 transition-colors duration-300">
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
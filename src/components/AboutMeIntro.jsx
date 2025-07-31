// src/components/AboutMeIntro.jsx
import React, { useEffect, useRef, useState } from 'react';
// import '../index.css'; // Not strictly needed here if styles are global

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
      id="about-intro" // Unique ID for navigation
      ref={sectionRef}
      // Add a substantial height for it to be a distinct scrollable section
      className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-8 md:px-[60px] py-20 relative overflow-hidden flex items-center justify-center"
    >
      {/* Background Effects (copied from AboutSection) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-600/3 rounded-full blur-3xl"></div>

      {/* Main Content Container - Apply glassmorphism here */}
      <div className="relative z-10 max-w-7xl mx-auto
                  bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 py-12 md:py-20
                  grid lg:grid-cols-3 gap-12 items-start"> {/* This is your main glassmorphic panel */}

        {/* Left Column - About Text */}
        <div className={`lg:col-span-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          
          {/* Section Header (modified for intro) */}
          <div className="mb-8">
            <div className="text-stone-300 text-4xl md:text-5xl font-normal font-['Dancing_Script'] mb-2">
              About
            </div>
            <div className="text-[#ff470f] text-5xl md:text-7xl font-semibold font-['Lufga'] leading-tight tracking-[2px] [text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)] mb-6">
              <div className="hover:tracking-[4px] transition-all duration-700 ease-out">Me</div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-full"></div>
          </div>

          <div className="space-y-6 animate-fade-in">
            <div className="text-stone-300 text-xl md:text-2xl font-normal font-['Nanum_Brush_Script'] mb-4">
              Passionate about bridging AI and human experience
            </div>
            
            <div className="space-y-4 text-stone-400 leading-relaxed">
              <p className="text-lg">
                I'm a creative technologist who thrives at the intersection of artificial intelligence and user experience design. 
                With over 5 years of experience, I've helped organizations transform complex data into intelligent, 
                user-friendly solutions.
              </p>
              <p>
                My journey began with a fascination for how machines can learn and adapt, which led me to pursue advanced studies 
                in AI. Along the way, I discovered that the most powerful technology means nothing without thoughtful design 
                that puts humans first.
              </p>
              <p>
                When I'm not training neural networks or crafting user interfaces, you'll find me exploring new coffee shops, 
                hiking mountain trails, or experimenting with generative art. I believe the best innovations come from 
                diverse experiences and fresh perspectives.
              </p>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-zinc-800">
              {personalStats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-[#FF4500] mb-2 group-hover:text-[#FF6B35] transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm text-stone-400 group-hover:text-stone-300 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Photo Placeholder (Centered) */}
        <div className={`lg:col-span-1 flex items-center justify-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          {/* Centered Photo Placeholder */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 shadow-lg flex items-center justify-center text-center">
            {/* Replace with your image: <img src="/your-photo.jpg" alt="Rahul Sharma" className="w-full h-full object-cover" /> */}
            <span className="text-stone-400 text-lg">Your Photo Here</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMeIntro;
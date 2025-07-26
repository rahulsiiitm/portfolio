// src/components/HeroSection.jsx
import React from 'react';

function HeroSection() {
  return (
    // This is the content you previously had in App.jsx's main content area
    <div className="relative z-10 flex flex-col justify-center px-8 md:px-[60px] py-8 flex-grow ml-8 md:ml-16 -mt-8 md:-mt-12">
        
        {/* Hero Text Section - Scaled down visually */}
        {/* Note: The 'transform: scale(0.85)' is a visual scale.
             If content still overflows, specific font sizes, margins, etc., need to be further reduced. */}
        <div className="max-w-4xl animate-fade-up" style={{ transform: 'scale(0.85)', transformOrigin: 'left center', animationDelay: '0.3s' }}>
          {/* Custom fonts used as per your code - ensure they are imported */}
          <div className="text-stone-300 text-5xl md:text-7xl font-normal font-['Brush_Script_MT'] mb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            I'm
          </div>
          
          <div className="mb-6">
            <div className="text-orange-500 text-6xl md:text-8xl font-semibold font-['Lufga'] leading-tight md:leading-[117.45px] tracking-[2px] md:tracking-[3.66px] [text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)] animate-scale-in" style={{ animationDelay: '0.8s' }}>
              <div className="-mb-2 md:-mb-4 hover:tracking-[4px] transition-all duration-700 ease-out">Rahul</div>
              <div className="hover:tracking-[4px] transition-all duration-700 ease-out">Sharma</div>
            </div>
          </div>

          {/* Enhanced Tagline */}
          <div className="mb-10 space-y-3 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="justify-start text-stone-300 text-4xl md:text-6xl font-normal font-['Nanum_Brush_Script'] hover:text-orange-400 hover:tracking-[1px] transition-all duration-500 ease-out">
              AI/ML Engineer & UI/UX Designer
            </div>
            <p className="text-base md:text-lg text-stone-400 max-w-2xl leading-relaxed hover:text-stone-300 transition-colors duration-400">
              Crafting intelligent solutions through machine learning and creating beautiful, 
              user-centered experiences that bridge technology and human needs.
            </p>
          </div>

          {/* Enhanced Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up-subtle" style={{ animationDelay: '1.2s' }}>
            <button className="group px-8 py-4 bg-zinc-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-orange-400 inline-flex justify-center items-center gap-3 hover:bg-orange-500 hover:outline-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-400 transform hover:scale-[1.01] hover:-translate-y-0.5">
              <span className="text-stone-300 text-xl font-medium font-[Poppins] group-hover:text-white transition-colors duration-300">
                Get in Touch
              </span>
              <svg className="w-5 h-5 text-stone-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
            <button className="group px-8 py-4 bg-transparent rounded-lg border-2 border-orange-400 inline-flex justify-center items-center gap-3 hover:bg-orange-500 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-400 transform hover:scale-[1.01] hover:-translate-y-0.5">
              <span className="text-orange-400 text-xl font-medium font-[Poppins] group-hover:text-white transition-colors duration-300">
                Download CV
              </span>
              <svg className="w-5 h-5 text-orange-400 group-hover:text-white group-hover:translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>

          {/* Skills/Expertise Tags */}
          <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '1.4s' }}>
            <span className="px-4 py-2 bg-zinc-900/50 border border-orange-500/30 rounded-full text-sm text-stone-300 backdrop-blur-sm hover:bg-orange-500/10 hover:border-orange-500/60 hover:text-orange-200 hover:-translate-y-1 transition-all duration-300 cursor-default">
              Machine Learning
            </span>
            <span className="px-4 py-2 bg-zinc-900/50 border border-orange-500/30 rounded-full text-sm text-stone-300 backdrop-blur-sm hover:bg-orange-500/10 hover:border-orange-500/60 hover:text-orange-200 hover:-translate-y-1 transition-all duration-300 cursor-default">
              Deep Learning
            </span>
            <span className="px-4 py-2 bg-zinc-900/50 border border-orange-500/30 rounded-full text-sm text-stone-300 backdrop-blur-sm hover:bg-orange-500/10 hover:border-orange-500/60 hover:text-orange-200 hover:-translate-y-1 transition-all duration-300 cursor-default">
              UI/UX Design
            </span>
            <span className="px-4 py-2 bg-zinc-900/50 border border-orange-500/30 rounded-full text-sm text-stone-300 backdrop-blur-sm hover:bg-orange-500/10 hover:border-orange-500/60 hover:text-orange-200 hover:-translate-y-1 transition-all duration-300 cursor-default">
              Python
            </span>
            <span className="px-4 py-2 bg-zinc-900/50 border border-orange-500/30 rounded-full text-sm text-stone-300 backdrop-blur-sm hover:bg-orange-500/10 hover:border-orange-500/60 hover:text-orange-200 hover:-translate-y-1 transition-all duration-300 cursor-default">
              React
            </span>
          </div>
        </div>
    </div>
  );
}

export default HeroSection;
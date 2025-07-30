// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import RightSidebar from './components/RightSidebar'; 
import HeroSection from './components/HeroSection'; 
import './index.css'; 

function App() {
  return (
    <>
      {/* This div contains all your sticky content */}
      <div className="fixed inset-0 bg-[#1A1A1A] text-white flex flex-col overflow-hidden z-10"> 
        {/* Navbar is now a direct child */}
        {/* Hero Section Content */}
        <HeroSection />

        {/* Background Image */}
        <img
          src="/bg.png"
          alt="Abstract background element"
          className="absolute right-0 md:right-[106px] top-0 h-full w-auto object-cover opacity-60 md:opacity-100 pointer-events-none z-0 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        />

        
      </div>

      <Navbar /> 
      <RightSidebar />
      {/* Placeholder for the next section that will scroll over */}
      <div className="relative z-20 mt-[1080px] bg-gray-700 text-white min-h-screen p-16"> 
        <h2 className="text-5xl mb-4">Next Section Title</h2>
        <p className="text-lg">
          This content will appear as you scroll down, covering the hero section.
          You can add more content here to test the scroll.
        </p>
        <p className="text-lg mt-4">
          Scroll down further to see how it works!
        </p>
      </div>

      {/* NEW SECTION ADDED BELOW */}
      <div className="relative z-20 bg-gray-900 text-white min-h-screen p-16">
        <h2 className="text-5xl mb-4">Second Section Title</h2>
        <p className="text-lg">
          This is the second section, appearing after the first scroll-over section.
          You can place different content or projects here.
        </p>
        <p className="text-lg mt-4">
          Keep scrolling for more!
        </p>
      </div>

      {/* Reminder about style block */}
    </>
  );
}

export default App;
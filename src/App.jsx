// src/App.jsx
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import RightSidebar from './components/RightSidebar'; 
import MobileSidebar from './components/MobileSidebar';
import HeroSection from './components/HeroSection';
import AboutMeIntro from './components/AboutMeIntro';
import Experience from './components/ExperienceSection';
import './index.css'; 

function App() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!hasScrolled && e.deltaY > 0 && window.scrollY < 100) {
        e.preventDefault();
        setHasScrolled(true);
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth',
        });
      }
    };

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setHasScrolled(false); // Reset when scrolled to top
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  // Handle mobile sidebar toggle
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Fixed Hero Section */}
      <div className="fixed inset-0 bg-[#1A1A1A] text-white flex flex-col overflow-hidden z-10"> 
        <HeroSection />
        <img
          src="/bg.png"
          alt="Abstract background element"
          className="absolute right-0 md:right-20 lg:right-[106px] top-0 h-full w-auto object-cover opacity-60 md:opacity-100 pointer-events-none z-0 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        />
      </div>

      <Navbar 
        onToggleSidebar={toggleMobileSidebar} 
        isSidebarOpen={isMobileSidebarOpen}
      /> 
      
      {/* Desktop Sidebar */}
      <RightSidebar />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* Scrollable Sections Below Hero */}
      <div className="relative z-20 mt-[100vh] min-h-screen">
        <AboutMeIntro />
      </div>

      <div className="relative z-20 bg-[#16191e] opacity-80 text-white min-h-screen p-8 md:p-16">
        <Experience />
      </div>
    </>
  );
}

export default App;
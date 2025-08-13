// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import Y21Logo from '../assets/Y21.svg';
import Y22Logo from '../assets/Y22.svg';
import { FaDownload, FaBars, FaTimes } from 'react-icons/fa';

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const [activeLink, setActiveLink] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Rahul_Resume (1).pdf';
    link.download = 'Rahul_Resume (1).pdf';
    link.click();
  };

  const handleRightBoxClick = () => {
    if (isMobile && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <header className={`
      fixed top-0 left-0 w-full z-50 border-b-2 overflow-hidden flex items-center pl-8 pr-0
      transition-all duration-300 ease-in-out
      ${isScrolled ? 'h-[64px] bg-black/80 backdrop-blur-lg border-[#9D9D9D]/70' : 'h-[88px] bg-black/10 backdrop-blur-md border-[#9D9D9D]/55'}
      animate-slide-down
    `}>
      <img
        src={Y21Logo}
        alt="Main Portfolio Logo"
        className={`transition-all duration-300 ${isScrolled ? 'h-[28px]' : 'h-[35px]'}`}
      />

      {/* Desktop Navigation Links */}
      <nav className="ml-auto space-x-[71px] hidden md:flex items-center">
        {['Home', 'About', 'Projects', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setActiveLink(item)}
            className={`
              text-[15px] font-[Poppins] font-medium relative group
              transition-colors duration-300 ease-out
              ${activeLink === item ? 'text-[#FF4500]' : 'text-white hover:text-[#FF4500]'}
            `}
          >
            {item}
            <span className={`
              absolute bottom-0 left-0 w-full h-[2px] bg-[#FF4500]
              transform origin-left
              transition-transform duration-500 ease-in-out delay-100
              ${activeLink === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
            `}></span>
          </a>
        ))}
      </nav>

      {/* Desktop Resume Button */}
      <div className="hidden md:flex items-center ml-8 mr-6">
        <button
          onClick={downloadResume}
          className="flex items-center space-x-2 px-5 py-2 bg-[#FF4500] text-white rounded-full hover:bg-[#FF6B35] transition-colors duration-300 text-sm font-medium"
        >
          <FaDownload className="text-xs" />
          <span>Resume</span>
        </button>
      </div>

      {/* Mobile Navigation Links */}
      <nav className="md:hidden ml-auto flex items-center space-x-4 mr-4">
        {[].map((item) => (
          <a
            
            >
            {item}
            <span className={`
              absolute bottom-0 left-0 w-full h-[1px] bg-[#FF4500]
              transform origin-left
              transition-transform duration-500 ease-in-out delay-100
              ${activeLink === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
            `}></span>
          </a>
        ))}
      </nav>

      {/* Right box - Toggle sidebar on mobile, decorative on desktop */}
      <div 
        className={`
          w-[106px] h-full bg-[#333333] ml-[15px] flex items-center flex-shrink-0 justify-center 
          group relative overflow-hidden
          ${isMobile ? 'cursor-pointer' : 'cursor-default'}
          transition-all duration-300
        `}
        onClick={handleRightBoxClick}
      >
        {isMobile ? (
          // Mobile: Show hamburger/close icon
          <div className="relative z-10 text-white group-hover:text-[#FF4500] transition-colors duration-300">
            {isSidebarOpen ? (
              <FaTimes className="text-lg transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <FaBars className="text-lg transition-transform duration-300 group-hover:scale-110" />
            )}
          </div>
        ) : (
          // Desktop: Show original logo
          <img 
            src={Y22Logo} 
            alt="Navigation Icon" 
            className="h-[13px] relative z-10 group-hover:scale-110 transition-transform duration-300" 
          />
        )}
        
        {/* Background animation */}
        <div className={`
          absolute inset-0 transform origin-left transition-transform duration-300 ease-out z-0
          ${isMobile ? 'bg-[#FF4500]' : 'bg-[#FF4500]'}
          ${(isMobile && isSidebarOpen) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
        `}></div>
      </div>
    </header>
  );
}

export default Navbar;
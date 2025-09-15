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

  // Handle active section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      // Check if we're at the top (hero section)
      if (window.scrollY < window.innerHeight / 2) {
        setActiveLink('Home');
        return;
      }

      // Check each section
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveLink(section.charAt(0).toUpperCase() + section.slice(1));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  // Handle navigation click
  const handleNavClick = (item) => {
    const sectionId = item.toLowerCase();
    
    if (sectionId === 'home') {
      // Scroll to top for home
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to specific section
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = isMobile ? 60 : 88; // Adjust based on mobile/desktop navbar height
        const elementPosition = element.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
    
    setActiveLink(item);
    
    // Close mobile sidebar if open
    if (isMobile && isSidebarOpen) {
      onToggleSidebar();
    }
  };

  // Handle resume download
  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Rahul_Resume.pdf';
    link.download = 'Rahul_Resume.pdf';
    link.click();
  };

  const handleRightBoxClick = () => {
    if (isMobile && onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <header className={`
      fixed top-0 left-0 w-full z-50 border-b-2 overflow-hidden flex items-center pl-4 md:pl-8 pr-0
      transition-all duration-300 ease-in-out
      ${
        isMobile 
          ? // Mobile: Fixed height, only background color changes
            `h-[60px] ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-[#9D9D9D]/70' : 'bg-black/10 backdrop-blur-md border-[#9D9D9D]/55'}`
          : // Desktop: Height changes with scroll
            `${isScrolled ? 'h-[64px] bg-black/80 backdrop-blur-lg border-[#9D9D9D]/70' : 'h-[88px] bg-black/10 backdrop-blur-md border-[#9D9D9D]/55'}`
      }
      animate-slide-down
    `}>
      <img
        src={Y21Logo}
        alt="Main Portfolio Logo"
        className={`transition-all duration-300 ${
          isMobile 
            ? 'h-[24px]' // Fixed smaller size for mobile
            : isScrolled ? 'h-[28px]' : 'h-[35px]' // Responsive for desktop
        }`}
      />

      {/* Desktop Navigation Links */}
      <nav className="ml-auto space-x-[71px] hidden md:flex items-center">
        {['Home', 'About', 'Experience', 'Projects', 'Contact'].map((item) => (
          <button
            key={item}
            onClick={() => handleNavClick(item)}
            className={`
              text-[15px] font-[Poppins] font-medium relative group
              transition-colors duration-300 ease-out cursor-pointer
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
          </button>
        ))}
      </nav>

      {/* Desktop Resume Button */}
      <div className="hidden md:flex items-center ml-8 mr-6">
        <button
          onClick={downloadResume}
          className="group px-5 py-2 bg-zinc-950 rounded-lg outline outline-offset-[-1px] outline-[#FF4500] inline-flex justify-center items-center gap-2 transition-all duration-400 transform hover:scale-[1.01] hover:-translate-y-0.5 relative overflow-hidden text-sm font-medium"
        >
          {/* Sliding background layer */}
          <div className="absolute inset-0 bg-[#FF4500] transform scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300 ease-out z-0"></div>
          
          {/* Content */}
          <div className="relative z-10 flex justify-center items-center gap-2 group-hover:scale-[1.05] transition-transform duration-300">
            <span className="text-stone-300 text-sm font-medium font-[Poppins] group-hover:text-white transition-colors duration-300">
              Resume
            </span>
            <svg className="w-4 h-4 text-stone-300 group-hover:text-white group-hover:translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          {/* Animated underline */}
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF4500] transform origin-left transition-transform duration-500 ease-in-out delay-100 scale-x-0 group-hover:scale-x-100 z-0"></span>
        </button>
      </div>

      {/* Mobile Navigation Links - Empty for now since you have sidebar */}
      <nav className="md:hidden ml-auto flex items-center space-x-4 mr-3">
        {/* Mobile links can be added here if needed */}
      </nav>

      {/* Right box - Toggle sidebar on mobile, decorative on desktop */}
      <div 
        className={`
          ${isMobile ? 'w-[80px]' : 'w-[106px]'} h-full bg-[#333333] ml-[15px] flex items-center flex-shrink-0 justify-center 
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
              <FaTimes className="text-base transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <FaBars className="text-base transition-transform duration-300 group-hover:scale-110" />
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
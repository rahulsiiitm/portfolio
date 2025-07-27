// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'; 
import Y21Logo from '../assets/Y21.svg';
import Y22Logo from '../assets/Y22.svg';
import { FaBars, FaTimes, FaDownload } from 'react-icons/fa'; 

function Navbar() {
  const [activeLink, setActiveLink] = useState("Home"); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect with delay
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolled(window.scrollY > 150);
      }, 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/path-to-your-resume.pdf';
    link.download = 'Your_Name_Resume.pdf';
    link.click();
  };

  return (
    <header className={`
      flex items-center pl-8 pr-0 border-b-2 relative z-20 overflow-hidden
      transition-all duration-400 ease-out
      ${isScrolled 
        ? 'h-[79px] bg-black/90 backdrop-blur-lg border-[#9D9D9D]/70 shadow-lg' 
        : 'h-[88px] bg-black/10 backdrop-blur-md border-[#9D9D9D]/55'
      }
      animate-slide-down
    `}>
      <img src={Y21Logo} alt="Main Portfolio Logo" className="h-[35px]" /> 
      
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

      {/* Hamburger Menu Icon */}
      <div className="md:hidden ml-auto text-2xl text-white cursor-pointer mr-6" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Right box */}
      <div className="w-[106px] h-full bg-[#333333] ml-[15px] flex items-center flex-shrink-0 justify-center group relative overflow-hidden">
        <img src={Y22Logo} alt="Navigation Icon" className="h-[13px] relative z-10 group-hover:scale-110 transition-transform duration-300" /> 
        <div className="absolute inset-0 bg-[#FF4500] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[88px] left-0 w-full h-[calc(100vh-88px)] bg-[#070707] flex flex-col items-center justify-center space-y-8 z-50">
          {['Home', 'About', 'Projects', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="text-white text-2xl font-[Poppins] hover:text-[#FF4500] transition-colors"
              onClick={() => {
                setActiveLink(item);
                toggleMobileMenu();
              }}
            >
              {item}
            </a>
          ))}
          
          {/* Mobile Resume Button */}
          <button
            onClick={() => {
              downloadResume();
              toggleMobileMenu();
            }}
            className="flex items-center space-x-3 px-6 py-3 bg-[#FF4500] text-white rounded-full hover:bg-[#FF6B35] transition-colors duration-300 mt-4"
          >
            <FaDownload />
            <span>Download Resume</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
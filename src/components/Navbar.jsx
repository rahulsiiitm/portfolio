// src/components/Navbar.jsx
import React, { useState } from 'react'; 
import Y21Logo from '../assets/Y21.svg';
import Y22Logo from '../assets/Y22.svg';
import { FaBars, FaTimes } from 'react-icons/fa'; 

function Navbar() {
  const activeLink = "Home"; 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // Added animate-slide-down and z-20 directly to the header
    <header className="h-[88px] bg-black/10 backdrop-blur-md flex items-center pl-8 pr-0 border-b-2 border-[#9D9D9D]/55 relative z-20 overflow-hidden animate-slide-down">
      <img src={Y21Logo} alt="Main Portfolio Logo" className="h-[35px]" /> 
      
      {/* Desktop Navigation Links */}
      <nav className="ml-auto space-x-[71px] hidden md:flex items-center"> 
        {['Home', 'About', 'Projects', 'Contact'].map((item) => (
          <a 
            key={item}
            href={`#${item.toLowerCase()}`} 
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

      {/* Hamburger Menu Icon (visible on small screens) */}
      <div className="md:hidden ml-auto text-2xl text-white cursor-pointer mr-4" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Right box */}
      <div className="w-[106px] h-full bg-[#333333] ml-[15px] flex items-center flex-shrink-0 justify-center group relative overflow-hidden hidden md:flex">
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
              onClick={toggleMobileMenu}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;  
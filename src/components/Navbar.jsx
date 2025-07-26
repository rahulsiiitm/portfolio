// src/components/Navbar.jsx
import React from 'react';
import Y21Logo from '../assets/Y21.svg';

function Navbar() {
  return (
    <header className="h-[132px] bg-transparent flex items-center px-8 border-b-2 border-[#9D9D9D]">
      <img src={Y21Logo} alt="Your Logo" className="h-10" /> 
      
      {/* Changed space-x-8 to space-x-[77px] */}
      <nav className="ml-auto space-x-[77px]"> 
        <a href="#" className="text-[22px] text-white hover:text-[#FF4500] transition-colors">Home</a>
        <a href="#" className="text-[22px] text-white hover:text-[#FF4500] transition-colors">About</a>
        <a href="#" className="text-[22px] text-white hover:text-[#FF3C00] transition-colors">Projects</a>
        <a href="#" className="text-[22px] text-white hover:text-[#FF3C00] transition-colors">Contact</a>
      </nav>
    </header>
  );
}

export default Navbar;
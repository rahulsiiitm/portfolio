// src/components/MobileSidebar.jsx
import React from 'react';
import Y21Logo from '../assets/Y21.svg'; // Make sure this path matches your project structure
import {
  FaLinkedinIn,
  FaTwitter,
  FaPinterestP,
  FaGithub,
  FaDownload,
  FaTimes,
  FaHome,
  FaUser,
  FaProjectDiagram,
  FaEnvelope,
  FaBriefcase
} from 'react-icons/fa';

function MobileSidebar({ isOpen, onClose }) {
  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rahulsharma2k4', icon: FaLinkedinIn, color: '#0077B5' },
    { name: 'GitHub', url: 'https://github.com/your-username', icon: FaGithub, color: '#333' },
    { name: 'Twitter', url: 'https://twitter.com/your-handle', icon: FaTwitter, color: '#1DA1F2' },
    { name: 'Pinterest', url: 'https://www.pinterest.com/rahulsharmahps', icon: FaPinterestP, color: '#E60023' }
  ];

  const navigationItems = [
    { name: 'Home', icon: FaHome, id: 'home' },
    { name: 'About', icon: FaUser, id: 'about' },
    { name: 'Experience', icon: FaBriefcase, id: 'experience' },
    { name: 'Projects', icon: FaProjectDiagram, id: 'projects' },
    { name: 'Contact', icon: FaEnvelope, id: 'contact' }
  ];

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/Rahul_Resume (1).pdf';
    link.download = 'Rahul_Resume (1).pdf';
    link.click();
    onClose();
  };

  const handleNavClick = (id) => {
    if (id === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 88;
        const elementPosition = element.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed right-0 top-0 h-full w-72 max-w-[80vw] 
        bg-gradient-to-b from-zinc-900/95 via-zinc-900/98 to-black/95
        backdrop-blur-xl border-l border-white/10 z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col overflow-hidden shadow-2xl
      `}>
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-stone-200 text-lg font-semibold font-[Poppins] tracking-wide">Menu</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#FF4500] transition-colors duration-300 p-1.5 hover:bg-white/5 rounded-lg hover:scale-110 transform"
            aria-label="Close sidebar"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4">
          <nav className="py-4">
            {/* Navigation Links */}
            <div className="mb-6">
              <h3 className="text-stone-400 text-xs uppercase tracking-wider font-medium mb-3 font-[Poppins]">Navigation</h3>
              <ul className="space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className="w-full text-left flex items-center gap-3 text-stone-300 hover:text-[#FF4500] transition-all duration-300 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 hover:translate-x-1 group font-[Poppins]"
                      >
                        <IconComponent className="text-sm group-hover:scale-110 transition-transform duration-300" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resume Download */}
            <div className="mb-6 pt-3 border-t border-white/10">
              <button
                onClick={downloadResume}
                className="group w-full px-4 py-2.5 bg-zinc-950 rounded-lg outline outline-offset-[-1px] outline-[#FF4500] inline-flex justify-center items-center gap-2 transition-all duration-400 transform hover:scale-[1.01] relative overflow-hidden"
              >
                {/* Sliding background layer */}
                <div className="absolute inset-0 bg-[#FF4500] transform scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300 ease-out z-0"></div>
                
                {/* Content */}
                <div className="relative z-10 flex justify-center items-center gap-2">
                  <FaDownload className="text-sm text-stone-300 group-hover:text-white transition-colors duration-300" />
                  <span className="text-stone-300 text-sm font-medium font-[Poppins] group-hover:text-white transition-colors duration-300">
                    Resume
                  </span>
                </div>
              </button>
            </div>

            {/* Social Links */}
            <div className="pt-3 border-t border-white/10">
              <h3 className="text-stone-400 text-xs uppercase tracking-wider font-medium mb-3 font-[Poppins]">Connect</h3>
              <div className="grid grid-cols-4 gap-2">
                {socialLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 group border border-white/10 hover:border-[#FF4500]/30 hover:scale-105 transform"
                      title={`Connect on ${link.name}`}
                    >
                      <IconComponent 
                        className="text-lg text-stone-300 group-hover:text-[#FF4500] transition-colors duration-300" 
                      />
                    </a>
                  );
                })}
              </div>

              {/* Compact Contact Info */}
              <div className="mt-4 p-3 bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 rounded-lg border border-[#FF4500]/20">
                <div className="text-center">
                  <h4 className="text-stone-200 font-medium text-sm mb-1 font-[Poppins]">Get in Touch</h4>
                  <p className="text-stone-400 text-xs leading-relaxed font-[Poppins]">
                    Let's create something amazing together.
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer with Logo + RS */}
        <div className="flex-shrink-0 p-3 border-t border-white/10 bg-black/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img
                src={Y21Logo}
                alt="Portfolio Logo"
                className="h-4 filter brightness-0 invert opacity-80"
              />
              <div className="text-[#FF4500] font-bold text-sm font-[Poppins] tracking-wide">RS</div>
              <div className="text-stone-400 text-xs font-light font-[Poppins]">© 2024</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MobileSidebar;
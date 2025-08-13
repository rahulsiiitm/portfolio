// src/components/MobileSidebar.jsx
import React from 'react';
import {
  FaLinkedinIn,
  FaTwitter,
  FaPinterestP,
  FaGithub,
  FaDownload,
  FaTimes
} from 'react-icons/fa';

function MobileSidebar({ isOpen, onClose }) {
  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rahulsharma2k4', icon: FaLinkedinIn, color: '#0077B5' },
    { name: 'GitHub', url: 'https://github.com/your-username', icon: FaGithub, color: '#333' },
    { name: 'Twitter', url: 'https://twitter.com/your-handle', icon: FaTwitter, color: '#1DA1F2' },
    { name: 'Pinterest', url: 'https://www.pinterest.com/rahulsharmahps', icon: FaPinterestP, color: '#E60023' }
  ];

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/path-to-your-resume.pdf';
    link.download = 'Rahul_Sharma_Resume.pdf';
    link.click();
    onClose();
  };

  const handleNavClick = (item) => {
    // Smooth scroll to section
    const element = document.getElementById(item.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed right-0 top-0 h-full w-80 max-w-[85vw] 
        bg-gradient-to-b from-[#1A1A1A] via-[#1A1A1A] to-[#0F0F0F]
        border-l border-[#9D9D9D]/30 z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col overflow-hidden
      `}>
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-[#9D9D9D]/20">
          <h2 className="text-white text-lg font-semibold font-[Poppins]">Menu</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-[#FF4500] transition-colors duration-300 text-xl p-2 hover:bg-white/5 rounded-lg"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <nav className="py-6">
            {/* Navigation Links */}
            <div className="mb-8">
              <h3 className="text-white/60 text-xs uppercase tracking-wider font-medium mb-4">Navigation</h3>
              <ul className="space-y-2">
                {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleNavClick(item)}
                      className="w-full text-left text-white hover:text-[#FF4500] transition-colors duration-300 text-lg font-medium py-3 px-2 rounded-lg hover:bg-white/5"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resume Download */}
            <div className="mb-8 pt-2 border-t border-[#9D9D9D]/20">
              <h3 className="text-white/60 text-xs uppercase tracking-wider font-medium mb-4">Resume</h3>
              <button
                onClick={downloadResume}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-[#FF4500] text-white rounded-xl hover:bg-[#FF6B35] transition-all duration-300 font-medium hover:shadow-lg hover:shadow-[#FF4500]/25"
              >
                <FaDownload className="text-sm" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="pt-2 border-t border-[#9D9D9D]/20">
              <h3 className="text-white/60 text-xs uppercase tracking-wider font-medium mb-4">Connect</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group border border-white/10 hover:border-white/20 hover:shadow-md"
                      title={`Connect on ${link.name}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = link.color + '60';
                        e.currentTarget.style.backgroundColor = link.color + '10';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.backgroundColor = '';
                      }}
                    >
                      <IconComponent 
                        className="text-xl text-white/70 group-hover:text-white transition-colors duration-300" 
                        style={{ color: 'inherit' }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-[#9D9D9D]/20">
          <p className="text-white/40 text-xs text-center font-light">
            © 2024 Rahul Sharma. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
}

export default MobileSidebar;
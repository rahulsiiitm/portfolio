// src/components/MobileSidebar.jsx
import React from 'react';
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
  FaEnvelope
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
    { name: 'Experience', icon: FaProjectDiagram, id: 'experience' },
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
    const element = document.getElementById(id);
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed right-0 top-0 h-full w-80 max-w-[85vw] 
        bg-gradient-to-b from-zinc-900/95 via-zinc-900/98 to-black/95
        backdrop-blur-xl border-l border-white/10 z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col overflow-hidden shadow-2xl
      `}>
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-stone-200 text-xl font-semibold font-['Lufga'] tracking-wide">Menu</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#ff470f] transition-colors duration-300 text-xl p-2 hover:bg-white/5 rounded-lg hover:scale-110 transform"
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
              <h3 className="text-stone-400 text-xs uppercase tracking-wider font-medium mb-6 font-['Montserrat']">Navigation</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className="w-full text-left flex items-center gap-4 text-stone-300 hover:text-[#ff470f] transition-all duration-300 text-lg font-medium py-3 px-4 rounded-xl hover:bg-white/5 hover:translate-x-1 group font-['Montserrat']"
                      >
                        <IconComponent className="text-base group-hover:scale-110 transition-transform duration-300" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resume Download */}
            <div className="mb-8 pt-4 border-t border-white/10">
              <h3 className="text-stone-400 text-xs uppercase tracking-wider font-medium mb-6 font-['Montserrat']">Resume</h3>
              <button
                onClick={downloadResume}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-[#ff470f] to-[#ff470f] text-white rounded-xl hover:from-[#ff470f]/90 hover:to-[#ff470f]/90 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-[#ff470f]/25 font-['Montserrat'] hover:scale-[1.02] transform"
              >
                <FaDownload className="text-sm" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-stone-400 text-xs uppercase tracking-wider font-medium mb-6 font-['Montserrat']">Connect</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group border border-white/10 hover:border-[#ff470f]/30 hover:shadow-md hover:scale-105 transform"
                      title={`Connect on ${link.name}`}
                    >
                      <IconComponent 
                        className="text-xl text-stone-300 group-hover:text-[#ff470f] transition-colors duration-300 mb-2" 
                      />
                      <span className="text-xs text-stone-400 group-hover:text-stone-200 transition-colors duration-300 font-['Montserrat']">
                        {link.name}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Additional Contact Info */}
              <div className="mt-6 p-4 bg-gradient-to-br from-[#ff470f]/10 to-[#ff470f]/5 rounded-xl border border-[#ff470f]/20">
                <div className="text-center">
                  <h4 className="text-stone-200 font-medium mb-2 font-['Lufga']">Get in Touch</h4>
                  <p className="text-stone-400 text-sm leading-relaxed font-['Montserrat']">
                    Ready to collaborate on your next project? Let's create something amazing together.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#ff470f] to-transparent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-white/10 bg-black/20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="text-[#ff470f] font-bold text-lg font-['Lufga'] tracking-wide">RS</div>
            </div>
            <p className="text-stone-400 text-xs font-light font-['Montserrat']">
              © 2024 Rahul Sharma. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MobileSidebar;
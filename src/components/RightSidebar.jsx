// src/components/RightSidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  FaLinkedinIn,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaChevronUp,
  FaShare
} from 'react-icons/fa';

function RightSidebar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(scrollPercent, 100));

      // Calculate current section based on scroll
      const section = Math.min(Math.floor(scrollPercent / 16.67) + 1, 6);
      setCurrentSection(section);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        setShowShareMenu(!showShareMenu);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareMenu(false);
      // You could add a toast notification here
    } catch (err) {
      console.log('Failed to copy link');
    }
  };

  return (
    // Added fixed right-0 top-1/2 -translate-y-1/2 z-40
    <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-8 h-full w-[106px] border-l-2 border-[#9D9D9D]/30 bg-gradient-to-b from-black/20 via-black/10 to-black/20 backdrop-blur-sm z-40">

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="text-white/70 hover:text-[#FF4500] transition-all duration-300 hover:scale-110 group"
        aria-label="Scroll to top"
      >
        <FaChevronUp className="text-lg group-hover:animate-bounce" />
      </button>

      {/* Enhanced Visual Scroll Indicator */}
      <div className="flex flex-col items-center relative h-52">
        {/* Current section number */}
        <div className="text-[18px] text-white/90 font-medium absolute top-0 -mt-4 transition-colors duration-300 group-hover:text-[#FF4500]">
          {String(currentSection).padStart(2, '0')}
        </div>

        {/* The scroll line with glow effect */}
        <div className="h-full w-[3px] bg-gradient-to-b from-[#9D9D9D]/30 via-[#9D9D9D]/55 to-[#9D9D9D]/30 mt-4 mb-4 rounded-full shadow-lg relative overflow-hidden">
          {/* Animated progress indicator */}
          <div
            className="bg-gradient-to-b from-[#FF4500] to-[#FF6B35] w-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,69,0,0.5)]"
            style={{ height: `${scrollProgress}%` }}
          >
            {/* Glowing dot at the top of progress */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
          </div>
        </div>

        {/* Total sections */}
        <div className="text-[18px] text-white/70 font-medium absolute bottom-0 -mb-4 transition-colors duration-300 group-hover:text-[#FF4500]">
          06
        </div>
      </div>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={handleShare}
          className="text-white/70 text-xl hover:text-[#FF4500] transition-all duration-300 hover:scale-110"
          aria-label="Share page"
        >
          <FaShare />
        </button>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md rounded-lg p-3 shadow-xl border border-[#9D9D9D]/30 min-w-[120px]">
            <button
              onClick={copyLink}
              className="block w-full text-left text-white/80 hover:text-[#FF4500] py-1 text-sm transition-colors"
            >
              Copy Link
            </button>
            <div className="w-2 h-2 bg-black/90 absolute right-[-4px] top-1/2 -translate-y-1/2 rotate-45 border-r border-b border-[#9D9D9D]/30"></div>
          </div>
        )}
      </div>

      {/* Enhanced Social Icons */}
      <div className="flex flex-col space-y-5">
        <a
          href="https://www.linkedin.com/in/rahulsharma2k4"
          className="text-white/70 text-xl hover:text-[#0077B5] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,119,181,0.3)] rounded-full p-1"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedinIn />
        </a>
        <a
          href="https://www.facebook.com/<YOUR_FACEBOOK_USERNAME>"
          className="text-white/70 text-xl hover:text-[#1877F2] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(24,119,242,0.3)] rounded-full p-1"
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://twitter.com/<YOUR_TWITTER_HANDLE>"
          className="text-white/70 text-xl hover:text-[#1DA1F2] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(29,161,242,0.3)] rounded-full p-1"
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.pinterest.com/rahulsharmahps"
          className="text-white/70 text-xl hover:text-[#E60023] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(230,0,35,0.3)] rounded-full p-1"
          aria-label="Pinterest"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaPinterestP />
        </a>
      </div>


      {/* Mobile Responsive - Hide on small screens */}
      <style jsx>{`
        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
        
        @media (max-width: 1024px) {
          .sidebar {
            width: 80px;
          }
        }
      `}</style>
    </div>
  );
}

export default RightSidebar;
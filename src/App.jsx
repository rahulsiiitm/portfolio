// src/App.jsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React, { useEffect, useState, Suspense } from 'react';
import Navbar from './components/Navbar';
import RightSidebar from './components/RightSidebar';
import MobileSidebar from './components/MobileSidebar';
import HeroSection from './components/HeroSection';
import './index.css';
// import MouseSpotlight from './components/MouseSpotlight';
import GrainOverlay from './components/GrainOverlay';

// 1. Lazy load non-critical sections to reduce initial bundle size
const AboutMeIntro = React.lazy(() => import('./components/AboutMeIntro'));
const Experience = React.lazy(() => import('./components/ExperienceSection'));
const ProjectsSection = React.lazy(() => import('./components/ProjectsSection'));
const SkillsSection = React.lazy(() => import('./components/SkillsSection'));
const ContactSection = React.lazy(() => import('./components/ContactSection'));

export default function App() {
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
      {/* <MouseSpotlight /> */}
      <GrainOverlay />

      {/* Fixed Hero Section */}
      <div id="home" className="fixed inset-0 bg-[#1A1A1A] text-white flex flex-col overflow-hidden z-10">
        <HeroSection />

        <img
          src="/bg.webp"
          alt="Abstract background element"
          fetchpriority="high"
          className="hidden sm:block absolute right-0 md:right-20 lg:right-[106px] top-0 h-full w-auto object-contain opacity-60 md:opacity-100 pointer-events-none z-0"
        />

        <div
          className="sm:hidden absolute inset-0 bg-cover bg-top opacity-60 pointer-events-none z-0"
          style={{
            backgroundImage: "url('/bg.webp')",
          }}
        ></div>

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

      {/* 3. SUSPENSE WRAPPER */}
      <Suspense fallback={<div className="min-h-screen bg-[#1A1A1A]" />}>

        {/* Scrollable Sections Below Hero */}
        <div id="about" className="relative z-20 mt-[100vh] min-h-screen">
          <AboutMeIntro />
        </div>

        <div id="experience" className="relative z-20 bg-[#16191e] opacity-80 text-white min-h-screen p-8 md:p-16">
          <Experience />
        </div>

        <div className="relative z-20">
          <SkillsSection />
        </div>

        {/* Projects Section */}
        <div id="projects" className="relative z-20">
          <ProjectsSection />
        </div>

        <div id="contact" className='relative z-20'>
          <ContactSection />
        </div>

      </Suspense>

      <Analytics />
      <SpeedInsights />
    </>
  );
}
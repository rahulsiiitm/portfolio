import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Y21Logo from '../assets/Y21.svg';

const WebsiteLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  const [isComplete, setIsComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  
  // Memoized loading texts to prevent recreation
  const loadingTexts = useMemo(() => ['Initializing', 'Loading Assets', 'Preparing UI', 'Almost Ready'], []);
  const skills = useMemo(() => ['ML', 'AI', 'UI/UX', 'React', 'Python'], []);
  
  // Memoized background particles to prevent recreation
  const backgroundParticles = useMemo(() => 
    [...Array(15)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2
    })), []
  );
  
  const handleLoadingComplete = useCallback(() => {
    if (onLoadingComplete) onLoadingComplete();
  }, [onLoadingComplete]);
  
  useEffect(() => {
    let progressInterval;
    let textInterval;
    
    // Smoother progress updates with requestAnimationFrame
    const updateProgress = () => {
      setProgress(prev => {
        const increment = Math.random() * 4 + 3; // Faster, more consistent increments
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress >= 100) {
          // Optimized completion sequence
          setTimeout(() => setIsComplete(true), 200);
          setTimeout(() => setShowTransition(true), 600);
          setTimeout(handleLoadingComplete, 1200);
          return 100;
        }
        return newProgress;
      });
    };
    
    progressInterval = setInterval(updateProgress, 120); // Faster updates
    
    // Less frequent text changes for better performance
    textInterval = setInterval(() => {
      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 1000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [loadingTexts, handleLoadingComplete]);
  
  // Optimized stroke calculations
  const circumference = 351.86;
  const strokeDashoffset = circumference - (circumference * progress) / 100;
  
  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center z-50 transition-all duration-700 ease-out ${
      showTransition ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
    }`}>
      {/* Optimized background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-orange-400/25 rounded-full will-change-transform"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `pulse ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      <div className={`text-center relative z-10 will-change-transform transition-all duration-400 ease-out ${
        isComplete ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* Logo Section */}
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <img 
              src={Y21Logo}
              alt="Y21 Logo"
              className="w-full h-full will-change-transform"
              style={{ 
                animation: 'spin 2.5s linear infinite',
                transform: 'translateZ(0)' // Hardware acceleration
              }}
            />
          </div>
          <h1 className="text-stone-300 text-xl font-semibold opacity-90 tracking-wide">
            Rahul Sharma
          </h1>
        </div>

        {/* Optimized Loading Animation */}
        <div className="mb-6">
          {/* Circular Progress - Hardware accelerated */}
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg 
              className="w-28 h-28 -rotate-90 will-change-transform" 
              viewBox="0 0 112 112"
              style={{ transform: 'translateZ(0)' }}
            >
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-zinc-700"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-orange-500 transition-all duration-300 ease-out will-change-transform"
                strokeLinecap="round"
                style={{ transform: 'translateZ(0)' }}
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xl font-bold text-orange-500 tabular-nums">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Simplified loading dots */}
          <div className="flex justify-center space-x-1.5 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-orange-500 rounded-full will-change-transform"
                style={{
                  animation: `bounce 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-stone-400 text-base font-medium mb-4 h-6">
          <span className="inline-block">
            {loadingText}
            <span className="animate-pulse">...</span>
          </span>
        </div>

        {/* Optimized Progress Bar */}
        <div className="w-64 mx-auto mb-8">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300 ease-out will-change-transform"
              style={{ 
                width: `${progress}%`,
                transform: 'translateZ(0)'
              }}
            />
          </div>
        </div>

        {/* Skills Preview - Optimized animations */}
        <div className="flex flex-wrap justify-center gap-2 opacity-70">
          {skills.map((skill, index) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-zinc-900/40 border border-orange-500/25 rounded-full text-xs text-stone-300 will-change-transform"
              style={{ 
                animation: `fadeInUp 0.6s ease-out forwards`,
                animationDelay: `${index * 0.1 + 0.5}s`,
                opacity: 0
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Completion overlay */}
      {isComplete && (
        <>
          {/* Black background overlay */}
          <div className="absolute inset-0 bg-black z-15"></div>
          
          <div className={`absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center z-20 will-change-transform transition-all duration-700 ease-out ${
            showTransition ? 'scale-120 opacity-0' : 'scale-100 opacity-100'
          }`}>
            <img 
              src={Y21Logo}
              alt="Y21 Logo"
              className="w-28 h-28 animate-pulse will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            />
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px) translateZ(0);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(0);
          }
        }
        
        /* Hardware acceleration for all animations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

// Optimized demo wrapper - Show loader only once
const LoaderDemo = () => {
  const [showLoader, setShowLoader] = useState(() => {
    // Only show loader if it hasn't been shown before in this session
    return !sessionStorage.getItem('loaderShown');
  });
  
  const handleLoadingComplete = useCallback(() => {
    // Mark loader as shown in session storage
    sessionStorage.setItem('loaderShown', 'true');
    setShowLoader(false);
  }, []);
  return showLoader ? <WebsiteLoader onLoadingComplete={handleLoadingComplete} /> : null;
};

export default LoaderDemo;
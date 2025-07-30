import React, { useState, useEffect, useCallback, useMemo } from 'react';

// UPDATED: Import the SVG logo directly.
// Make sure you have the Y21.svg file in the 'src/assets' directory.
import Y21Logo from '../assets/Y21.svg';

// Component-specific styles, converted from the original <style jsx>.
const LoaderStyles = () => (
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.25; transform: scale(0.95); }
        50% { opacity: 1; transform: scale(1.05); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
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
      
      /* Accessibility: Reduce motion if the user prefers it */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
);


const WebsiteLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  const [isComplete, setIsComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const loadingTexts = useMemo(() => ['Initializing', 'Loading Assets', 'Preparing UI', 'Almost Ready'], []);
  const skills = useMemo(() => ['ML', 'AI', 'UI/UX', 'React', 'Python'], []);

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

    progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 4 + 3;
        const newProgress = Math.min(prev + increment, 100);

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);

          setTimeout(() => setIsComplete(true), 200);
          setTimeout(() => setShowTransition(true), 600);
          setTimeout(handleLoadingComplete, 1400);
          
          return 100;
        }
        return newProgress;
      });
    }, 120);

    textInterval = setInterval(() => {
      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [loadingTexts, handleLoadingComplete]);

  const circumference = 2 * Math.PI * 48; // 301.59
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-700 ease-out 
      ${isComplete ? 'bg-black' : 'bg-gradient-to-br from-black via-zinc-900 to-black'} 
      ${showTransition ? 'opacity-0' : 'opacity-100'}`}>
      
      <LoaderStyles />

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

      <div className={`text-center relative z-10 will-change-transform transition-all duration-400 ease-out ${isComplete ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <img
              src={Y21Logo}
              alt="Y21 Logo"
              className="w-full h-full will-change-transform"
              style={{
                animation: 'spin 2.5s linear infinite',
                transform: 'translateZ(0)'
              }}
            />
          </div>
          <h1 className="text-stone-300 text-xl font-semibold opacity-90 tracking-wide">
            Rahul Sharma
          </h1>
        </div>

        <div className="mb-6">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-700" />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-orange-500 transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xl font-bold text-orange-500 tabular-nums">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-1.5 mb-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 bg-orange-500 rounded-full" style={{ animation: `bounce 1s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>

        <div className="text-stone-400 text-base font-medium mb-4 h-6">
          <span>{loadingText}<span className="animate-pulse">...</span></span>
        </div>

        <div className="w-64 mx-auto mb-8">
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 opacity-70">
          {skills.map((skill, index) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-zinc-900/40 border border-orange-500/25 rounded-full text-xs text-stone-300"
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

      {isComplete && (
        <div className={`absolute inset-0 flex items-center justify-center z-20 will-change-transform transition-all duration-700 ease-out ${showTransition ? 'scale-120 opacity-0' : 'scale-100 opacity-100'}`}>
          <img
            src={Y21Logo}
            alt="Y21 Logo"
            className="w-28 h-28 animate-pulse will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          />
        </div>
      )}
    </div>
  );
};

export default WebsiteLoader;
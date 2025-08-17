// src/components/SkillsSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  Code, 
  Database, 
  Globe, 
  Settings, 
  Brain,
  Cpu,
  Eye,
  BarChart3,
  Atom,
  Server,
  Zap,
  FileCode,
  Palette,
  Wind,
  FileText,
  Link,
  Leaf,
  GitBranch,
  Container,
  BookOpen,
  Figma,
  Terminal,
  Monitor,
  Sparkles
} from 'lucide-react';

const SkillsSection = () => {
  const skills = {
    "AI & Machine Learning": [
      { name: "PyTorch", icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />, level: 85, color: "from-red-600 to-orange-500" },
      { name: "TensorFlow", icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />, level: 80, color: "from-red-500 to-orange-400" },
      { name: "Scikit-learn", icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />, level: 90, color: "from-red-600 to-orange-600" },
      { name: "Transformers", icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, level: 75, color: "from-red-400 to-orange-400" },
      { name: "OpenCV", icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />, level: 70, color: "from-red-500 to-red-400" },
      { name: "Pandas", icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" />, level: 95, color: "from-red-700 to-orange-600" },
    ],
    "Web Development": [
      { name: "React", icon: <Atom className="w-4 h-4 sm:w-5 sm:h-5" />, level: 90, color: "from-orange-600 to-red-500" },
      { name: "Node.js", icon: <Server className="w-4 h-4 sm:w-5 sm:h-5" />, level: 85, color: "from-orange-500 to-red-400" },
      { name: "FastAPI", icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, level: 80, color: "from-red-600 to-orange-400" },
      { name: "HTML5", icon: <FileCode className="w-4 h-4 sm:w-5 sm:h-5" />, level: 95, color: "from-orange-600 to-red-600" },
      { name: "CSS3", icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5" />, level: 90, color: "from-red-500 to-orange-500" },
      { name: "Tailwind CSS", icon: <Wind className="w-4 h-4 sm:w-5 sm:h-5" />, level: 85, color: "from-orange-500 to-red-400" },
    ],
    "Languages & Databases": [
      { name: "Python", icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" />, level: 95, color: "from-red-700 to-orange-600" },
      { name: "JavaScript", icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />, level: 90, color: "from-orange-600 to-red-500" },
      { name: "C++", icon: <Link className="w-4 h-4 sm:w-5 sm:h-5" />, level: 70, color: "from-red-500 to-red-400" },
      { name: "SQL", icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" />, level: 80, color: "from-red-600 to-orange-400" },
      { name: "MongoDB", icon: <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />, level: 75, color: "from-orange-500 to-red-400" },
      { name: "Firebase", icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, level: 80, color: "from-red-600 to-orange-500" },
    ],
    "Tools & Platforms": [
      { name: "Git & GitHub", icon: <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />, level: 90, color: "from-orange-600 to-red-500" },
      { name: "Docker", icon: <Container className="w-4 h-4 sm:w-5 sm:h-5" />, level: 75, color: "from-red-500 to-orange-400" },
      { name: "Jupyter", icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />, level: 85, color: "from-red-600 to-orange-500" },
      { name: "Figma", icon: <Figma className="w-4 h-4 sm:w-5 sm:h-5" />, level: 80, color: "from-orange-500 to-red-400" },
      { name: "Linux", icon: <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />, level: 75, color: "from-red-500 to-red-400" },
      { name: "VS Code", icon: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />, level: 95, color: "from-red-700 to-orange-600" },
    ],
  };

  const marqueeSkills = Object.values(skills).flat();

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const categoryRefs = useRef([]);

  // Main section visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if(sectionRef.current) observer.unobserve(sectionRef.current)
    };
  }, []);

  // Individual category visibility observer
  useEffect(() => {
    const observers = categoryRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCategories(prev => {
              if (!prev.includes(index)) {
                return [...prev, index].sort((a, b) => a - b);
              }
              return prev;
            });
          }
        },
        {
          threshold: 0.2,
          rootMargin: '-5% 0px -5% 0px'
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const categoryIcons = {
    "AI & Machine Learning": <Brain className="w-3 h-3 sm:w-4 sm:h-4" />,
    "Web Development": <Globe className="w-3 h-3 sm:w-4 sm:h-4" />,
    "Languages & Databases": <Database className="w-3 h-3 sm:w-4 sm:h-4" />,
    "Tools & Platforms": <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
  };

  const getSkillLevelColor = (level) => {
    if (level >= 90) return "text-red-400";
    if (level >= 80) return "text-orange-400";
    if (level >= 70) return "text-yellow-400";
    return "text-red-300";
  };
  
  // Correctly define animations inside a style tag
  const customStyles = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      100% { transform: translateY(-10px) rotate(5deg); }
    }
    .animate-marquee {
      animation: marquee 45s linear infinite;
    }
  `;

  return (
    <section 
      ref={sectionRef} 
      id="skills" 
      className="bg-transparent px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16 relative overflow-hidden"
    >
      <style>{customStyles}</style>
      {/* Enhanced background elements with red tints */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-orange-950/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{animationDuration: '4s'}}></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-orange-600/8 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Floating skill particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`
            }}
          >
            <div className="w-1 h-1 bg-red-400/40 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl mx-auto">

        {/* Enhanced Section Header with red accents */}
        <div className={`text-center mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 ${
          isVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-10'
        }`}>
          <div
            className="text-stone-300 text-xl sm:text-2xl lg:text-3xl font-normal font-['Dancing_Script'] mb-1 sm:mb-2 transition-all duration-1000"
            style={{
              animationDelay: '0.2s',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            Technical
          </div>
          <div
            className="text-[#ff470f] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold font-['Lufga'] leading-tight tracking-wide lg:tracking-[1px] mb-3 sm:mb-4 transition-all duration-1000 relative"
            style={{
              animationDelay: '0.4s',
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
              textShadow: '2px 2px 10px rgb(0 0 0 / 0.8), 0 0 20px rgba(255, 71, 15, 0.3)'
            }}
          >
            <div className="hover:tracking-[2px] lg:hover:tracking-[3px] transition-all duration-700 ease-out cursor-default font-['Lufga']">
              Skills
            </div>
          </div>
          <div
            className="w-12 sm:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-red-500 via-[#FF4500] to-orange-500 rounded-full mx-auto mb-3 sm:mb-4 transition-all duration-1000 shadow-lg shadow-red-500/20"
            style={{
              animationDelay: '0.6s',
              width: isVisible ? 'auto' : '0px',
              opacity: isVisible ? 1 : 0
            }}
          ></div>
          <p
            className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-md sm:max-w-lg lg:max-w-xl mx-auto transition-all duration-1000 font-['Montserrat'] px-4"
            style={{
              animationDelay: '0.8s',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            Technologies and tools I use to bring <span className="text-red-400 font-medium">innovative ideas</span> to life.
          </p>
        </div>

        {/* Enhanced Skills Grid with red tints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
          {Object.entries(skills).map(([category, items], catIndex) => (
            <div 
              key={category}
              ref={el => categoryRefs.current[catIndex] = el}
              className={`bg-black/[0.15] backdrop-blur-sm border border-white/[0.12] rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-700 ease-out group relative overflow-hidden ${
                visibleCategories.includes(catIndex)
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform translate-y-6'
              }`}
              style={{
                transitionDelay: `${visibleCategories.includes(catIndex) ? catIndex * 0.1 : 0}s`
              }}
              onMouseEnter={() => setHoveredCategory(catIndex)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-xl lg:rounded-2xl`}></div>
              
              <div className={`absolute inset-0 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-500 ${
                hoveredCategory === catIndex 
                  ? 'shadow-lg shadow-red-500/10 border-red-500/20' 
                  : ''
              }`}></div>

              <h3 className="text-[#FF4500] text-base sm:text-lg lg:text-xl font-semibold font-['Lufga'] mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3 group-hover:text-red-400 transition-all duration-300 relative z-10">
                <span className="text-[#ff470f] group-hover:scale-110 group-hover:text-red-400 transition-all duration-300">
                  {categoryIcons[category]}
                </span>
                <span className="leading-tight">{category}</span>
              </h3>

              <div className="space-y-2 sm:space-y-3 relative z-10">
                {items.map((skill, index) => (
                  <div 
                    key={skill.name} 
                    className="skill-item group/item cursor-default relative"
                    onMouseEnter={() => setHoveredSkill(`${category}-${skill.name}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`text-stone-400 group-hover/item:text-red-400 group-hover/item:scale-110 transition-all duration-300 ${
                          hoveredSkill === `${category}-${skill.name}` ? 'drop-shadow-sm drop-shadow-red-400/30' : ''
                        }`}>
                          {skill.icon}
                        </span>
                        <span className="text-stone-300 font-['Montserrat'] text-xs sm:text-sm font-medium group-hover/item:text-white transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold transition-all duration-300 ${
                          hoveredSkill === `${category}-${skill.name}` 
                            ? `opacity-100 ${getSkillLevelColor(skill.level)}` 
                            : 'opacity-0'
                        }`}>
                          {skill.level}%
                        </span>
                        {hoveredSkill === `${category}-${skill.name}` && skill.level >= 90 && (
                          <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
                        )}
                      </div>
                    </div>

                    <div className={`h-0.5 bg-zinc-700/60 rounded-full overflow-hidden transition-all duration-300 ${
                      hoveredSkill === `${category}-${skill.name}` ? 'opacity-100 h-1' : 'opacity-0'
                    }`}>
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out relative`}
                        style={{ 
                          width: hoveredSkill === `${category}-${skill.name}` ? `${skill.level}%` : '0%',
                          boxShadow: '0 0 8px rgba(255, 71, 15, 0.4), 0 0 4px rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        {hoveredSkill === `${category}-${skill.name}` && (
                          <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`relative w-full overflow-hidden transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-l from-zinc-900 via-zinc-900/80 to-transparent z-10 pointer-events-none"></div>
          
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          
          <div className="flex overflow-hidden py-4 sm:py-5 lg:py-6 group relative">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10"></div>
            </div>
            
            <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
              {marqueeSkills.map((skill, index) => (
                <div key={`${skill.name}-${index}`} className="flex items-center mx-3 sm:mx-4 lg:mx-6 flex-shrink-0 group/item relative">
                  <span className="text-stone-400 mr-2 sm:mr-3 group-hover/item:text-red-400 group-hover/item:scale-110 transition-all duration-300 group-hover/item:drop-shadow-sm group-hover/item:drop-shadow-red-400/30">
                    {skill.icon}
                  </span>
                  <span className="text-stone-400 font-['Montserrat'] text-xs sm:text-sm font-medium group-hover/item:text-red-400 transition-colors duration-300">
                    {skill.name}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-red-500/5 scale-0 group-hover/item:scale-150 transition-transform duration-500 -z-10"></div>
                </div>
              ))}
            </div>
            <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap" aria-hidden="true">
              {marqueeSkills.map((skill, index) => (
                <div key={`${skill.name}-${index}-duplicate`} className="flex items-center mx-3 sm:mx-4 lg:mx-6 flex-shrink-0 group/item relative">
                  <span className="text-stone-400 mr-2 sm:mr-3 group-hover/item:text-red-400 group-hover/item:scale-110 transition-all duration-300 group-hover/item:drop-shadow-sm group-hover/item:drop-shadow-red-400/30">
                    {skill.icon}
                  </span>
                  <span className="text-stone-400 font-['Montserrat'] text-xs sm:text-sm font-medium group-hover/item:text-red-400 transition-colors duration-300">
                    {skill.name}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-red-500/5 scale-0 group-hover/item:scale-150 transition-transform duration-500 -z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

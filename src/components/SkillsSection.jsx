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
  Hash,
  Link,
  HardDrive,
  Leaf,
  GitBranch,
  Container,
  BookOpen,
  Figma,
  Terminal,
  Monitor
} from 'lucide-react';

const SkillsSection = () => {
  const skills = {
    "AI & Machine Learning": [
      { name: "PyTorch", icon: <Brain className="w-5 h-5" />, level: 85 },
      { name: "TensorFlow", icon: <Cpu className="w-5 h-5" />, level: 80 },
      { name: "Scikit-learn", icon: <BarChart3 className="w-5 h-5" />, level: 90 },
      { name: "Transformers", icon: <Zap className="w-5 h-5" />, level: 75 },
      { name: "OpenCV", icon: <Eye className="w-5 h-5" />, level: 70 },
      { name: "Pandas", icon: <Database className="w-5 h-5" />, level: 95 },
    ],
    "Web Development": [
      { name: "React", icon: <Atom className="w-5 h-5" />, level: 90 },
      { name: "Node.js", icon: <Server className="w-5 h-5" />, level: 85 },
      { name: "FastAPI", icon: <Zap className="w-5 h-5" />, level: 80 },
      { name: "HTML5", icon: <FileCode className="w-5 h-5" />, level: 95 },
      { name: "CSS3", icon: <Palette className="w-5 h-5" />, level: 90 },
      { name: "Tailwind CSS", icon: <Wind className="w-5 h-5" />, level: 85 },
    ],
    "Languages & Databases": [
      { name: "Python", icon: <Code className="w-5 h-5" />, level: 95 },
      { name: "JavaScript", icon: <FileText className="w-5 h-5" />, level: 90 },
      { name: "C++", icon: <Link className="w-5 h-5" />, level: 70 },
      { name: "SQL", icon: <Database className="w-5 h-5" />, level: 80 },
      { name: "MongoDB", icon: <Leaf className="w-5 h-5" />, level: 75 },
      { name: "Firebase", icon: <Zap className="w-5 h-5" />, level: 80 },
    ],
    "Tools & Platforms": [
      { name: "Git & GitHub", icon: <GitBranch className="w-5 h-5" />, level: 90 },
      { name: "Docker", icon: <Container className="w-5 h-5" />, level: 75 },
      { name: "Jupyter", icon: <BookOpen className="w-5 h-5" />, level: 85 },
      { name: "Figma", icon: <Figma className="w-5 h-5" />, level: 80 },
      { name: "Linux", icon: <Terminal className="w-5 h-5" />, level: 75 },
      { name: "VS Code", icon: <Monitor className="w-5 h-5" />, level: 95 },
    ],
  };

  const marqueeSkills = Object.values(skills).flat();

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const marqueeStyle = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      animation: marquee 40s linear infinite;
    }
    .skill-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    .skill-card:hover {
      border-color: rgba(255,71,15,0.4);
      transform: translateY(-4px);
      background: linear-gradient(135deg, rgba(255,71,15,0.08) 0%, rgba(0,0,0,0.15) 100%);
      box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255,71,15,0.1);
    }
    .skill-progress {
      height: 2px;
      background: rgba(255,255,255,0.1);
      border-radius: 1px;
      overflow: hidden;
      margin-top: 4px;
      opacity: 0;
      transition: all 0.3s ease;
    }
    .skill-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #ff470f, #ff6b3d, #ff8f5a);
      border-radius: 1px;
      box-shadow: 0 0 8px rgba(255,71,15,0.4);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .skill-item:hover .skill-progress {
      opacity: 1;
    }
    .skill-icon {
      transition: all 0.3s ease;
    }
    .skill-item:hover .skill-icon {
      transform: scale(1.1);
      color: #ff470f;
    }
  `;

  const categoryIcons = {
    "AI & Machine Learning": <Brain className="w-4 h-4" />,
    "Web Development": <Globe className="w-4 h-4" />,
    "Languages & Databases": <Database className="w-4 h-4" />,
    "Tools & Platforms": <Settings className="w-4 h-4" />
  };

  return (
    <section 
      ref={sectionRef} 
      id="skills" 
      className="bg-[#16191e] relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <style>{marqueeStyle}</style>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center items-center gap-2">
            <div className="text-stone-300 text-4xl md:text-5xl font-normal font-['Dancing_Script']">
              Technical
            </div>
            <div className="text-[#ff470f] text-5xl md:text-7xl font-semibold font-['Lufga'] leading-tight tracking-[2px] [text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)]">
              <div className="hover:tracking-[4px] transition-all duration-700 ease-out">Skills</div>
            </div>
          </div>
          <p className="text-stone-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-['Montserrat'] mt-4">
            A snapshot of the technologies and tools I use to bring ideas to life.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {Object.entries(skills).map(([category, items], catIndex) => (
            <div 
              key={category} 
              className={`skill-card rounded-2xl p-6 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${catIndex * 150}ms` }}
            >
              <h3 className="text-[#FF4500] text-lg font-semibold font-['Lufga'] mb-6 flex items-center gap-3">
                <span className="text-[#ff470f]">{categoryIcons[category]}</span>
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((skill, index) => (
                  <div 
                    key={skill.name} 
                    className="skill-item group"
                    onMouseEnter={() => setHoveredSkill(`${category}-${skill.name}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="skill-icon text-stone-400">
                          {skill.icon}
                        </span>
                        <span className="text-stone-300 font-['Montserrat'] text-sm group-hover:text-white transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-[#ff470f] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="skill-progress">
                      <div 
                        className="skill-progress-bar" 
                        style={{ 
                          width: hoveredSkill === `${category}-${skill.name}` ? `${skill.level}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="relative mt-16 md:mt-24 w-full overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#16191e] via-transparent to-[#16191e] z-10 pointer-events-none"></div>
          <div className="flex">
            <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
              {marqueeSkills.map((skill, index) => (
                <div key={`${skill.name}-${index}`} className="flex items-center mx-4 flex-shrink-0 group/item">
                  <span className="text-stone-400 mr-3 group-hover/item:text-[#ff470f] group-hover/item:scale-110 transition-all duration-300">
                    {skill.icon}
                  </span>
                  <span className="text-stone-400 font-['Montserrat'] text-sm group-hover/item:text-[#ff470f] transition-colors duration-300">{skill.name}</span>
                </div>
              ))}
            </div>
            <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap" aria-hidden="true">
              {marqueeSkills.map((skill, index) => (
                <div key={`${skill.name}-${index}-duplicate`} className="flex items-center mx-4 flex-shrink-0 group/item">
                  <span className="text-stone-400 mr-3 group-hover/item:text-[#ff470f] group-hover/item:scale-110 transition-all duration-300">
                    {skill.icon}
                  </span>
                  <span className="text-stone-400 font-['Montserrat'] text-sm group-hover/item:text-[#ff470f] transition-colors duration-300">{skill.name}</span>
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
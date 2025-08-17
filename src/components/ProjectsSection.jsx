import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Brain, Eye, MessageSquare, BarChart3, Sparkles, Code2, Sprout, Laptop, Smartphone } from 'lucide-react';


const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

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

  const projects = [
  {
    id: 1,
    title: "AgriHive",
    description: "A multilingual AI-powered farming assistant that provides crop insights, weather info, and smart recommendations for farmers.",
    tech: ["Flutter", "TensorFlow Lite", "Firebase", "Gemini API"],
    icon: <Sprout className="w-5 h-5" />,
    github: "#",
    demo: "#",
    image: "Agri.png",
    featured: true,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    color: "#22c55e"
  },
  {
    id: 2,
    title: "Guidance Bot",
    description: "An AI chatbot that helps users make better product choices by analyzing features, reviews, and preferences.",
    tech: ["Python", "FastAPI", "LangChain", "React"],
    icon: <MessageSquare className="w-5 h-5" />,
    github: "#",
    demo: "#",
    image: "guidance.png",
    gradient: "from-blue-500/20 via-cyan-500/20 to-indigo-500/20",
    color: "#3b82f6"
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description: "My interactive portfolio showcasing projects, skills, and experiments with creative web design.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    icon: <Laptop className="w-5 h-5" />,
    github: "#",
    demo: "#",
    image: "portfolio.png",
    gradient: "from-purple-500/20 via-pink-500/20 to-red-500/20",
    color: "#a855f7"
  },
  {
    id: 4,
    title: "Flutter Experiments",
    description: "Prototypes and apps built with Flutter, integrating Firebase authentication, cloud storage, and real-time databases.",
    tech: ["Flutter", "Dart", "Firebase"],
    icon: <Smartphone className="w-5 h-5" />,
    github: "#",
    demo: "#",
    image: "flutter.png",
    gradient: "from-orange-500/20 via-red-500/20 to-pink-500/20",
    color: "#f97316"
  }
];


  const animationStyles = `
    @keyframes gentle-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-2px); }
    }
    @keyframes subtle-glow {
      0%, 100% { box-shadow: 0 4px 20px rgba(255,71,15,0.05); }
      50% { box-shadow: 0 6px 25px rgba(255,71,15,0.08); }
    }
    .project-card {
      animation: gentle-float 6s ease-in-out infinite, subtle-glow 4s ease-in-out infinite;
    }
    .project-card:nth-child(2n) {
      animation-delay: -2s, -1s;
    }
    .project-card:nth-child(3n) {
      animation-delay: -3s, -2s;
    }
    .project-card:hover {
      transform: translateY(-4px);
    }
  `;

  // Simplified ProjectCard component
  const ProjectCard = ({ project, index }) => (
    <div 
      className={`
        project-card relative group p-5 sm:p-6 lg:p-8
        bg-black/[0.1] backdrop-blur-sm border border-white/[0.08] rounded-2xl
        hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500
        overflow-hidden cursor-pointer
        ${project.featured ? 'col-span-1 md:col-span-2 row-span-1 md:row-span-2' : 'col-span-1 row-span-1'}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ 
        transitionDelay: `${index * 150}ms`
      }}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-zinc-800/60 rounded-xl text-[#FF4500] border border-transparent group-hover:border-[#FF4500]/30 transition-all duration-300">
            <div className="group-hover:scale-110 transition-transform duration-300">
              {project.icon}
            </div>
          </div>
          <h3 className="text-[#FF4500] text-base sm:text-lg font-semibold group-hover:text-[#FF6B35] transition-colors duration-300 font-['Lufga'] leading-tight">
            {project.title}
          </h3>
        </div>

        <p className="text-stone-400 leading-relaxed my-4 group-hover:text-stone-300 transition-colors duration-300 font-['Montserrat'] text-xs sm:text-sm flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1.5 bg-zinc-800/40 border border-[#FF4500]/20 rounded-full text-xs text-stone-300 font-medium font-['Montserrat'] group-hover:bg-zinc-800/60 group-hover:text-white transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-auto">
          <a 
            href={project.github} 
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/60 hover:bg-zinc-700/60 border border-white/[0.1] rounded-xl transition-all duration-300 text-sm font-['Montserrat'] text-stone-300 hover:text-white"
          >
            <Github className="w-4 h-4" /> 
            Code
          </a>
          <a 
            href={project.demo} 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF4500] hover:bg-[#e03d00] rounded-xl transition-all duration-300 text-sm font-medium font-['Montserrat'] text-white hover:scale-105"
          >
            <ExternalLink className="w-4 h-4" /> 
            Demo
          </a>
        </div>
      </div>

      {/* Background Image Layer */}
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        />
      )}
    </div>
  );

  return (
    <div ref={sectionRef} className="bg-[#16191e] relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <style>{animationStyles}</style>
      
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff470f]/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#ff470f]/3 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Simplified Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold font-['Lufga'] text-stone-200 leading-tight tracking-wide mb-3">
            <span className="text-[#ff470f] [text-shadow:_2px_2px_10px_rgb(255_71_15_/_0.5)] hover:tracking-[2px] transition-all duration-700">
              AI/ML
            </span> Projects
          </h2>
          <div className="w-16 lg:w-20 h-0.5 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-full mx-auto mb-4"></div>
          <p className="text-stone-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-['Montserrat']">
            A selection of my projects, showcasing my skills in building intelligent and practical applications.
          </p>
        </div>

        {/* Enhanced Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Floating Action Elements */}
        <div className="mt-12 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff470f] to-[#ff6b35] rounded-full text-white font-medium transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
            <Github className="w-5 h-5" />
            <span>View All Projects</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
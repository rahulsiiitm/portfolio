import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Sprout, MessageSquare, Laptop, Wrench, Download, Globe } from 'lucide-react';

const ProjectsSection = () => {
  const [hoveredProject, setHoveredProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "AgriHive",
      description: "A multilingual AI-powered farming assistant that provides crop insights, weather info, and smart recommendations for farmers.",
      tech: ["Flutter", "TensorFlow", "Firebase", "Gemini API", "Flask"],
      icon: <Sprout className="w-5 h-5" />,
      github: "https://github.com/rahulsiiitm/AgriHive-Frontend",
      githubBackend: "https://github.com/rahulsiiitm/Backend",
      download: "https://drive.google.com/uc?export=download&id=1mOW06ng4V848ZiInPcajH08s4yVApNqz",
      image: "AgriHive.png", // Ensure this path is correct in your public folder
      featured: true,
      color: "#22c55e",
      type: "app"
    },
    {
      id: 2,
      title: "Techfest Website",
      description: "A modern, responsive website for my college's tech festival featuring interactive design, event schedules, and registration systems.",
      tech: ["HTML", "CSS", "JavaScript", "Figma"],
      icon: <Globe className="w-5 h-5" />,
      github: "https://github.com/rahulsiiitm/My-Website",
      demo: "https://my-test-website-eta.vercel.app/",
      image: "techfest.png",
      color: "#06b6d4"
    },
    {
      id: 3,
      title: "Guidance Bot",
      description: "An AI chatbot that helps users make better product choices by analyzing features, reviews, and preferences.",
      tech: ["Python", "Flask", "LangChain", "Dart"],
      icon: <MessageSquare className="w-5 h-5" />,
      github: "https://github.com/rahulsiiitm/Chatbot",
      image: "guidance.png",
      color: "#3b82f6"
    },
    {
      id: 4,
      title: "Personal Portfolio",
      description: "My interactive portfolio showcasing projects, skills, and experiments with creative web design.",
      tech: ["React", "Tailwind CSS", "Framer Motion"],
      icon: <Laptop className="w-5 h-5" />,
      github: "https://github.com/rahulsiiitm/portfolio",
      image: "portfolio.png",
      type: "portfolio",
      color: "#a855f7"
    },
    {
      id: 5,
      title: "More Coming Soon...",
      description: "Exciting new projects are currently in development! Stay tuned for innovative solutions and creative experiments.",
      tech: ["React", "Flutter/Dart", "AI/ML"],
      icon: <Wrench className="w-5 h-5" />,
      image: null,
      type: "coming-soon",
      color: "#6b7280"
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 12 
      }
    }
  };

  return (
    <section className="bg-[#16191e] relative overflow-hidden py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff470f]/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-stone-200 leading-tight tracking-wide mb-3">
            <span className="font-['Dancing_Script'] text-white">Technical</span>
            <br />
            <span className="text-[#ff470f] font-['Lufga']">Projects</span>
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-0.5 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-full mx-auto mb-4"
          />
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto font-['Montserrat']">
            Hover to explore project details and technologies used.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className={`
                relative group p-4 sm:p-6 lg:p-8
                bg-black/[0.1] backdrop-blur-sm border border-white/[0.08] rounded-2xl
                hover:bg-white/[0.06] hover:border-white/[0.15] transition-colors duration-300
                overflow-hidden cursor-default flex flex-col h-full
                ${project.featured && project.type !== 'coming-soon' ? 'md:col-span-2 md:row-span-2' : 
                  project.type === 'coming-soon' ? 'md:col-span-2' : ''}
              `}
            >
              {/* Background Image with Overlay */}
              {project.image && (
                <>
                  <div className="absolute inset-0 z-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16191e] via-[#16191e]/80 to-[#16191e]/30 z-0"></div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/60 z-0"
                  />
                </>
              )}

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 sm:p-2.5 bg-black/70 backdrop-blur-sm rounded-lg text-[#FF4500] border border-[#FF4500]/30">
                    {project.icon}
                  </div>
                  <h3 className="text-white text-sm sm:text-base font-semibold font-['Lufga'] drop-shadow-lg" 
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    {project.title}
                  </h3>
                </div>

                {/* Description & Tech - Revealed on Hover */}
                <motion.div 
                  initial={{ opacity: 0.8, height: "auto" }}
                  whileHover={{ opacity: 1 }}
                  className="mb-4 flex-grow"
                >
                  <p className={`text-gray-300 text-xs sm:text-sm leading-relaxed font-['Montserrat'] mb-4 
                    ${hoveredProject === project.id ? 'line-clamp-none' : 'line-clamp-3'}`}>
                    {project.description}
                  </p>
                  
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded text-[10px] sm:text-xs text-gray-200 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Buttons / Links */}
                <div className="mt-auto pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {project.type === "app" ? (
                    <>
                      <ProjectButton href={project.github} icon={<Github className="w-3 h-3"/>} label="Frontend" />
                      <ProjectButton href={project.githubBackend} icon={<Github className="w-3 h-3"/>} label="Backend" />
                      <ProjectButton href={project.download} icon={<Download className="w-3 h-3"/>} label="APK" primary />
                    </>
                  ) : project.type === "coming-soon" ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-600/20 backdrop-blur-sm border border-gray-500/30 rounded-lg text-xs text-gray-400 cursor-not-allowed">
                      <Wrench className="w-3 h-3" />
                      Coming Soon
                    </div>
                  ) : (
                    <>
                      <ProjectButton href={project.github} icon={<Github className="w-3 h-3"/>} label="Code" />
                      {project.demo && (
                        <ProjectButton href={project.demo} icon={<ExternalLink className="w-3 h-3"/>} label="Live Demo" primary />
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.a
            href='https://github.com/rahulsiiitm?tab=repositories'
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff470f] to-[#ff6b35] rounded-full text-white font-medium shadow-lg hover:shadow-orange-500/25 transition-shadow"
          >
            <Github className="w-5 h-5" />
            View All Projects
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

// Helper Component for Buttons to keep code clean
const ProjectButton = ({ href, icon, label, primary = false }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
      ${primary 
        ? 'bg-[#FF4500] hover:bg-[#e03d00] text-white shadow-lg shadow-orange-500/20' 
        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white'}
    `}
  >
    {icon}
    {label}
  </a>
);

export default ProjectsSection;
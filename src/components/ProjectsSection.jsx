// src/components/ProjectsSection.jsx
import React from 'react';
import { ExternalLink, Github, Brain, Eye, MessageSquare, BarChart3, Cpu, Database } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: "Computer Vision Model",
      description: "Deep learning model for real-time object detection and classification using YOLO architecture. Built with custom preprocessing pipeline and optimized inference.",
      tech: ["Python", "PyTorch", "OpenCV", "CUDA"],
      metrics: "94.2% accuracy, 45 FPS",
      icon: <Eye className="w-5 h-5" />,
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "NLP Sentiment Analyzer", 
      description: "Transformer-based model for multi-class sentiment analysis with custom preprocessing pipeline. Handles multiple languages and emotional nuances.",
      tech: ["Python", "Transformers", "BERT", "FastAPI"],
      metrics: "91.8% accuracy, 0.89 F1-score",
      icon: <MessageSquare className="w-5 h-5" />,
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "Predictive Analytics Dashboard",
      description: "ML-powered forecasting system with interactive dashboard for business metrics prediction. Real-time data processing and visualization.",
      tech: ["Python", "Scikit-learn", "React", "D3.js"],
      metrics: "2.3% MAE, 0.94 R²-score",
      icon: <BarChart3 className="w-5 h-5" />,
      github: "#",
      demo: "#"
    },
    {
      id: 4,
      title: "Neural Network Framework",
      description: "Custom deep learning framework built from scratch with automatic differentiation. Supports multiple layer types and optimization algorithms.",
      tech: ["Python", "NumPy", "Cython", "CUDA"],
      metrics: "15+ layer types, 10K ops/sec",
      icon: <Brain className="w-5 h-5" />,
      github: "#",
      demo: "#"
    }
  ];

  return (
    <div className="bg-[#16191e] text-white min-h-screen p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#ff6b35]">AI/ML</span> Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Building intelligent solutions that solve real-world problems through machine learning and data science.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="border-l-2 border-gray-700 pl-8 pb-8 relative group hover:border-[#ff6b35] transition-colors duration-300"
            >
              {/* Project Number */}
              <div className="absolute -left-3 top-0 w-6 h-6 bg-[#16191e] border-2 border-gray-700 rounded-full flex items-center justify-center group-hover:border-[#ff6b35] group-hover:bg-[#ff6b35] transition-all duration-300">
                <span className="text-xs font-bold text-gray-400 group-hover:text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-800 rounded-lg text-[#ff6b35] group-hover:bg-[#ff6b35] group-hover:text-white transition-all duration-300">
                      {project.icon}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-[#ff6b35] transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="text-[#ff6b35] font-medium text-sm">
                    {project.metrics}
                  </p>
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a 
                    href={project.github}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                  <a 
                    href={project.demo}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] hover:bg-[#e55a2b] rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 mb-6">
              Want to see more projects or discuss collaboration?
            </p>
            <button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              View All Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
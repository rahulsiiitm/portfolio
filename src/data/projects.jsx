import { Sprout, Globe, MessageSquare, Laptop, Wrench } from 'lucide-react';

export const projectsData = [
  {
    id: 1,
    title: "AgriHive",
    description: "A multilingual AI-powered farming assistant that provides crop insights, weather info, and smart recommendations for farmers.",
    tech: ["Flutter", "TensorFlow", "Firebase", "Gemini API", "Flask"],
    icon: <Sprout className="w-5 h-5" />,
    github: "https://github.com/rahulsiiitm/AgriHive-Frontend",
    githubBackend: "https://github.com/rahulsiiitm/Backend",
    download: "https://drive.google.com/uc?export=download&id=1mOW06ng4V848ZiInPcajH08s4yVApNqz",
    image: "AgriHive.png",
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
import { 
  Brain, Cpu, BarChart3, Zap, Eye, Database, 
  Atom, Server, FileCode, Palette, Wind, 
  Code, FileText, Link, Leaf, 
  GitBranch, Container, BookOpen, Figma, Terminal, Monitor 
} from 'lucide-react';

export const skillsData = {
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
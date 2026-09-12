import Hero from "./components/Hero";
import About from "./components/About";
import Intro from "./components/Intro";
import TechStack from "./components/TechStack";
import Marquee from "./components/Marquee";
import Experience from "./components/Experience";
import Achievements from "./components/Achievements";
import dynamic from "next/dynamic";

const Projects = dynamic(() => import("./components/Projects"));
const Footer = dynamic(() => import("./components/Footer"));

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Hero />
      <About />
      <Intro />
      <Marquee />
      <Projects />
      <TechStack /> 
      <Experience />
      <Achievements />
      <Footer />
    </main>
  );
}
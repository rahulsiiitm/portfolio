import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack"; // Import this
import Experience from "./components/Experience";
import Achievements from "./components/Achievements";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Hero />
      <Intro />
      <Projects />
      <TechStack /> 
      <Experience />
      <Achievements />
      <Footer />
    </main>
  );
}
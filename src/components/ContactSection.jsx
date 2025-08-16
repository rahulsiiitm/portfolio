// src/components/ContactSection.jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Send, Mail, Linkedin, Github, Twitter, CheckCircle } from 'lucide-react';

// Using the stable CSS 3D Cube to prevent page crashes
const Css3dCube = () => {
  return (
    <div className="cube-container">
      <div className="cube">
        <div className="face front">AI/ML</div>
        <div className="face back">UI/UX</div>
        <div className="face right">React</div>
        <div className="face left">Python</div>
        <div className="face top">Design</div>
        <div className="face bottom">Code</div>
      </div>
    </div>
  );
};

// Interactive Card Component
const InteractiveCard = ({ children }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        card.addEventListener('mousemove', handleMouseMove);
        return () => card.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return <div ref={cardRef} className="interactive-card">{children}</div>;
};

const ContactSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formStatus, setFormStatus] = useState({ submitting: false, submitted: false, error: false });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: false });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormStatus({ submitting: false, submitted: true, error: false });
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => {
        setFormStatus({ submitting: false, submitted: false, error: false });
    }, 5000);
  };

  const socialLinks = useMemo(() => [
    { href: "#", icon: <Github className="w-5 h-5" />, label: "GitHub" },
    { href: "#", icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
    { href: "#", icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
  ], []);
  
  const customStyles = `
    .interactive-card {
        position: relative;
        background: #1D1D1D;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.5rem;
        padding: 1.5rem;
        transition: background 0.3s ease, border-color 0.3s ease;
        overflow: hidden;
        z-index: 1;
    }
    .interactive-card::before {
        content: '';
        position: absolute;
        left: var(--mouse-x, 50%);
        top: var(--mouse-y, 50%);
        width: 250px;
        height: 250px;
        background: radial-gradient(circle at center, rgba(255, 71, 15, 0.15) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
    }
    .interactive-card:hover::before {
        opacity: 1;
    }
    
    .cube-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        perspective: 1000px;
    }
    .cube {
        width: 140px;
        height: 140px;
        position: relative;
        transform-style: preserve-3d;
        animation: rotate 20s infinite linear;
    }
    .face {
        position: absolute;
        width: 140px;
        height: 140px;
        background: rgba(255, 71, 15, 0.1);
        border: 1px solid #ff470f;
        color: #ff470f;
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(255, 71, 15, 0.2);
    }
    .front  { transform: rotateY(0deg) translateZ(70px); }
    .back   { transform: rotateY(180deg) translateZ(70px); }
    .right  { transform: rotateY(90deg) translateZ(70px); }
    .left   { transform: rotateY(-90deg) translateZ(70px); }
    .top    { transform: rotateX(90deg) translateZ(70px); }
    .bottom { transform: rotateX(-90deg) translateZ(70px); }

    @keyframes rotate {
      from { transform: rotateX(0deg) rotateY(0deg); }
      to   { transform: rotateX(360deg) rotateY(360deg); }
    }
  `;

  return (
    <section 
      ref={sectionRef} 
      id="contact" 
      className="bg-[#1A1A1A] relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <style>{customStyles}</style>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center items-center gap-2">
            <div className="text-stone-300 text-4xl md:text-5xl font-normal font-['Dancing_Script']">
              Get in
            </div>
            <div className="text-[#ff470f] text-5xl md:text-7xl font-semibold font-['Lufga'] leading-tight tracking-[2px] [text-shadow:_4px_4px_19px_rgb(0_0_0_/_1.00)]">
              <div className="hover:tracking-[4px] transition-all duration-700 ease-out">Touch</div>
            </div>
          </div>
          <p className="text-stone-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-['Montserrat'] mt-4">
            Have a project in mind or just want to say hello? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div 
            className={`lg:col-span-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `150ms` }}
          >
             <InteractiveCard>
                {formStatus.submitted ? (
                  <div className="flex flex-col items-center justify-center h-full text-center min-h-[380px]">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold font-['Lufga'] text-stone-200">Message Sent!</h3>
                    <p className="text-stone-400 font-['Montserrat'] mt-2">Thank you! I'll be in touch soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-stone-300 font-['Montserrat'] mb-2">Name</label>
                      <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-zinc-900/60 border border-white/10 rounded-lg px-4 py-2.5 text-stone-200 focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none transition-all duration-300" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-300 font-['Montserrat'] mb-2">Email</label>
                      <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-900/60 border border-white/10 rounded-lg px-4 py-2.5 text-stone-200 focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none transition-all duration-300" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-stone-300 font-['Montserrat'] mb-2">Message</label>
                      <textarea name="message" id="message" rows="3" required value={formData.message} onChange={handleInputChange} className="w-full bg-zinc-900/60 border border-white/10 rounded-lg px-4 py-2.5 text-stone-200 focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none transition-all duration-300"></textarea>
                    </div>
                    <button type="submit" disabled={formStatus.submitting} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FF4500] hover:bg-[#e03d00] rounded-lg transition-colors duration-200 text-sm font-medium font-['Montserrat'] text-white disabled:bg-gray-500 disabled:cursor-not-allowed">
                      {formStatus.submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
             </InteractiveCard>
          </div>

          {/* CSS 3D Cube in the middle */}
          <div className="relative hidden lg:block h-64 w-full">
            <Css3dCube />
          </div>

          <div 
            className={`flex flex-col gap-8 lg:col-span-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `300ms` }}
          >
            <InteractiveCard>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900/60 border border-white/10 rounded-lg text-[#FF4500]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-stone-200 font-semibold font-['Lufga']">Email</h3>
                  <p className="text-stone-400 font-['Montserrat'] text-sm">rahulsharma.hps@gmail.com</p>
                  <a href="mailto:rahul@iiitmanipur.ac.in" className="text-[#FF4500] text-sm font-medium hover:underline font-['Montserrat'] mt-1 inline-block">Send an email</a>
                </div>
              </div>
            </InteractiveCard>
            <InteractiveCard>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900/60 border border-white/10 rounded-lg text-[#FF4500]">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-stone-200 font-semibold font-['Lufga']">Social Profiles</h3>
                  <p className="text-stone-400 font-['Montserrat'] text-sm">Connect with me on social media.</p>
                  <div className="flex gap-4 mt-3">
                    {socialLinks.map(social => (
                      <a key={social.label} href={social.href} aria-label={social.label} className="text-stone-400 hover:text-[#FF4500] transition-colors">
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </InteractiveCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

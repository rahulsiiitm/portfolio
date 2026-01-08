import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Wifi, Send, Github, Linkedin, Twitter, CheckCircle2, AlertCircle } from 'lucide-react';

const ContactSection = () => {
  const [formState, setFormState] = useState('idle'); // idle, writing, sending, success, error
  const [terminalLines, setTerminalLines] = useState([
    { text: "System Initialized...", id: 1 },
    { text: "Accessing AishTrex secure server...", id: 2 },
    { text: "Awaiting user input...", id: 3 }
  ]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Helper to add logs
  const addLog = (text) => {
    setTerminalLines(prev => [...prev, { text, id: Date.now() }]);
  };

  // Handle Input Changes
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formState !== 'writing') setFormState('writing');
  };

  // Web3Forms Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        addLog("Error: Fields cannot be empty.");
        return;
    }

    setFormState('sending');
    addLog(`Encrypting package from: ${formData.email}...`);
    
    // Simulate processing delay for effect
    await new Promise(r => setTimeout(r, 1200));
    addLog("Upload in progress...");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...formData,
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, // Ensure this is set in your .env
          subject: `Portfolio Contact from ${formData.name}`,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setFormState('success');
        addLog("Transmission successful. Message received.");
        setFormData({ name: '', email: '', message: '' });
        
        // Reset after a delay
        setTimeout(() => {
            setFormState('idle');
            addLog("Ready for new transmission.");
        }, 5000);
      } else {
        throw new Error("API Error");
      }
    } catch (error) {
      setFormState('error');
      addLog("Transmission failed. Server unreachable.");
    }
  };

  return (
    <section 
      id="contact" 
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/image.webp')` }} // YOUR ORIGINAL BACKGROUND
    >
      {/* Dark Overlay to make text readable */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      {/* Main Terminal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-[#16191e]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row"
      >
        
        {/* LEFT PANEL: System Status & Logs */}
        <div className="md:w-1/3 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-6">
               <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
               </div>
               <span className="ml-3 text-xs font-mono text-stone-400">root@rahul:~</span>
            </div>

            <h3 className="text-[#FF4500] text-sm font-bold mb-4 font-['Lufga'] tracking-wider flex items-center gap-2">
              <Wifi className="w-4 h-4 animate-pulse" /> SYSTEM LOGS
            </h3>
            
            {/* Live Logs */}
            <div className="font-mono text-xs space-y-2 text-stone-300 h-48 overflow-y-auto scrollbar-hide">
               {terminalLines.map((line) => (
                  <div key={line.id} className="flex gap-2 animate-fade-in">
                    <span className="text-[#FF4500] opacity-70">{`>`}</span>
                    <span className="opacity-80">{line.text}</span>
                  </div>
               ))}
               <div className="h-4"></div> {/* Spacer */}
            </div>
          </div>

          {/* Connect Links */}
          <div className="mt-6 md:mt-0 pt-6 border-t border-white/10">
             <h3 className="text-stone-300 text-xs font-bold mb-3 font-['Lufga'] flex items-center gap-2">
                <Cpu className="w-3 h-3" /> EXTERNAL LINKS
             </h3>
             <div className="space-y-2">
                {[
                  { name: "GitHub", url: "https://github.com/rahulsiiitm", icon: Github },
                  { name: "LinkedIn", url: "https://www.linkedin.com/in/rahulsharma2k4", icon: Linkedin },
                  { name: "Twitter", url: "https://twitter.com/rahulsiiitm", icon: Twitter }
                ].map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-xs text-stone-400 hover:text-[#FF4500] transition-colors group p-2 rounded hover:bg-white/5"
                  >
                    <social.icon className="w-4 h-4" />
                    <span className="font-mono">{social.name}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT PANEL: The Interactive Form */}
        <div className="md:w-2/3 p-6 md:p-10 relative bg-gradient-to-br from-transparent to-[#FF4500]/5">
            <h2 className="text-2xl font-bold text-white mb-1 font-['Lufga']">
                Initialize <span className="text-[#FF4500]">Contact</span>
            </h2>
            <p className="text-stone-400 text-sm mb-8 font-['Montserrat']">
                Execute the form below to establish a direct connection.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name Input */}
                <div className="group relative">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-500 mb-1 group-focus-within:text-[#FF4500] transition-colors">
                        <span>01 // Identity</span>
                    </div>
                    <div className="relative flex items-center">
                        <span className="absolute left-0 text-[#FF4500] font-mono">{`>`}</span>
                        <input 
                           type="text" 
                           name="name"
                           value={formData.name}
                           onChange={handleInput}
                           className="w-full bg-transparent border-b border-white/20 pl-6 py-2 text-stone-200 font-mono text-sm focus:border-[#FF4500] focus:outline-none transition-all placeholder:text-stone-600"
                           placeholder="Enter Identification_"
                           autoComplete="off"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="group relative">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-500 mb-1 group-focus-within:text-[#FF4500] transition-colors">
                        <span>02 // Return Address</span>
                    </div>
                    <div className="relative flex items-center">
                        <span className="absolute left-0 text-[#FF4500] font-mono">{`@`}</span>
                        <input 
                           type="email" 
                           name="email"
                           value={formData.email}
                           onChange={handleInput}
                           className="w-full bg-transparent border-b border-white/20 pl-6 py-2 text-stone-200 font-mono text-sm focus:border-[#FF4500] focus:outline-none transition-all placeholder:text-stone-600"
                           placeholder="Enter Email Address_"
                           autoComplete="off"
                        />
                    </div>
                </div>

                {/* Message Input */}
                <div className="group relative">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-500 mb-1 group-focus-within:text-[#FF4500] transition-colors">
                        <span>03 // Data Packet</span>
                    </div>
                    <div className="relative flex items-start mt-2 bg-white/5 border border-white/10 rounded p-2 focus-within:border-[#FF4500]/50 transition-colors">
                        <span className="text-[#FF4500] font-mono mt-1 mr-2">{`$`}</span>
                        <textarea 
                           name="message"
                           value={formData.message}
                           onChange={handleInput}
                           rows="4"
                           className="w-full bg-transparent border-none text-stone-200 font-mono text-sm focus:outline-none placeholder:text-stone-600 resize-none"
                           placeholder="Type your transmission here..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                   type="submit"
                   disabled={formState === 'sending' || formState === 'success'}
                   className={`
                      w-full py-4 mt-4 rounded-lg font-bold tracking-wider uppercase text-xs transition-all flex items-center justify-center gap-2
                      ${formState === 'success' 
                        ? 'bg-green-500 text-black cursor-default' 
                        : 'bg-[#FF4500] hover:bg-[#ff571a] text-white shadow-lg shadow-[#FF4500]/20'
                      }
                      disabled:opacity-70 disabled:cursor-not-allowed
                   `}
                >
                    {formState === 'sending' ? (
                        <>Processing<span className="animate-pulse">_</span></>
                    ) : formState === 'success' ? (
                        <><CheckCircle2 className="w-4 h-4" /> Transmission Complete</>
                    ) : (
                        <>Execute Transmission <Send className="w-3 h-3" /></>
                    )}
                </button>

            </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
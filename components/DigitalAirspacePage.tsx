
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Crosshair, Hexagon, Cpu, Network, Activity, Database, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  onBack: () => void;
}

const MODULES = [
  {
    id: 0,
    title: "DREAM IT",
    subtitle: "STRATEGIC IDEATION",
    description: "We don't just code; we architect realities. Our strategic phase maps the unseen, turning abstract business goals into concrete AR functional specifications. We model user dwell time, emotional resonance, and brand conversion loops before a single pixel is rendered.",
    specs: [
      { label: "LATENCY", value: "0.0ms" },
      { label: "CONCEPT", value: "VALIDATED" },
      { label: "MODE", value: "CREATIVE" }
    ],
    icon: Hexagon
  },
  {
    id: 1,
    title: "BUILD IT",
    subtitle: "WEBGL PRODUCTION",
    description: "Frictionless deployment. Utilizing advanced WebGL and Three.js pipelines, we deploy high-fidelity 3D assets directly to the browser. No App Store. No downloads. Just pure, unadulterated visual immersion triggered by image targets or geolocation.",
    specs: [
      { label: "FRAMEWORK", value: "THREE.JS" },
      { label: "RENDER", value: "PBR/DITHER" },
      { label: "FPS", value: "60+" }
    ],
    icon: Cpu
  },
  {
    id: 2,
    title: "GROW IT",
    subtitle: "SCALING & ANALYTICS",
    description: "The launch is only the beginning. We inject real-time telemetry into the AR experience to track engagement heatmaps, dwell times, and conversion funnels. Data drives iteration. We scale what works and prune what doesn't.",
    specs: [
      { label: "DATA", value: "REAL-TIME" },
      { label: "SCALE", value: "GLOBAL" },
      { label: "ROI", value: "POSITIVE" }
    ],
    icon: Network
  }
];

export const DigitalAirspacePage: React.FC<Props> = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound Synthesis Logic
  const playSound = useCallback((type: 'hover' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
         ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === 'hover') {
         // High-tech chirpy blip for hover
         osc.type = 'sine';
         osc.frequency.setValueAtTime(1000, now);
         osc.frequency.exponentialRampToValueAtTime(2000, now + 0.05); // Pitch up
         
         gain.gain.setValueAtTime(0.02, now); // Very quiet
         gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
         
         osc.start(now);
         osc.stop(now + 0.05);
      } else {
         // Digital confirmation click/thud
         osc.type = 'triangle';
         osc.frequency.setValueAtTime(300, now);
         osc.frequency.exponentialRampToValueAtTime(50, now + 0.15); // Pitch down
         
         gain.gain.setValueAtTime(0.05, now);
         gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
         
         osc.start(now);
         osc.stop(now + 0.15);
      }
    } catch (e) {
      // Fail silently if audio is not supported
    }
  }, []);

  // Initial Entrance Animation
  useEffect(() => {
    const tl = gsap.timeline();

    // Reset states
    gsap.set([sidebarRef.current, contentRef.current], { opacity: 0 });
    gsap.set(sidebarRef.current?.children || [], { x: -50, opacity: 0 });
    gsap.set(contentRef.current, { x: 50, opacity: 0 });

    tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
      .to(sidebarRef.current, { opacity: 1, duration: 0.1 })
      .to(sidebarRef.current?.children || [], { 
        x: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1,
        ease: 'power2.out' 
      })
      .to(contentRef.current, { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, "-=0.3");
      
  }, []);

  // Content Switch Animation
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Text scramble effect simulation
    setIsGlitching(true);
    const timer = setTimeout(() => setIsGlitching(false), 300);

    gsap.fromTo(contentRef.current, 
      { opacity: 0.5, filter: 'blur(4px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 0.4 }
    );
    
    return () => clearTimeout(timer);
  }, [activeModule]);

  const ScrambleText = ({ text, active }: { text: string, active: boolean }) => {
    const [display, setDisplay] = useState(text);
    
    useEffect(() => {
      if (!active) {
        setDisplay(text);
        return;
      }
      
      let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let iterations = 0;
      
      const interval = setInterval(() => {
        setDisplay(prev => text.split("").map((letter, index) => {
          if(index < iterations) return text[index];
          return chars[Math.floor(Math.random() * 46)];
        }).join(""));
        
        if(iterations >= text.length) clearInterval(interval);
        iterations += 1/2; 
      }, 30);
      
      return () => clearInterval(interval);
    }, [text, active]);
    
    return <span>{display}</span>;
  };

  const CurrentIcon = MODULES[activeModule].icon;

  return (
    <div ref={containerRef} className="absolute inset-0 z-30 w-full h-full text-white overflow-hidden bg-gradient-to-r from-black/80 via-black/20 to-transparent backdrop-blur-sm">
      
      {/* --- DECORATIVE HUD ELEMENTS --- */}
      <div className="absolute top-8 left-8 w-64 h-px bg-white/20 pointer-events-none" />
      <div className="absolute top-8 left-8 w-px h-64 bg-white/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-64 h-px bg-white/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-px h-64 bg-white/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] border border-white/5 pointer-events-none rounded-[2rem]" />

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-auto">
        <button 
          onClick={() => {
            playSound('click');
            onBack();
          }}
          onMouseEnter={() => playSound('hover')}
          className="group flex items-center gap-3 px-4 py-2 border border-white/10 bg-black/40 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-[0.2em] text-cyan-400/80 group-hover:text-cyan-400">EXIT_SIMULATION</span>
        </button>

        <div className="flex items-center gap-4 font-mono text-[10px] text-white/40 tracking-widest">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
            <span>SYSTEM_OPTIMAL</span>
          </div>
          <span>::</span>
          <span>AIRSPACE_V2.4</span>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="w-full h-full flex pt-24 pb-12 pl-8 md:pl-16 pr-4 md:pr-0">
        
        {/* LEFT SIDEBAR - NAVIGATION */}
        <div ref={sidebarRef} className="w-24 md:w-1/4 h-full flex flex-col justify-center border-r border-white/10 relative pointer-events-auto bg-gradient-to-b from-transparent via-black/40 to-transparent backdrop-blur-md">
           <div className="absolute -right-[1px] top-0 h-full w-px bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.2)]" />
           
           <div className="flex flex-col gap-0">
             {MODULES.map((module, index) => (
               <button 
                 key={module.id}
                 onClick={() => {
                    playSound('click');
                    setActiveModule(index);
                 }}
                 onMouseEnter={() => playSound('hover')}
                 className={`group relative w-full text-left p-6 md:p-8 border-b border-white/5 hover:bg-white/5 transition-all duration-300 ${activeModule === index ? 'bg-white/5' : ''}`}
               >
                 {/* Active Indicator Line */}
                 <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${activeModule === index ? 'bg-cyan-400 shadow-[0_0_15px_0_rgba(34,211,238,0.5)]' : 'bg-transparent group-hover:bg-white/20'}`} />
                 
                 <div className="font-mono text-[10px] text-white/40 mb-2 group-hover:text-cyan-400 transition-colors">
                   0{index + 1} // MODULE
                 </div>
                 <div className={`font-display text-xl md:text-4xl font-bold tracking-tighter transition-all duration-300 ${activeModule === index ? 'text-white translate-x-2' : 'text-white/40 group-hover:text-white'}`}>
                   {module.title}
                 </div>
                 
                 {/* Mobile hidden, desktop visible subtitle */}
                 <div className={`hidden md:block mt-2 text-xs font-mono tracking-wider transition-all duration-500 overflow-hidden ${activeModule === index ? 'max-h-10 opacity-100 text-cyan-400' : 'max-h-0 opacity-0'}`}>
                   [{module.subtitle}]
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* RIGHT CONTENT - DATA DISPLAY */}
        <div className="flex-1 h-full relative flex flex-col justify-center px-8 md:px-24 pointer-events-none">
          
          {/* Background decorative grid for content area */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-[80%] bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-[0.03] pointer-events-none" />

          <div ref={contentRef} className="relative max-w-2xl">
            
            {/* Floating Icon */}
            <div className="absolute -top-24 -left-8 opacity-10 animate-pulse">
              <CurrentIcon size={200} strokeWidth={0.5} />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />
              <span className="font-mono text-cyan-400 text-xs tracking-[0.3em] uppercase">
                <ScrambleText text={MODULES[activeModule].subtitle} active={isGlitching} />
              </span>
            </div>
            
            <h1 ref={titleRef} className="font-display text-6xl md:text-8xl font-bold leading-[0.85] mb-12 mix-blend-overlay text-white">
               {MODULES[activeModule].title}
            </h1>

            <div className="flex flex-col gap-8 relative z-10">
               <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed border-l-2 border-cyan-500/30 pl-6">
                 {MODULES[activeModule].description}
               </p>

               {/* Specs Grid */}
               <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                 {MODULES[activeModule].specs.map((spec, i) => (
                   <div key={i} className="flex flex-col gap-1">
                     <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{spec.label}</span>
                     <span className="text-sm font-mono text-cyan-400">{spec.value}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Action Button */}
            <button 
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('click')}
              className="mt-12 group relative px-8 py-4 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 pointer-events-auto overflow-hidden"
            >
              <div className="absolute inset-0 w-0 bg-cyan-400 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
              <div className="flex items-center justify-between gap-8">
                <span className="font-mono text-xs tracking-widest text-cyan-300 group-hover:text-cyan-200 uppercase">Initialize Protocol</span>
                <Crosshair className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* --- BOTTOM STATUS BAR --- */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end pointer-events-none opacity-50">
         <div className="hidden md:flex flex-col gap-1 font-mono text-[10px] text-white/30">
            <span>MEM: 42%</span>
            <span>CPU: 12%</span>
            <span>NET: SECURE</span>
         </div>
         <div className="flex items-center gap-2 font-mono text-[10px] text-white/30">
            <Database className="w-3 h-3" />
            <span>DATA STREAM: ENCRYPTED</span>
         </div>
      </div>
    </div>
  );
};

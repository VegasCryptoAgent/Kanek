
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Scan, Smartphone, Cloud, Layers, Terminal, Cpu, Code2, Wifi } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  onBack: () => void;
}

const STEPS = [
  {
    id: 0,
    title: "CAMERA VISION",
    subtitle: "OPTICAL RECOGNITION",
    description: "The browser is the new operating system. By leveraging SLAM (Simultaneous Localization and Mapping) directly in the DOM, we bypass the need for native downloads. The camera acts as the primary input device, scanning for 6DoF marker tracking or surface plane detection instantly.",
    codeSnippet: "await navigator.xr.requestSession('immersive-ar');",
    icon: Scan
  },
  {
    id: 1,
    title: "LAUNCH MODES",
    subtitle: "MULTI-VECTOR ENTRY",
    description: "Access is ubiquitous. Whether triggered via QR codes printed on physical assets, NFC taps, SMS deep links, or geo-fenced coordinates, the entry point is frictionless. We reduce the 'time-to-magic' from minutes (app install) to seconds (link click).",
    codeSnippet: "const trigger = new LaunchVector({ type: 'QR', id: 'x99' });",
    icon: Smartphone
  },
  {
    id: 2,
    title: "AUGMENTED CLOUD",
    subtitle: "DYNAMIC ASSET DELIVERY",
    description: "Content is not static. Our cloud infrastructure streams optimized 3D assets (GLB/USDZ) based on device capability and network speed. Real-time content updates allow campaigns to evolve daily without user updates, powered by edge-cached delivery networks.",
    codeSnippet: "Cloud.streamAsset('hero_model_v2', { lod: 'high' });",
    icon: Cloud
  },
  {
    id: 3,
    title: "INTERACTIVE UI",
    subtitle: "SPATIAL INTERFACE",
    description: "The UI lives in world space. Buttons, scoreboards, and interactive elements are projected into the user's physical environment. We blend standard DOM overlay elements with WebGL raycasting to create a hybrid interface that feels tangible and responsive.",
    codeSnippet: "<ARButton position={[0, 1.5, -2]} onClick={interact} />",
    icon: Layers
  }
];

export const HowItWorksPage: React.FC<Props> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null); // Right side
  const codeRef = useRef<HTMLDivElement>(null); // Code snippet ref
  
  // Intro Animation
  useEffect(() => {
    const tl = gsap.timeline();
    
    gsap.set([sidebarRef.current], { x: 100, opacity: 0 });
    
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
      .to(sidebarRef.current, { 
        x: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out' 
      });
      
  }, []);

  // Step Transition
  useEffect(() => {
    // Animate general text content
    const els = document.querySelectorAll('.step-animate');
    gsap.fromTo(els, 
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    );

    // Animate code snippet specifically
    if (codeRef.current) {
      gsap.fromTo(codeRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.1 }
      );
    }
  }, [activeStep]);

  const CurrentIcon = STEPS[activeStep].icon;

  return (
    <div ref={containerRef} className="absolute inset-0 z-30 w-full h-full text-white overflow-hidden bg-black/80 backdrop-blur-md">
      
      {/* --- DECORATIVE GRID BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-4 py-2 border border-white/10 bg-black/40 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-500 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-[0.2em] text-emerald-500/80 group-hover:text-emerald-500">ABORT_SEQUENCE</span>
        </button>

        <div className="flex items-center gap-4 font-mono text-[10px] text-emerald-500/60 tracking-widest">
          <span>SCHEMATIC_VIEW</span>
          <span>::</span>
          <span>ENG_MODE</span>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="w-full h-full flex pt-24 pb-12">
        
        {/* LEFT SIDE - 3D VISUAL AREA (Empty div to occupy space, visual is in Scene.tsx) */}
        <div className="hidden md:flex w-1/2 h-full relative flex-col justify-end p-12 pointer-events-none">
           {/* Floating Code Snippet near the object */}
           <div ref={codeRef} className="bg-black/60 border border-emerald-500/20 p-4 rounded max-w-md backdrop-blur-sm origin-bottom-left">
              <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                 <Terminal className="w-3 h-3 text-emerald-500" />
                 <span className="text-[10px] font-mono text-emerald-500 uppercase">Function Call</span>
              </div>
              <code className="font-mono text-xs text-gray-400 block">
                 {STEPS[activeStep].codeSnippet}
              </code>
           </div>
        </div>

        {/* RIGHT SIDE - CONTROLS & INFO */}
        <div ref={sidebarRef} className="w-full md:w-1/2 h-full flex flex-col relative pointer-events-auto px-8 md:px-16 overflow-y-auto">
           
           {/* Steps Navigation (Horizontal or Grid) */}
           <div className="grid grid-cols-4 gap-2 mb-12 border-b border-white/10 pb-8">
              {STEPS.map((step, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`group flex flex-col items-center gap-3 py-4 transition-all duration-300 border-b-2 ${activeStep === idx ? 'border-emerald-500 bg-emerald-500/5' : 'border-transparent hover:bg-white/5'}`}
                >
                  <step.icon className={`w-6 h-6 transition-colors ${activeStep === idx ? 'text-emerald-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
                  <span className="font-mono text-[10px] tracking-wider hidden md:block text-gray-500">{step.title.split(' ')[0]}</span>
                </button>
              ))}
           </div>

           {/* Active Content */}
           <div className="flex-1 flex flex-col justify-center">
              <div className="step-animate flex items-center gap-3 mb-6">
                 <div className="w-8 h-[1px] bg-emerald-500" />
                 <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase">0{activeStep + 1} // {STEPS[activeStep].subtitle}</span>
              </div>
              
              <h2 className="step-animate font-display text-5xl md:text-7xl font-bold leading-[0.9] mb-8 text-white">
                 {STEPS[activeStep].title}
              </h2>
              
              <p className="step-animate text-gray-400 text-lg leading-relaxed max-w-xl mb-12 border-l border-white/10 pl-6">
                 {STEPS[activeStep].description}
              </p>

              {/* Tech Specs Details */}
              <div className="step-animate grid grid-cols-2 gap-6 max-w-md">
                 <div className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-emerald-500/50 mt-1" />
                    <div>
                       <h4 className="font-bold text-sm mb-1">Processing</h4>
                       <p className="text-xs text-gray-500">Client-side heuristic analysis</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Wifi className="w-5 h-5 text-emerald-500/50 mt-1" />
                    <div>
                       <h4 className="font-bold text-sm mb-1">Latency</h4>
                       <p className="text-xs text-gray-500">Edge-computed response &lt;50ms</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Code2 className="w-5 h-5 text-emerald-500/50 mt-1" />
                    <div>
                       <h4 className="font-bold text-sm mb-1">Stack</h4>
                       <p className="text-xs text-gray-500">Three.js / React-Three-Fiber</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* --- FOOTER STATUS --- */}
      <div className="absolute bottom-0 right-0 w-full md:w-1/2 p-6 flex justify-between border-t border-white/5 bg-black/90 pointer-events-none">
         <div className="font-mono text-[10px] text-emerald-500/50 flex gap-4">
            <span>CORE_TEMP: 45C</span>
            <span>THREADS: 8</span>
         </div>
         <div className="font-mono text-[10px] text-emerald-500/50 animate-pulse">
            AWAITING_INPUT...
         </div>
      </div>
    </div>
  );
};
    
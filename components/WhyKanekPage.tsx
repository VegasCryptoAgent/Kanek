
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Zap, Link2, Repeat, Globe, ShieldCheck, TrendingUp, MousePointer2, Lock, BarChart } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  onBack: () => void;
}

const ADVANTAGES = [
  {
    id: 0,
    title: "ZERO FRICTION",
    subtitle: "CAMERA NATIVE",
    description: "Eliminate the 'App Store Wall'. By utilizing the native camera browser stack, we increase user conversion by up to 300% compared to app-download funnels. Instant access means instant engagement.",
    stat: "300%",
    statLabel: "HIGHER CONVERSION",
    icon: Zap
  },
  {
    id: 1,
    title: "RAPID INTEGRATION",
    subtitle: "SYSTEM AGNOSTIC",
    description: "Our architecture hooks directly into your existing CRM and CDP pipelines. Push loyalty rewards, capture leads, and sync user profiles in real-time without refactoring your backend.",
    stat: "<24H",
    statLabel: "DEPLOYMENT TIME",
    icon: Link2
  },
  {
    id: 2,
    title: "RETENTION LOOPS",
    subtitle: "ALGORITHMIC REWARDS",
    description: "Gamified experiences that aren't just for show. We build psychological hooks that reward return visits, creating a self-sustaining cycle of user engagement and brand loyalty.",
    stat: "4.5X",
    statLabel: "DWELL TIME",
    icon: Repeat
  },
  {
    id: 3,
    title: "GLOBAL SCALE",
    subtitle: "EDGE NETWORK",
    description: "Content delivered via a distributed edge network ensures low-latency experiences from Tokyo to New York. Automatic quality scaling for any device, on any network.",
    stat: "99.9%",
    statLabel: "UPTIME SLA",
    icon: Globe
  }
];

export const WhyKanekPage: React.FC<Props> = ({ onBack }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  // Entrance Animation
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Reset positions
    gsap.set([listRef.current, contentRef.current], { opacity: 0, x: -20 });
    
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
      .to(listRef.current, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' })
      .to(contentRef.current, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6");
      
  }, []);

  // Transition Animation
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Animate content refresh
    gsap.fromTo(contentRef.current.children, 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    );

  }, [activeIdx]);

  const ActiveIcon = ADVANTAGES[activeIdx].icon;

  return (
    <div ref={containerRef} className="absolute inset-0 z-30 w-full h-full text-white overflow-hidden bg-gradient-to-br from-neutral-900 to-black">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
        {/* Vertical scanning lines */}
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:100px_100%]" />
      </div>
      
      {/* Amber Glow orb in corner */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-4 py-2 border border-white/10 bg-black/40 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-[0.2em] text-amber-500/80 group-hover:text-amber-500">RETURN_HOME</span>
        </button>

        <div className="flex items-center gap-4 font-mono text-[10px] text-amber-500/60 tracking-widest">
          <span className="uppercase">Competitive_Advantage</span>
          <span>::</span>
          <span className="animate-pulse">LIVE_METRICS</span>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="w-full h-full flex flex-col md:flex-row pt-24 pb-12 px-8 md:px-16 gap-12">
        
        {/* LEFT SIDE - NAVIGATION LIST */}
        <div ref={listRef} className="w-full md:w-1/3 h-full flex flex-col justify-center relative pointer-events-auto z-10">
           <div className="font-display text-xl text-white/40 mb-8 tracking-tight">SELECT_VECTOR //</div>
           
           <div className="flex flex-col gap-4">
             {ADVANTAGES.map((item, idx) => (
               <button 
                 key={idx}
                 onMouseEnter={() => setActiveIdx(idx)}
                 onClick={() => setActiveIdx(idx)}
                 className={`group relative text-left p-6 border transition-all duration-300 overflow-hidden ${activeIdx === idx ? 'border-amber-500 bg-amber-950/30' : 'border-white/10 hover:border-white/30 bg-black/40'}`}
               >
                 {/* Hover slide effect */}
                 <div className={`absolute inset-0 bg-amber-500/10 transition-transform duration-500 origin-left ${activeIdx === idx ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                 
                 <div className="relative flex items-center justify-between">
                    <div>
                        <div className={`font-mono text-[10px] mb-1 uppercase tracking-wider ${activeIdx === idx ? 'text-amber-400' : 'text-gray-500'}`}>
                            0{idx + 1} . {item.subtitle}
                        </div>
                        <div className={`font-bold text-xl md:text-2xl transition-colors ${activeIdx === idx ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                            {item.title}
                        </div>
                    </div>
                    <item.icon className={`w-6 h-6 transition-all duration-300 ${activeIdx === idx ? 'text-amber-500 scale-110' : 'text-gray-600 group-hover:text-gray-400'}`} />
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* RIGHT SIDE - DETAILED CONTENT */}
        <div className="flex-1 h-full relative flex flex-col justify-center md:pl-12 pointer-events-none">
          <div ref={contentRef} className="max-w-2xl relative">
             
             {/* Giant Background Number */}
             <div className="absolute -top-40 -right-20 text-[20rem] font-display font-bold text-white/[0.02] select-none">
                0{activeIdx + 1}
             </div>

             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/30">
                    <ActiveIcon className="w-8 h-8 text-amber-500" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
             </div>

             <h2 className="font-display text-6xl md:text-7xl font-bold text-white mb-8 leading-[0.9]">
                {ADVANTAGES[activeIdx].title}
             </h2>

             <p className="text-xl text-gray-300 font-light leading-relaxed mb-12 max-w-lg">
                {ADVANTAGES[activeIdx].description}
             </p>

             <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                   <div className="font-display text-4xl md:text-5xl font-bold text-amber-500 mb-1">
                      {ADVANTAGES[activeIdx].stat}
                   </div>
                   <div className="font-mono text-xs text-gray-500 tracking-widest uppercase">
                      {ADVANTAGES[activeIdx].statLabel}
                   </div>
                </div>
                <div className="flex flex-col justify-end pb-1">
                    <button className="flex items-center gap-2 text-xs font-mono text-white hover:text-amber-400 transition-colors pointer-events-auto group">
                        <span>READ_CASE_STUDY</span>
                        <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
};

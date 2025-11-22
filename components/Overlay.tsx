
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Scan, Cloud, Smartphone, Zap, Globe, Layers, BarChart3, Zap as Lightning, MousePointer2 } from 'lucide-react';
import { ViewState } from '../App';

// Helper hook for scroll animations
const useSectionAnimation = (ref: React.RefObject<HTMLElement>, staggerAmount = 0.15) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state immediately to avoid flash
    gsap.set(element.children, { opacity: 0, y: 40 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(element.children, {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: staggerAmount,
              ease: 'power3.out',
              overwrite: true
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" } 
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, staggerAmount]);
};

interface Props {
  onNavigate: (view: ViewState) => void;
}

export const Overlay: React.FC<Props> = ({ onNavigate }) => {
  // Hero refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Section refs for scroll animation
  const airspaceRef = useRef<HTMLDivElement>(null);
  const mechanicsRef = useRef<HTMLDivElement>(null);
  const advantageRef = useRef<HTMLDivElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);

  // Initial Hero Animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial state for Hero elements
    gsap.set([titleRef.current, taglineRef.current, footerRef.current], {
      opacity: 0,
      y: 20
    });

    // Animation sequence for Hero
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, delay: 0.5 })
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .to(footerRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");

  }, []);

  // Trigger animations for sections on scroll
  useSectionAnimation(airspaceRef);
  useSectionAnimation(mechanicsRef);
  useSectionAnimation(advantageRef);
  useSectionAnimation(footerContentRef);

  // Icon Animations
  useEffect(() => {
    const icons = document.querySelectorAll('.icon-animate');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Kill any existing tweens to prevent conflicts
          gsap.killTweensOf(entry.target);
          
          const tl = gsap.timeline();
          
          // Pop In Animation
          tl.fromTo(entry.target, 
            { scale: 0, rotate: -45, opacity: 0 }, 
            { 
              scale: 1, 
              rotate: 0, 
              opacity: 1, 
              duration: 1.2, 
              ease: 'elastic.out(1, 0.5)' 
            }
          );
          
          // Continuous Pulse Animation
          tl.to(entry.target, {
            scale: 1.15,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5, rootMargin: "0px 0px -50px 0px" });

    icons.forEach(icon => observer.observe(icon));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col pointer-events-auto selection:bg-white selection:text-black">
      
      {/* --- HERO SECTION (DO NOT CHANGE) --- */}
      <section className="w-full h-screen flex flex-col justify-between p-8 md:p-16 relative z-10">
        {/* Navigation / Header - Removed as requested */}
        <div className="min-h-[20px]"></div>

        {/* Main Content */}
        <div className="relative flex flex-col items-center md:items-start justify-center h-full max-w-7xl">
          
          {/* Giant Logotype */}
          <h1 ref={titleRef} className="font-display text-[12vw] md:text-[11rem] leading-[0.8] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mix-blend-difference">
            KANEK
          </h1>

          {/* Tagline */}
          <div ref={taglineRef} className="mt-8 md:mt-6 ml-1 md:ml-4 w-full flex flex-col gap-2">
            <span className="w-fit whitespace-nowrap text-lg md:text-3xl text-gray-400 font-extralight leading-tight transition-all duration-500 hover:text-white hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-default">
              Where the real world meets the digital frontier.
            </span>
            <span className="w-fit whitespace-nowrap text-2xl md:text-5xl text-gray-200 font-medium leading-tight transition-all duration-500 hover:text-white hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-default">
              Engage. Retain. Grow.
            </span>
          </div>

          {/* CTA Button - Removed as requested */}
        </div>

        {/* Footer / Specs */}
        <div ref={footerRef} className="flex flex-col md:flex-row justify-between items-end text-[10px] md:text-xs text-gray-600 font-mono tracking-wider uppercase border-t border-gray-900/50 pt-6">
          <div className="flex gap-6 mb-4 md:mb-0">
            <span>Lat: 34.0522 N</span>
            <span>Lon: 118.2437 W</span>
          </div>
          <div className="flex flex-col text-right gap-1">
            <span>System Status: Online</span>
            <span>Ver: 2.4.0-Alpha</span>
          </div>
        </div>
      </section>

      {/* --- DIGITAL AIRSPACE (Dream It, Build It, Grow It) --- */}
      <section className="w-full min-h-screen flex items-center p-8 md:p-16 relative z-10">
        <div 
          ref={airspaceRef} 
          onClick={() => onNavigate('airspace')}
          className="max-w-3xl cursor-pointer group relative transition-all duration-500"
        >
          {/* Interactive Background Cue */}
          <div className="absolute -inset-10 bg-white/0 group-hover:bg-white/[0.03] transition-all duration-500 rounded-3xl -z-10" />
          
          <div className="flex justify-between items-start mb-8">
             <div className="text-xs font-mono text-gray-500 tracking-widest uppercase">/// 01. Framework</div>
             <div className="text-xs font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 translate-x-4 group-hover:translate-x-0">
                ACCESS AIRSPACE <MousePointer2 className="w-3 h-3" />
             </div>
          </div>

          <h2 className="font-display text-4xl md:text-7xl leading-[0.9] mb-16 text-gray-100 group-hover:text-white transition-colors">
            DIGITAL <span className="text-gray-600 group-hover:text-gray-400 transition-colors">AIRSPACE</span>
          </h2>
          
          <div className="grid gap-12 relative border-l border-gray-800 pl-8 md:pl-12 group-hover:border-gray-600 transition-colors">
            {/* Dream It */}
            <div className="relative group/item">
              <div className="absolute -left-[3.25rem] md:-left-[4.25rem] top-1 w-3 h-3 bg-gray-800 group-hover/item:bg-white transition-colors rounded-full" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">DREAM IT</h3>
              <p className="text-gray-400 leading-relaxed max-w-md group-hover/item:text-gray-300 transition-colors">
                Ideation, strategy, and storytelling. We map how loyalty and AR experiences will function before writing a single line of code.
              </p>
            </div>

            {/* Build It */}
            <div className="relative group/item">
              <div className="absolute -left-[3.25rem] md:-left-[4.25rem] top-1 w-3 h-3 bg-gray-800 group-hover/item:bg-white transition-colors rounded-full" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">BUILD IT</h3>
              <p className="text-gray-400 leading-relaxed max-w-md group-hover/item:text-gray-300 transition-colors">
                Production and deployment of browser-based AR. Seamless system integration and analytics setup without the need for app stores.
              </p>
            </div>

            {/* Grow It */}
            <div className="relative group/item">
              <div className="absolute -left-[3.25rem] md:-left-[4.25rem] top-1 w-3 h-3 bg-gray-800 group-hover/item:bg-white transition-colors rounded-full" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">GROW IT</h3>
              <p className="text-gray-400 leading-relaxed max-w-md group-hover/item:text-gray-300 transition-colors">
                Optimization and scaling. Leveraging data intelligence and live insights to refine user engagement and drive ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Mechanics) --- */}
      <section className="w-full min-h-screen flex items-center justify-end p-8 md:p-16 relative z-10">
        <div 
          ref={mechanicsRef} 
          onClick={() => onNavigate('mechanics')}
          className="max-w-2xl text-right cursor-pointer group relative"
        >
          {/* Interactive Background Cue */}
          <div className="absolute -inset-10 bg-white/0 group-hover:bg-white/[0.03] transition-all duration-500 rounded-3xl -z-10" />

          <div className="flex justify-between items-start mb-8">
             <div className="text-xs font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 -translate-x-4 group-hover:translate-x-0">
                <MousePointer2 className="w-3 h-3" /> VIEW SCHEMATICS
             </div>
             <div className="text-xs font-mono text-gray-500 tracking-widest uppercase">/// 02. Operational Mechanics</div>
          </div>

          <h2 className="font-display text-4xl md:text-6xl leading-tight mb-12 text-gray-100 group-hover:text-white transition-colors">
            HOW IT <span className="text-gray-500 group-hover:text-gray-400 transition-colors">WORKS</span>
          </h2>
          
          <div className="grid gap-8">
            <div className="group/item p-6 border border-gray-900 hover:border-gray-600 transition-all bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-end gap-4 mb-3">
                <h3 className="text-xl font-bold group-hover/item:text-emerald-400 transition-colors">Camera Vision</h3>
                <Scan className="w-5 h-5 text-gray-400 icon-animate opacity-0 group-hover/item:text-emerald-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The interface is the browser via camera. No downloads required.
              </p>
            </div>

            <div className="group/item p-6 border border-gray-900 hover:border-gray-600 transition-all bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-end gap-4 mb-3">
                <h3 className="text-xl font-bold group-hover/item:text-emerald-400 transition-colors">Launch Modes</h3>
                <Smartphone className="w-5 h-5 text-gray-400 icon-animate opacity-0 group-hover/item:text-emerald-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Activate via link, QR code, printed ticket, or SMS. Instant access.
              </p>
            </div>

            <div className="group/item p-6 border border-gray-900 hover:border-gray-600 transition-all bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-end gap-4 mb-3">
                <h3 className="text-xl font-bold group-hover/item:text-emerald-400 transition-colors">Augmented Cloud</h3>
                <Cloud className="w-5 h-5 text-gray-400 icon-animate opacity-0 group-hover/item:text-emerald-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dynamic content creation, automated campaigns, and actionable insights.
              </p>
            </div>

            <div className="group/item p-6 border border-gray-900 hover:border-gray-600 transition-all bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-end gap-4 mb-3">
                <h3 className="text-xl font-bold group-hover/item:text-emerald-400 transition-colors">Interactive UI/UX</h3>
                <Layers className="w-5 h-5 text-gray-400 icon-animate opacity-0 group-hover/item:text-emerald-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Customizable experiences: games, banners, and event activations embedded in AR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY KANEK (Value Prop) --- */}
      <section className="w-full min-h-screen flex items-center p-8 md:p-16 relative z-10">
        <div 
          ref={advantageRef} 
          onClick={() => onNavigate('advantage')}
          className="max-w-4xl cursor-pointer group relative"
        >
           {/* Interactive Background Cue */}
           <div className="absolute -inset-10 bg-white/0 group-hover:bg-white/[0.03] transition-all duration-500 rounded-3xl -z-10" />

           <div className="flex justify-between items-start mb-8">
             <div className="text-xs font-mono text-gray-500 mb-8 tracking-widest uppercase">/// 03. The Advantage</div>
             <div className="text-xs font-mono text-amber-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 translate-x-4 group-hover:translate-x-0">
                EXPLORE ADVANTAGE <MousePointer2 className="w-3 h-3" />
             </div>
           </div>

            <h2 className="font-display text-4xl md:text-7xl leading-[0.9] mb-16 text-white group-hover:text-amber-50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500">
              WHY <span className="text-gray-600 group-hover:text-amber-500/50 transition-colors">KANEK?</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 group-hover:border-amber-500/20 transition-colors">
              <div className="border-t border-gray-800 pt-6 group-hover:border-amber-900 transition-colors">
                 <Lightning className="w-8 h-8 text-white mb-4 icon-animate opacity-0 group-hover:text-amber-500 transition-colors" />
                 <h4 className="font-display text-lg mb-2 text-white">Seamless Entry</h4>
                 <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                   Uses the native smartphone camera. No friction, no app store barriers.
                 </p>
              </div>
              
              <div className="border-t border-gray-800 pt-6 group-hover:border-amber-900 transition-colors">
                 <Layers className="w-8 h-8 text-white mb-4 icon-animate opacity-0 group-hover:text-amber-500 transition-colors" />
                 <h4 className="font-display text-lg mb-2 text-white">Easy Integration</h4>
                 <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                   Integrates with existing systems. Scalable and cost-effective architecture.
                 </p>
              </div>

              <div className="border-t border-gray-800 pt-6 group-hover:border-amber-900 transition-colors">
                 <BarChart3 className="w-8 h-8 text-white mb-4 icon-animate opacity-0 group-hover:text-amber-500 transition-colors" />
                 <h4 className="font-display text-lg mb-2 text-white">Full Lifecycle</h4>
                 <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                   Focus on acquisition + retention via loyalty-driven AR experiences.
                 </p>
              </div>

               <div className="border-t border-gray-800 pt-6 group-hover:border-amber-900 transition-colors">
                 <Zap className="w-8 h-8 text-white mb-4 icon-animate opacity-0 group-hover:text-amber-500 transition-colors" />
                 <h4 className="font-display text-lg mb-2 text-white">Experience Economy</h4>
                 <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                   Unlike general AR platforms, we obsess over guest engagement and loyalty.
                 </p>
              </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <section className="w-full min-h-[50vh] flex flex-col justify-center items-center p-8 md:p-16 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-black/90">
        <div ref={footerContentRef} className="text-center max-w-4xl">
          <h2 className="font-display text-5xl md:text-8xl font-bold tracking-tighter mb-8">
            START NOW
          </h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">
            No app. No friction. Just results.
          </p>
          <button 
            onClick={() => onNavigate('contact')}
            className="px-12 py-4 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
          >
            Connect With Us
          </button>
        </div>
        
        <div className="mt-auto w-full flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-600 pt-24">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 icon-animate opacity-0" />
            <span>Global Infrastructure</span>
          </div>
          <div className="mt-4 md:mt-0">
            &copy; 2024 KANEK TECHNOLOGIES. ALL RIGHTS RESERVED.
          </div>
        </div>
      </section>

    </div>
  );
}

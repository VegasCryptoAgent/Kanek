
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Mail, MapPin, MessageSquare, Terminal, Radio, Loader2 } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  onBack: () => void;
}

export const ContactPage: React.FC<Props> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Entrance Animation
  useEffect(() => {
    const tl = gsap.timeline();
    
    gsap.set([leftPanelRef.current, rightPanelRef.current], { opacity: 0, y: 20 });
    
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
      .to(leftPanelRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to(rightPanelRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6");
      
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate network request
    setTimeout(() => {
      setFormState('sent');
    }, 2000);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-30 w-full h-full text-white overflow-hidden bg-gradient-to-bl from-indigo-950 via-black to-black">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-indigo-500/10 blur-[100px] rounded-full" />
      </div>

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-4 py-2 border border-white/10 bg-black/40 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-[0.2em] text-indigo-400/80 group-hover:text-indigo-400">TERMINATE_UPLINK</span>
        </button>

        <div className="flex items-center gap-4 font-mono text-[10px] text-indigo-400/60 tracking-widest">
          <span className="flex items-center gap-2">
            <Radio className="w-3 h-3 animate-pulse" /> SIGNAL_STRENGTH: 100%
          </span>
          <span className="hidden md:inline">::</span>
          <span className="hidden md:inline">ENCRYPTED_CHANNEL</span>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="w-full h-full flex flex-col md:flex-row pt-24 pb-12 px-8 md:px-16 gap-12 md:gap-24 items-center justify-center">
        
        {/* LEFT PANEL - INFO */}
        <div ref={leftPanelRef} className="w-full md:w-1/3 flex flex-col gap-8 pointer-events-auto relative z-10">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                    <span className="font-mono text-indigo-400 text-xs tracking-widest uppercase">Transmission Protocol</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold leading-none mb-6">
                    INITIATE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-white">CONTACT</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                    Ready to deploy? Our team is standing by to integrate the future of AR into your infrastructure.
                </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
                <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/5 hover:border-indigo-500/30 transition-colors rounded-lg">
                    <MapPin className="w-5 h-5 text-indigo-400 mt-1" />
                    <div>
                        <h4 className="font-bold text-sm mb-1">Headquarters</h4>
                        <p className="text-xs text-gray-400 font-mono">
                            34.0522° N, 118.2437° W<br/>
                            Los Angeles, CA
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-white/5 bg-white/5 hover:border-indigo-500/30 transition-colors rounded-lg">
                    <Mail className="w-5 h-5 text-indigo-400 mt-1" />
                    <div>
                        <h4 className="font-bold text-sm mb-1">Direct Line</h4>
                        <p className="text-xs text-gray-400 font-mono">
                            hello@kanektech.com<br/>
                            PGP Key: 0x4A1B...
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div ref={rightPanelRef} className="w-full md:w-1/2 max-w-xl pointer-events-auto relative">
            {/* Form Container */}
            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                
                {/* Decorative Terminal Header */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <div className="ml-auto font-mono text-[10px] text-gray-400">msg_compose.exe</div>
                </div>

                {formState === 'sent' ? (
                     <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500">
                            <Terminal className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">TRANSMISSION SENT</h3>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Your packet has been successfully delivered to our relay node. We will respond shortly.
                        </p>
                        <button 
                            onClick={() => setFormState('idle')} 
                            className="mt-8 text-xs font-mono text-indigo-400 hover:text-white underline underline-offset-4"
                        >
                            SEND_NEW_MESSAGE
                        </button>
                     </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="group">
                            <label className="block text-[10px] font-mono text-indigo-300/70 mb-2 uppercase tracking-wider">Identity // Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-white/5 border border-white/10 rounded p-4 text-white outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all font-mono text-sm"
                                placeholder="_"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-mono text-indigo-300/70 mb-2 uppercase tracking-wider">Comms // Email</label>
                            <input 
                                type="email" 
                                required
                                className="w-full bg-white/5 border border-white/10 rounded p-4 text-white outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all font-mono text-sm"
                                placeholder="user@domain.com"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-mono text-indigo-300/70 mb-2 uppercase tracking-wider">Payload // Message</label>
                            <textarea 
                                rows={4}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded p-4 text-white outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all font-mono text-sm resize-none"
                                placeholder="Describe your objective..."
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={formState === 'sending'}
                            className="group relative w-full py-4 bg-indigo-600 hover:bg-indigo-500 transition-all rounded overflow-hidden flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {formState === 'sending' ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    <span className="font-mono text-xs font-bold tracking-widest">ENCRYPTING...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-mono text-xs font-bold tracking-widest">SEND TRANSMISSION</span>
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

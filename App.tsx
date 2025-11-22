
import React, { Suspense, useRef, useState } from 'react';
import { CanvasContainer } from './components/CanvasContainer';
import { Overlay } from './components/Overlay';
import { DigitalAirspacePage } from './components/DigitalAirspacePage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { WhyKanekPage } from './components/WhyKanekPage';
import { ContactPage } from './components/ContactPage';

export type ViewState = 'home' | 'airspace' | 'mechanics' | 'advantage' | 'contact';

const App: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [view, setView] = useState<ViewState>('home');

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Normalized scroll 0 to 1
    const maxScroll = scrollHeight - clientHeight;
    scrollProgress.current = maxScroll > 0 ? scrollTop / maxScroll : 0;
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden">
      {/* The 3D Scene Background - Persistent */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-xs tracking-widest uppercase opacity-50">Initializing Core...</div>}>
          <CanvasContainer scrollProgress={scrollProgress} view={view} />
        </Suspense>
      </div>

      {/* The UI Overlay - Conditional Render */}
      {view === 'home' && (
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          <Overlay onNavigate={setView} />
        </div>
      )}

      {/* The Digital Airspace Page Overlay */}
      {view === 'airspace' && (
        <DigitalAirspacePage onBack={() => setView('home')} />
      )}

      {/* The How It Works Page Overlay */}
      {view === 'mechanics' && (
        <HowItWorksPage onBack={() => setView('home')} />
      )}

      {/* The Why Kanek Page Overlay */}
      {view === 'advantage' && (
        <WhyKanekPage onBack={() => setView('home')} />
      )}

      {/* The Contact Page Overlay */}
      {view === 'contact' && (
        <ContactPage onBack={() => setView('home')} />
      )}

      {/* Noise/Grain Overlay Texture */}
      <div className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.min.css")`, filter: 'contrast(300%) brightness(100%)' }}>
      </div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
    </div>
  );
};

export default App;

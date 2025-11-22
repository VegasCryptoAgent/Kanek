
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { DitheredShape } from './DitheredShape';
import { Particles } from './Particles';
import { AirspaceGeometry } from './AirspaceGeometry';
import { SchematicRing } from './SchematicRing';
import * as THREE from 'three';
import { ViewState } from '../App';
import { PresentationControls } from '@react-three/drei';

interface Props {
  scrollProgress: React.MutableRefObject<number>;
  view: ViewState;
}

export const Scene: React.FC<Props> = ({ scrollProgress, view }) => {
  const { mouse, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Default initialization
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let targetRotY = 0;
      let targetRotX = 0;

      if (view === 'airspace') {
        // --- AIRSPACE VIEW LOGIC ---
        // Move object to the right side to allow UI on the left
        targetX = 3.5; 
        targetY = 0.5;
        targetZ = 0; 

        // Continuous slow rotation
        const t = state.clock.getElapsedTime();
        targetRotY = t * 0.2;
        targetRotX = Math.sin(t * 0.5) * 0.2;
        
      } else if (view === 'mechanics') {
        // --- MECHANICS VIEW LOGIC (How It Works) ---
        // Move object to the LEFT side to allow UI on the RIGHT
        targetX = -3.5;
        targetY = 0.5;
        targetZ = 0;

        const t = state.clock.getElapsedTime();
        // More technical, rigid rotation
        targetRotY = t * 0.15 + Math.PI; // Flip it around
        targetRotX = Math.cos(t * 0.3) * 0.1;

      } else if (view === 'advantage') {
        // --- ADVANTAGE VIEW LOGIC (Why Kanek) ---
        // Move object to the FAR RIGHT
        targetX = 4.0;
        targetY = 0;
        targetZ = 0.5;

        const t = state.clock.getElapsedTime();
        // Fast, energetic rotation
        targetRotY = t * 0.5;
        targetRotX = Math.sin(t) * 0.3;

      } else if (view === 'contact') {
        // --- CONTACT VIEW LOGIC ---
        // Center, slightly zoomed
        targetX = 0;
        targetY = 0.5;
        targetZ = 1; // Zoom in

        const t = state.clock.getElapsedTime();
        // Slow, steady, confident rotation
        targetRotY = t * 0.1;
        targetRotX = Math.sin(t * 0.2) * 0.1;

      } else {
        // --- HOME VIEW LOGIC (Scroll based) ---
        const scroll = scrollProgress.current;
        
        // Base mouse interaction (strongest when at top of page)
        const mouseInfluence = Math.max(0, 1 - scroll * 3); 
        const mouseX = (mouse.x * viewport.width) / 10;
        const mouseY = (mouse.y * viewport.height) / 10;

        targetX = mouseX * mouseInfluence;
        targetY = mouseY * mouseInfluence;

        // Scroll Choreography
        if (scroll > 0.15 && scroll <= 0.35) {
          // Section 2: Digital Airspace (Move Right to balance Left text)
          targetX = 3.5;
          targetY = 0;
          targetZ = -2;
        } else if (scroll > 0.35 && scroll <= 0.65) {
          // Section 3: How It Works (Move Left to balance Right text)
          targetX = -3.5;
          targetY = 0.5;
          targetZ = -1.5;
        } else if (scroll > 0.65 && scroll <= 0.85) {
          // Section 4: Why Kanek (Move Right again or Center High)
          targetX = 3.0;
          targetY = -1.0;
          targetZ = -1;
        } else if (scroll > 0.85) {
           // Footer: Center and Zoom
           targetX = 0;
           targetY = 0;
           targetZ = 2.5;
        }

        // Rotation: Mouse tilt + Scroll spin
        targetRotY = (mouse.x * 0.5 * mouseInfluence) + (scroll * Math.PI * 4);
        targetRotX = (-mouse.y * 0.5 * mouseInfluence) + (scroll * Math.PI);
      }

      // Smoothly interpolate position
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.04);
      
      // Interactivity Fix
      if (view !== 'mechanics') {
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      } else {
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI, 0.05);
          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
      }
    }
  });

  // Determine Light Color based on View
  const getLightColor = () => {
    switch(view) {
      case 'mechanics': return "#10b981";
      case 'advantage': return "#f59e0b";
      case 'contact': return "#6366f1"; // Indigo
      default: return "#4ade80";
    }
  };

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* Lights - mostly for the shader to pick up directional vectors */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight 
        position={[-5, -5, -5]} 
        intensity={0.5} 
        color={getLightColor()} 
      />
      
      {/* Background Particles */}
      <Particles />
      
      {/* Airspace Grid Terrain - Only visible in Airspace view */}
      <AirspaceGeometry visible={view === 'airspace'} />

      <group ref={groupRef}>
          <PresentationControls
            enabled={true} // Always enabled, but most useful in specific views
            global={false} // Spin locally
            cursor={true}
            snap={view === 'mechanics'} // Snap back in mechanics view for that "precision" feel
            speed={1.5}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]} // Vertical limits
            azimuth={[-Math.PI, Math.PI]} // Horizontal limits
          >
            <DitheredShape view={view} />
            {/* Schematic Rings - Attached to the object in Mechanics view */}
            <SchematicRing visible={view === 'mechanics'} />
          </PresentationControls>
      </group>
    </>
  );
};

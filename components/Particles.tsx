import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Particles: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 500; // Number of particles

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Random positions in a large area
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Colors - subtle mix of white and brand green
      if (Math.random() > 0.8) {
          color.setHex(0x4ade80); // Green accent
      } else {
          color.setHex(0x666666); // Dark Grey
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
        // Gentle drift/rotation
        const t = state.clock.getElapsedTime();
        ref.current.rotation.x = t * 0.02;
        ref.current.rotation.y = t * 0.03;
        
        // Optional: Pulse size or opacity in shader material if we used one, 
        // but simple rotation is enough for "drifting".
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
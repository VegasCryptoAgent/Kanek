import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { ViewState } from '../App';

interface Props {
  scrollProgress: React.MutableRefObject<number>;
  view: ViewState;
}

export const CanvasContainer: React.FC<Props> = ({ scrollProgress, view }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]} // Optimization for high DPI screens
      gl={{ 
        antialias: false, // Disable AA because we are dithering
        alpha: false,
        preserveDrawingBuffer: true
      }}
    >
      <Scene scrollProgress={scrollProgress} view={view} />
    </Canvas>
  );
};
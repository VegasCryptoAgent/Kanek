
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  visible: boolean;
}

const fragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Grid Logic
    vec2 gridUv = vUv * 40.0; // Grid density
    
    // Moving the grid lines to simulate speed
    gridUv.y += uTime * 2.0; 
    
    // Create grid lines
    float thickness = 0.05;
    float x = fract(gridUv.x);
    float y = fract(gridUv.y);
    
    float grid = step(1.0 - thickness, x) + step(1.0 - thickness, y);
    
    // Fade grid into distance (top of screen is y=1 in UV usually, but let's use distance from center-bottom)
    float dist = distance(vUv, vec2(0.5, 0.0));
    float alpha = grid * (1.0 - smoothstep(0.0, 0.8, vUv.y)) * uOpacity;

    // Add a "horizon" glow
    float horizon = 1.0 - smoothstep(0.0, 0.1, abs(vUv.y - 0.5));
    
    vec3 finalColor = uColor + (vElevation * 2.0); // Brighten peaks

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  // Simplex noise for terrain
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Create rolling terrain effect
    // We move the noise sampling coordinate with time to simulate forward movement
    float noise = snoise(uv * 6.0 + vec2(0.0, -uTime * 0.5));
    
    // Elevate only based on noise, more pronounced at edges
    float elevation = noise * 1.5 * smoothstep(0.2, 0.8, abs(uv.x - 0.5) * 2.0);
    
    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const AirspaceGeometry: React.FC<Props> = ({ visible }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uColor: { value: new THREE.Color('#00ffff') }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Smoothly transition opacity based on visibility
      const targetOpacity = visible ? 0.6 : 0.0;
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        targetOpacity,
        0.05
      );
    }
    
    // Subtle sway
    if (meshRef.current) {
        meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2.2, 0, 0]} 
      position={[0, -2.5, -5]}
      scale={[2, 2, 2]}
    >
      <planeGeometry args={[60, 60, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={false} // Prevents z-fighting with particles sometimes
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

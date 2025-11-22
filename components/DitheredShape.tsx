
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ViewState } from '../App';
import gsap from 'gsap';

// Vertex Shader: Handles shape distortion (liquid metal effect)
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uDistortionSpeed;
  uniform float uDistortionStrength;

  // Simplex noise function (simplified)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Distort position based on noise
    float noiseVal = snoise(position * 0.8 + uTime * uDistortionSpeed);
    vec3 newPos = position + normal * noiseVal * uDistortionStrength;
    
    vPosition = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

// Fragment Shader: Handles Dithering and Lighting
const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1; // Dark
  uniform vec3 uColor2; // Light/Accent

  // Bayer Matrix 4x4 for ordered dithering
  float dither4x4(vec2 position, float brightness) {
      int x = int(mod(position.x, 4.0));
      int y = int(mod(position.y, 4.0));
      int index = x + y * 4;
      float limit = 0.0;

      if (x < 8) {
          if (index == 0) limit = 0.0625;
          if (index == 1) limit = 0.5625;
          if (index == 2) limit = 0.1875;
          if (index == 3) limit = 0.6875;
          if (index == 4) limit = 0.8125;
          if (index == 5) limit = 0.3125;
          if (index == 6) limit = 0.9375;
          if (index == 7) limit = 0.4375;
          if (index == 8) limit = 0.25;
          if (index == 9) limit = 0.75;
          if (index == 10) limit = 0.125;
          if (index == 11) limit = 0.625;
          if (index == 12) limit = 1.0;
          if (index == 13) limit = 0.5;
          if (index == 14) limit = 0.875;
          if (index == 15) limit = 0.375;
      }

      return brightness < limit ? 0.0 : 1.0;
  }

  void main() {
    // Simple lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Rim light - animated slightly with time
    float fresnel = pow(1.0 - max(dot(normalize(vPosition), normalize(vNormal)), 0.0), 3.0);
    
    // Combine lighting
    float lighting = diff + fresnel * 0.5;
    
    // Map position to pixel coordinates for dithering
    vec2 pixelPos = gl_FragCoord.xy;
    
    // Apply dither
    float ditherVal = dither4x4(pixelPos, lighting);
    
    // Final Color Mix
    vec3 finalColor = mix(uColor1, uColor2, ditherVal);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface Props {
    view?: ViewState;
}

export const DitheredShape: React.FC<Props> = ({ view = 'home' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uColor1: { value: new THREE.Color('#0a0a0a') }, // Dark background
    uColor2: { value: new THREE.Color('#e2e2e2') }, // Light/Highlight
    uDistortionSpeed: { value: 0.3 },
    uDistortionStrength: { value: 0.4 }
  }), []);

  // Effect to handle view transitions
  useEffect(() => {
    if (!materialRef.current) return;

    const uColor2 = materialRef.current.uniforms.uColor2.value;
    
    let targetColor = '#e2e2e2'; // Default White
    let targetStrength = 0.4;
    let targetSpeed = 0.3;

    if (view === 'airspace') {
        targetColor = '#00ffff'; // Cyan
        targetStrength = 0.7;
        targetSpeed = 0.8;
    } else if (view === 'mechanics') {
        targetColor = '#10b981'; // Emerald Green
        targetStrength = 0.2; // Less distortion for "solid engineering" look
        targetSpeed = 0.1;
    } else if (view === 'advantage') {
        targetColor = '#f59e0b'; // Amber
        targetStrength = 0.9; // High volatility/energy
        targetSpeed = 1.2; // Very fast
    } else if (view === 'contact') {
        targetColor = '#6366f1'; // Indigo/Violet
        targetStrength = 0.3; // Calm, wavelike
        targetSpeed = 0.5;
    }

    gsap.to(uColor2, {
      r: new THREE.Color(targetColor).r,
      g: new THREE.Color(targetColor).g,
      b: new THREE.Color(targetColor).b,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    gsap.to(materialRef.current.uniforms.uDistortionStrength, {
        value: targetStrength,
        duration: 2,
        ease: 'elastic.out(1, 0.75)'
    });

    gsap.to(materialRef.current.uniforms.uDistortionSpeed, {
        value: targetSpeed,
        duration: 1.5,
        ease: 'power2.out'
    });

  }, [view]);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Rotate slightly faster in sub-pages
      const rotSpeed = view === 'home' ? 0.05 : 0.1;
      meshRef.current.rotation.z += rotSpeed * 0.1; 
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[1.8, 1.8, 1.8]}>
      <icosahedronGeometry args={[1, 60]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};


import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  visible: boolean;
}

export const SchematicRing: React.FC<Props> = ({ visible }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Ring 1: Large slow outer ring
  const ring1Ref = useRef<THREE.Mesh>(null);
  // Ring 2: Middle rapid ring
  const ring2Ref = useRef<THREE.Mesh>(null);
  // Ring 3: Inner Dashed ring
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Visibility transition
    if (groupRef.current) {
      const targetScale = visible ? 1 : 0;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
      
      // If barely visible, hide to save performance
      groupRef.current.visible = groupRef.current.scale.x > 0.01;
    }

    if (visible && groupRef.current && groupRef.current.visible) {
        if (ring1Ref.current) {
            ring1Ref.current.rotation.z = t * 0.05;
            ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.1;
        }
        if (ring2Ref.current) {
             ring2Ref.current.rotation.z = -t * 0.2;
             ring2Ref.current.rotation.y = Math.cos(t * 0.5) * 0.1;
        }
        if (ring3Ref.current) {
             ring3Ref.current.rotation.z = t * 0.1;
             // Pulse scale
             const s = 1 + Math.sin(t * 2) * 0.02;
             ring3Ref.current.scale.set(s, s, s);
        }
    }
  });

  return (
    <group ref={groupRef} position={[-3.5, 0.5, 0]} rotation={[0, 0, 0]}>
        {/* Ring 1 - Thin large Orbit */}
        <mesh ref={ring1Ref}>
            <torusGeometry args={[3.2, 0.01, 16, 100]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
        </mesh>

        {/* Ring 2 - Tilted scanner */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.8, 0.02, 16, 100]} />
            <meshBasicMaterial color="#34d399" transparent opacity={0.5} wireframe />
        </mesh>

        {/* Ring 3 - Dashed Technical circle */}
        {/* We use a lot of segments and wireframe to simulate tech look or points */}
        <points ref={ring3Ref}>
            <torusGeometry args={[2.2, 0.05, 16, 60]} />
            <pointsMaterial color="#10b981" size={0.05} sizeAttenuation transparent opacity={0.6} />
        </points>

        {/* Vertical Axis Line */}
        <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 8, 8]} />
            <meshBasicMaterial color="#065f46" transparent opacity={0.2} />
        </mesh>
    </group>
  );
};

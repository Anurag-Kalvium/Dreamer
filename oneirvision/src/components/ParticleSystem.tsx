import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  spread?: number;
  size?: number;
  color?: string;
  opacity?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 6800,
  spread = 500,
  size = 0.5,
  color = '#ffffff',
  opacity = 0.6
}) => {
  const particlesRef = useRef<THREE.Points>(null);

  // Create particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    
    return positions;
  }, [count, spread]);

  // Create particle material
  const material = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/textures/particle.png');
    
    return new THREE.PointsMaterial({
      color: color,
      size: size,
      map: texture,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
  }, [color, size, opacity]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.00002;
      particlesRef.current.rotation.x += 0.00005;
      particlesRef.current.rotation.z += 0.00001;
    }
  });

  return (
    <points ref={particlesRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
};

export default ParticleSystem;
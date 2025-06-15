import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface TubeGeometryProps {
  scrollProgress: number;
}

function TubeGeometry({ scrollProgress }: TubeGeometryProps) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Create tube path
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 5, -20),
    new THREE.Vector3(-5, 10, -40),
    new THREE.Vector3(15, -5, -60),
    new THREE.Vector3(-10, 15, -80),
    new THREE.Vector3(5, -10, -100),
    new THREE.Vector3(20, 0, -120),
    new THREE.Vector3(-15, 20, -140),
    new THREE.Vector3(0, -15, -160),
    new THREE.Vector3(25, 10, -180),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 16, false);

  // Create particles
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = Math.random() * -200;
  }

  useFrame((state) => {
    if (tubeRef.current && particlesRef.current && lightRef.current) {
      // Animate tube rotation
      tubeRef.current.rotation.z = scrollProgress * Math.PI * 2;
      
      // Animate particles
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;
      
      // Move light along the tube
      const lightPosition = curve.getPointAt(scrollProgress * 0.8);
      lightRef.current.position.copy(lightPosition);
      
      // Animate tube material
      if (tubeRef.current.material instanceof THREE.MeshStandardMaterial) {
        tubeRef.current.material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <group>
      {/* Main Tube */}
      <mesh ref={tubeRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#8A2BE2"
          emissive="#4A0E4E"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe Tube */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#00BFFF"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FFFFFF"
          size={0.5}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Dynamic Light */}
      <pointLight
        ref={lightRef}
        color="#00BFFF"
        intensity={2}
        distance={50}
        decay={2}
      />

      {/* Ambient Light */}
      <ambientLight intensity={0.2} />

      {/* Content Elements */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 0, -50]}
          fontSize={3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Dreams
        </Text>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.7}>
        <Text
          position={[10, 5, -100]}
          fontSize={2.5}
          color="#8A2BE2"
          anchorX="center"
          anchorY="middle"
        >
          Visualize
        </Text>
      </Float>

      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <Text
          position={[-8, -3, -150]}
          fontSize={2}
          color="#00BFFF"
          anchorX="center"
          anchorY="middle"
        >
          Discover
        </Text>
      </Float>
    </group>
  );
}

interface TubeScrollAnimationProps {
  className?: string;
}

const TubeScrollAnimation: React.FC<TubeScrollAnimationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tube-container relative w-full h-screen overflow-hidden ${className}`}
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center center',
      }}
    >
      {/* Vignette Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(13, 4, 27, 0.8) 100%)',
          }}
        />
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        style={{
          background: 'transparent',
        }}
      >
        <TubeGeometry scrollProgress={scrollProgressRef.current} />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#0D041B', 50, 200]} />
      </Canvas>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
            Journey Through Your Dreams
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 opacity-80">
            Experience the infinite possibilities of your subconscious mind
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-sm">
        <div className="flex flex-col items-center">
          <span className="mb-2">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default TubeScrollAnimation;
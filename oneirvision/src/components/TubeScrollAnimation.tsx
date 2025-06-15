import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface TubeGeometryProps {
  scrollProgress: number;
  isFullscreen: boolean;
  onJourneyComplete: () => void;
}

function TubeGeometry({ scrollProgress, isFullscreen, onJourneyComplete }: TubeGeometryProps) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Create tube path based on the provided points
  const points = [
    new THREE.Vector3(10, 0, 89),
    new THREE.Vector3(50, 10, 88),
    new THREE.Vector3(76, 20, 139),
    new THREE.Vector3(126, 12, 141),
    new THREE.Vector3(150, 8, 112),
    new THREE.Vector3(157, 0, 73),
    new THREE.Vector3(180, 5, 44),
    new THREE.Vector3(207, 10, 35),
    new THREE.Vector3(232, 0, 36),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  curve.tension = 0.5;

  const tubeGeometry = new THREE.TubeGeometry(curve, 300, 4, 32, false);
  const innerTubeGeometry = new THREE.TubeGeometry(curve, 150, 3.4, 32, false);

  // Create particles
  const particleCount = 6800;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 500;
  }

  useFrame((state) => {
    if (tubeRef.current && lightRef.current && cameraGroupRef.current) {
      // Update camera position along the tube path
      const p1 = curve.getPointAt(scrollProgress);
      const p2 = curve.getPointAt(Math.min(scrollProgress + 0.03, 1));
      
      if (isFullscreen) {
        cameraGroupRef.current.position.copy(p1);
        cameraGroupRef.current.lookAt(p2);
        lightRef.current.position.copy(p2);
      }

      // Animate tube material
      if (tubeRef.current.material instanceof THREE.MeshPhongMaterial) {
        const texture = tubeRef.current.material.map;
        if (texture) {
          texture.offset.x += 0.004;
        }
      }

      // Check if journey is complete
      if (scrollProgress >= 0.96 && isFullscreen) {
        onJourneyComplete();
      }
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.00002;
      particlesRef.current.rotation.x += 0.00005;
      particlesRef.current.rotation.z += 0.00001;
    }
  });

  return (
    <group>
      {/* Camera Group for fullscreen mode */}
      <group ref={cameraGroupRef} position={[0, 0, isFullscreen ? 0 : 400]}>
        {!isFullscreen && <primitive object={camera} />}
      </group>

      {/* Main Tube */}
      <mesh ref={tubeRef} geometry={tubeGeometry}>
        <meshPhongMaterial
          side={THREE.BackSide}
          color="#194794"
          shininess={20}
          specular="#0b2349"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner Wireframe Tube */}
      <lineSegments geometry={new THREE.EdgesGeometry(innerTubeGeometry)}>
        <lineBasicMaterial
          color="#ffffff"
          linewidth={2}
          opacity={0.2}
          transparent
        />
      </lineSegments>

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
          color="#ffffff"
          size={0.5}
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dynamic Light */}
      <pointLight
        ref={lightRef}
        color="#ffffff"
        intensity={0.35}
        distance={4}
        decay={0}
        castShadow
      />

      {/* Ambient Light */}
      <ambientLight intensity={0.2} />

      {/* Fog */}
      <fog attach="fog" args={['#194794', 0, 100]} />

      {/* Content Elements - only show when not in fullscreen */}
      {!isFullscreen && (
        <>
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
        </>
      )}
    </group>
  );
}

interface TubeScrollAnimationProps {
  className?: string;
}

const TubeScrollAnimation: React.FC<TubeScrollAnimationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // Fullscreen API compatibility
  const requestFullscreen = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      return (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      return (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      return (element as any).msRequestFullscreen();
    }
    return Promise.reject('Fullscreen not supported');
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      return (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      return (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      return (document as any).msExitFullscreen();
    }
    return Promise.reject('Exit fullscreen not supported');
  };

  const handleClick = async () => {
    if (!containerRef.current || isTransitioning) return;

    setIsTransitioning(true);
    
    try {
      await requestFullscreen(containerRef.current);
      setIsFullscreen(true);
      
      // Reset scroll progress and start the journey
      scrollProgressRef.current = 0;
      
      // Create scroll target for fullscreen mode
      const scrollTarget = document.createElement('div');
      scrollTarget.className = 'fullscreen-scroll-target';
      scrollTarget.style.height = '1000vh';
      scrollTarget.style.position = 'absolute';
      scrollTarget.style.top = '0';
      scrollTarget.style.width = '1px';
      scrollTarget.style.zIndex = '-1';
      document.body.appendChild(scrollTarget);

      // Setup GSAP ScrollTrigger for fullscreen mode
      const tubePerc = { percent: 0 };
      
      gsap.timeline({
        scrollTrigger: {
          trigger: scrollTarget,
          start: "top top",
          end: "bottom 100%",
          scrub: 1,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress * 0.96;
          }
        }
      }).to(tubePerc, {
        percent: 0.96,
        ease: "none",
        duration: 1
      });

    } catch (error) {
      console.warn('Fullscreen not supported or denied');
      setIsFullscreen(true); // Continue with pseudo-fullscreen
    }
    
    setIsTransitioning(false);
  };

  const handleJourneyComplete = async () => {
    setIsTransitioning(true);
    
    // Smooth transition out
    gsap.to(scrollProgressRef, {
      current: 1,
      duration: 1,
      ease: "power2.out",
      onComplete: async () => {
        try {
          await exitFullscreen();
        } catch (error) {
          console.warn('Exit fullscreen failed');
        }
        
        setIsFullscreen(false);
        
        // Clean up scroll target
        const scrollTarget = document.querySelector('.fullscreen-scroll-target');
        if (scrollTarget) {
          scrollTarget.remove();
        }
        
        // Navigate to analyze page
        setTimeout(() => {
          navigate('/analyze');
        }, 500);
      }
    });
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      if (!isCurrentlyFullscreen && isFullscreen && !isTransitioning) {
        setIsFullscreen(false);
        // Clean up scroll target
        const scrollTarget = document.querySelector('.fullscreen-scroll-target');
        if (scrollTarget) {
          scrollTarget.remove();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isFullscreen, isTransitioning]);

  // Setup initial scroll trigger for non-fullscreen mode
  useEffect(() => {
    if (!containerRef.current || isFullscreen) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          if (!isFullscreen) {
            scrollProgressRef.current = self.progress;
          }
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`tube-container relative w-full h-screen overflow-hidden cursor-pointer ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
      }`}
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center center',
      }}
      onClick={!isFullscreen ? handleClick : undefined}
    >
      {/* Vignette Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: isFullscreen 
              ? 'radial-gradient(circle, transparent 60%, black 150%)'
              : 'radial-gradient(circle, transparent 40%, rgba(13, 4, 27, 0.8) 100%)',
          }}
        />
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: isFullscreen ? [0, 0, 0] : [0, 0, 10],
          fov: 45,
          near: 0.001,
          far: 200,
        }}
        style={{
          background: 'transparent',
        }}
        gl={{
          antialias: true,
          shadowMap: true,
        }}
      >
        <TubeGeometry 
          scrollProgress={scrollProgressRef.current} 
          isFullscreen={isFullscreen}
          onJourneyComplete={handleJourneyComplete}
        />
      </Canvas>

      {/* Content Overlay - only show when not in fullscreen */}
      {!isFullscreen && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
              Journey Through Your Dreams
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 opacity-80">
              Experience the infinite possibilities of your subconscious mind
            </p>
            <div className="pointer-events-auto">
              <button 
                onClick={handleClick}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                disabled={isTransitioning}
              >
                {isTransitioning ? 'Entering...' : 'Enter the Tube'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Instructions */}
      {isFullscreen && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-sm">
          <div className="flex flex-col items-center">
            <span className="mb-2">Scroll to journey through your dreams</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
          </div>
        </div>
      )}

      {/* Scroll Indicator for non-fullscreen */}
      {!isFullscreen && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-sm">
          <div className="flex flex-col items-center">
            <span className="mb-2">Click to enter immersive mode</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TubeScrollAnimation;
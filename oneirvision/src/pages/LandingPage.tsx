import { useEffect, useRef } from 'react';
// @ts-ignore
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Stars, Float, Text3D } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';


const FloatingIcons = () => {
  const icons = [
    { icon: '🌙', position: [10, 5, 0] },
    { icon: '🔍', position: [-8, 3, 0] },
    { icon: '📊', position: [5, -4, 0] },
    { icon: '📖', position: [-12, -6, 0] },
  ];

  return (
    <>
      {icons.map((item, i) => (
        <Float
          key={i}
          speed={2 + Math.random() * 2}
          rotationIntensity={2}
          floatIntensity={1}
          position={item.position as [number, number, number]}
        >
          <Text3D
            size={1.5}
            height={0.1}
            font={"/fonts/helvetiker_regular.typeface.json"}
            bevelEnabled
            bevelSize={0.02}
            bevelThickness={0.02}
            curveSegments={12}
          >
            {item.icon}
            {/* @ts-ignore */}
            <meshStandardMaterial attach="material" color="#8b5cf6" />
          </Text3D>
        </Float>
      ))}
    </>
  );
};

const LandingPage = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      [titleRef.current, subtitleRef.current, ctaRef.current],
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      }
    );
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingIcons />
          <Stars radius={50} count={1000} factor={4} fade speed={2} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <h1
            ref={titleRef}
            className="mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-5xl font-bold text-transparent opacity-0 md:text-7xl lg:text-8xl"
          >
            Unlock Your Dreams
          </h1>
          <p
            ref={subtitleRef}
            className="mb-12 text-xl text-gray-300 opacity-0 md:text-2xl"
          >
            Discover the hidden meanings behind your dreams with our AI-powered interpretation platform.
          </p>
          <div ref={ctaRef} className="opacity-0">
            <Link
              to="/auth/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
            >
              <span className="relative z-10 flex items-center">
                Start Dreaming Free
                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 transition-opacity group-hover:opacity-100"></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

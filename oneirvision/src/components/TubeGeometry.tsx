import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TubeGeometryComponentProps {
  path: THREE.CatmullRomCurve3;
  scrollProgress: number;
  isFullscreen: boolean;
  onPositionUpdate?: (position: THREE.Vector3, lookAt: THREE.Vector3) => void;
}

export const TubeGeometryComponent: React.FC<TubeGeometryComponentProps> = ({
  path,
  scrollProgress,
  isFullscreen,
  onPositionUpdate
}) => {
  const tubeRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  // Create geometries
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(path, 300, 4, 32, false), [path]);
  const innerTubeGeometry = useMemo(() => new THREE.TubeGeometry(path, 150, 3.4, 32, false), [path]);
  const wireframeGeometry = useMemo(() => new THREE.EdgesGeometry(innerTubeGeometry), [innerTubeGeometry]);

  // Create materials
  const tubeMaterial = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/textures/space-texture.jpg');
    const bumpMap = loader.load('/textures/waveform-bump.jpg');
    
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15, 2);
    
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(15, 2);

    return new THREE.MeshPhongMaterial({
      side: THREE.BackSide,
      map: texture,
      shininess: 20,
      bumpMap: bumpMap,
      bumpScale: -0.03,
      specular: 0x0b2349,
      transparent: true,
      opacity: 0.8
    });
  }, []);

  const wireframeMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2,
    opacity: 0.2,
    transparent: true
  }), []);

  useFrame((state) => {
    // Update camera position along path
    if (isFullscreen && onPositionUpdate) {
      const p1 = path.getPointAt(scrollProgress);
      const p2 = path.getPointAt(Math.min(scrollProgress + 0.03, 1));
      onPositionUpdate(p1, p2);
    }

    // Animate texture
    if (tubeRef.current?.material instanceof THREE.MeshPhongMaterial) {
      const texture = tubeRef.current.material.map;
      if (texture) {
        texture.offset.x += 0.004;
      }
    }

    // Animate tube rotation
    if (tubeRef.current) {
      tubeRef.current.rotation.z = scrollProgress * Math.PI * 2;
    }
  });

  return (
    <group>
      {/* Main Tube */}
      <mesh ref={tubeRef} geometry={tubeGeometry} material={tubeMaterial} />
      
      {/* Wireframe Tube */}
      <lineSegments ref={wireframeRef} geometry={wireframeGeometry} material={wireframeMaterial} />
    </group>
  );
};

export default TubeGeometryComponent;
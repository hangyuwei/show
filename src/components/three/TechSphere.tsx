'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const TECH_LIST = [
  'TypeScript',
  'React',
  'Next.js',
  'Vue',
  'Three.js',
  'Python',
  'LangChain',
  'Spring Boot',
  'Docker',
  'MySQL',
  'Redis',
  'Streamlit',
  'Pandas',
  'PyTorch',
  'FastAPI',
  'Tailwind CSS',
  'GSAP',
  'Git',
];

const SPHERE_RADIUS = 2.5;

interface TechTagProps {
  label: string;
  position: [number, number, number];
}

function TechTag({ label, position }: TechTagProps) {
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <div className="px-2 py-1 rounded-full border border-blue-400/30 bg-blue-900/20 backdrop-blur-sm">
        <span className="text-[10px] sm:text-xs font-medium text-blue-200 whitespace-nowrap">
          {label}
        </span>
      </div>
    </Html>
  );
}

function WireframeSphere() {
  const geometry = useMemo(
    () => new THREE.SphereGeometry(SPHERE_RADIUS - 0.1, 24, 24),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#1a3a5c',
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <mesh geometry={geometry} material={material} />;
}

function TechSphereScene() {
  const tagPositions = useMemo(() => {
    const positions: { label: string; pos: [number, number, number] }[] = [];
    const count = TECH_LIST.length;
    // Fibonacci sphere distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY * SPHERE_RADIUS;
      const yPos = y * SPHERE_RADIUS;
      const z = Math.sin(theta) * radiusAtY * SPHERE_RADIUS;

      positions.push({
        label: TECH_LIST[i],
        pos: [x, yPos, z],
      });
    }
    return positions;
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <group>
        {/* Wireframe sphere as background */}
        <WireframeSphere />

        {tagPositions.map(({ label, pos }) => (
          <TechTag key={label} label={label} position={pos} />
        ))}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}

export default function TechSphere() {
  return (
    <div className="w-full h-full min-h-[400px] sm:min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <TechSphereScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

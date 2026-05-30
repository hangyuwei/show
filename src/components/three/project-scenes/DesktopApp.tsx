'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'desktop-app';

function FloatingWindow({ position, color, rotationSpeed }: { position: [number, number, number]; color: string; rotationSpeed: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1.5, 1), []);
  const frameGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.52, 1.02, 0.02)), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.3,
        side: THREE.DoubleSide,
      }),
    [color]
  );
  const frameMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#e2e8f0'),
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * rotationSpeed + position[0]) * 0.2;
      meshRef.current.rotation.y = Math.sin(t * rotationSpeed * 0.5) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh geometry={geometry} material={material} />
      <lineSegments geometry={frameGeometry} material={frameMaterial} />
    </group>
  );
}

export default function DesktopApp() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} />
      <FloatingWindow position={[-1.2, 0.5, 0]} color="#3b82f6" rotationSpeed={0.8} />
      <FloatingWindow position={[0.8, -0.3, 0.5]} color="#8b5cf6" rotationSpeed={1.1} />
      <FloatingWindow position={[-0.3, -0.8, -0.3]} color="#06b6d4" rotationSpeed={0.9} />
      <FloatingWindow position={[1.5, 1.0, -0.4]} color="#f59e0b" rotationSpeed={1.3} />
    </group>
  );
}

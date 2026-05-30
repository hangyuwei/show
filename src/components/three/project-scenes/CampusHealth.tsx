'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'campus-health';

function Building({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#10b981'),
        roughness: 0.4,
        metalness: 0.2,
      }),
    []
  );

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry} material={material} />
  );
}

function Roof({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  const geometry = useMemo(
    () => new THREE.ConeGeometry(0.75, 0.5, 4),
    []
  );
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#059669'),
        roughness: 0.5,
        metalness: 0.1,
      }),
    []
  );

  return <mesh position={position} scale={scale} geometry={geometry} material={material} rotation={[0, Math.PI / 4, 0]} />;
}

function Ground() {
  const geometry = useMemo(() => new THREE.PlaneGeometry(12, 12), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#34d399'),
        roughness: 0.8,
        metalness: 0,
      }),
    []
  );
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} geometry={geometry} material={material} />;
}

export default function CampusHealth() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
      <Ground />
      <Building position={[-2, 0, 0]} scale={[1.2, 2, 1.2]} />
      <Roof position={[-2, 1.25, 0]} scale={[1, 1, 1]} />
      <Building position={[1.5, -0.3, -1]} scale={[1.8, 1.4, 1]} />
      <Roof position={[1.5, 0.7, -1]} scale={[1.5, 1, 1]} />
      <Building position={[0, -0.5, 1.5]} scale={[0.8, 1, 0.8]} />
      <Roof position={[0, 0.2, 1.5]} scale={[0.7, 0.8, 0.7]} />
      <Building position={[-1, 0.5, -1.8]} scale={[0.6, 2.5, 0.6]} />
      <Roof position={[-1, 1.9, -1.8]} scale={[0.5, 0.6, 0.5]} />
    </group>
  );
}

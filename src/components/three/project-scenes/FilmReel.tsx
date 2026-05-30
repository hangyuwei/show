'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'film-reel';

function Reel({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const outerGeometry = useMemo(() => new THREE.TorusGeometry(0.8, 0.08, 8, 32), []);
  const innerGeometry = useMemo(() => new THREE.TorusGeometry(0.3, 0.06, 8, 32), []);
  const hubGeometry = useMemo(() => new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16), []);
  const spokeGeometry = useMemo(() => new THREE.BoxGeometry(0.05, 0.05, 1.0), []);

  const outerMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color('#374151'), roughness: 0.4, metalness: 0.7 }),
    []
  );
  const innerMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color('#4b5563'), roughness: 0.4, metalness: 0.6 }),
    []
  );
  const hubMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color('#6b7280'), roughness: 0.3, metalness: 0.8 }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={outerGeometry} material={outerMaterial} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={innerGeometry} material={innerMaterial} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={hubGeometry} material={hubMaterial} rotation={[Math.PI / 2, 0, 0]} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          geometry={spokeGeometry}
          material={hubMaterial}
          rotation={[0, 0, (i / 6) * Math.PI * 2]}
        />
      ))}
    </group>
  );
}

function FilmStrip() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(5, 0.3), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1f2937'),
        roughness: 0.6,
        metalness: 0.3,
        side: THREE.DoubleSide,
      }),
    []
  );

  return <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]} geometry={geometry} material={material} />;
}

function SprocketHoles() {
  const groupRef = useRef<THREE.Group>(null);
  const holeGeo = useMemo(() => new THREE.PlaneGeometry(0.08, 0.08), []);
  const holeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fbbf24'),
        emissive: new THREE.Color('#f59e0b'),
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={i}
          geometry={holeGeo}
          material={holeMat}
          position={[-2.4 + i * 0.25, 0.1, 0.01]}
        />
      ))}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={`b${i}`}
          geometry={holeGeo}
          material={holeMat}
          position={[-2.4 + i * 0.25, -0.1, 0.01]}
        />
      ))}
    </group>
  );
}

export default function FilmReel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 3]} intensity={0.8} color="#fbbf24" />
      <Reel position={[-2, 0, 0]} />
      <Reel position={[2, 0, 0]} />
      <FilmStrip />
      <SprocketHoles />
    </group>
  );
}

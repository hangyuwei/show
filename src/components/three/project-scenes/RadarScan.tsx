'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'radar-scan';

function RadarBase() {
  const geometry = useMemo(() => new THREE.CylinderGeometry(1.5, 1.5, 0.05, 64), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0f172a'),
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );
  return <mesh position={[0, -0.025, 0]} geometry={geometry} material={material} />;
}

function RadarRings() {
  const groupRef = useRef<THREE.Group>(null);

  const lineObjs = useMemo(() => {
    const lines: THREE.Line[] = [];
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color('#22d3ee'),
      transparent: true,
      opacity: 0.3,
    });
    [0.5, 1.0, 1.5].forEach((radius) => {
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(new THREE.Line(geo, material));
    });
    return lines;
  }, []);

  useEffect(() => {
    return () => {
      lineObjs.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    };
  }, [lineObjs]);

  return (
    <group ref={groupRef} position={[0, 0.01, 0]}>
      {lineObjs.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </group>
  );
}

function ScanLine() {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#22d3ee'),
        emissive: new THREE.Color('#06b6d4'),
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      }),
    []
  );
  const geometry = useMemo(() => new THREE.PlaneGeometry(1.5, 0.02), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.02, 0]}>
      <mesh geometry={geometry} material={material} position={[0.75, 0, 0]} />
    </group>
  );
}

function Blip({ angle, distance }: { angle: number; distance: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.04, 8, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#22d3ee'),
        emissive: new THREE.Color('#06b6d4'),
        emissiveIntensity: 0.8,
      }),
    []
  );

  const pos = useMemo((): [number, number, number] => {
    return [Math.cos(angle) * distance, 0.03, Math.sin(angle) * distance];
  }, [angle, distance]);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 3 + angle) * 0.4;
    }
  });

  return <mesh ref={meshRef} position={pos} geometry={geometry} material={material} />;
}

function GlowBase() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.CircleGeometry(1.5, 64), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0ea5e9'),
        emissive: new THREE.Color('#0284c7'),
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      }),
    []
  );
  return <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} geometry={geometry} material={material} />;
}

export default function RadarScan() {
  const groupRef = useRef<THREE.Group>(null);
  const blips = useMemo(
    () => [
      { angle: 0.5, distance: 0.7 },
      { angle: 2.1, distance: 1.1 },
      { angle: 3.8, distance: 0.4 },
      { angle: 5.2, distance: 1.3 },
      { angle: 1.2, distance: 0.9 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = -0.5;
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#22d3ee" />
      <RadarBase />
      <GlowBase />
      <RadarRings />
      <ScanLine />
      {blips.map((blip, i) => (
        <Blip key={i} angle={blip.angle} distance={blip.distance} />
      ))}
    </group>
  );
}

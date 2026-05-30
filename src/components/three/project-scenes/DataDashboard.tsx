'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'data-dashboard';

const BAR_COUNT = 12;
const BAR_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

function Bar({ position, targetHeight, color }: { position: [number, number, number]; targetHeight: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(0.35, 1, 0.35), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const float = Math.sin(t * 2 + position[0] * 2) * 0.15;
      meshRef.current.position.y = (targetHeight / 2) + float;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], targetHeight / 2, position[2]]}
      scale={[1, targetHeight, 1]}
      geometry={geometry}
      material={material}
    />
  );
}

function DataLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
    return geo;
  }, [start, end]);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color('#60a5fa'), transparent: true, opacity: 0.6 }),
    []
  );
  const lineObj = useMemo(() => {
    const l = new THREE.Line(geometry, material);
    return l;
  }, [geometry, material]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material, lineObj]);

  return <primitive object={lineObj} />;
}

export default function DataDashboard() {
  const groupRef = useRef<THREE.Group>(null);
  const heights = useMemo(() => Array.from({ length: BAR_COUNT }, () => 0.5 + Math.random() * 2.5), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 3]} intensity={1} color="#818cf8" />
      {heights.map((h, i) => {
        const x = (i - BAR_COUNT / 2) * 0.5;
        return (
          <Bar
            key={i}
            position={[x, 0, 0]}
            targetHeight={h}
            color={BAR_COLORS[i % BAR_COLORS.length]}
          />
        );
      })}
      <DataLine start={[-(BAR_COUNT / 2) * 0.5, 0, 0.3]} end={[(BAR_COUNT / 2 - 1) * 0.5, 0, 0.3]} />
      <DataLine start={[-(BAR_COUNT / 2) * 0.5, 0, -0.3]} end={[(BAR_COUNT / 2 - 1) * 0.5, 0, -0.3]} />
    </group>
  );
}

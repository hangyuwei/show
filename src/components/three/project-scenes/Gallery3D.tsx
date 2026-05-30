'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'gallery-3d';

const FRAME_COUNT = 8;
const RADIUS = 2.5;
const FRAME_WIDTH = 0.8;
const FRAME_HEIGHT = 0.6;

const FRAME_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

function Frame({ angle, index }: { angle: number; index: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const backGeometry = useMemo(() => new THREE.PlaneGeometry(FRAME_WIDTH, FRAME_HEIGHT), []);
  const borderGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(FRAME_WIDTH + 0.05, FRAME_HEIGHT + 0.05, 0.02)), []);

  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(FRAME_COLORS[index % FRAME_COLORS.length]),
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      }),
    [index]
  );
  const borderMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#e2e8f0'),
      }),
    []
  );

  useEffect(() => {
    return () => { backGeometry.dispose(); borderGeometry.dispose(); backMaterial.dispose(); borderMaterial.dispose(); };
  }, [backGeometry, borderGeometry, backMaterial, borderMaterial]);

  const x = Math.cos(angle) * RADIUS;
  const z = Math.sin(angle) * RADIUS;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.8 + index * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      <mesh geometry={backGeometry} material={backMaterial} />
      <lineSegments geometry={borderGeometry} material={borderMaterial} />
    </group>
  );
}

function CenterPiece() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.3, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fbbf24'),
        emissive: new THREE.Color('#f59e0b'),
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.6,
        wireframe: true,
      }),
    []
  );

  useEffect(() => {
    return () => { geometry.dispose(); material.dispose(); };
  }, [geometry, material]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.015;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function Gallery3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const angles = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, i) => (i / FRAME_COUNT) * Math.PI * 2),
    []
  );

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#fbbf24" />
      {angles.map((angle, i) => (
        <Frame key={i} angle={angle} index={i} />
      ))}
      <CenterPiece />
    </group>
  );
}

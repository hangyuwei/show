'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'tai-chi';

function YinHemisphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e1e2e'),
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );
  useEffect(() => {
    return () => { geometry.dispose(); material.dispose(); };
  }, [geometry, material]);
  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

function YangHemisphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f0f0f0'),
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );
  useEffect(() => {
    return () => { geometry.dispose(); material.dispose(); };
  }, [geometry, material]);
  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

function YinDot() {
  const geometry = useMemo(() => new THREE.SphereGeometry(0.18, 16, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f0f0f0'),
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );
  useEffect(() => {
    return () => { geometry.dispose(); material.dispose(); };
  }, [geometry, material]);
  return <mesh position={[0, 0.5, 0]} geometry={geometry} material={material} />;
}

function YangDot() {
  const geometry = useMemo(() => new THREE.SphereGeometry(0.18, 16, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e1e2e'),
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );
  useEffect(() => {
    return () => { geometry.dispose(); material.dispose(); };
  }, [geometry, material]);
  return <mesh position={[0, -0.5, 0]} geometry={geometry} material={material} />;
}

function GlowRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.TorusGeometry(1.05, 0.02, 8, 64), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8b5cf6'),
        emissive: new THREE.Color('#7c3aed'),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      material.opacity = 0.4 + Math.sin(t * 2) * 0.2;
    }
  });

  useEffect(() => {
    return () => { geometry.dispose(); material.dispose(); };
  }, [geometry, material]);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function TaiChi() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 2]} intensity={0.8} color="#c084fc" />
      <pointLight position={[-2, -1, -2]} intensity={0.5} color="#818cf8" />
      <YinHemisphere />
      <YangHemisphere />
      <YinDot />
      <YangDot />
      <GlowRing />
    </group>
  );
}

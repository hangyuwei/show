'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'music-box';

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.4, 32, 32), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fbbf24'),
        emissive: new THREE.Color('#f59e0b'),
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.4,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

function Planet({ orbitRadius, speed, size, color, emissiveColor }: {
  orbitRadius: number;
  speed: number;
  size: number;
  color: string;
  emissiveColor: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(size, 16, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(emissiveColor),
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.5,
      }),
    [color, emissiveColor]
  );

  useFrame((state) => {
    if (orbitRef.current) {
      const t = state.clock.getElapsedTime();
      orbitRef.current.rotation.y = t * speed;
    }
    if (meshRef.current) {
      meshRef.current.position.x = orbitRadius;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color('#4b5563'), transparent: true, opacity: 0.3 }),
    []
  );
  const lineObj = useMemo(() => {
    const l = new THREE.Line(geometry, material);
    return l;
  }, [geometry, material]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material, lineObj]);

  return <primitive object={lineObj} />;
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions } = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return { positions: pos };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color('#fbbf24'),
        size: 0.03,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      }),
    []
  );

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function MusicBox() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 2]} intensity={1} color="#fbbf24" />
      <Sun />
      <OrbitRing radius={1.2} />
      <OrbitRing radius={1.8} />
      <OrbitRing radius={2.5} />
      <Planet orbitRadius={1.2} speed={1.0} size={0.12} color="#ef4444" emissiveColor="#dc2626" />
      <Planet orbitRadius={1.8} speed={0.6} size={0.18} color="#3b82f6" emissiveColor="#2563eb" />
      <Planet orbitRadius={2.5} speed={0.35} size={0.14} color="#10b981" emissiveColor="#059669" />
      <Particles />
    </group>
  );
}

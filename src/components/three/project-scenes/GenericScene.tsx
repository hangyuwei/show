'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'generic';

interface GenericSceneProps {
  primaryColor?: string;
  secondaryColor?: string;
  variant?: 'float' | 'spin' | 'pulse';
}

function FloatingCubes({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 8;
  const cubeGeo = useMemo(() => new THREE.BoxGeometry(0.3, 0.3, 0.3), []);
  const mat1 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(primaryColor), roughness: 0.3, metalness: 0.5 }),
    [primaryColor]
  );
  const mat2 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(secondaryColor), roughness: 0.3, metalness: 0.5 }),
    [secondaryColor]
  );

  useEffect(() => {
    return () => {
      cubeGeo.dispose();
      mat1.dispose();
      mat2.dispose();
    };
  }, [cubeGeo, mat1, mat2]);

  const positions = useMemo(() => {
    const result: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.2 + Math.random() * 0.5;
      result.push([Math.cos(angle) * r, (Math.random() - 0.5) * 1.5, Math.sin(angle) * r]);
    }
    return result;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.children.forEach((child, i) => {
        child.position.y = positions[i][1] + Math.sin(t * 0.8 + i * 0.7) * 0.2;
        child.rotation.x = t * 0.5 + i;
        child.rotation.z = t * 0.3 + i;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={cubeGeo} material={i % 2 === 0 ? mat1 : mat2} />
      ))}
    </group>
  );
}

function CentralSphere({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.5, 2), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.2,
        metalness: 0.6,
        wireframe: true,
      }),
    [color]
  );

  useEffect(() => {
    return () => { geo.dispose(); mat.dispose(); };
  }, [geo, mat]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
    }
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} />;
}

function RingParticles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { geometry, material } = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.0 + (Math.random() - 0.5) * 0.3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    return { geometry: geo, material: mat };
  }, [color]);

  useEffect(() => {
    return () => { geometry.dispose(); material.dispose(); };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function GenericScene({ primaryColor = '#6366f1', secondaryColor = '#8b5cf6' }: GenericSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.8} color={primaryColor} />
      <pointLight position={[-3, -1, -2]} intensity={0.4} color={secondaryColor} />
      <CentralSphere color={primaryColor} />
      <FloatingCubes primaryColor={primaryColor} secondaryColor={secondaryColor} />
      <RingParticles color={secondaryColor} />
    </group>
  );
}

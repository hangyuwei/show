'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface SatelliteConfig {
  name: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
}

interface ProjectPlanetProps {
  name: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  isMainPlanet: boolean;
  satellites?: SatelliteConfig[];
}

function PlanetMesh({
  name,
  color,
  size,
  isMainPlanet,
}: {
  name: string;
  color: string;
  size: number;
  isMainPlanet: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(1);
  const currentEmissiveIntensity = useRef(isMainPlanet ? 0.3 : 0.1);

  const colorObj = useMemo(() => new THREE.Color(color), [color]);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, isMainPlanet ? 32 : 16, isMainPlanet ? 32 : 16), [isMainPlanet]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: colorObj,
        emissive: colorObj,
        emissiveIntensity: isMainPlanet ? 0.3 : 0.1,
        roughness: 0.4,
        metalness: 0.3,
      }),
    [colorObj, isMainPlanet],
  );

  const glowGeometry = useMemo(
    () => new THREE.SphereGeometry(1.15, 32, 32),
    [],
  );
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      }),
    [colorObj],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
    };
  }, [geometry, material, glowGeometry, glowMaterial]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += delta * 0.5;

    const scaleTarget = hovered ? 1.3 : 1;
    targetScale.current = scaleTarget;
    const s = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(s, targetScale.current, delta * 5);
    meshRef.current.scale.setScalar(newScale);

    const emissiveTarget = hovered ? 0.8 : isMainPlanet ? 0.3 : 0.1;
    currentEmissiveIntensity.current = THREE.MathUtils.lerp(
      currentEmissiveIntensity.current,
      emissiveTarget,
      delta * 5,
    );
    material.emissiveIntensity = currentEmissiveIntensity.current;

    if (glowRef.current) {
      glowRef.current.scale.setScalar(newScale);
    }
    glowMaterial.opacity = hovered ? 0.3 : 0.15;
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        scale={size}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      />
      <mesh
        ref={glowRef}
        geometry={glowGeometry}
        material={glowMaterial}
        scale={size * 1.15}
      />
      <Html
        center
        distanceFactor={10}
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0,
          visibility: hovered ? 'visible' : 'hidden',
          transition: 'opacity 0.2s ease, visibility 0.2s ease',
        }}
      >
        <div className="rounded-lg bg-black/80 px-3 py-1.5 text-sm text-white backdrop-blur-sm border border-white/10">
          {name}
        </div>
      </Html>
    </group>
  );
}

function Satellite({
  config,
  parentColor,
}: {
  config: SatelliteConfig;
  parentColor: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(config.orbitOffset);

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(parentColor).lerp(new THREE.Color('#ffffff'), 0.3),
        emissive: new THREE.Color(parentColor),
        emissiveIntensity: 0.05,
        roughness: 0.5,
        metalness: 0.2,
      }),
    [parentColor],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    angleRef.current += config.orbitSpeed * delta;
    meshRef.current.rotation.y += delta * 1.0;
    meshRef.current.position.x = Math.cos(angleRef.current) * config.orbitRadius;
    meshRef.current.position.z = Math.sin(angleRef.current) * config.orbitRadius;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      scale={config.size}
    />
  );
}

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.15,
      }),
    [color],
  );

  const lineObj = useMemo(
    () => new THREE.LineLoop(geometry, material),
    [geometry, material],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive object={lineObj} />;
}

export default function ProjectPlanet({
  name,
  color,
  size,
  orbitRadius,
  orbitSpeed,
  isMainPlanet,
  satellites = [],
}: ProjectPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    angleRef.current += orbitSpeed * delta;
    groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
    groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
  });

  return (
    <>
      <OrbitRing radius={orbitRadius} color={color} />
      <group ref={groupRef}>
        <PlanetMesh name={name} color={color} size={size} isMainPlanet={isMainPlanet} />
        {satellites.map((sat) => (
          <Satellite key={sat.name} config={sat} parentColor={color} />
        ))}
      </group>
    </>
  );
}

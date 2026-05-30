'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'dna-helix';

const HELIX_POINTS = 80;
const HELIX_RADIUS = 0.8;
const HELIX_HEIGHT = 4;

function HelixStrand({ offset }: { offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < HELIX_POINTS; i++) {
      const t = i / HELIX_POINTS;
      const angle = t * Math.PI * 6 + offset;
      const x = Math.cos(angle) * HELIX_RADIUS;
      const y = (t - 0.5) * HELIX_HEIGHT;
      const z = Math.sin(angle) * HELIX_RADIUS;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, HELIX_POINTS * 2, 0.04, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(offset === 0 ? '#8b5cf6' : '#ec4899'),
      roughness: 0.3,
      metalness: 0.5,
    });
    return { geometry: tubeGeo, material: tubeMat };
  }, [offset]);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

function CrossLinks() {
  const meshRef = useRef<THREE.Group>(null);

  const lineObjs = useMemo(() => {
    const lines: THREE.Line[] = [];
    for (let i = 0; i < HELIX_POINTS; i += 6) {
      const t = i / HELIX_POINTS;
      const angle1 = t * Math.PI * 6;
      const angle2 = angle1 + Math.PI;
      const y = (t - 0.5) * HELIX_HEIGHT;
      const start = new THREE.Vector3(
        Math.cos(angle1) * HELIX_RADIUS,
        y,
        Math.sin(angle1) * HELIX_RADIUS
      );
      const end = new THREE.Vector3(
        Math.cos(angle2) * HELIX_RADIUS,
        y,
        Math.sin(angle2) * HELIX_RADIUS
      );
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const mat = new THREE.LineBasicMaterial({ color: new THREE.Color('#c084fc'), transparent: true, opacity: 0.5 });
      lines.push(new THREE.Line(geo, mat));
    }
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
    <group ref={meshRef}>
      {lineObjs.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </group>
  );
}

function NucleotideSpheres() {
  const groupRef = useRef<THREE.Group>(null);
  const spheres = useMemo(() => {
    const result: { position: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < HELIX_POINTS; i += 4) {
      const t = i / HELIX_POINTS;
      const y = (t - 0.5) * HELIX_HEIGHT;
      for (const offset of [0, Math.PI]) {
        const angle = t * Math.PI * 6 + offset;
        result.push({
          position: [
            Math.cos(angle) * HELIX_RADIUS,
            y,
            Math.sin(angle) * HELIX_RADIUS,
          ],
          color: offset === 0 ? '#a78bfa' : '#f472b6',
        });
      }
    }
    return result;
  }, []);

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.06, 8, 8), []);
  const materials = useMemo(
    () => ({
      purple: new THREE.MeshStandardMaterial({ color: new THREE.Color('#a78bfa'), roughness: 0.3, metalness: 0.6 }),
      pink: new THREE.MeshStandardMaterial({ color: new THREE.Color('#f472b6'), roughness: 0.3, metalness: 0.6 }),
    }),
    []
  );

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh
          key={i}
          position={s.position}
          geometry={sphereGeo}
          material={s.color === '#a78bfa' ? materials.purple : materials.pink}
        />
      ))}
    </group>
  );
}

export default function DnaHelix() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 2]} intensity={0.8} color="#c084fc" />
      <pointLight position={[-2, -1, -2]} intensity={0.5} color="#ec4899" />
      <HelixStrand offset={0} />
      <HelixStrand offset={Math.PI} />
      <CrossLinks />
      <NucleotideSpheres />
    </group>
  );
}

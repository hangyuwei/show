'use client';

import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarParticlesProps {
  count: number;
}

function StarParticles({ count }: StarParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 50 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const isBlue = Math.random() > 0.7;
      if (isBlue) {
        col[i * 3] = 0.7 + Math.random() * 0.3;
        col[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 2] = 1.0;
      } else {
        const brightness = 0.9 + Math.random() * 0.1;
        col[i * 3] = brightness;
        col[i * 3 + 1] = brightness;
        col[i * 3 + 2] = brightness;
      }
    }

    return { positions: pos, colors: col };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );
      geometryRef.current.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3),
      );
    }
  }, [positions, colors]);

  useEffect(() => {
    const geo = geometryRef.current;
    return () => {
      geo?.dispose();
      material.dispose();
    };
  }, [material]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <primitive object={material} attach="material" />
    </points>
  );
}

function StarFieldScene({ particleCount }: { particleCount: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <StarParticles count={particleCount} />
    </>
  );
}

export default function StarField() {
  const [particleCount, setParticleCount] = useState(1200);

  useEffect(() => {
    setParticleCount(window.innerWidth < 768 ? 500 : 1200);
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <StarFieldScene particleCount={particleCount} />
        </Suspense>
      </Canvas>
    </div>
  );
}

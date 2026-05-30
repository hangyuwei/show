'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GridLineProps {
  points: THREE.Vector3[];
  color: string;
  speed: number;
}

function GridLine({ points, color, speed }: GridLineProps) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const progressRef = useRef(0);

  const lineObj = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
    return new THREE.Line(geometry, material);
  }, [points, color]);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * speed) % 1;

    const mat = materialRef.current ?? lineObj.material as THREE.LineBasicMaterial;
    mat.opacity = 0.08 + Math.sin(progressRef.current * Math.PI) * 0.12;
  });

  // Sync material ref
  materialRef.current = lineObj.material as THREE.LineBasicMaterial;

  return <primitive object={lineObj} />;
}

interface PulsePointProps {
  position: [number, number, number];
  speed: number;
  color: string;
}

function PulsePoint({ position, speed, color }: PulsePointProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(Math.random());

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * speed) % 1;

    if (meshRef.current) {
      const scale = 0.02 + Math.sin(tRef.current * Math.PI) * 0.04;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} />
    </mesh>
  );
}

interface DataFlowSceneProps {
  lowPerformance?: boolean;
}

function DataFlowScene({ lowPerformance = false }: DataFlowSceneProps) {
  const gridLines = useMemo(() => {
    const lines: { points: THREE.Vector3[]; color: string; speed: number }[] = [];
    const pulses: { position: [number, number, number]; speed: number; color: string }[] = [];

    const gridSize = lowPerformance ? 8 : 14;
    const spacing = 2;
    const half = (gridSize * spacing) / 2;

    const lineColor = '#3b82f6';

    // Horizontal lines
    for (let i = 0; i <= gridSize; i++) {
      const z = i * spacing - half;
      const pts = [
        new THREE.Vector3(-half, 0, z),
        new THREE.Vector3(half, 0, z),
      ];
      lines.push({ points: pts, color: lineColor, speed: 0.15 + Math.random() * 0.1 });
    }

    // Vertical lines
    for (let i = 0; i <= gridSize; i++) {
      const x = i * spacing - half;
      const pts = [
        new THREE.Vector3(x, 0, -half),
        new THREE.Vector3(x, 0, half),
      ];
      lines.push({ points: pts, color: lineColor, speed: 0.15 + Math.random() * 0.1 });
    }

    // Pulse points at intersections (sampled for performance)
    const pulseStep = lowPerformance ? 4 : 3;
    for (let i = 0; i <= gridSize; i += pulseStep) {
      for (let j = 0; j <= gridSize; j += pulseStep) {
        const x = i * spacing - half;
        const z = j * spacing - half;
        pulses.push({
          position: [x, 0, z],
          speed: 0.3 + Math.random() * 0.5,
          color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6',
        });
      }
    }

    return { lines, pulses };
  }, [lowPerformance]);

  return (
    <>
      <group rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, 0]}>
        {gridLines.lines.map((line, i) => (
          <GridLine key={`line-${i}`} {...line} />
        ))}
        {gridLines.pulses.map((pulse, i) => (
          <PulsePoint key={`pulse-${i}`} {...pulse} />
        ))}
      </group>
    </>
  );
}

interface DataFlowGridProps {
  lowPerformance?: boolean;
}

export default function DataFlowGrid({ lowPerformance = false }: DataFlowGridProps) {
  const isLowPerf = lowPerformance || (typeof window !== 'undefined' && window.innerWidth < 768);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 12, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <DataFlowScene lowPerformance={isLowPerf} />
        </Suspense>
      </Canvas>
    </div>
  );
}

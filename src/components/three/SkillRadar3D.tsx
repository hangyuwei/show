'use client';

import { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

interface SkillDimension {
  label: string;
  value: number;
}

const SKILLS: SkillDimension[] = [
  { label: '全栈开发', value: 0.9 },
  { label: 'AI应用', value: 0.8 },
  { label: '数据分析', value: 0.85 },
  { label: '行业知识', value: 0.9 },
  { label: '项目管理', value: 0.75 },
  { label: '创意设计', value: 0.7 },
];

const RADAR_RADIUS = 2;
const GRID_RINGS = 4;
const ANGLE_STEP = (Math.PI * 2) / SKILLS.length;
const LABEL_POSITIONS = [
  'left-1/2 top-4 -translate-x-1/2 sm:top-6',
  'right-3 top-[26%] sm:right-6',
  'right-3 bottom-[26%] sm:right-6',
  'left-1/2 bottom-4 -translate-x-1/2 sm:bottom-6',
  'left-3 bottom-[26%] sm:left-6',
  'left-3 top-[26%] sm:left-6',
] as const;

function skillAngle(index: number): number {
  return Math.PI / 2 - index * ANGLE_STEP;
}

function polarToCartesian(angle: number, radius: number): [number, number, number] {
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
}

function RadarGrid() {
  const geometries = useMemo(() => {
    const rings: Float32Array[] = [];
    for (let ring = 1; ring <= GRID_RINGS; ring++) {
      const r = (ring / GRID_RINGS) * RADAR_RADIUS;
      const points: number[] = [];
      for (let i = 0; i <= SKILLS.length; i++) {
        const angle = skillAngle(i % SKILLS.length);
        const [x, y, z] = polarToCartesian(angle, r);
        points.push(x, y, z);
      }
      rings.push(new Float32Array(points));
    }
    return rings;
  }, []);

  const spokes = useMemo(() => {
    return SKILLS.map((_, i) => {
      const angle = skillAngle(i);
      const [x, y, z] = polarToCartesian(angle, RADAR_RADIUS);
      return new Float32Array([0, 0, z, x, y, z]);
    });
  }, []);

  const ringMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#4a90d9', transparent: true, opacity: 0.25 }),
    [],
  );
  const spokeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#4a90d9', transparent: true, opacity: 0.2 }),
    [],
  );

  useEffect(() => {
    return () => {
      ringMaterial.dispose();
      spokeMaterial.dispose();
    };
  }, [ringMaterial, spokeMaterial]);

  return (
    <group>
      {geometries.map((positions, i) => (
        <line key={`ring-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <primitive object={ringMaterial} attach="material" />
        </line>
      ))}
      {spokes.map((positions, i) => (
        <line key={`spoke-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <primitive object={spokeMaterial} attach="material" />
        </line>
      ))}
    </group>
  );
}

function RadarFill() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    SKILLS.forEach((skill, i) => {
      const angle = skillAngle(i);
      const r = skill.value * RADAR_RADIUS;
      const [x, y] = polarToCartesian(angle, r);
      if (i === 0) {
        s.moveTo(x, y);
      } else {
        s.lineTo(x, y);
      }
    });
    s.closePath();
    return s;
  }, []);

  const shapeGeo = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  const fillMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#4a90d9',
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      shapeGeo.dispose();
      fillMat.dispose();
    };
  }, [shapeGeo, fillMat]);

  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0.01]} geometry={shapeGeo} material={fillMat} />
  );
}

function RadarGlowEdge() {
  const positions = useMemo(() => {
    const verts: number[] = [];
    SKILLS.forEach((skill, i) => {
      const angle = skillAngle(i);
      const r = skill.value * RADAR_RADIUS;
      const [x, y, z] = polarToCartesian(angle, r);
      verts.push(x, y, z);
    });
    // Close the shape
    const firstAngle = skillAngle(0);
    const firstR = SKILLS[0].value * RADAR_RADIUS;
    const [fx, fy, fz] = polarToCartesian(firstAngle, firstR);
    verts.push(fx, fy, fz);
    return new Float32Array(verts);
  }, []);

  const edgeMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#6cb4ee', transparent: true, opacity: 0.9, linewidth: 2 }),
    [],
  );

  useEffect(() => {
    return () => {
      edgeMat.dispose();
    };
  }, [edgeMat]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <primitive object={edgeMat} attach="material" />
    </line>
  );
}

function RadarVertexDots() {
  const positions = useMemo(() => {
    return SKILLS.map((skill, i) => {
      const angle = skillAngle(i);
      const r = skill.value * RADAR_RADIUS;
      return polarToCartesian(angle, r);
    });
  }, []);

  const sharedGeo = useMemo(() => new THREE.SphereGeometry(0.04, 16, 16), []);
  const sharedMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#6cb4ee' }), []);

  useEffect(() => {
    return () => {
      sharedGeo.dispose();
      sharedMat.dispose();
    };
  }, [sharedGeo, sharedMat]);

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={`dot-${i}`} position={pos} geometry={sharedGeo} material={sharedMat} />
      ))}
    </group>
  );
}

function RadarScene() {
  return (
    <group>
      <RadarGrid />
      <RadarFill />
      <RadarGlowEdge />
      <RadarVertexDots />
    </group>
  );
}

function SkillLabel({
  skill,
  className,
}: {
  skill: SkillDimension;
  className: string;
}) {
  return (
    <div
      className={`absolute min-w-16 rounded-full border border-sky-300/20 bg-slate-950/55 px-2.5 py-1 text-center shadow-[0_0_18px_rgba(74,144,217,0.14)] backdrop-blur-md ${className}`}
    >
      <div className="whitespace-nowrap text-[11px] font-medium leading-tight text-white/90 sm:text-xs">
        {skill.label}
      </div>
      <div className="mt-0.5 text-[10px] leading-none text-blue-300/80 sm:text-[11px]">
        {Math.round(skill.value * 100)}%
      </div>
    </div>
  );
}

export default function SkillRadar3D() {
  return (
    <div className="relative h-full min-h-0 w-full overflow-visible">
      <div className="absolute inset-x-8 bottom-12 top-12 sm:inset-x-14 sm:bottom-16 sm:top-16">
        <Canvas
          aria-hidden="true"
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <RadarScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {SKILLS.map((skill, index) => (
          <SkillLabel
            key={skill.label}
            skill={skill}
            className={LABEL_POSITIONS[index]}
          />
        ))}
      </div>
    </div>
  );
}

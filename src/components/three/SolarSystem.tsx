'use client';

import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, GodRays, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { allProjects, businessLineLabels, type BusinessLine } from '@/data/projects';
import { createPlanetSurfaceMaterial, createCloudMaterial, seedFromLine, type PlanetSurfaceMaterial } from '@/components/three/planetMaterial';

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SatelliteConfig {
  name: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
}

interface PlanetConfig {
  name: string;
  /* business-line key in src/data/projects.ts — used for click navigation */
  line: string;
  color: string;
  emissiveHex: string;
  count: number;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  tilt: number;
  /* orbital plane inclination — varied per line so the system reads as a
     volume instead of a flat coplanar diagram */
  inclinationX: number;
  inclinationZ: number;
  ringColor?: string;
  satellites: SatelliteConfig[];
}

/* ------------------------------------------------------------------ */
/*  Planet Data — orbits are authored, colors/names/counts come        */
/*  straight from the projects data source so they never drift         */
/* ------------------------------------------------------------------ */

const PLANETS: PlanetConfig[] = ([
  { line: 'health', size: 0.66, orbitRadius: 5.5, orbitSpeed: 0.14, tilt: 0.15, incl: [0.1, -0.05] },
  { line: 'ai', size: 0.58, orbitRadius: 8.0, orbitSpeed: 0.1, tilt: -0.1, ring: true, incl: [-0.08, 0.07] },
  { line: 'web', size: 0.52, orbitRadius: 10.5, orbitSpeed: 0.08, tilt: 0.2, incl: [0.06, 0.09] },
  { line: 'creative', size: 0.44, orbitRadius: 13.0, orbitSpeed: 0.06, tilt: -0.25, ring: true, incl: [-0.11, -0.04] },
  { line: 'research', size: 0.47, orbitRadius: 15.5, orbitSpeed: 0.045, tilt: 0.12, incl: [0.05, -0.09] },
] as Array<{ line: BusinessLine; size: number; orbitRadius: number; orbitSpeed: number; tilt: number; ring?: boolean; incl: [number, number] }>).map(
  ({ line, ring, incl, ...orbit }) => {
    const label = businessLineLabels[line];
    const count = allProjects.filter((project) => project.businessLine === line).length;
    return {
      name: label.name,
      line,
      color: label.color,
      emissiveHex: label.color,
      count,
      ringColor: ring ? label.color : undefined,
      inclinationX: incl[0],
      inclinationZ: incl[1],
      satellites: Array.from({ length: count }, (_, i) => ({
        name: `${label.name}${i + 1}`,
        size: 0.055,
        orbitRadius: 0.7 + Math.random() * 0.6,
        orbitSpeed: 0.4 + Math.random() * 0.4,
        orbitOffset: (i / count) * Math.PI * 2,
      })),
      ...orbit,
    };
  },
);

/* ------------------------------------------------------------------ */
/*  Custom Shader: Corona Glow Sun                                     */
/* ------------------------------------------------------------------ */

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex-ish noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    // Multi-frequency pulsing with wider dynamic range + harmonic richness
    float pulse = 0.80 + 0.11 * sin(uTime * 1.8) + 0.07 * sin(uTime * 0.6 + 1.3)
                + 0.05 * sin(uTime * 4.7 + 2.7) + 0.03 * sin(uTime * 8.3 + 0.9)
                + 0.02 * sin(uTime * 13.7 + 3.2) + 0.012 * sin(uTime * 21.1 + 1.1);

    // Surface detail with eight octaves for ultra-rich chromosphere texture
    float n1 = snoise(vPosition * 1.6 + uTime * 0.11);
    float n2 = snoise(vPosition * 3.2 - uTime * 0.08);
    float n3 = snoise(vPosition * 6.4 + uTime * 0.16);
    float n4 = snoise(vPosition * 12.8 - uTime * 0.10);
    float n5 = snoise(vPosition * 25.6 + uTime * 0.06);
    float n6 = snoise(vPosition * 51.2 - uTime * 0.045);
    float n7 = snoise(vPosition * 102.4 + uTime * 0.025);
    float n8 = snoise(vPosition * 200.0 - uTime * 0.015);
    float noise = n1 * 0.30 + n2 * 0.22 + n3 * 0.17 + n4 * 0.12 + n5 * 0.08
                + n6 * 0.05 + n7 * 0.03 + n8 * 0.03;

    // Premium solar palette with enhanced chromatic depth and warmer core
    vec3 core    = vec3(0.92, 0.97, 1.0);   // white-hot ice
    vec3 inner   = vec3(0.72, 0.88, 1.0);   // pale ice blue
    vec3 mid     = vec3(0.38, 0.72, 0.96);  // telemetry cyan
    vec3 edge    = vec3(0.14, 0.44, 0.78);  // deep signal blue
    vec3 limb    = vec3(0.04, 0.16, 0.36);  // dark navy limb

    float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    fresnel = pow(fresnel, 1.5);

    vec3 baseColor = mix(core, inner, fresnel * 0.3);
    baseColor = mix(baseColor, mid, fresnel * 0.55 + noise * 0.15);
    baseColor = mix(baseColor, edge, fresnel * fresnel * 0.65);
    baseColor = mix(baseColor, limb, pow(fresnel, 3.2) * 0.50);

    // Bright granulation spots with hotter color shift
    float hotSpot = smoothstep(0.15, 0.65, noise);
    baseColor += vec3(0.22, 0.38, 0.52) * hotSpot;

    // Solar flare streaks with stronger contrast
    float streak = snoise(vPosition * 3.0 + vec3(uTime * 0.07, 0.0, uTime * 0.05));
    float flareLine = smoothstep(0.46, 0.58, streak);
    baseColor += vec3(0.20, 0.42, 0.66) * flareLine * (1.0 - fresnel);

    // Secondary perpendicular flare network
    float streak2 = snoise(vPosition * 5.0 + vec3(0.0, uTime * 0.04, uTime * 0.06));
    float flareLine2 = smoothstep(0.54, 0.64, streak2);
    baseColor += vec3(0.14, 0.30, 0.52) * flareLine2 * (1.0 - fresnel) * 0.6;

    // Tertiary fine-scale granulation for photospheric detail
    float gran = snoise(vPosition * 22.0 + uTime * 0.04);
    float granDetail = smoothstep(0.35, 0.65, gran) * 0.08;
    baseColor += vec3(0.07, 0.16, 0.28) * granDetail * (1.0 - fresnel);

    // Limb-brightened prominences -- concentrated at the solar edge
    float promNoise = snoise(vPosition * 2.2 + vec3(uTime * 0.03, uTime * 0.02, 0.0));
    float promMask = smoothstep(0.40, 0.75, fresnel) * smoothstep(0.35, 0.65, promNoise);
    baseColor += vec3(0.16, 0.42, 0.68) * promMask * 0.8;

    // Sunspots with penumbra and chromatic darkening
    float spotNoise = snoise(vPosition * 5.5 + uTime * 0.035);
    float penumbra = smoothstep(0.52, 0.64, spotNoise);
    float umbra = smoothstep(0.70, 0.76, spotNoise);
    baseColor *= 1.0 - penumbra * 0.22 - umbra * 0.30;
    // Slight reddish tint in umbra (chromospheric emission)
    baseColor += vec3(0.0, 0.04, 0.10) * umbra;

    float brightness = (1.0 + noise * 0.20) * pulse;
    gl_FragColor = vec4(baseColor * brightness, 1.0);
  }
`;

const coronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const coronaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    float fresnel = 0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    float intensity = pow(max(fresnel, 0.0), 1.6);

    // Multi-layered ray streaks with richer angular structure
    vec3 dir = normalize(vWorldPosition);
    float angle = atan(dir.z, dir.x);
    float streak1 = 0.58 + 0.42 * sin(angle * 5.0 + uTime * 0.5);
    float streak2 = 0.68 + 0.32 * sin(angle * 9.0 - uTime * 0.85);
    float streak3 = 0.78 + 0.22 * sin(angle * 17.0 + uTime * 1.3);
    float streak4 = 0.88 + 0.12 * sin(angle * 29.0 - uTime * 2.0);
    float streak5 = 0.93 + 0.07 * sin(angle * 41.0 + uTime * 0.7);
    float streak = streak1 * streak2 * streak3 * streak4 * streak5;

    // Streamer modulation with wider and narrower features
    float streamer1 = 0.7 + 0.3 * smoothstep(0.35, 0.65, sin(angle * 2.5 + uTime * 0.12));
    float streamer2 = 0.85 + 0.15 * smoothstep(0.4, 0.6, sin(angle * 7.0 - uTime * 0.2));
    float streamer = streamer1 * streamer2;

    // Rich multi-frequency pulsing with broader harmonic content
    float pulse = 0.56 + 0.20 * sin(uTime * 1.6) + 0.10 * sin(uTime * 4.2 + 0.8)
                + 0.06 * sin(uTime * 7.5 + 2.0) + 0.04 * sin(uTime * 11.0 + 1.5)
                + 0.025 * sin(uTime * 16.0 + 3.0) + 0.015 * sin(uTime * 23.0 + 0.4);

    // Premium color gradient: champagne inner -> warm gold mid -> deep amber outer
    vec3 innerColor = vec3(0.85, 0.94, 1.0);
    vec3 midColor = vec3(0.44, 0.73, 0.98);
    vec3 outerColor = uColor;
    vec3 deepColor = vec3(0.10, 0.32, 0.62);
    float depth = pow(max(fresnel, 0.0), 0.60);
    vec3 glowColor = mix(innerColor, midColor, depth * 0.45);
    glowColor = mix(glowColor, outerColor, depth * 0.8);
    glowColor = mix(glowColor, deepColor, pow(depth, 2.0) * 0.35);

    vec3 glow = glowColor * intensity * streak * streamer * pulse * 4.2;
    float alpha = intensity * 0.78 * pulse * streak * streamer;
    gl_FragColor = vec4(glow, alpha);
  }
`;

/* Outer corona with radial ray streaks and streamer modulation */
const outerCoronaFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    float fresnel = 0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    float intensity = pow(max(fresnel, 0.0), 2.2);

    vec3 dir = normalize(vWorldPosition);
    float angle = atan(dir.z, dir.x);

    // Dense radial rays with richer frequency content
    float rays1 = 0.46 + 0.54 * sin(angle * 8.0 + uTime * 0.35);
    float rays2 = 0.60 + 0.40 * cos(angle * 15.0 - uTime * 0.6);
    float rays3 = 0.74 + 0.26 * sin(angle * 4.0 + uTime * 0.2);
    float rays4 = 0.84 + 0.16 * cos(angle * 23.0 + uTime * 1.1);
    float rays5 = 0.91 + 0.09 * sin(angle * 37.0 - uTime * 1.6);
    float rays6 = 0.95 + 0.05 * cos(angle * 53.0 - uTime * 0.9);
    float rays = rays1 * rays2 * rays3 * rays4 * rays5 * rays6;

    // Asymmetric brightness with slow drift (like real corona)
    float asymmetry = 0.78 + 0.22 * sin(angle * 0.7 + uTime * 0.08);

    float pulse = 0.70 + 0.15 * sin(uTime * 1.1) + 0.08 * sin(uTime * 2.8 + 0.5)
                + 0.04 * sin(uTime * 6.5 + 1.2) + 0.02 * sin(uTime * 10.0 + 2.8)
                + 0.015 * sin(uTime * 15.0 + 4.1);

    vec3 colorInner = vec3(0.66, 0.85, 1.0);
    vec3 colorMid = vec3(0.30, 0.60, 0.94);
    vec3 colorOuter = vec3(0.12, 0.34, 0.68);
    float depthGrad = pow(max(fresnel, 0.0), 1.3);
    vec3 color = mix(colorInner, colorMid, depthGrad * 0.6);
    color = mix(color, colorOuter, depthGrad);

    vec3 glow = color * intensity * rays * asymmetry * pulse * 3.2;
    float alpha = intensity * rays * asymmetry * pulse * 0.58;
    gl_FragColor = vec4(glow, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/*  Sun Component                                                      */
/* ------------------------------------------------------------------ */

function Sun({
  coreRef,
  onCoreReady,
}: {
  coreRef?: React.MutableRefObject<THREE.Mesh | null>;
  onCoreReady?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerCoronaRef = useRef<THREE.Mesh>(null);
  const midHazeRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );
  const coronaUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#4da8ff') },
    }),
    [],
  );
  const outerCoronaUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  const sunGeo = useMemo(() => new THREE.SphereGeometry(0.9, 64, 64), []);
  const innerGlowGeo = useMemo(() => new THREE.SphereGeometry(1.08, 48, 48), []);
  const coronaGeo = useMemo(() => new THREE.SphereGeometry(1.45, 48, 48), []);
  const outerCoronaGeo = useMemo(() => new THREE.SphereGeometry(2.2, 48, 48), []);
  const midHazeGeo = useMemo(() => new THREE.SphereGeometry(3.0, 32, 32), []);
  const outerGeo = useMemo(() => new THREE.SphereGeometry(4.2, 32, 32), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    coronaUniforms.uTime.value = t;
    outerCoronaUniforms.uTime.value = t;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.04;
    }
    if (coronaRef.current) {
      const s = 1.0 + 0.10 * Math.sin(t * 1.8) + 0.045 * Math.sin(t * 4.7) + 0.022 * Math.sin(t * 8.1);
      coronaRef.current.scale.setScalar(s);
    }
    if (innerGlowRef.current) {
      const s = 1.0 + 0.07 * Math.sin(t * 2.2 + 0.3) + 0.035 * Math.sin(t * 5.1 + 1.1);
      innerGlowRef.current.scale.setScalar(s);
    }
    if (outerCoronaRef.current) {
      const s = 1.0 + 0.08 * Math.sin(t * 1.2 + 0.7) + 0.04 * Math.sin(t * 3.5) + 0.018 * Math.sin(t * 6.2);
      outerCoronaRef.current.scale.setScalar(s);
    }
    if (midHazeRef.current) {
      const s = 1.0 + 0.05 * Math.sin(t * 0.95 + 1.2) + 0.028 * Math.sin(t * 2.6) + 0.014 * Math.sin(t * 4.8);
      midHazeRef.current.scale.setScalar(s);
    }
    if (outerRef.current) {
      const s = 1.0 + 0.042 * Math.sin(t * 0.8 + 0.5) + 0.022 * Math.sin(t * 1.9) + 0.012 * Math.sin(t * 3.7);
      outerRef.current.scale.setScalar(s);
    }
  });

  useEffect(() => {
    return () => {
      sunGeo.dispose();
      innerGlowGeo.dispose();
      coronaGeo.dispose();
      outerCoronaGeo.dispose();
      midHazeGeo.dispose();
      outerGeo.dispose();
    };
  }, [sunGeo, innerGlowGeo, coronaGeo, outerCoronaGeo, midHazeGeo, outerGeo]);

  return (
    <group>
      {/* Primary warm point light */}
      <pointLight intensity={12} distance={75} decay={2} color="#cfe4ff" />
      {/* Secondary fill light for softer ambient bounce */}
      <pointLight intensity={3.0} distance={40} decay={2} color="#9cc8ff" />
      {/* Tertiary subtle warm-cool rim for color depth */}
      <pointLight intensity={1.0} distance={22} decay={2} color="#e8f4ff" />
      {/* Quaternary ultra-soft wide fill for deep shadow lift */}
      <pointLight intensity={0.4} distance={58} decay={2} color="#b8d4ff" />

      {/* Sun core */}
      <mesh
        ref={(m: THREE.Mesh | null) => {
          meshRef.current = m;
          if (coreRef) coreRef.current = m;
          if (m) onCoreReady?.();
        }}
        geometry={sunGeo}
      >
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Inner photosphere glow - soft transition between core and corona */}
      <mesh ref={innerGlowRef} geometry={innerGlowGeo}>
        <meshBasicMaterial
          color="#a8d8ff"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner corona glow with ray streaks */}
      <mesh ref={coronaRef} geometry={coronaGeo}>
        <shaderMaterial
          vertexShader={coronaVertexShader}
          fragmentShader={coronaFragmentShader}
          uniforms={coronaUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer corona with radial rays */}
      <mesh ref={outerCoronaRef} geometry={outerCoronaGeo}>
        <shaderMaterial
          vertexShader={coronaVertexShader}
          fragmentShader={outerCoronaFragmentShader}
          uniforms={outerCoronaUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Mid haze layer for smoother corona falloff */}
      <mesh ref={midHazeRef} geometry={midHazeGeo}>
        <meshBasicMaterial
          color="#4da8ff"
          transparent
          opacity={0.045}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Diffuse outer haze */}
      <mesh ref={outerRef} geometry={outerGeo}>
        <meshBasicMaterial
          color="#3d8fe0"
          transparent
          opacity={0.038}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Planet with atmosphere                                             */
/* ------------------------------------------------------------------ */

interface PlanetMeshProps {
  name: string;
  color: string;
  emissiveHex: string;
  size: number;
  tilt: number;
  ringColor?: string;
  count?: number;
  onClick?: () => void;
}

function PlanetBody({ name, color, emissiveHex, size, tilt, ringColor, count, onClick }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  const colorObj = useMemo(() => new THREE.Color(color), [color]);
  const emissiveObj = useMemo(() => new THREE.Color(emissiveHex), [emissiveHex]);

  const geo = useMemo(() => new THREE.SphereGeometry(1, 48, 48), []);
  /* desktop: procedural surface (continents / cities / glint / rim);
     mobile: lit standard material for GPU headroom */
  const surfaceMat = useMemo(
    () => (IS_MOBILE ? null : createPlanetSurfaceMaterial(color, seedFromLine(name))),
    [color, name],
  );
  const mat = useMemo(
    () =>
      surfaceMat ??
      new THREE.MeshStandardMaterial({
        color: colorObj,
        emissive: emissiveObj,
        emissiveIntensity: 0.35,
        roughness: 0.32,
        metalness: 0.52,
      }),
    [surfaceMat, colorObj, emissiveObj],
  );

  const cloudGeo = useMemo(() => (IS_MOBILE ? null : new THREE.SphereGeometry(1.035, 48, 48)), []);
  const cloudMat = useMemo(() => (IS_MOBILE ? null : createCloudMaterial(seedFromLine(name))), [name]);

  const atmosGeo = useMemo(() => new THREE.SphereGeometry(1.20, 32, 32), []);
  const atmosMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colorObj],
  );

  // Second atmosphere layer for softer outer glow
  const outerAtmosGeo = useMemo(() => new THREE.SphereGeometry(1.42, 24, 24), []);
  const outerAtmosMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colorObj],
  );

  // Third ultra-soft atmospheric haze for premium depth
  const ultraAtmosGeo = useMemo(() => new THREE.SphereGeometry(1.65, 20, 20), []);
  const ultraAtmosMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.035,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colorObj],
  );

  const ringGeo = useMemo(
    () => new THREE.RingGeometry(1.35, 2.05, 64),
    [],
  );
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(ringColor ?? color),
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color, ringColor],
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.25;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.31;
    const target = hovered ? 1.22 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 4.5);
    meshRef.current.scale.setScalar(scaleRef.current);
    if (atmosRef.current) atmosRef.current.scale.setScalar(scaleRef.current * 1.20);
    if (ringRef.current) ringRef.current.scale.setScalar(scaleRef.current);
    if (surfaceMat) {
      /* procedural path — hover brightens the rim and the night-side cities */
      surfaceMat.uniforms.uTime.value = state.clock.elapsedTime;
      surfaceMat.uniforms.uHover.value = THREE.MathUtils.lerp(surfaceMat.uniforms.uHover.value, hovered ? 1 : 0, delta * 4);
      if (cloudMat) cloudMat.uniforms.uTime.value = state.clock.elapsedTime;
    } else {
      (mat as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.lerp(
        (mat as THREE.MeshStandardMaterial).emissiveIntensity,
        hovered ? 0.90 : 0.35,
        delta * 3.5,
      );
    }
    atmosMat.opacity = THREE.MathUtils.lerp(atmosMat.opacity, hovered ? 0.40 : 0.18, delta * 3.5);
    outerAtmosMat.opacity = THREE.MathUtils.lerp(outerAtmosMat.opacity, hovered ? 0.16 : 0.08, delta * 3.5);
    ultraAtmosMat.opacity = THREE.MathUtils.lerp(ultraAtmosMat.opacity, hovered ? 0.07 : 0.035, delta * 3.5);
  });

  useEffect(() => {
    return () => {
      geo.dispose(); mat.dispose();
      cloudGeo?.dispose(); cloudMat?.dispose();
      atmosGeo.dispose(); atmosMat.dispose();
      outerAtmosGeo.dispose(); outerAtmosMat.dispose();
      ultraAtmosGeo.dispose(); ultraAtmosMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
    };
  }, [geo, mat, cloudGeo, cloudMat, atmosGeo, atmosMat, outerAtmosGeo, outerAtmosMat, ultraAtmosGeo, ultraAtmosMat, ringGeo, ringMat]);

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh
        ref={meshRef}
        geometry={geo}
        material={mat}
        scale={size}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      />
      <mesh ref={atmosRef} geometry={atmosGeo} material={atmosMat} scale={size * 1.15} />
      {cloudGeo && cloudMat && (
        <mesh ref={cloudRef} geometry={cloudGeo} material={cloudMat} scale={size * 1.03} />
      )}
      <mesh geometry={outerAtmosGeo} material={outerAtmosMat} scale={size * 1.3} />
      <mesh geometry={ultraAtmosGeo} material={ultraAtmosMat} scale={size * 1.5} />
      {ringColor && (
        <mesh ref={ringRef} geometry={ringGeo} material={ringMat} scale={size} rotation={[Math.PI / 2.5, 0, 0]} />
      )}
      {/* Chart annotation — constant-size HUD label so every orbit identifies itself.
          zIndexRange keeps labels below the section HUD (z-10); pointer events pass
          through to the planet mesh via the wrapper's pointer-events:none. */}
      <Html
        position={[0, size * 2.35, 0]}
        center
        wrapperClass="planet-label-wrapper"
        zIndexRange={[9, 0]}
      >
        <div
          className="pointer-events-none whitespace-nowrap border border-white/10 bg-[#02030a]/62 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.2em] backdrop-blur-[2px] transition-[color,background-color,border-color,box-shadow,transform,opacity,filter] duration-300"
          style={{
            borderLeft: `2px solid ${color}`,
            color: hovered ? '#ffffff' : 'rgba(232, 242, 255, 0.72)',
            textShadow: hovered ? `0 0 12px ${color}` : 'none',
            opacity: hovered ? 1 : 0.82,
          }}
        >
          {name}{typeof count === 'number' ? ` · ${count}` : ''}
        </div>
      </Html>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Satellite                                                          */
/* ------------------------------------------------------------------ */

function Satellite({ config, parentColor }: { config: SatelliteConfig; parentColor: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = useRef(config.orbitOffset);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 20, 20), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(parentColor).lerp(new THREE.Color('#ffffff'), 0.40),
        emissive: new THREE.Color(parentColor),
        emissiveIntensity: 0.30,
        roughness: 0.30,
        metalness: 0.45,
      }),
    [parentColor],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    angle.current += config.orbitSpeed * delta;
    ref.current.position.x = Math.cos(angle.current) * config.orbitRadius;
    ref.current.position.z = Math.sin(angle.current) * config.orbitRadius;
    ref.current.position.y = Math.sin(angle.current * 1.7) * 0.04; // subtle vertical bob
    ref.current.rotation.y += delta * 0.6;
  });

  return <mesh ref={ref} geometry={geo} material={mat} scale={config.size} />;
}

/* ------------------------------------------------------------------ */
/*  Orbit Ring (gradient fade)                                         */
/* ------------------------------------------------------------------ */

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const geo = useMemo(() => {
    const segments = 256;
    const positions = new Float32Array((segments + 1) * 3);
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(a) * radius;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [radius]);

  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.16,
      }),
    [color],
  );

  const lineObj = useMemo(() => {
    const l = new THREE.Line(geo, mat);
    return l;
  }, [geo, mat]);

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <primitive object={lineObj} />;
}

/* ------------------------------------------------------------------ */
/*  Orbit Trail Particles                                              */
/* ------------------------------------------------------------------ */

function OrbitTrail({ radius, color, count = 60 }: { radius: number; color: string; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const angleOffsets = useRef<Float32Array>(new Float32Array(0));

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const alp = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      // Slight vertical scatter and radial variation for depth
      const radialJitter = (Math.random() - 0.5) * 0.25;
      pos[i * 3] = Math.cos(a) * (radius + radialJitter) + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = Math.sin(a) * (radius + radialJitter) + (Math.random() - 0.5) * 0.15;
      alp[i] = 0.10 + Math.random() * 0.22;
      offsets[i] = a;
    }
    angleOffsets.current = offsets;
    return { positions: pos };
  }, [radius, count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size: 0.06,
        transparent: true,
        opacity: 0.30,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  // Smoother drift animation with subtle vertical shimmer
  useFrame((_, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const offsets = angleOffsets.current;
    const speed = 0.02;
    for (let i = 0; i < count; i++) {
      offsets[i] += speed * delta;
      arr[i * 3] = Math.cos(offsets[i]) * radius + Math.sin(offsets[i] * 3) * 0.06;
      arr[i * 3 + 1] = Math.sin(offsets[i] * 2.3) * 0.04;
      arr[i * 3 + 2] = Math.sin(offsets[i]) * radius + Math.cos(offsets[i] * 2) * 0.06;
    }
    posAttr.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------------ */
/*  Cosmic Dust (deep-space particles with custom twinkle shader)      */
/* ------------------------------------------------------------------ */

const dustVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aTwinkleSpeed;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSize;

  void main() {
    vColor = color;
    vSize = aSize;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Per-star twinkle with unique speed and phase, smoother curve
    float twinkle = 0.55 + 0.45 * sin(uTime * aTwinkleSpeed + aPhase);
    // Brighter stars twinkle less (more stable), dimmer ones twinkle more
    float sizeFactor = mix(1.0, twinkle, 0.55 - aSize * 1.5);
    gl_PointSize = aSize * sizeFactor * (240.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = twinkle * (0.65 + 0.35 * aSize);
  }
`;

const dustFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSize;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    // Gaussian core with softer falloff
    float gaussian = exp(-dist * dist * 12.0);

    // Cross-spike diffraction for brighter stars (vSize > threshold)
    float spikeSharpness = 70.0;
    float spikeX = exp(-abs(center.y) * spikeSharpness) * exp(-abs(center.x) * 5.5);
    float spikeY = exp(-abs(center.x) * spikeSharpness) * exp(-abs(center.y) * 5.5);
    float spikes = (spikeX + spikeY) * step(0.12, vSize) * 0.40;

    // Subtle halo ring for medium-brightness stars
    float halo = exp(-pow(dist - 0.22, 2.0) * 80.0) * 0.12 * step(0.06, vSize);

    float brightness = gaussian + spikes + halo;
    float alpha = brightness * vAlpha;
    gl_FragColor = vec4(vColor * (0.85 + 0.15 * brightness), alpha);
  }
`;

function CosmicDust() {
  const ref = useRef<THREE.Points>(null);
  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 3200 : 7500;

  const { positions, colors, sizes, phases, twinkleSpeeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    const ts = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Shell distribution with denser inner ring
      const shell = Math.random();
      const r = shell < 0.3 ? 18 + Math.random() * 30 : 25 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55; // flattened galactic plane
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Varied star colors: warm white, cool blue, purple, faint gold, rose, teal
      const type = Math.random();
      if (type < 0.30) {
        // Warm white / yellow-white
        const b = 0.72 + Math.random() * 0.28;
        col[i * 3] = b; col[i * 3 + 1] = b * 0.94; col[i * 3 + 2] = b * 0.80;
      } else if (type < 0.48) {
        // Cool blue / ice-blue
        col[i * 3] = 0.28 + Math.random() * 0.18;
        col[i * 3 + 1] = 0.48 + Math.random() * 0.30;
        col[i * 3 + 2] = 0.85 + Math.random() * 0.15;
      } else if (type < 0.60) {
        // Purple / violet
        col[i * 3] = 0.48 + Math.random() * 0.25;
        col[i * 3 + 1] = 0.18 + Math.random() * 0.22;
        col[i * 3 + 2] = 0.68 + Math.random() * 0.30;
      } else if (type < 0.72) {
        // Faint gold / amber
        col[i * 3] = 0.78 + Math.random() * 0.22;
        col[i * 3 + 1] = 0.58 + Math.random() * 0.22;
        col[i * 3 + 2] = 0.18 + Math.random() * 0.15;
      } else if (type < 0.82) {
        // Rose / pink accent
        col[i * 3] = 0.78 + Math.random() * 0.22;
        col[i * 3 + 1] = 0.28 + Math.random() * 0.22;
        col[i * 3 + 2] = 0.38 + Math.random() * 0.22;
      } else if (type < 0.92) {
        // Teal / cyan for dark theme harmony
        col[i * 3] = 0.18 + Math.random() * 0.15;
        col[i * 3 + 1] = 0.55 + Math.random() * 0.25;
        col[i * 3 + 2] = 0.60 + Math.random() * 0.25;
      } else {
        // Bright accent stars (near-white)
        col[i * 3] = 0.92 + Math.random() * 0.08;
        col[i * 3 + 1] = 0.88 + Math.random() * 0.12;
        col[i * 3 + 2] = 0.95 + Math.random() * 0.05;
      }

      // Size: mostly small, few bright ones
      const sizeRoll = Math.random();
      if (sizeRoll > 0.96) {
        sz[i] = 0.18 + Math.random() * 0.22; // bright stars
      } else if (sizeRoll > 0.85) {
        sz[i] = 0.08 + Math.random() * 0.10; // medium
      } else {
        sz[i] = 0.02 + Math.random() * 0.06; // dim stars
      }
      ph[i] = Math.random() * Math.PI * 2;
      ts[i] = 0.5 + Math.random() * 2.5; // varied twinkle speeds
    }
    return { positions: pos, colors: col, sizes: sz, phases: ph, twinkleSpeeds: ts };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    g.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));
    return g;
  }, [positions, colors, sizes, phases, twinkleSpeeds]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dustVertexShader,
        fragmentShader: dustFragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.0015;
    (mat.uniforms.uTime as { value: number }).value = state.clock.elapsedTime;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------------ */
/*  Nebula Background (soft colored clouds)                            */
/* ------------------------------------------------------------------ */

function NebulaClouds() {
  const groupRef = useRef<THREE.Group>(null);
  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 22 : 45;

  const meshes = useMemo(() => {
    const items: { position: [number, number, number]; scale: number; color: string; opacity: number; pulseSpeed: number; pulsePhase: number }[] = [];
    const colors = [
      '#1a0a4e', '#0a1628', '#0d3756', '#1a0a2e', '#052a4c', '#12083a',
      '#0a2d5e', '#1e0845', '#083040', '#150a50', '#0a2845', '#1c0842',
      '#0b1a3e', '#180a56', '#062040', '#200a50', '#0a3560', '#140840',
      '#0f1852', '#081e3a', '#1a0838', '#0c2a50', '#10083e', '#062848',
      '#1a0a3a', '#081a42', '#120e55', '#0a3048', '#0e0845', '#082540',
      '#063848', '#0a4858', '#082a4e', '#0c3860', '#051a50', '#0a3058',
      '#082858', '#0e1848', '#062860', '#0c1a55',
      '#0d2838', '#083848', '#0a1828', '#102838', '#062038',
    ];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 28 + Math.random() * 55;
      const ySpread = (Math.random() - 0.5) * 45;
      items.push({
        position: [
          Math.cos(angle) * r + (Math.random() - 0.5) * 12,
          ySpread,
          Math.sin(angle) * r + (Math.random() - 0.5) * 12,
        ],
        scale: 15 + Math.random() * 45,
        color: colors[i % colors.length],
        opacity: 0.05 + Math.random() * 0.16,
        pulseSpeed: 0.15 + Math.random() * 0.45,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    return items;
  }, []);

  const sharedGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);

  const cloudMaterials = useMemo(
    () =>
      meshes.map(
        (m) =>
          new THREE.MeshBasicMaterial({
            color: m.color,
            transparent: true,
            opacity: m.opacity,
            side: THREE.BackSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
      ),
    [meshes],
  );

  useEffect(() => {
    const geo = sharedGeo;
    const mats = cloudMaterials;
    return () => {
      geo.dispose();
      mats.forEach((mat) => mat.dispose());
    };
  }, [sharedGeo, cloudMaterials]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.0006;
    // Subtle opacity pulsing per cloud with smoother transitions
    const t = state.clock.elapsedTime;
    meshes.forEach((m, i) => {
      if (cloudMaterials[i]) {
        const base = m.opacity;
        cloudMaterials[i].opacity = base + base * 0.25 * Math.sin(t * m.pulseSpeed + m.pulsePhase);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {meshes.map((m, i) => (
        <mesh key={i} position={m.position} scale={m.scale} geometry={sharedGeo} material={cloudMaterials[i]} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Complete Planet System (planet + orbit + satellites)               */
/* ------------------------------------------------------------------ */

function PlanetSystem({
  config,
  onClick,
  positionSink,
}: {
  config: PlanetConfig;
  onClick?: () => void;
  /* persistent vector filled with the planet's world position each frame —
     feeds the click-to-focus flight */
  positionSink?: THREE.Vector3;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  // Subtle eccentricity for natural-looking elliptical orbits
  const eccentricity = useMemo(() => 0.02 + Math.random() * 0.06, []);
  const tiltAngle = useMemo(() => (Math.random() - 0.5) * 0.1, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    angleRef.current += config.orbitSpeed * delta;
    const r = config.orbitRadius * (1.0 + eccentricity * Math.cos(angleRef.current * 2.0));
    groupRef.current.position.x = Math.cos(angleRef.current) * r;
    groupRef.current.position.z = Math.sin(angleRef.current) * r;
    groupRef.current.position.y = Math.sin(angleRef.current) * r * tiltAngle;
    if (positionSink) groupRef.current.getWorldPosition(positionSink);
  });

  return (
    <group rotation={[config.inclinationX, 0, config.inclinationZ]}>
      <OrbitRing radius={config.orbitRadius} color={config.color} />
      <OrbitTrail radius={config.orbitRadius} color={config.color} count={55} />
      <group ref={groupRef}>
        <PlanetBody
          name={config.name}
          color={config.color}
          emissiveHex={config.emissiveHex}
          size={config.size}
          tilt={config.tilt}
          ringColor={config.ringColor}
          count={config.count}
          onClick={onClick}
        />
        {config.satellites.map((s) => (
          <Satellite key={s.name} config={s} parentColor={config.color} />
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Asteroid Belt — one instanced draw call, hundreds of tumbling      */
/*  rocks threading the gap between the Web and Creative orbits       */
/* ------------------------------------------------------------------ */

function AsteroidBelt() {
  const count = IS_MOBILE ? 320 : 900;
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5b6b80',
        roughness: 0.92,
        metalness: 0.08,
        emissive: '#16324e',
        emissiveIntensity: 0.3,
      }),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const rocks = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        radius: 11.3 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        speed: 0.016 + Math.random() * 0.02,
        y: (Math.random() - 0.5) * 0.42,
        scale: 0.018 + Math.random() * 0.05,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.5,
      })),
    [count],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    for (let i = 0; i < rocks.length; i += 1) {
      const rock = rocks[i];
      rock.angle += rock.speed * delta;
      rock.rx += rock.spin * delta;
      dummy.position.set(
        Math.cos(rock.angle) * rock.radius,
        rock.y,
        Math.sin(rock.angle) * rock.radius,
      );
      dummy.rotation.set(rock.rx, rock.ry, rock.rz);
      dummy.scale.setScalar(rock.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat, count]} />;
}

/* ------------------------------------------------------------------ */
/*  Comets — bright heads with cyan particle tails crossing the       */
/*  system on random chords, resting between passes                   */
/* ------------------------------------------------------------------ */

type CometState = {
  start: THREE.Vector3;
  end: THREE.Vector3;
  duration: number;
  elapsed: number;
  resting: number;
  history: THREE.Vector3[];
};

function randomChord(): { start: THREE.Vector3; end: THREE.Vector3 } {
  const start = new THREE.Vector3().setFromSphericalCoords(
    34 + Math.random() * 10,
    Math.PI * (0.32 + Math.random() * 0.36),
    Math.random() * Math.PI * 2,
  );
  const end = start.clone().multiplyScalar(-1).add(
    new THREE.Vector3().setFromSphericalCoords(
      20 + Math.random() * 14,
      Math.PI * (0.35 + Math.random() * 0.3),
      Math.random() * Math.PI * 2,
    ),
  );
  return { start, end };
}

function Comets({ count = 2 }: { count?: number }) {
  const trailLength = 34;
  const comets = useMemo<CometState[]>(
    () =>
      Array.from({ length: count }, () => ({
        ...randomChord(),
        duration: 7 + Math.random() * 5,
        elapsed: -Math.random() * 6,
        resting: 0,
        history: [],
      })),
    [count],
  );

  const headGeo = useMemo(() => new THREE.SphereGeometry(0.07, 12, 12), []);
  const headMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#eaf6ff', transparent: true, opacity: 0.95 }),
    [],
  );
  const trailGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * trailLength * 3), 3));
    return g;
  }, [count]);
  const trailMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#9fe8ff',
        size: 0.16,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const headRefs = useRef<(THREE.Mesh | null)[]>([]);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useEffect(
    () => () => {
      headGeo.dispose();
      headMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
    },
    [headGeo, headMat, trailGeo, trailMat],
  );

  useFrame((_, delta) => {
    const arr = trailGeo.getAttribute('position') as THREE.BufferAttribute;
    for (let c = 0; c < comets.length; c += 1) {
      const comet = comets[c];
      const head = headRefs.current[c];
      comet.elapsed += delta;
      if (comet.elapsed < 0) {
        if (head) head.visible = false;
        continue;
      }
      const t = comet.elapsed / comet.duration;
      if (t >= 1) {
        /* rest, then respawn on a fresh chord */
        comet.resting += delta;
        if (comet.resting > 2.5 + Math.random() * 4) {
          const chord = randomChord();
          comet.start = chord.start;
          comet.end = chord.end;
          comet.duration = 7 + Math.random() * 5;
          comet.elapsed = 0;
          comet.resting = 0;
          comet.history = [];
        }
        if (head) head.visible = false;
        continue;
      }
      const eased = t * t * (3 - 2 * t);
      scratch.lerpVectors(comet.start, comet.end, eased);
      comet.history.unshift(scratch.clone());
      if (comet.history.length > trailLength) comet.history.length = trailLength;
      if (head) {
        head.visible = true;
        head.position.copy(scratch);
      }
      const base = c * trailLength * 3;
      for (let i = 0; i < trailLength; i += 1) {
        const point = comet.history[Math.min(i, comet.history.length - 1)];
        if (point) {
          arr.array[base + i * 3] = point.x;
          arr.array[base + i * 3 + 1] = point.y;
          arr.array[base + i * 3 + 2] = point.z;
        }
      }
    }
    arr.needsUpdate = true;
  });

  return (
    <group>
      {comets.map((_, index) => (
        <mesh
          key={index}
          ref={(m: THREE.Mesh | null) => { headRefs.current[index] = m; }}
          geometry={headGeo}
          material={headMat}
        />
      ))}
      <points geometry={trailGeo} material={trailMat} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Camera Telemetry — feeds the real orbit state to the section HUD   */
/* ------------------------------------------------------------------ */

function CameraTelemetry({ onRead }: { onRead: (az: number, el: number, dist: number) => void }) {
  const { camera } = useThree();
  const last = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (t - last.current < 0.4) return;
    last.current = t;
    const dist = camera.position.length();
    const el = Math.asin(THREE.MathUtils.clamp(camera.position.y / dist, -1, 1));
    const az = Math.atan2(camera.position.x, camera.position.z);
    onRead(az, el, dist);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Scroll Flight — the scroll progress flies the camera through the   */
/*  system; depth is felt when we skim the ecliptic and planets        */
/*  sweep past the lens                                                */
/* ------------------------------------------------------------------ */

/* keyframes: (scroll progress, orbit radius, elevation°, azimuth°) */
const CAM_KEYFRAMES = [
  { p: 0.0, r: 33, el: 30, az: -24 },    // establishing shot
  { p: 0.28, r: 22, el: 16, az: 30 },    // descend toward the plane
  { p: 0.5, r: 7.5, el: 9, az: 105 },    // graze the star — god rays bloom
  { p: 0.72, r: 12.5, el: 3.5, az: 150 },// skim the ecliptic past the belt
  { p: 1.0, r: 18.5, el: 11, az: 195 },  // settle into explore orbit
];

function smootherstep(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function sampleCameraPath(p: number) {
  for (let i = 0; i < CAM_KEYFRAMES.length - 1; i += 1) {
    const a = CAM_KEYFRAMES[i];
    const b = CAM_KEYFRAMES[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = smootherstep((p - a.p) / (b.p - a.p));
      return {
        r: a.r + (b.r - a.r) * t,
        el: a.el + (b.el - a.el) * t,
        az: a.az + (b.az - a.az) * t,
      };
    }
  }
  const last = CAM_KEYFRAMES[CAM_KEYFRAMES.length - 1];
  return { r: last.r, el: last.el, az: last.az };
}

type FocusFlight = { line: string; startedAt: number | null; fired: boolean } | null;

function ScrollCamera({
  getProgress,
  controlsRef,
  planetPositions,
  focusRef,
  onFocusComplete,
}: {
  getProgress: () => number;
  controlsRef: React.RefObject<{ enabled: boolean; autoRotate: boolean } | null>;
  planetPositions: Map<string, THREE.Vector3>;
  focusRef: React.MutableRefObject<FocusFlight>;
  onFocusComplete: (line: string) => void;
}) {
  const { camera } = useThree();
  const drift = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    /* click-to-focus flight: swoop to the clicked planet, then navigate */
    const focus = focusRef.current;
    if (focus) {
      if (focus.startedAt === null) focus.startedAt = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - focus.startedAt;
      const sink = planetPositions.get(focus.line);
      if (sink) {
        /* hover 2.4 units off the planet surface, approaching as we settle */
        const dir = desired.copy(camera.position).sub(sink).normalize();
        if (dir.lengthSq() < 1e-6) dir.set(0, 0.4, 1).normalize();
        desired.copy(sink).add(dir.multiplyScalar(2.4));
        camera.position.lerp(desired, 1 - Math.exp(-delta * 6));
        camera.lookAt(sink);
        /* FOV punch through the dive — a small warp hit before the jump */
        const persp = camera as THREE.PerspectiveCamera;
        persp.fov = 54 + 16 * Math.sin(Math.min(1, elapsed / 0.9) * Math.PI);
        persp.updateProjectionMatrix();
      }
      if (elapsed >= 0.9 && !focus.fired) {
        focus.fired = true;
        const line = focus.line;
        focusRef.current = null;
        onFocusComplete(line);
      }
      const controls = controlsRef.current;
      if (controls) { controls.enabled = false; controls.autoRotate = false; }
      return;
    }

    const p = THREE.MathUtils.clamp(getProgress(), 0, 1);
    /* idle drift keeps the far establishing shot alive before the dive;
       it eases out as the flight settles so explore mode is purely user-driven */
    const settle = THREE.MathUtils.smoothstep(p, 0.85, 1);
    drift.current += delta * 2.4 * (1 - settle);
    const path = sampleCameraPath(p);
    const breathe = 1 + 0.03 * Math.sin(state.clock.elapsedTime * 0.07) * settle;
    const r = path.r * breathe;
    const el = THREE.MathUtils.degToRad(path.el);
    const az = THREE.MathUtils.degToRad(path.az + drift.current);
    target.set(
      r * Math.cos(el) * Math.sin(az),
      r * Math.sin(el),
      r * Math.cos(el) * Math.cos(az),
    );

    /* guaranteed close encounter — mid-flight the camera swings past the
       health planet (the one with the most satellites) so its moons sweep
       the foreground, whatever their current orbital phase */
    let lookWeight = 0;
    const flyby = planetPositions.get('health');
    const flyW = THREE.MathUtils.smoothstep(p, 0.56, 0.68) * (1 - THREE.MathUtils.smoothstep(p, 0.80, 0.92));
    if (flyW > 0.001 && flyby && flyby.lengthSq() > 0) {
      const dir = desired.copy(camera.position).sub(flyby);
      if (dir.lengthSq() < 1e-6) dir.set(0, 0.35, 1);
      dir.normalize().multiplyScalar(5.4);
      desired.copy(flyby).add(dir);
      target.lerp(desired, flyW * 0.92);
      lookWeight = flyW;
    }

    /* critically-damped approach — scroll jitter never reaches the camera */
    camera.position.lerp(target, 1 - Math.exp(-delta * 3.2));

    /* flight drama: widen the FOV and bank the camera through the traverse,
       easing back to a calm instrument view at both ends of the scroll */
    const persp = camera as THREE.PerspectiveCamera;
    const speedCurve = Math.sin(THREE.MathUtils.smoothstep(p, 0.28, 0.88) * Math.PI);
    if (Math.abs(persp.fov - (50 + 16 * speedCurve)) > 0.01) {
      persp.fov = 50 + 16 * speedCurve;
      persp.updateProjectionMatrix();
    }
    const roll = 0.16 * speedCurve * Math.sin(state.clock.elapsedTime * 0.35);
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    lookTarget.set(0, 0, 0);
    if (lookWeight > 0 && flyby) lookTarget.lerp(flyby, lookWeight * 0.85);
    camera.lookAt(lookTarget);

    /* hand the camera to OrbitControls once the flight has settled */
    const interactive = p >= 0.97;
    const controls = controlsRef.current;
    if (controls && (controls.enabled !== interactive || controls.autoRotate !== interactive)) {
      controls.enabled = interactive;
      controls.autoRotate = interactive;
    }
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

function Scene({
  onPlanetClick,
  onPlanetFocusStart,
  active,
  onTelemetry,
  getProgress,
  coreRef,
  onCoreReady,
}: {
  onPlanetClick?: (line: string) => void;
  onPlanetFocusStart?: (line: string) => void;
  active: boolean;
  onTelemetry?: (az: number, el: number, dist: number) => void;
  getProgress: () => number;
  coreRef: React.MutableRefObject<THREE.Mesh | null>;
  onCoreReady: () => void;
}) {
  const controlsRef = useRef<{ enabled: boolean; autoRotate: boolean } | null>(null);
  const focusRef = useRef<FocusFlight>(null);
  /* live world positions per business line — feeds the focus flight */
  const planetPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    PLANETS.forEach((p) => map.set(p.line, new THREE.Vector3()));
    return map;
  }, []);

  return (
    <>
      {/* depth cue — the far side of the system falls away into the dark */}
      <fogExp2 attach="fog" args={['#020309', 0.015]} />
      <ambientLight intensity={0.06} color="#141e38" />
      <Sun coreRef={coreRef} onCoreReady={onCoreReady} />
      <CosmicDust />
      <NebulaClouds />
      <AsteroidBelt />
      <Comets count={IS_MOBILE ? 1 : 3} />
      {PLANETS.map((p) => (
        <PlanetSystem
          key={p.name}
          config={p}
          positionSink={planetPositions.get(p.line)}
          onClick={() => {
            /* focus flight first — swoop to the planet, then navigate */
            onPlanetFocusStart?.(p.line);
            focusRef.current = { line: p.line, startedAt: null, fired: false };
          }}
        />
      ))}
      <OrbitControls
        ref={controlsRef as never}
        enableDamping
        dampingFactor={0.04}
        minDistance={6}
        maxDistance={35}
        autoRotate={false}
        autoRotateSpeed={0.16}
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.28}
      />
      <ScrollCamera
        getProgress={getProgress}
        controlsRef={controlsRef}
        planetPositions={planetPositions}
        focusRef={focusRef}
        onFocusComplete={(line) => onPlanetClick?.(line)}
      />
      <CameraTelemetry onRead={onTelemetry ?? (() => {})} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading                                                            */
/* ------------------------------------------------------------------ */

function LoadingFallback() {
  const geo = useMemo(() => new THREE.SphereGeometry(0.3, 16, 16), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#16324e', wireframe: true }), []);

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  return <mesh geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export default function SolarSystem({
  onPlanetClick,
  onPlanetFocusStart,
  active = true,
  onTelemetry,
  getProgress,
}: {
  onPlanetClick?: (line: string) => void;
  onPlanetFocusStart?: (line: string) => void;
  active?: boolean;
  onTelemetry?: (az: number, el: number, dist: number) => void;
  getProgress?: () => number;
}) {
  const sunCoreRef = useRef<THREE.Mesh | null>(null);
  const [sunReady, setSunReady] = useState(false);

  return (
    <Canvas
      dpr={[1, 1.5]}
      /* nominal start — the scroll flight path takes over immediately */
      camera={{ position: [0, 16, 28], fov: 50, near: 0.1, far: 250 }}
      frameloop={active ? 'always' : 'never'}
      style={{ background: 'radial-gradient(ellipse at center, #060814 0%, #000105 100%)' }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Scene
          onPlanetClick={onPlanetClick}
          onPlanetFocusStart={onPlanetFocusStart}
          active={active}
          onTelemetry={onTelemetry}
          getProgress={getProgress ?? (() => 1)}
          coreRef={sunCoreRef}
          onCoreReady={() => setSunReady(true)}
        />
      </Suspense>
      {/* Post-processing: volumetric god rays from the star, cold bloom,
          subtle chromatic aberration + film grain for the cinematic read */}
      <EffectComposer>
        {sunReady && !IS_MOBILE && sunCoreRef.current ? (
          <GodRays
            sun={sunCoreRef.current}
            samples={36}
            density={0.93}
            decay={0.92}
            weight={0.5}
            exposure={0.42}
            clampMax={1}
            blur
          />
        ) : (
          <></>
        )}
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.95}
          mipmapBlur
        />
        {!IS_MOBILE ? (
          <ChromaticAberration
            offset={[0.00055, 0.0004]}
            radialModulation
            modulationOffset={0.4}
          />
        ) : (
          <></>
        )}
        <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} premultiply />
        <Vignette eskil={false} offset={0.28} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}

'use client';

import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useState } from 'react';

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
  color: string;
  emissiveHex: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  tilt: number;
  ringColor?: string;
  satellites: SatelliteConfig[];
}

/* ------------------------------------------------------------------ */
/*  Planet Data                                                        */
/* ------------------------------------------------------------------ */

const PLANETS: PlanetConfig[] = [
  {
    name: '大健康',
    color: '#4cc9f0',
    emissiveHex: '#0ea5e9',
    size: 0.6,
    orbitRadius: 5.5,
    orbitSpeed: 0.14,
    tilt: 0.15,
    satellites: Array.from({ length: 17 }, (_, i) => ({
      name: `健康${i + 1}`,
      size: 0.06,
      orbitRadius: 1.1 + Math.random() * 0.5,
      orbitSpeed: 0.4 + Math.random() * 0.4,
      orbitOffset: (i / 17) * Math.PI * 2,
    })),
  },
  {
    name: 'AI / 大模型',
    color: '#d8b4fe',
    emissiveHex: '#a855f7',
    size: 0.52,
    orbitRadius: 8.0,
    orbitSpeed: 0.10,
    tilt: -0.1,
    ringColor: '#a855f7',
    satellites: Array.from({ length: 7 }, (_, i) => ({
      name: `AI${i + 1}`,
      size: 0.055,
      orbitRadius: 0.9 + Math.random() * 0.4,
      orbitSpeed: 0.5 + Math.random() * 0.4,
      orbitOffset: (i / 7) * Math.PI * 2,
    })),
  },
  {
    name: 'Web 开发',
    color: '#fdba74',
    emissiveHex: '#f97316',
    size: 0.46,
    orbitRadius: 10.5,
    orbitSpeed: 0.08,
    tilt: 0.2,
    satellites: Array.from({ length: 4 }, (_, i) => ({
      name: `Web${i + 1}`,
      size: 0.05,
      orbitRadius: 0.85 + Math.random() * 0.3,
      orbitSpeed: 0.6 + Math.random() * 0.3,
      orbitOffset: (i / 4) * Math.PI * 2,
    })),
  },
  {
    name: '创意',
    color: '#fde68a',
    emissiveHex: '#f59e0b',
    size: 0.38,
    orbitRadius: 13.0,
    orbitSpeed: 0.06,
    tilt: -0.25,
    ringColor: '#f59e0b',
    satellites: [
      { name: '创意1', size: 0.045, orbitRadius: 0.75, orbitSpeed: 0.7, orbitOffset: 0 },
    ],
  },
  {
    name: '学术研究',
    color: '#5eead4',
    emissiveHex: '#2dd4bf',
    size: 0.42,
    orbitRadius: 15.5,
    orbitSpeed: 0.045,
    tilt: 0.12,
    satellites: Array.from({ length: 3 }, (_, i) => ({
      name: `学术${i + 1}`,
      size: 0.05,
      orbitRadius: 0.8 + Math.random() * 0.3,
      orbitSpeed: 0.5 + Math.random() * 0.3,
      orbitOffset: (i / 3) * Math.PI * 2,
    })),
  },
];

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
    vec4 p0 = vec4(a0.xy, h.x);
    vec4 p1 = vec4(a0.zw, h.y);
    vec4 p2 = vec4(a1.xy, h.z);
    vec4 p3 = vec4(a1.zw, h.w);
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
    vec3 core    = vec3(1.0, 0.97, 0.85);   // white-hot champagne
    vec3 inner   = vec3(1.0, 0.88, 0.52);   // warm golden amber
    vec3 mid     = vec3(1.0, 0.55, 0.10);   // vivid amber-orange
    vec3 edge    = vec3(0.92, 0.28, 0.05);  // deep crimson-orange
    vec3 limb    = vec3(0.62, 0.10, 0.02);  // dark limb for contrast

    float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    fresnel = pow(fresnel, 1.5);

    vec3 baseColor = mix(core, inner, fresnel * 0.3);
    baseColor = mix(baseColor, mid, fresnel * 0.55 + noise * 0.15);
    baseColor = mix(baseColor, edge, fresnel * fresnel * 0.65);
    baseColor = mix(baseColor, limb, pow(fresnel, 3.2) * 0.50);

    // Bright granulation spots with hotter color shift
    float hotSpot = smoothstep(0.15, 0.65, noise);
    baseColor += vec3(0.42, 0.28, 0.06) * hotSpot;

    // Solar flare streaks with stronger contrast
    float streak = snoise(vPosition * 3.0 + vec3(uTime * 0.07, 0.0, uTime * 0.05));
    float flareLine = smoothstep(0.46, 0.58, streak);
    baseColor += vec3(0.35, 0.18, 0.0) * flareLine * (1.0 - fresnel);

    // Secondary perpendicular flare network
    float streak2 = snoise(vPosition * 5.0 + vec3(0.0, uTime * 0.04, uTime * 0.06));
    float flareLine2 = smoothstep(0.54, 0.64, streak2);
    baseColor += vec3(0.24, 0.12, 0.0) * flareLine2 * (1.0 - fresnel) * 0.6;

    // Tertiary fine-scale granulation for photospheric detail
    float gran = snoise(vPosition * 22.0 + uTime * 0.04);
    float granDetail = smoothstep(0.35, 0.65, gran) * 0.08;
    baseColor += vec3(0.14, 0.09, 0.01) * granDetail * (1.0 - fresnel);

    // Limb-brightened prominences -- concentrated at the solar edge
    float promNoise = snoise(vPosition * 2.2 + vec3(uTime * 0.03, uTime * 0.02, 0.0));
    float promMask = smoothstep(0.40, 0.75, fresnel) * smoothstep(0.35, 0.65, promNoise);
    baseColor += vec3(0.30, 0.12, 0.02) * promMask * 0.8;

    // Sunspots with penumbra and chromatic darkening
    float spotNoise = snoise(vPosition * 5.5 + uTime * 0.035);
    float penumbra = smoothstep(0.52, 0.64, spotNoise);
    float umbra = smoothstep(0.70, 0.76, spotNoise);
    baseColor *= 1.0 - penumbra * 0.22 - umbra * 0.30;
    // Slight reddish tint in umbra (chromospheric emission)
    baseColor += vec3(0.06, 0.0, 0.0) * umbra;

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
    vec3 innerColor = vec3(1.0, 0.94, 0.72);
    vec3 midColor = vec3(1.0, 0.70, 0.28);
    vec3 outerColor = uColor;
    vec3 deepColor = vec3(0.85, 0.35, 0.08);
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

    vec3 colorInner = vec3(1.0, 0.75, 0.34);
    vec3 colorMid = vec3(0.94, 0.44, 0.10);
    vec3 colorOuter = vec3(0.80, 0.26, 0.05);
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

function Sun() {
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
      uColor: { value: new THREE.Color('#ff9944') },
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
      <pointLight intensity={12} distance={75} decay={2} color="#ffaa44" />
      {/* Secondary fill light for softer ambient bounce */}
      <pointLight intensity={3.0} distance={40} decay={2} color="#ff8844" />
      {/* Tertiary subtle warm-cool rim for color depth */}
      <pointLight intensity={1.0} distance={22} decay={2} color="#ffcc88" />
      {/* Quaternary ultra-soft wide fill for deep shadow lift */}
      <pointLight intensity={0.4} distance={58} decay={2} color="#ffddaa" />

      {/* Sun core */}
      <mesh ref={meshRef} geometry={sunGeo}>
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Inner photosphere glow - soft transition between core and corona */}
      <mesh ref={innerGlowRef} geometry={innerGlowGeo}>
        <meshBasicMaterial
          color="#ffd066"
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
          color="#ff8830"
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
          color="#ff6618"
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
}

function PlanetBody({ color, emissiveHex, size, tilt, ringColor }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  const colorObj = useMemo(() => new THREE.Color(color), [color]);
  const emissiveObj = useMemo(() => new THREE.Color(emissiveHex), [emissiveHex]);

  const geo = useMemo(() => new THREE.SphereGeometry(1, 48, 48), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: colorObj,
        emissive: emissiveObj,
        emissiveIntensity: 0.35,
        roughness: 0.32,
        metalness: 0.52,
      }),
    [colorObj, emissiveObj],
  );

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

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.25;
    const target = hovered ? 1.22 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 4.5);
    meshRef.current.scale.setScalar(scaleRef.current);
    if (atmosRef.current) atmosRef.current.scale.setScalar(scaleRef.current * 1.20);
    if (ringRef.current) ringRef.current.scale.setScalar(scaleRef.current);
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hovered ? 0.90 : 0.35, delta * 3.5);
    atmosMat.opacity = THREE.MathUtils.lerp(atmosMat.opacity, hovered ? 0.40 : 0.18, delta * 3.5);
    outerAtmosMat.opacity = THREE.MathUtils.lerp(outerAtmosMat.opacity, hovered ? 0.16 : 0.08, delta * 3.5);
    ultraAtmosMat.opacity = THREE.MathUtils.lerp(ultraAtmosMat.opacity, hovered ? 0.07 : 0.035, delta * 3.5);
  });

  useEffect(() => {
    return () => {
      geo.dispose(); mat.dispose();
      atmosGeo.dispose(); atmosMat.dispose();
      outerAtmosGeo.dispose(); outerAtmosMat.dispose();
      ultraAtmosGeo.dispose(); ultraAtmosMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
    };
  }, [geo, mat, atmosGeo, atmosMat, outerAtmosGeo, outerAtmosMat, ultraAtmosGeo, ultraAtmosMat, ringGeo, ringMat]);

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh
        ref={meshRef}
        geometry={geo}
        material={mat}
        scale={size}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      />
      <mesh ref={atmosRef} geometry={atmosGeo} material={atmosMat} scale={size * 1.15} />
      <mesh geometry={outerAtmosGeo} material={outerAtmosMat} scale={size * 1.3} />
      <mesh geometry={ultraAtmosGeo} material={ultraAtmosMat} scale={size * 1.5} />
      {ringColor && (
        <mesh ref={ringRef} geometry={ringGeo} material={ringMat} scale={size} rotation={[Math.PI / 2.5, 0, 0]} />
      )}
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
  const count = 7500;

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
  const count = 45;

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
/*  Camera Auto-Dolly (cinematic breathing + orbital drift)            */
/* ------------------------------------------------------------------ */

function CameraAutoDolly() {
  const { camera } = useThree();
  const baseDistance = useRef(0);
  const initialized = useRef(false);

  useFrame((state) => {
    if (!initialized.current) {
      baseDistance.current = camera.position.length();
      initialized.current = true;
    }
    const t = state.clock.elapsedTime;
    // Breathing zoom with richer organic rhythm
    const dollyFactor = 1.0 + 0.035 * Math.sin(t * 0.07) + 0.018 * Math.sin(t * 0.04 + 1.0)
                      + 0.008 * Math.sin(t * 0.17 + 2.5) + 0.005 * Math.sin(t * 0.29 + 0.7)
                      + 0.002 * Math.sin(t * 0.43 + 3.1);
    const dir = camera.position.clone().normalize();
    const targetDist = baseDistance.current * dollyFactor;
    const currentDist = camera.position.length();
    const newDist = THREE.MathUtils.lerp(currentDist, targetDist, 0.010);
    camera.position.copy(dir.multiplyScalar(newDist));

    // Gentle vertical sway with layered oscillation for cinematic drift
    const sway = 0.22 * Math.sin(t * 0.04) + 0.10 * Math.sin(t * 0.08 + 0.5)
               + 0.05 * Math.sin(t * 0.15 + 1.8) + 0.02 * Math.sin(t * 0.27 + 2.2);
    const normalizedY = camera.position.y / currentDist;
    camera.position.y = newDist * (normalizedY + sway * 0.004);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Complete Planet System (planet + orbit + satellites)               */
/* ------------------------------------------------------------------ */

function PlanetSystem({ config }: { config: PlanetConfig }) {
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
  });

  return (
    <>
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
        />
        {config.satellites.map((s) => (
          <Satellite key={s.name} config={s} parentColor={config.color} />
        ))}
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.06} color="#141e38" />
      <Sun />
      <CosmicDust />
      <NebulaClouds />
      {PLANETS.map((p) => (
        <PlanetSystem key={p.name} config={p} />
      ))}
      <OrbitControls
        enableDamping
        dampingFactor={0.04}
        minDistance={6}
        maxDistance={35}
        autoRotate
        autoRotateSpeed={0.16}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.28}
      />
      <CameraAutoDolly />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading                                                            */
/* ------------------------------------------------------------------ */

function LoadingFallback() {
  const geo = useMemo(() => new THREE.SphereGeometry(0.3, 16, 16), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#222', wireframe: true }), []);

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  return <mesh geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export default function SolarSystem() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 10, 18], fov: 50, near: 0.1, far: 250 }}
      style={{ background: 'radial-gradient(ellipse at center, #080818 0%, #000004 100%)' }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.25 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Scene />
      </Suspense>
      {/* Post-processing: tuned bloom for dramatic sun glow with clean planet rendering */}
      <EffectComposer>
        <Bloom
          intensity={1.85}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.95}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.28} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}

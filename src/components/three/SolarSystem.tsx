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
    color: '#38bdf8',
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
    color: '#c4b5fd',
    emissiveHex: '#8b5cf6',
    size: 0.52,
    orbitRadius: 8.0,
    orbitSpeed: 0.10,
    tilt: -0.1,
    ringColor: '#8b5cf6',
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
    color: '#fde047',
    emissiveHex: '#eab308',
    size: 0.38,
    orbitRadius: 13.0,
    orbitSpeed: 0.06,
    tilt: -0.25,
    ringColor: '#eab308',
    satellites: [
      { name: '创意1', size: 0.045, orbitRadius: 0.75, orbitSpeed: 0.7, orbitOffset: 0 },
    ],
  },
  {
    name: '学术研究',
    color: '#5eead4',
    emissiveHex: '#14b8a6',
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
    // Multi-frequency pulsing for organic feel
    float pulse = 0.85 + 0.10 * sin(uTime * 2.0) + 0.05 * sin(uTime * 0.7 + 1.3) + 0.04 * sin(uTime * 5.1 + 2.7);

    // Surface detail with five octaves for richer texture
    float n1 = snoise(vPosition * 2.0 + uTime * 0.15);
    float n2 = snoise(vPosition * 4.0 - uTime * 0.1);
    float n3 = snoise(vPosition * 8.0 + uTime * 0.2);
    float n4 = snoise(vPosition * 16.0 - uTime * 0.12);
    float n5 = snoise(vPosition * 32.0 + uTime * 0.08);
    float noise = n1 * 0.40 + n2 * 0.25 + n3 * 0.18 + n4 * 0.10 + n5 * 0.07;

    // Enhanced solar palette with chromatic granulation
    vec3 core = vec3(1.0, 0.95, 0.72);   // white-hot pale gold
    vec3 mid  = vec3(1.0, 0.58, 0.12);    // vivid orange
    vec3 edge = vec3(0.90, 0.25, 0.04);   // deep crimson-amber
    vec3 limb = vec3(0.70, 0.12, 0.02);   // dark limb for contrast

    float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    fresnel = pow(fresnel, 1.6);

    vec3 baseColor = mix(core, mid, fresnel * 0.55 + noise * 0.18);
    baseColor = mix(baseColor, edge, fresnel * fresnel * 0.6);
    baseColor = mix(baseColor, limb, pow(fresnel, 3.5) * 0.4);

    // Brighten surface granulation spots
    float hotSpot = smoothstep(0.25, 0.75, noise);
    baseColor += vec3(0.30, 0.18, 0.02) * hotSpot;

    // Solar flare streaks along surface
    float streak = snoise(vPosition * 3.0 + vec3(uTime * 0.08, 0.0, uTime * 0.06));
    float flareLine = smoothstep(0.55, 0.65, streak);
    baseColor += vec3(0.25, 0.12, 0.0) * flareLine * (1.0 - fresnel);

    // Dark spots (sunspots) with penumbra
    float spotNoise = snoise(vPosition * 6.0 + uTime * 0.04);
    float penumbra = smoothstep(0.55, 0.65, spotNoise);
    float umbra = smoothstep(0.68, 0.72, spotNoise);
    baseColor *= 1.0 - penumbra * 0.2 - umbra * 0.25;

    float brightness = (0.95 + noise * 0.18) * pulse;
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
    float intensity = pow(max(fresnel, 0.0), 2.0);

    // Multi-layered ray streaks for solar corona texture
    vec3 dir = normalize(vWorldPosition);
    float angle = atan(dir.z, dir.x);
    float streak1 = 0.65 + 0.35 * sin(angle * 6.0 + uTime * 0.6);
    float streak2 = 0.75 + 0.25 * sin(angle * 11.0 - uTime * 1.0);
    float streak3 = 0.85 + 0.15 * sin(angle * 19.0 + uTime * 1.5);
    float streak = streak1 * streak2 * streak3;

    // Streamer-like modulation: long radial features
    float streamer = 0.7 + 0.3 * smoothstep(0.4, 0.6, sin(angle * 3.0 + uTime * 0.15));

    // Rich multi-frequency pulsing
    float pulse = 0.65 + 0.18 * sin(uTime * 1.8) + 0.10 * sin(uTime * 4.7 + 0.8)
                + 0.05 * sin(uTime * 8.1 + 2.0) + 0.03 * sin(uTime * 12.3 + 1.5);

    // Enhanced color gradient: pale gold inner → deep orange outer
    vec3 innerColor = vec3(1.0, 0.90, 0.55);
    vec3 midColor = vec3(1.0, 0.65, 0.25);
    vec3 outerColor = uColor;
    float depth = pow(max(fresnel, 0.0), 0.7);
    vec3 glowColor = mix(innerColor, midColor, depth * 0.5);
    glowColor = mix(glowColor, outerColor, depth);

    vec3 glow = glowColor * intensity * streak * streamer * pulse * 3.2;
    float alpha = intensity * 0.7 * pulse * streak * streamer;
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
    float intensity = pow(max(fresnel, 0.0), 2.8);

    vec3 dir = normalize(vWorldPosition);
    float angle = atan(dir.z, dir.x);

    // Dense radial rays with varied frequencies
    float rays1 = 0.55 + 0.45 * sin(angle * 10.0 + uTime * 0.4);
    float rays2 = 0.70 + 0.30 * cos(angle * 17.0 - uTime * 0.7);
    float rays3 = 0.80 + 0.20 * sin(angle * 5.0 + uTime * 0.25);
    float rays = rays1 * rays2 * rays3;

    // Asymmetric brightness (one side brighter, like real corona)
    float asymmetry = 0.85 + 0.15 * sin(angle + uTime * 0.1);

    float pulse = 0.75 + 0.15 * sin(uTime * 1.2) + 0.07 * sin(uTime * 3.1) + 0.03 * sin(uTime * 7.0);

    vec3 colorInner = vec3(1.0, 0.70, 0.25);
    vec3 colorOuter = vec3(0.85, 0.30, 0.06);
    vec3 color = mix(colorInner, colorOuter, pow(max(fresnel, 0.0), 1.5));

    vec3 glow = color * intensity * rays * asymmetry * pulse * 2.2;
    float alpha = intensity * rays * asymmetry * pulse * 0.45;
    gl_FragColor = vec4(glow, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/*  Sun Component                                                      */
/* ------------------------------------------------------------------ */

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
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
  const coronaGeo = useMemo(() => new THREE.SphereGeometry(1.35, 48, 48), []);
  const outerCoronaGeo = useMemo(() => new THREE.SphereGeometry(1.9, 48, 48), []);
  const midHazeGeo = useMemo(() => new THREE.SphereGeometry(2.4, 32, 32), []);
  const outerGeo = useMemo(() => new THREE.SphereGeometry(3.5, 32, 32), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    coronaUniforms.uTime.value = t;
    outerCoronaUniforms.uTime.value = t;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05;
    }
    if (coronaRef.current) {
      const s = 1.0 + 0.08 * Math.sin(t * 2.0) + 0.04 * Math.sin(t * 5.3);
      coronaRef.current.scale.setScalar(s);
    }
    if (outerCoronaRef.current) {
      const s = 1.0 + 0.06 * Math.sin(t * 1.4 + 0.7) + 0.03 * Math.sin(t * 3.8);
      outerCoronaRef.current.scale.setScalar(s);
    }
    if (midHazeRef.current) {
      const s = 1.0 + 0.04 * Math.sin(t * 1.1 + 1.2) + 0.025 * Math.sin(t * 2.9);
      midHazeRef.current.scale.setScalar(s);
    }
    if (outerRef.current) {
      const s = 1.0 + 0.035 * Math.sin(t * 0.9 + 0.5) + 0.02 * Math.sin(t * 2.1);
      outerRef.current.scale.setScalar(s);
    }
  });

  useEffect(() => {
    return () => {
      sunGeo.dispose();
      coronaGeo.dispose();
      outerCoronaGeo.dispose();
      midHazeGeo.dispose();
      outerGeo.dispose();
    };
  }, [sunGeo, coronaGeo, outerCoronaGeo, midHazeGeo, outerGeo]);

  return (
    <group>
      {/* Primary warm point light */}
      <pointLight intensity={8} distance={60} decay={2} color="#ffaa55" />
      {/* Secondary fill light for softer ambient bounce */}
      <pointLight intensity={2.0} distance={30} decay={2} color="#ff8844" />
      {/* Tertiary subtle cool-warm rim for color depth */}
      <pointLight intensity={0.6} distance={15} decay={2} color="#ffcc88" />

      {/* Sun core */}
      <mesh ref={meshRef} geometry={sunGeo}>
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
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
          color="#ff8833"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Diffuse outer haze */}
      <mesh ref={outerRef} geometry={outerGeo}>
        <meshBasicMaterial
          color="#ff6620"
          transparent
          opacity={0.03}
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

function PlanetBody({ name, color, emissiveHex, size, tilt, ringColor }: PlanetMeshProps) {
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
        emissiveIntensity: 0.25,
        roughness: 0.5,
        metalness: 0.35,
      }),
    [colorObj, emissiveObj],
  );

  const atmosGeo = useMemo(() => new THREE.SphereGeometry(1.18, 32, 32), []);
  const atmosMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colorObj],
  );

  // Second atmosphere layer for softer outer glow
  const outerAtmosGeo = useMemo(() => new THREE.SphereGeometry(1.35, 24, 24), []);
  const outerAtmosMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colorObj],
  );

  const ringGeo = useMemo(
    () => new THREE.RingGeometry(1.4, 1.85, 64),
    [],
  );
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(ringColor ?? color),
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color, ringColor],
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.3;
    const target = hovered ? 1.2 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 5);
    meshRef.current.scale.setScalar(scaleRef.current);
    if (atmosRef.current) atmosRef.current.scale.setScalar(scaleRef.current * 1.18);
    if (ringRef.current) ringRef.current.scale.setScalar(scaleRef.current);
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hovered ? 0.65 : 0.25, delta * 4);
    atmosMat.opacity = THREE.MathUtils.lerp(atmosMat.opacity, hovered ? 0.28 : 0.12, delta * 4);
    outerAtmosMat.opacity = THREE.MathUtils.lerp(outerAtmosMat.opacity, hovered ? 0.10 : 0.05, delta * 4);
  });

  useEffect(() => {
    return () => {
      geo.dispose(); mat.dispose();
      atmosGeo.dispose(); atmosMat.dispose();
      outerAtmosGeo.dispose(); outerAtmosMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
    };
  }, [geo, mat, atmosGeo, atmosMat, outerAtmosGeo, outerAtmosMat, ringGeo, ringMat]);

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
  const geo = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(parentColor).lerp(new THREE.Color('#ffffff'), 0.35),
        emissive: new THREE.Color(parentColor),
        emissiveIntensity: 0.15,
        roughness: 0.5,
        metalness: 0.25,
      }),
    [parentColor],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    angle.current += config.orbitSpeed * delta;
    ref.current.position.x = Math.cos(angle.current) * config.orbitRadius;
    ref.current.position.z = Math.sin(angle.current) * config.orbitRadius;
    ref.current.position.y = Math.sin(angle.current * 1.7) * 0.05; // subtle vertical bob
    ref.current.rotation.y += delta * 0.8;
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
        opacity: 0.14,
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

  const { positions, alphas } = useMemo(() => {
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
      alp[i] = 0.12 + Math.random() * 0.2;
      offsets[i] = a;
    }
    angleOffsets.current = offsets;
    return { positions: pos, alphas: alp };
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
        size: 0.05,
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  // Subtle drift animation
  useFrame((_, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const offsets = angleOffsets.current;
    const speed = 0.025;
    for (let i = 0; i < count; i++) {
      offsets[i] += speed * delta;
      arr[i * 3] = Math.cos(offsets[i]) * radius + Math.sin(offsets[i] * 3) * 0.08;
      arr[i * 3 + 2] = Math.sin(offsets[i]) * radius + Math.cos(offsets[i] * 2) * 0.08;
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

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Per-star twinkle with unique speed and phase
    float twinkle = 0.6 + 0.4 * sin(uTime * aTwinkleSpeed + aPhase);
    // Brighter stars twinkle less (more stable), dimmer ones twinkle more
    float sizeFactor = mix(1.0, twinkle, 0.5 - aSize * 1.5);
    gl_PointSize = aSize * sizeFactor * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = twinkle * (0.7 + 0.3 * aSize);
  }
`;

const dustFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function CosmicDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 5000;

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

      // Varied star colors: warm white, cool blue, purple, faint gold, rose
      const type = Math.random();
      if (type < 0.35) {
        // Warm white / yellow-white
        const b = 0.7 + Math.random() * 0.3;
        col[i * 3] = b; col[i * 3 + 1] = b * 0.95; col[i * 3 + 2] = b * 0.82;
      } else if (type < 0.55) {
        // Cool blue
        col[i * 3] = 0.3 + Math.random() * 0.2;
        col[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        col[i * 3 + 2] = 0.85 + Math.random() * 0.15;
      } else if (type < 0.70) {
        // Purple / violet
        col[i * 3] = 0.5 + Math.random() * 0.25;
        col[i * 3 + 1] = 0.2 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.3;
      } else if (type < 0.82) {
        // Faint gold / amber
        col[i * 3] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 1] = 0.6 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.2 + Math.random() * 0.15;
      } else if (type < 0.92) {
        // Rose / pink accent
        col[i * 3] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 1] = 0.3 + Math.random() * 0.2;
        col[i * 3 + 2] = 0.4 + Math.random() * 0.2;
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
  const count = 24;

  const meshes = useMemo(() => {
    const items: { position: [number, number, number]; scale: number; color: string; opacity: number; pulseSpeed: number; pulsePhase: number }[] = [];
    const colors = [
      '#1a0a4e', '#0a1628', '#0d3756', '#1a0a2e', '#052a4c', '#12083a',
      '#0a2d5e', '#1e0845', '#083040', '#150a50', '#0a2845', '#1c0842',
      '#0b1a3e', '#180a56', '#062040', '#200a50', '#0a3560', '#140840',
      '#0f1852', '#081e3a', '#1a0838', '#0c2a50', '#10083e', '#062848',
    ];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 30 + Math.random() * 50;
      const ySpread = (Math.random() - 0.5) * 50;
      items.push({
        position: [
          Math.cos(angle) * r + (Math.random() - 0.5) * 10,
          ySpread,
          Math.sin(angle) * r + (Math.random() - 0.5) * 10,
        ],
        scale: 12 + Math.random() * 40,
        color: colors[i % colors.length],
        opacity: 0.08 + Math.random() * 0.12,
        pulseSpeed: 0.2 + Math.random() * 0.5,
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
        cloudMaterials[i].opacity = base + base * 0.2 * Math.sin(t * m.pulseSpeed + m.pulsePhase);
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
    // Breathing zoom with three frequencies for organic rhythm
    const dollyFactor = 1.0 + 0.04 * Math.sin(t * 0.10) + 0.02 * Math.sin(t * 0.06 + 1.0) + 0.01 * Math.sin(t * 0.22 + 2.5);
    const dir = camera.position.clone().normalize();
    const targetDist = baseDistance.current * dollyFactor;
    const currentDist = camera.position.length();
    const newDist = THREE.MathUtils.lerp(currentDist, targetDist, 0.012);
    camera.position.copy(dir.multiplyScalar(newDist));

    // Gentle vertical sway with slower oscillation
    const sway = 0.25 * Math.sin(t * 0.06) + 0.12 * Math.sin(t * 0.11 + 0.5);
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
      <ambientLight intensity={0.08} color="#223355" />
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
        autoRotateSpeed={0.15}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
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
      style={{ background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000005 100%)' }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Scene />
      </Suspense>
      {/* Post-processing: tuned bloom for dramatic sun glow with clean planet rendering */}
      <EffectComposer>
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.3} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}

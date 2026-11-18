/**
 * Procedural planet surface materials — turns the business-line planets from
 * billiard balls into worlds: fbm continents, polar caps, ocean sun-glint,
 * night-side gold city lights, Fresnel atmosphere rim, and an animated cloud
 * shell. Shared simplex-noise GLSL (Ashima 3D, the corrected vec3 variant).
 */

import * as THREE from 'three';

const SNOISE_GLSL = `
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
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}
`;

const PLANET_VERTEX = `
varying vec3 vObjPos;
varying vec3 vWorldPos;
varying vec3 vNormalW;
void main() {
  vObjPos = normalize(position);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const PLANET_FRAGMENT = `
uniform float uTime;
uniform float uHover;
uniform float uSeed;
uniform vec3 uColor;
uniform vec3 uColorDeep;
varying vec3 vObjPos;
varying vec3 vWorldPos;
varying vec3 vNormalW;
${SNOISE_GLSL}
void main() {
  vec3 n = normalize(vObjPos);
  /* the star sits at the world origin, so the day/night terminator
     is simply the direction back to it */
  vec3 sunDir = normalize(-vWorldPos);
  vec3 normalW = normalize(vNormalW);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);

  float diff = dot(normalW, sunDir);
  float day = smoothstep(-0.12, 0.25, diff);

  float terrain = fbm(n * 2.4 + vec3(uSeed));
  float land = smoothstep(0.03, 0.16, terrain);
  float height = smoothstep(0.16, 0.55, terrain);

  vec3 ocean = uColorDeep * (0.75 + 0.45 * smoothstep(-0.4, 0.5, snoise(n * 5.0 + uSeed)));
  vec3 landCol = mix(uColor, uColor * 1.4 + vec3(0.05), height);
  vec3 surface = mix(ocean, landCol, land);

  /* polar caps */
  float polar = smoothstep(0.70, 0.86, abs(n.y) + terrain * 0.08);
  surface = mix(surface, vec3(0.92, 0.96, 1.0), polar);

  /* night-side city lights — gold, the site's calibration accent */
  float cities = smoothstep(0.52, 0.8, snoise(n * 26.0 + uSeed * 3.1)) * land * (1.0 - polar);
  vec3 nightGlow = vec3(1.0, 0.78, 0.42) * cities * (1.0 - day) * (0.6 + uHover * 0.9);

  /* ocean sun-glint */
  float spec = pow(max(dot(reflect(-sunDir, normalW), viewDir), 0.0), 42.0) * (1.0 - land) * day;

  /* atmosphere rim */
  float fres = pow(1.0 - max(dot(normalW, viewDir), 0.0), 2.6);
  vec3 rim = uColor * fres * (0.45 + day * 0.85 + uHover * 0.7);

  vec3 col = surface * (0.14 + day * 1.2) + nightGlow + vec3(0.9, 0.95, 1.0) * spec * 0.55 + rim * 0.7;
  gl_FragColor = vec4(col, 1.0);
}
`;

const CLOUD_FRAGMENT = `
uniform float uTime;
uniform float uSeed;
varying vec3 vObjPos;
varying vec3 vWorldPos;
varying vec3 vNormalW;
${SNOISE_GLSL}
void main() {
  vec3 n = normalize(vObjPos);
  vec3 sunDir = normalize(-vWorldPos);
  float day = smoothstep(-0.15, 0.3, dot(normalize(vNormalW), sunDir));
  float c = snoise(n * 3.0 + vec3(uTime * 0.009, uSeed, uTime * 0.005));
  c += 0.5 * snoise(n * 6.5 - vec3(uTime * 0.006, 0.0, uSeed));
  float alpha = smoothstep(0.28, 0.75, c) * (0.14 + day * 0.5);
  gl_FragColor = vec4(vec3(0.93, 0.97, 1.0), alpha);
}
`;

export type PlanetSurfaceMaterial = THREE.ShaderMaterial & {
  uniforms: { uTime: { value: number }; uHover: { value: number }; uSeed: { value: number }; uColor: { value: THREE.Color }; uColorDeep: { value: THREE.Color } };
};

export function createPlanetSurfaceMaterial(colorHex: string, seed: number): PlanetSurfaceMaterial {
  const base = new THREE.Color(colorHex);
  const deep = base.clone().multiplyScalar(0.22).lerp(new THREE.Color('#04101e'), 0.55);
  return new THREE.ShaderMaterial({
    vertexShader: PLANET_VERTEX,
    fragmentShader: PLANET_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uHover: { value: 0 },
      uSeed: { value: seed },
      uColor: { value: base },
      uColorDeep: { value: deep },
    },
  }) as PlanetSurfaceMaterial;
}

export function createCloudMaterial(seed: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: PLANET_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uSeed: { value: seed + 17.3 },
    },
    transparent: true,
    depthWrite: false,
  });
}

export function seedFromLine(line: string): number {
  let hash = 0;
  for (let i = 0; i < line.length; i += 1) {
    hash = (hash * 31 + line.charCodeAt(i)) % 997;
  }
  return hash * 0.173;
}

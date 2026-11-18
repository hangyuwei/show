/**
 * Adapted from ThreeUI Community (https://github.com/MengTo/threeui) — MIT License.
 * Changes: import three@0.184 instead of the bundled three128 alias; palette
 * retuned from violet to the site's astrolabe scheme — cyan telemetry particles
 * and orbits with gold calibration nodes.
 */

import * as THREE from "three";

export type OrbitalSphereOptions = { speed: number; particleSize: number; particleOpacity: number; orbitOpacity: number; scale: number; haloOpacity: number; hue: number };
export const ORBITAL_SPHERE_DEFAULTS: OrbitalSphereOptions = { speed: 1, particleSize: 0.015, particleOpacity: 0.8, orbitOpacity: 0.25, scale: 1, haloOpacity: 0.2, hue: 0 };

function createGlowTexture(): THREE.CanvasTexture {
  const size = 64, canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export function createOrbitalSphereRenderer(canvas: HTMLCanvasElement, getOptions: () => OrbitalSphereOptions) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const networkGroup = new THREE.Group(); scene.add(networkGroup);
  const radius = 2.2, particleCount = 15000;
  const positions = new Float32Array(particleCount * 3), colors = new Float32Array(particleCount * 3);
  const colorBright = new THREE.Color(0x65d8ff), colorDim = new THREE.Color(0x2f7fb8);
  let validIndex = 0;
  for (let index = 0; index < particleCount; index += 1) {
    const phi = Math.acos(-1 + (2 * index) / particleCount), theta = Math.sqrt(particleCount * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi), y = radius * Math.sin(theta) * Math.sin(phi), z = radius * Math.cos(phi);
    const noise = Math.sin(x * 3.5) * Math.cos(y * 3.5) * Math.sin(z * 3.5) + Math.cos(x * 6) * 0.4;
    if (noise <= -0.1) continue;
    const distortion = 1 + noise * 0.1;
    positions[validIndex * 3] = x * distortion; positions[validIndex * 3 + 1] = y * distortion; positions[validIndex * 3 + 2] = z * distortion;
    const mixedColor = colorDim.clone().lerp(colorBright, noise > 0.5 ? 1 : 0.55);
    colors[validIndex * 3] = mixedColor.r; colors[validIndex * 3 + 1] = mixedColor.g; colors[validIndex * 3 + 2] = mixedColor.b; validIndex += 1;
  }
  const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions.slice(0, validIndex * 3), 3)); particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors.slice(0, validIndex * 3), 3));
  const glowTexture = createGlowTexture();
  const particleMaterial = new THREE.PointsMaterial({ size: 0.015, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, map: glowTexture, sizeAttenuation: true }); networkGroup.add(new THREE.Points(particleGeometry, particleMaterial));
  const orbitMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(0x65d8ff).multiplyScalar(1.5), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
  const orbitGeometries: THREE.BufferGeometry[] = [], nodeGeometries: THREE.BufferGeometry[] = [], nodeMaterials: THREE.Material[] = [], haloMaterials: THREE.MeshBasicMaterial[] = [];
  let responsiveScale = 1;
  for (let index = 0; index < 6; index += 1) {
    const geometry = new THREE.BufferGeometry(), points: number[] = [], orbitRadius = radius * (1.08 + Math.random() * 0.2);
    for (let point = 0; point <= 90; point += 1) { const angle = (point / 90) * Math.PI * 2; points.push(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, Math.sin(angle * 4) * 0.1); }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3)); orbitGeometries.push(geometry);
    const line = new THREE.Line(geometry, orbitMaterial); line.rotation.x = Math.random() * Math.PI * 2; line.rotation.y = Math.random() * Math.PI * 2; networkGroup.add(line);
    if (index % 2 !== 0) {
      const nodeGeometry = new THREE.SphereGeometry(0.06, 16, 16), nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xf2c166 }), node = new THREE.Mesh(nodeGeometry, nodeMaterial); const angle = Math.random() * Math.PI * 2; node.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0); line.add(node);
      const haloGeometry = new THREE.SphereGeometry(0.17, 16, 16), haloMaterial = new THREE.MeshBasicMaterial({ color: 0xf2c166, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending }), halo = new THREE.Mesh(haloGeometry, haloMaterial); node.add(halo);
      nodeGeometries.push(nodeGeometry, haloGeometry); nodeMaterials.push(nodeMaterial, haloMaterial); haloMaterials.push(haloMaterial);
    }
  }
  const coreMaterial = new THREE.SpriteMaterial({ map: glowTexture, color: 0x65d8ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
  const coreGlow = new THREE.Sprite(coreMaterial); coreGlow.scale.setScalar(3.2); networkGroup.add(coreGlow);
  const heartMaterial = new THREE.SpriteMaterial({ map: glowTexture, color: 0xbfeaff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
  const heartGlow = new THREE.Sprite(heartMaterial); heartGlow.scale.setScalar(1.15); networkGroup.add(heartGlow);
  const pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
  const onPointerMove = (event: PointerEvent) => { pointer.x = (event.clientX / window.innerWidth) * 2 - 1; pointer.y = -((event.clientY / window.innerHeight) * 2 - 1); };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  let lastTime = performance.now();

  return {
    resize(width: number, height: number) {
      camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
      const options = getOptions();
      if (width >= 1024) { networkGroup.position.set(0, 0.8, -4); responsiveScale = 1.9; camera.position.z = 7; }
      else { networkGroup.position.set(0, -1, -3); responsiveScale = 1; camera.position.z = 6.5; }
      networkGroup.scale.setScalar(responsiveScale * options.scale);
    },
    render() {
      const options = getOptions(); particleMaterial.size = options.particleSize; particleMaterial.opacity = options.particleOpacity; orbitMaterial.opacity = options.orbitOpacity; haloMaterials.forEach((material) => material.opacity = options.haloOpacity); networkGroup.scale.setScalar(responsiveScale * options.scale);
      networkGroup.rotation.y += 0.0008 * options.speed; networkGroup.rotation.x += 0.0003 * options.speed;
      networkGroup.children.forEach((child: THREE.Object3D, index: number) => { if (child.type === "Line") child.rotation.z += 0.0004 * options.speed * (index % 2 === 0 ? 1 : -1); });
      const now = performance.now(), dt = Math.min(64, now - lastTime); lastTime = now;
      const pulse = 1 + Math.sin(now * 0.0014) * 0.14;
      coreGlow.scale.setScalar(3.2 * pulse); heartGlow.scale.setScalar(1.15 * (1 + Math.sin(now * 0.0021) * 0.2));
      eased.x += (pointer.x - eased.x) * Math.min(1, dt * 0.004); eased.y += (pointer.y - eased.y) * Math.min(1, dt * 0.004);
      camera.position.x = eased.x * 0.55; camera.position.y = camera.position.z > 6.8 ? 0.8 + eased.y * 0.4 : -1 + eased.y * 0.4;
      camera.lookAt(networkGroup.position); renderer.render(scene, camera);
    },
    dispose() { window.removeEventListener("pointermove", onPointerMove); particleGeometry.dispose(); particleMaterial.dispose(); orbitMaterial.dispose(); orbitGeometries.forEach((item) => item.dispose()); nodeGeometries.forEach((item) => item.dispose()); nodeMaterials.forEach((item) => item.dispose()); coreMaterial.dispose(); heartMaterial.dispose(); glowTexture.dispose(); renderer.dispose(); },
  };
}

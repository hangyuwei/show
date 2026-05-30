'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const sceneType = 'neural-network';

interface NodeData {
  position: [number, number, number];
  layer: number;
}

const LAYER_CONFIG = [4, 6, 6, 4, 2];

function generateNodes(): NodeData[] {
  const nodes: NodeData[] = [];
  const layerSpacing = 2;
  const startX = -((LAYER_CONFIG.length - 1) * layerSpacing) / 2;

  LAYER_CONFIG.forEach((count, layer) => {
    const x = startX + layer * layerSpacing;
    const startY = -((count - 1) * 0.6) / 2;
    for (let i = 0; i < count; i++) {
      nodes.push({ position: [x, startY + i * 0.6, 0], layer });
    }
  });
  return nodes;
}

function generateConnections(nodes: NodeData[]): [number, number][] {
  const connections: [number, number][] = [];
  let offset = 0;
  for (let layer = 0; layer < LAYER_CONFIG.length - 1; layer++) {
    const currentCount = LAYER_CONFIG[layer];
    const nextCount = LAYER_CONFIG[layer + 1];
    const nextOffset = offset + currentCount;
    for (let i = 0; i < currentCount; i++) {
      for (let j = 0; j < nextCount; j++) {
        connections.push([offset + i, nextOffset + j]);
      }
    }
    offset = nextOffset;
  }
  return connections;
}

function NodeSphere({ position, index }: { position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.12, 12, 12), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8b5cf6'),
        roughness: 0.3,
        metalness: 0.6,
        emissive: new THREE.Color('#7c3aed'),
        emissiveIntensity: 0.3,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = 0.8 + Math.sin(t * 3 + index * 0.5) * 0.2;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return <mesh ref={meshRef} position={position} geometry={geometry} material={material} />;
}

function NetworkConnections({ nodes, connections }: { nodes: NodeData[]; connections: [number, number][] }) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#6366f1'),
        transparent: true,
        opacity: 0.25,
      }),
    []
  );

  const lineObjs = useMemo(() => {
    return connections.map(([from, to]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...nodes[from].position),
        new THREE.Vector3(...nodes[to].position),
      ]);
      return new THREE.Line(geo, material);
    });
  }, [nodes, connections, material]);

  useEffect(() => {
    return () => {
      lineObjs.forEach((l) => {
        l.geometry.dispose();
      });
    };
  }, [lineObjs]);

  return (
    <group ref={groupRef}>
      {lineObjs.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </group>
  );
}

function PulseParticles({ nodes, connections }: { nodes: NodeData[]; connections: [number, number][] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 20;
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.04, 6, 6), []);
  const sphereMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fbbf24'),
        emissive: new THREE.Color('#f59e0b'),
        emissiveIntensity: 0.8,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const connIdx = i % connections.length;
      const [from, to] = connections[connIdx];
      const progress = ((t * 0.5 + i * 0.15) % 1);
      const fromPos = nodes[from].position;
      const toPos = nodes[to].position;
      dummy.position.set(
        fromPos[0] + (toPos[0] - fromPos[0]) * progress,
        fromPos[1] + (toPos[1] - fromPos[1]) * progress,
        fromPos[2] + (toPos[2] - fromPos[2]) * progress
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[sphereGeo, sphereMat, count]} />;
}

export default function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => generateNodes(), []);
  const connections = useMemo(() => generateConnections(nodes), [nodes]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 3]} intensity={0.8} color="#818cf8" />
      {nodes.map((node, i) => (
        <NodeSphere key={i} position={node.position} index={i} />
      ))}
      <NetworkConnections nodes={nodes} connections={connections} />
      <PulseParticles nodes={nodes} connections={connections} />
    </group>
  );
}

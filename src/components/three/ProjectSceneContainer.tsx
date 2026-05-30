'use client';

import { Suspense, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface SceneContainerProps {
  sceneType: string;
}

// Named scene components with dedicated 3D visuals
const namedSceneMap: Record<string, () => Promise<{ default: ComponentType }>> = {
  'campus-health': () => import('./project-scenes/CampusHealth'),
  'data-dashboard': () => import('./project-scenes/DataDashboard'),
  'desktop-app': () => import('./project-scenes/DesktopApp'),
  'dna-helix': () => import('./project-scenes/DnaHelix'),
  'neural-network': () => import('./project-scenes/NeuralNetwork'),
  'film-reel': () => import('./project-scenes/FilmReel'),
  'music-box': () => import('./project-scenes/MusicBox'),
  'tai-chi': () => import('./project-scenes/TaiChi'),
  'gallery-3d': () => import('./project-scenes/Gallery3D'),
  'radar-scan': () => import('./project-scenes/RadarScan'),
};

// Color palettes per business line for the generic scene
const businessLineColors: Record<string, { primary: string; secondary: string }> = {
  health: { primary: '#0ea5e9', secondary: '#06b6d4' },
  ai: { primary: '#8b5cf6', secondary: '#a78bfa' },
  web: { primary: '#f97316', secondary: '#fb923c' },
  creative: { primary: '#eab308', secondary: '#facc15' },
  research: { primary: '#14b8a6', secondary: '#2dd4bf' },
  default: { primary: '#6366f1', secondary: '#818cf8' },
};

// Map each scene3d value from the data to a color theme
const sceneColorMap: Record<string, { primary: string; secondary: string }> = {
  // Health scenes
  building: businessLineColors.health,
  chart: businessLineColors.health,
  document: businessLineColors.health,
  palette: businessLineColors.health,
  microscope: businessLineColors.health,
  radar: businessLineColors.health,
  clipboard: businessLineColors.health,
  warehouse: businessLineColors.health,
  folder: businessLineColors.health,
  stethoscope: businessLineColors.health,
  book: businessLineColors.health,
  film: businessLineColors.health,
  syringe: businessLineColors.health,
  heartbeat: businessLineColors.health,
  archive: businessLineColors.health,
  // AI scenes
  brain: businessLineColors.ai,
  yin_yang: businessLineColors.ai,
  robot: businessLineColors.ai,
  network: businessLineColors.ai,
  video: businessLineColors.ai,
  image: businessLineColors.ai,
  nodes: businessLineColors.ai,
  // Web scenes
  graduation: businessLineColors.web,
  server: businessLineColors.web,
  articles: businessLineColors.web,
  phone: businessLineColors.web,
  // Creative scenes
  comments: businessLineColors.creative,
  knowledge: businessLineColors.creative,
  // Research scenes
  research: businessLineColors.research,
  download: businessLineColors.research,
  resume: businessLineColors.research,
};

const genericLoader = () => import('./project-scenes/GenericScene');

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

export default function ProjectSceneContainer({ sceneType }: SceneContainerProps) {
  // Check for a named scene first
  const namedLoader = namedSceneMap[sceneType];

  if (namedLoader) {
    const SceneComponent = dynamic(namedLoader, {
      loading: () => <LoadingFallback />,
      ssr: false,
    });

    return (
      <div className="h-full w-full">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 1, 5], fov: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <SceneComponent />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={(3 * Math.PI) / 4}
              minAzimuthAngle={-Math.PI / 3}
              maxAzimuthAngle={Math.PI / 3}
            />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  // Fall back to generic scene with color theming
  const colors = sceneColorMap[sceneType] ?? businessLineColors.default;

  const GenericComponent = dynamic(genericLoader, {
    loading: () => <LoadingFallback />,
    ssr: false,
  });

  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <GenericComponent primaryColor={colors.primary} secondaryColor={colors.secondary} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
            minAzimuthAngle={-Math.PI / 3}
            maxAzimuthAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

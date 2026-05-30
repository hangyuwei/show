# SPEC: Hang's Portfolio -- Technical Specification

> Generated from PRD.md v1. Reflects actual codebase state as of 2026-05-31.

---

## 1. Tech Stack Versions

| Dependency | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.6 | SSG / App Router / SSR framework |
| React | 19.2.4 | UI rendering |
| React DOM | 19.2.4 | DOM rendering |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Dark theme + responsive styling (via @tailwindcss/postcss) |
| Three.js | ^0.184.0 | 3D rendering core |
| @react-three/fiber | ^9.6.1 | React Three.js bindings (R3F) |
| @react-three/drei | ^10.7.7 | R3F helper components (OrbitControls, Html, etc.) |
| @react-three/postprocessing | ^3.0.4 | Bloom, Vignette post-processing |
| postprocessing | ^6.39.1 | Post-processing lower-level library |
| Framer Motion | ^12.40.0 | Page transitions + interaction animations |
| ESLint | ^9 | Code linting |
| eslint-config-next | 16.2.6 | Next.js ESLint rules |

**Not installed but listed in PRD:**

| Dependency | PRD Purpose | Status |
|------------|-------------|--------|
| GSAP | Animation | Not installed; Framer Motion covers all current animation needs |
| @next/mdx | MDX content | Not installed; thought-chain content currently stored in `projects.ts` |
| @mdx-js/loader | MDX loading | Not installed |
| @mdx-js/react | MDX rendering | Not installed |
| next-sitemap | sitemap.xml generation | Not installed |

---

## 2. Directory Structure

```
portfolio/
├── src/
│   ├── app/                            # Next.js App Router pages
│   │   ├── layout.tsx                  # Root layout: fonts, StarFieldWrapper, Navbar, PageTransition, Footer
│   │   ├── page.tsx                    # Home page: Hero + featured projects placeholder
│   │   ├── globals.css                 # CSS variables + Tailwind @theme + global styles
│   │   ├── not-found.tsx               # 404: space-lost theme
│   │   ├── favicon.ico
│   │   ├── about/
│   │   │   └── page.tsx                # About page
│   │   ├── contact/
│   │   │   └── page.tsx                # Contact page
│   │   └── projects/
│   │       ├── page.tsx                # Project list (client component)
│   │       └── [slug]/
│   │           ├── page.tsx            # Project detail (server, SSG + generateMetadata)
│   │           └── ProjectDetailClient.tsx  # Detail page client component
│   ├── components/
│   │   ├── Hero.tsx                    # Full-screen hero: SolarSystem (lazy) + typewriter tagline
│   │   ├── PageTransition.tsx          # Warp-speed line page transition
│   │   ├── ProjectFilter.tsx           # Business line filter bar
│   │   ├── three/                      # 3D components
│   │   │   ├── SolarSystem.tsx         # Solar system main scene
│   │   │   ├── StarField.tsx           # Global starfield particle background
│   │   │   ├── StarFieldWrapper.tsx    # Conditional render (hidden on home page)
│   │   │   ├── ParticleBackground.tsx  # Contact page particle background
│   │   │   ├── ProjectPlanet.tsx       # Reusable planet + satellite component
│   │   │   ├── DataFlowGrid.tsx        # Matrix data flow grid
│   │   │   ├── TechSphere.tsx          # Tech tag 3D sphere
│   │   │   ├── SkillRadar3D.tsx        # Skill radar chart
│   │   │   ├── FloatingCard3D.tsx      # Project 3D tilt card
│   │   │   ├── ProjectSceneContainer.tsx  # Project detail 3D scene router
│   │   │   └── project-scenes/         # Project-specific 3D scenes
│   │   │       ├── CampusHealth.tsx
│   │   │       ├── DataDashboard.tsx
│   │   │       ├── DesktopApp.tsx
│   │   │       ├── DnaHelix.tsx
│   │   │       ├── NeuralNetwork.tsx
│   │   │       ├── FilmReel.tsx
│   │   │       ├── MusicBox.tsx
│   │   │       ├── TaiChi.tsx
│   │   │       ├── Gallery3D.tsx
│   │   │       ├── RadarScan.tsx
│   │   │       └── GenericScene.tsx     # Default fallback 3D scene
│   │   ├── ui/                         # UI base components
│   │   │   ├── Navbar.tsx              # Glass-morphism navigation bar
│   │   │   ├── Footer.tsx              # Page footer
│   │   │   ├── SkeletonLoader.tsx      # Skeleton loading states
│   │   │   ├── TechBadge.tsx           # Tech tag badge
│   │   │   ├── SectionTitle.tsx        # Section heading
│   │   │   ├── ImageGallery.tsx        # Image gallery + lightbox
│   │   │   ├── CodeBlock.tsx           # Code block (terminal style)
│   │   │   └── ArchitectureDiagram.tsx # Architecture diagram (horizontal/vertical)
│   │   ├── about/
│   │   │   └── AboutContent.tsx        # About page content layout
│   │   └── contact/
│   │       └── ContactContent.tsx       # Contact page content layout
│   └── data/
│       └── projects.ts                 # 32 project metadata + type definitions
├── public/
│   └── projects/                       # Project screenshot assets
├── next.config.ts                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
├── eslint.config.mjs                   # ESLint configuration
├── postcss.config.mjs                  # PostCSS (Tailwind)
├── package.json
├── PRD.md
└── SPEC.md
```

---

## 3. Route Table

| Route | File | Render Mode | Metadata |
|-------|------|-------------|----------|
| `/` | `src/app/page.tsx` | SSG (default) | `title: "Hang's Portfolio - ..."`, `description: "全栈开发 · AI应用 · 大健康行业 - 探索项目宇宙"` |
| `/projects` | `src/app/projects/page.tsx` | Client Component | No page-level metadata; inherits root layout |
| `/projects/[slug]` | `src/app/projects/[slug]/page.tsx` | SSG (`generateStaticParams`) | `generateMetadata()` produces `title: "{name} \| Portfolio"` |
| `/about` | `src/app/about/page.tsx` | SSG (default) | Inherits root layout |
| `/contact` | `src/app/contact/page.tsx` | Client Component | Inherits root layout |
| `/not-found` | `src/app/not-found.tsx` | Static | No independent metadata |

**`generateStaticParams`**: Project detail pages pre-render all 32 slugs at build time.

---

## 4. Data Models

### 4.1 Core TypeScript Types

```typescript
// src/data/projects.ts

type BusinessLine = 'health' | 'ai' | 'web' | 'creative' | 'research';

interface ThoughtChain {
  problem: string;        // Original problem / pain point
  analysis: string;       // Requirements analysis
  design: string;         // Solution design
  development: string;    // Development process
  challenges: Array<{
    title: string;
    description: string;
    solution: string;
  }>;
  outcome: string;        // Project outcome
}

interface Project {
  id: number;
  slug: string;           // URL slug (kebab-case)
  name: string;           // Chinese name
  nameEn: string;         // English name
  businessLine: BusinessLine;
  tagline: string;        // One-line description
  description: string;    // Detailed description (newline-separated)
  techStack: string[];    // Tech stack tags
  scene3d: string;        // 3D scene type identifier (mapped in ProjectSceneContainer)
  thoughtChain: ThoughtChain;
  screenshots: string[];  // Screenshot path array
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;      // Whether project is featured
  year: string;           // Year
  status: 'completed' | 'active' | 'planning';
}
```

### 4.2 Business Line Label Mapping

```typescript
const businessLineLabels: Record<BusinessLine, {
  name: string;     // Chinese name
  nameEn: string;   // English name
  emoji: string;    // Icon
  color: string;    // Theme color (hex)
}> = {
  health:    { name: '大健康行业', nameEn: 'Health Industry', emoji: '🏥', color: '#06b6d4' },
  ai:        { name: 'AI/大模型',  nameEn: 'AI & LLM',        emoji: '🤖', color: '#8b5cf6' },
  web:       { name: 'Web开发',   nameEn: 'Web Dev',         emoji: '💻', color: '#f97316' },
  creative:  { name: '创意/3D',   nameEn: 'Creative',        emoji: '🎨', color: '#eab308' },
  research:  { name: '学术研究',  nameEn: 'Research',        emoji: '📚', color: '#14b8a6' },
};
```

### 4.3 Data Query Functions

| Function | Signature | Returns |
|----------|-----------|---------|
| `getProjectsByBusinessLine` | `(line: BusinessLine) => Project[]` | Filter by business line |
| `getFeaturedProjects` | `() => Project[]` | Featured projects only |
| `getProjectBySlug` | `(slug: string) => Project \| undefined` | Find by slug |
| `getAllSlugs` | `() => string[]` | All slug list |

### 4.4 Data Scale

- Total projects: 32
- Health: 17, AI: 7, Web: 4, Creative: 1, Research: 3
- Featured: campus-health, kefu-stats, feasibility-report, medical-ocr, competitor-intel, my-agent, vimax, starry-music-box

---

## 5. Component API Specifications

### 5.1 Page Components

#### `Hero` (`src/components/Hero.tsx`)

- **Export**: `export default function Hero()`
- **Props**: None
- **Behavior**: Full-screen hero area; lazy-loads SolarSystem via `next/dynamic`; typewriter effect cycles taglines; "Explore Project Universe" button scrolls to `#featured-projects`

#### `PageTransition` (`src/components/PageTransition.tsx`)

- **Export**: `export default function PageTransition({ children }: PageTransitionProps)`
- **Props**:
  ```typescript
  interface PageTransitionProps {
    children: ReactNode;
  }
  ```
- **Behavior**: `AnimatePresence mode="wait"` wrapper; key is `pathname`; enter/exit uses scale + warp lines animation

#### `ProjectFilter` (`src/components/ProjectFilter.tsx`)

- **Export**: `export default function ProjectFilter({ activeFilter, onFilterChange }: ProjectFilterProps)`
- **Props**:
  ```typescript
  type FilterOption = '全部' | BusinessLine;
  interface ProjectFilterProps {
    activeFilter: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
  }
  ```
- **Behavior**: Horizontal scrollable filter bar with 6 options (all + 5 business lines); Framer Motion `layoutId` indicator animation

### 5.2 3D Components

#### `SolarSystem` (`src/components/three/SolarSystem.tsx`)

- **Export**: `export default function SolarSystem()`
- **Props**: None (self-contained complete solar system scene)
- **Internal sub-components**: `Sun`, `PlanetBody`, `Satellite`, `OrbitRing`, `CosmicDust`, `NebulaClouds`, `PlanetSystem`, `LoadingFallback`
- **3D data**: 5 planet configurations hardcoded in `PLANETS` constant
- **Loading**: Lazy-loaded via `next/dynamic` + `{ ssr: false }` in Hero component

#### `StarField` (`src/components/three/StarField.tsx`)

- **Export**: `export default function StarField()`
- **Props**: None
- **Behavior**: Fixed-position starfield particle background (`position: fixed, inset: 0, z-index: -10`); mobile 500 particles / desktop 1200 particles
- **Internal interface**:
  ```typescript
  interface StarParticlesProps {
    count: number;
  }
  ```

#### `StarFieldWrapper` (`src/components/three/StarFieldWrapper.tsx`)

- **Export**: `export default function StarFieldWrapper()`
- **Props**: None
- **Behavior**: Conditional render of StarField; hidden on home page (`/`)

#### `ParticleBackground` (`src/components/three/ParticleBackground.tsx`)

- **Export**: `export default function ParticleBackground()`
- **Props**: None
- **Behavior**: Fixed-position particle background; mobile 200 particles / desktop 500 particles

#### `ProjectPlanet` (`src/components/three/ProjectPlanet.tsx`)

- **Export**: `export default function ProjectPlanet({ ... }: ProjectPlanetProps)`
- **Props**:
  ```typescript
  interface SatelliteConfig {
    name: string;
    size: number;
    orbitRadius: number;
    orbitSpeed: number;
    orbitOffset: number;
  }
  interface ProjectPlanetProps {
    name: string;
    color: string;
    size: number;
    orbitRadius: number;
    orbitSpeed: number;
    isMainPlanet: boolean;
    satellites?: SatelliteConfig[];
  }
  ```
- **Behavior**: Planet component with atmosphere and satellites; hover enlarges + glow increases + Html tooltip

#### `DataFlowGrid` (`src/components/three/DataFlowGrid.tsx`)

- **Export**: `export default function DataFlowGrid({ lowPerformance }: DataFlowGridProps)`
- **Props**:
  ```typescript
  interface DataFlowGridProps {
    lowPerformance?: boolean;  // default: false
  }
  ```
- **Behavior**: Matrix data flow grid; `lowPerformance` = 8x8 grid, otherwise 14x14

#### `TechSphere` (`src/components/three/TechSphere.tsx`)

- **Export**: `export default function TechSphere()`
- **Props**: None (built-in 18 tech labels)
- **Behavior**: Fibonacci sphere distribution of tech labels; auto-rotate + OrbitControls interaction

#### `SkillRadar3D` (`src/components/three/SkillRadar3D.tsx`)

- **Export**: `export default function SkillRadar3D()`
- **Props**: None (built-in 6-dimension skill data)
- **Behavior**: 6-sided radar chart; slow rotation; percentage labels
- **Internal interface**:
  ```typescript
  interface SkillDimension {
    label: string;
    value: number;  // 0-1
  }
  ```

#### `FloatingCard3D` (`src/components/three/FloatingCard3D.tsx`)

- **Export**: `export default function FloatingCard3D({ project, index }: FloatingCard3DProps)`
- **Props**:
  ```typescript
  interface FloatingCard3DProps {
    project: Project;
    index: number;
  }
  ```
- **Behavior**: CSS perspective 3D tilt card; mouse-tracking gloss effect; hover lifts; links to project detail page

#### `ProjectSceneContainer` (`src/components/three/ProjectSceneContainer.tsx`)

- **Export**: `export default function ProjectSceneContainer({ sceneType }: SceneContainerProps)`
- **Props**:
  ```typescript
  interface SceneContainerProps {
    sceneType: string;
  }
  ```
- **Behavior**: Dynamically loads named 3D scene by `sceneType` or falls back to GenericScene; wrapped in Canvas + OrbitControls

### 5.3 UI Components

#### `Navbar` (`src/components/ui/Navbar.tsx`)

- **Export**: `export default function Navbar()`
- **Props**: None
- **Behavior**: Fixed-top glass-morphism nav; 4 links (Home/Projects/About/Contact); `md:` breakpoint switches desktop/mobile menu

#### `Footer` (`src/components/ui/Footer.tsx`)

- **Export**: `export default function Footer()`
- **Props**: None
- **Behavior**: Bottom bar with copyright / GitHub link / back-to-top

#### `SkeletonLoader` (`src/components/ui/SkeletonLoader.tsx`)

- **Export**: `export default function SkeletonLoader({ variant, count, className }: SkeletonLoaderProps)`
- **Props**:
  ```typescript
  interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | '3d' | 'image';
    count?: number;       // default: 1
    className?: string;
  }
  ```

#### `TechBadge` (`src/components/ui/TechBadge.tsx`)

- **Export**: `export default function TechBadge({ name, color }: TechBadgeProps)`
- **Props**:
  ```typescript
  interface TechBadgeProps {
    name: string;
    color?: string;  // optional custom color
  }
  ```

#### `SectionTitle` (`src/components/ui/SectionTitle.tsx`)

- **Export**: `export default function SectionTitle({ title, subtitle, align }: SectionTitleProps)`
- **Props**:
  ```typescript
  interface SectionTitleProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center';  // default: 'left'
  }
  ```

#### `ImageGallery` (`src/components/ui/ImageGallery.tsx`)

- **Export**: `export default function ImageGallery({ images }: ImageGalleryProps)`
- **Props**:
  ```typescript
  interface GalleryImage {
    src: string;
    alt: string;
  }
  interface ImageGalleryProps {
    images: GalleryImage[];
  }
  ```
- **Behavior**: Responsive grid + fullscreen lightbox; keyboard/button previous/next navigation

#### `CodeBlock` (`src/components/ui/CodeBlock.tsx`)

- **Export**: `export default function CodeBlock({ code, language }: CodeBlockProps)`
- **Props**:
  ```typescript
  interface CodeBlockProps {
    code: string;
    language?: string;  // default: 'text'
  }
  ```

#### `ArchitectureDiagram` (`src/components/ui/ArchitectureDiagram.tsx`)

- **Export**: `export default function ArchitectureDiagram({ items }: ArchitectureDiagramProps)`
- **Props**:
  ```typescript
  interface ArchitectureItem {
    name: string;
    description: string;
    connections?: number[];
  }
  interface ArchitectureDiagramProps {
    items: ArchitectureItem[];
  }
  ```
- **Behavior**: Desktop horizontal layout / mobile vertical layout; colored borders + glow effect

### 5.4 Page Layout Components

#### `AboutContent` (`src/components/about/AboutContent.tsx`)

- **Export**: `export default function AboutContent()`
- **Props**: None
- **Behavior**: Layouts SkillRadar3D + personal bio + TechSphere + career timeline in four sections

#### `ContactContent` (`src/components/contact/ContactContent.tsx`)

- **Export**: `export default function ContactContent()`
- **Props**: None
- **Behavior**: Layouts ParticleBackground + GitHub card + Email card

---

## 6. 3D Scene Specifications

### 6.1 SolarSystem

#### Canvas Configuration

| Parameter | Value |
|-----------|-------|
| Camera position | `[0, 10, 18]` |
| FOV | 50 deg |
| Near / Far | 0.1 / 250 |
| DPR | `[1, 1.5]` |
| Antialias | `true` |
| Alpha | `false` |
| Tone Mapping | `ACESFilmicToneMapping`, exposure 1.0 |
| Background CSS | `radial-gradient(ellipse at center, #0a0a1a 0%, #000005 100%)` |

#### Sun

| Parameter | Value |
|-----------|-------|
| Core geometry | `SphereGeometry(0.9, 64, 64)` |
| Corona geometry | `SphereGeometry(1.25, 48, 48)` |
| Outer haze geometry | `SphereGeometry(1.8, 32, 32)` |
| Core material | Custom `ShaderMaterial` (vertex + fragment shaders) |
| Corona material | Custom `ShaderMaterial`, `BackSide`, `AdditiveBlending`, `transparent`, `depthWrite: false` |
| Outer haze material | `MeshBasicMaterial`, color=#ff8833, opacity=0.04, `BackSide`, `AdditiveBlending` |
| Point light | intensity=4, distance=40, decay=2, color=#ffaa55 |
| Shader noise | Simplex Noise, 3 layers (frequency 2/4/8), time-animated |
| Color range | core #ffc866 (warm gold) -> mid #ff8c26 (orange) -> edge #cc400d (deep amber) |
| Corona pulse | `sin(uTime * 1.5)` amplitude 0.2, base 0.8 |

#### Planet System (5 planets)

| Planet | Color / Emissive | Size | Orbit Radius | Speed | Tilt | Satellites | Ring |
|--------|------------------|------|-------------|-------|------|------------|------|
| Health | #0ea5e9 / #0284c7 | 0.55 | 5.5 | 0.12 | 0.15 | 17 | no |
| AI/LLM | #a78bfa / #7c3aed | 0.45 | 8.0 | 0.09 | -0.10 | 7 | #7c3aed |
| Web Dev | #fb923c / #ea580c | 0.40 | 10.5 | 0.07 | 0.20 | 4 | no |
| Creative | #facc15 / #ca8a04 | 0.32 | 13.0 | 0.05 | -0.25 | 1 | #ca8a04 |
| Research | #2dd4bf / #0d9488 | 0.36 | 15.5 | 0.04 | 0.12 | 3 | no |

**Planet material**: `MeshStandardMaterial`, roughness=0.55, metalness=0.25, emissiveIntensity=0.15 (hover: 0.5, lerp delta*5)
**Atmosphere**: `SphereGeometry(1.12)`, `BackSide`, `AdditiveBlending`, opacity=0.08 (hover: 0.20, lerp delta*5)
**Ring**: `RingGeometry(1.4, 1.8, 64)`, `DoubleSide`, `AdditiveBlending`, opacity=0.12

#### CosmicDust (Star Particles)

| Parameter | Value |
|-----------|-------|
| Count | 3000 |
| Distribution | Spherical shell, radius 25-80 |
| Colors | Warm white 60%, cool blue 25%, amber 15% |
| Sizes | 0.05-0.25 (per-particle random), PointsMaterial size=0.12, sizeAttenuation |
| Material | `PointsMaterial`, `AdditiveBlending`, `vertexColors`, `depthWrite: false`, opacity=0.7 |
| Rotation | Y-axis, delta * 0.003 |

#### NebulaClouds

| Parameter | Value |
|-----------|-------|
| Count | 8 spheres |
| Colors | #1a0533, #0a1628, #0d2137, #1a0a2e, #051a2c |
| Sizes | 15-40 (random) |
| Opacity | 0.15-0.25 |
| Rotation | Y-axis, delta * 0.001 |
| Material | `MeshBasicMaterial`, `BackSide`, `AdditiveBlending`, `depthWrite: false` |

#### Post-Processing

| Effect | Parameters |
|--------|------------|
| Bloom | intensity=0.6, luminanceThreshold=0.2, luminanceSmoothing=0.9, mipmapBlur=true |
| Vignette | eskil=false, offset=0.3, darkness=0.6 |

#### OrbitControls

| Parameter | Value |
|-----------|-------|
| enableDamping | true, factor=0.04 |
| minDistance / maxDistance | 6 / 35 |
| autoRotate | true, speed=0.2 |
| enablePan | false |
| maxPolarAngle / minPolarAngle | 0.7*PI / 0.3*PI |

### 6.2 StarField

| Parameter | Value |
|-----------|-------|
| Camera | position=[0,0,10], fov=60 |
| DPR | [1, 1.5] |
| Particle count | Desktop: 1200, Mobile: 500 |
| Distribution | Spherical, radius 5-55 |
| Colors | White 70%, Blue 30% |
| Size | 0.15, sizeAttenuation |
| Rotation | Y: delta*0.02, X: delta*0.005 |
| Alpha | true (transparent background) |
| Power preference | 'high-performance' |

### 6.3 DataFlowGrid

| Parameter | Value |
|-----------|-------|
| Camera | position=[0,12,12], fov=50 |
| DPR | [1, 1.5] |
| Grid size | Standard: 14x14, Low-performance: 8x8 |
| Spacing | 2 units |
| Line color | #3b82f6 |
| Pulse point colors | #06b6d4 / #8b5cf6 |
| Rotation | -PI/4 (perspective angle) |
| Pulse sample step | Standard: 3, Low-performance: 4 |
| Antialias | false (performance) |
| Power preference | 'low-power' |

### 6.4 SkillRadar3D

| Parameter | Value |
|-----------|-------|
| Camera | position=[0,0,5], fov=50 |
| DPR | [1, 2] |
| Radar radius | 2 |
| Grid rings | 4 |
| Dimensions | 6 (Full-stack Dev / AI Apps / Data Analysis / Industry Knowledge / Project Management / Creative Design) |
| Fill color | #4a90d9, opacity=0.15 |
| Edge color | #6cb4ee, opacity=0.9 |
| Vertex dots | `SphereGeometry(0.04)` |
| Rotation | Z-axis, delta * 0.08 |

### 6.5 TechSphere

| Parameter | Value |
|-----------|-------|
| Camera | position=[0,0,6], fov=50 |
| DPR | [1, 1.5] |
| Sphere radius | 2.5 |
| Label count | 18 |
| Distribution | Fibonacci sphere (golden angle) |
| Wireframe sphere | `SphereGeometry(2.4, 24, 24)`, color=#1a3a5c, opacity=0.1 |
| AutoRotate | speed=0.5 |
| OrbitControls | enableZoom=false, enablePan=false |

### 6.6 ProjectSceneContainer

| Parameter | Value |
|-----------|-------|
| Camera | position=[0,1,5], fov=50 |
| DPR | [1, 1.5] |
| Named scene map | campus-health, data-dashboard, desktop-app, dna-helix, neural-network, film-reel, music-box, tai-chi, gallery-3d, radar-scan |
| Generic scene colors | health=#0ea5e9, ai=#8b5cf6, web=#f97316, creative=#eab308, research=#14b8a6, default=#6366f1 |
| OrbitControls | enableZoom=false, enablePan=false, polar=[PI/4, 3PI/4], azimuth=[-PI/3, PI/3] |
| Loading | `next/dynamic` per scene type |

### 6.7 ParticleBackground

| Parameter | Value |
|-----------|-------|
| Camera | position=[0,0,10], fov=60 |
| DPR | [1, 2] |
| Particle count | Desktop: 500, Mobile: 200 |
| Distribution | Spherical, radius 5-35 |
| Color | #4a90d9, opacity=0.4 |
| Size | 0.05, sizeAttenuation |
| Rotation | Y-axis, delta * 0.03 |

---

## 7. Style Tokens

### 7.1 CSS Variables (`globals.css :root`)

```css
:root {
  --background: #0a0a1a;      /* Main background: deep blue-black */
  --foreground: #e0e0f0;      /* Main text: light gray-blue */
  --accent: #6488ff;          /* Accent: blue-purple */
  --accent-dim: #3a5bbf;      /* Accent dim */
  --surface: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.1);
  --muted: #8888aa;           /* Muted text */
}
```

### 7.2 Tailwind Theme Tokens (`globals.css @theme inline`)

```css
/* Background colors */
--color-bg-primary: #0a0a1a;
--color-bg-secondary: #111827;
--color-bg-card: #1f2937;

/* Text colors */
--color-text-primary: #f9fafb;
--color-text-secondary: #9ca3af;

/* Accent colors (per business line) */
--color-accent-blue: #06b6d4;      /* Health */
--color-accent-purple: #8b5cf6;    /* AI */
--color-accent-orange: #f97316;    /* Web */
--color-accent-gold: #eab308;      /* Creative */
--color-accent-teal: #14b8a6;      /* Research */

/* Glow */
--color-glow: #3b82f6;

/* Fonts */
--font-sans: var(--font-geist-sans);   /* Geist Sans */
--font-mono: var(--font-geist-mono);   /* Geist Mono */

/* Custom animations */
--animate-float: float 6s ease-in-out infinite;
--animate-pulse-glow: pulse-glow 2s ease-in-out infinite;
--animate-warp-in: warp-in 0.6s ease-out forwards;
```

### 7.3 Custom Keyframes

```css
@keyframes float       { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
@keyframes pulse-glow  { 0%,100% { opacity: 0.4; box-shadow: 0 0 8px var(--color-glow); } 50% { opacity: 1; box-shadow: 0 0 20px var(--color-glow); } }
@keyframes warp-in     { 0% { opacity: 0; transform: scale(0.8) rotateX(10deg); filter: blur(4px); } 100% { opacity: 1; transform: scale(1) rotateX(0deg); filter: blur(0px); } }
```

### 7.4 Dark Theme Color Summary

| Usage | Token | Hex |
|-------|-------|-----|
| Page background | --background / --color-bg-primary | #0a0a1a |
| Card / secondary bg | --color-bg-secondary | #111827 |
| Card inner bg | --color-bg-card | #1f2937 |
| Primary text | --foreground / --color-text-primary | #e0e0f0 / #f9fafb |
| Secondary text | --muted / --color-text-secondary | #8888aa / #9ca3af |
| Border | --border | rgba(255,255,255,0.1) |
| Accent | --accent | #6488ff |
| Glow | --color-glow | #3b82f6 |

### 7.5 Global Style Rules

- `html`: `scroll-behavior: smooth`
- `body`: min-height 100vh, overflow-x hidden, Geist Sans font
- `canvas`: `touch-action: none` (prevents 3D canvas scroll interference)
- `a, button`: `transition: color/bg/border 0.2s ease`
- `::selection`: `background: rgba(100,136,255,0.3)`, color #fff
- Scrollbar: WebKit 8px rounded, track #0a0a1a, thumb rgba(255,255,255,0.15)
- Firefox: `scrollbar-width: thin`, `scrollbar-color: rgba(255,255,255,0.15) #0a0a1a`

### 7.6 Fonts

| Font | Source | CSS Variable | Usage |
|------|--------|-------------|-------|
| Geist Sans | `next/font/google` | `--font-geist-sans` | Primary body font |
| Geist Mono | `next/font/google` | `--font-geist-mono` | Code / monospace |

---

## 8. Performance Targets

### 8.1 Bundle Size Targets

| Chunk | Target (gzipped) | Current Status |
|-------|-----------------|----------------|
| First-screen HTML + CSS | < 50KB | Not measured |
| First-screen JS (excl. Three.js) | < 100KB | Not measured |
| Three.js chunk (lazy-loaded) | < 300KB | Not measured |

### 8.2 Lighthouse Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 3s (4G) |
| Lighthouse Performance | > 80 |
| Lighthouse Accessibility | > 85 |

### 8.3 3D Rendering Targets

| Metric | Target |
|--------|--------|
| FPS (Desktop) | > 30fps |
| FPS (Mobile) | > 20fps |

### 8.4 Bundle Split Strategy

- Three.js + R3F + drei + postprocessing: all loaded via `next/dynamic` + `{ ssr: false }`
- First screen contains zero Three.js code
- Three.js isolated as vendor chunk, loaded only on pages with 3D
- `next.config.ts` configures `transpilePackages: ['three', '@react-three/fiber', '@react-three/drei']`

---

## 9. Responsive Breakpoints

### 9.1 Breakpoint Definitions (Tailwind defaults)

| Name | Min Width | Usage |
|------|-----------|-------|
| sm | 640px | `sm:` prefix |
| md | 768px | `md:` prefix |
| lg | 1024px | `lg:` prefix |
| xl | 1280px | `xl:` prefix |

### 9.2 3D Degradation Strategy

| Device | Breakpoint | Post-Processing | Particles | Solar System | DPR | Detection |
|--------|-----------|-----------------|-----------|-------------|-----|-----------|
| Mobile | < 768px | Bloom + Vignette off | 500 (StarField) / 200 (ParticleBg) | Full 3D (DPR-limited) | [1, 1.5] | `window.innerWidth < 768` |
| Tablet | 768-1024px | Bloom on, intensity 0.3 | 1200 | Full 3D | [1, 1.5] | - |
| Desktop | > 1024px | Full Bloom + Vignette | 3000 (Solar) / 1200 (StarField) | Full 3D | [1, 2] | - |

### 9.3 Layout Strategy

| Page | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| Home | Single-column Hero | Single-column Hero | Single-column Hero |
| Project List | 1-column cards | 2-column cards | 3-column cards |
| Project Detail | Single-column full-width | Single-column full-width | Content + side decoration |
| About | Single column | Single column | Single column max-w-3xl |
| Contact | Single column centered | Single column centered | Single column centered max-w-lg |

### 9.4 Component-Level Responsive

- **Navbar**: `hidden md:flex` desktop nav / `md:hidden` hamburger menu
- **ArchitectureDiagram**: `hidden md:flex` horizontal / `md:hidden flex` vertical
- **FloatingCard3D**: perspective 800px hover effect desktop-only (touch devices skip)
- **SkillRadar3D**: `min-h-[400px] sm:min-h-[500px]`
- **TechSphere**: `min-h-[400px] sm:min-h-[500px]`

### 9.5 Low-End Device Detection (Planned)

- `navigator.hardwareConcurrency < 4` -> degrade to mobile config
- WebGL support failure -> fallback to CSS animated background
- `useMemo` cache degradation decision

---

## 10. SEO / Accessibility Specification

### 10.1 Metadata Strategy

| Page | Title | Description | Generation |
|------|-------|-------------|------------|
| Root layout | "Hang's Portfolio" | "全栈开发 · AI应用 · 大健康行业 - 探索项目宇宙" | `export const metadata` |
| Home | "Hang's Portfolio - 全栈开发 · AI应用 · 大健康" | "探索Hang的项目宇宙..." | `export const metadata` |
| Project Detail | "{project.name} \| Portfolio" | project.description | `generateMetadata()` |

### 10.2 Language and Fonts

- `<html lang="zh-CN">` Chinese language tag
- Geist Sans + Geist Mono via `next/font/google`

### 10.3 Semantic HTML

| Element | Usage |
|---------|-------|
| `<header>` | Navbar wrapped in `<header>` |
| `<main>` | Root layout `<main className="flex-1 pt-16">` |
| `<nav>` | Navbar `<nav role="navigation" aria-label="Main navigation">` |
| `<footer>` | Footer component uses `<footer>` |
| `<section>` | Content sections |
| `<article>` | Project card content |

### 10.4 ARIA Labels

| Element | ARIA |
|---------|------|
| All 3D Canvas containers | `aria-hidden="true"` |
| Navbar navigation | `role="navigation"`, `aria-label="Main navigation"` |
| Mobile menu button | `aria-expanded`, `aria-label="Toggle navigation menu"` |
| Lightbox close button | `aria-label="Close lightbox"` |
| Prev/Next buttons | `aria-label="Previous/Next image"` |
| External links | `rel="noopener noreferrer"` |
| Decorative SVGs | `aria-hidden="true"` |

### 10.5 Accessibility Targets

- Color contrast: text vs background >= 4.5:1 (WCAG AA)
- Focus indicators: Tailwind default focus ring
- Keyboard navigation: Tab reaches all interactive elements
- Skip navigation: planned "Skip to main content" link (not yet implemented)
- Image alt: decorative images `alt=""`, informational images have descriptive alt

### 10.6 SEO Plan (Not Yet Implemented)

- **Open Graph**: planned og:title, og:description, og:image, og:url
- **Twitter Card**: planned twitter:card, twitter:title, etc.
- **sitemap.xml**: planned via next-sitemap auto-generation
- **robots.txt**: planned to allow all crawlers
- **JSON-LD**: planned WebSite + Person schema

---

## 11. Vercel Deploy Configuration

### 11.1 Deployment Settings

| Config | Value |
|--------|-------|
| Platform | Vercel |
| Build command | `next build` |
| Output directory | `.next` (default) |
| Node.js version | Vercel default |
| Domain | show.vercel.app (planned) |
| Environment variables | None required (pure static content site) |
| Deploy trigger | GitHub repo push -> auto deploy |

### 11.2 CDN Cache Strategy (Planned)

| Resource Type | Strategy |
|--------------|----------|
| Static assets (JS/CSS/images) | immutable cache |
| HTML pages | 1-hour cache |
| 3D models (.glb/.gltf) | immutable cache |

### 11.3 Performance Monitoring (Planned)

- Vercel Analytics + Web Vitals
- Post-build `next-sitemap` generates sitemap.xml

### 11.4 Current `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  turbopack: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    return config;
  },
};
```

### 11.5 TypeScript Configuration

```jsonc
{
  compilerOptions: {
    target: 'ES2017',
    lib: ['dom', 'dom.iterable', 'esnext'],
    strict: true,
    noEmit: true,
    module: 'esnext',
    moduleResolution: 'bundler',
    jsx: 'react-jsx',
    incremental: true,
    paths: { '@/*': ['./src/*'] }
  }
}
```

---

## Appendix A: Pending Items (From PRD, Not Yet Implemented)

| ID | Item | Priority | Notes |
|----|------|----------|-------|
| A1 | MDX content system | P1 | @next/mdx + @mdx-js/loader; thought-chain MDX files |
| A2 | GSAP integration | P2 | Listed in PRD but not installed; Framer Motion covers current needs |
| A3 | next-sitemap | P1 | sitemap.xml + robots.txt auto-generation |
| A4 | Open Graph / Twitter Card | P1 | Social share meta tags |
| A5 | JSON-LD structured data | P2 | WebSite + Person + SoftwareSourceCode schema |
| A6 | Contact form | P2 | PRD mentions but current implementation is GitHub + Email cards only |
| A7 | Mouse-follow particles | P3 | PRD F6 mentions; desktop-only |
| A8 | Scroll indicator 3D comet | P3 | PRD F6 mentions |
| A9 | Low-end device auto-detection | P2 | hardwareConcurrency < 4 degradation |
| A10 | WebGL failure CSS fallback | P1 | ErrorBoundary + CSS gradient background |
| A11 | "Skip to main content" | P2 | Accessibility skip link |
| A12 | Home page featured projects display | P0 | Currently placeholder content |
| A13 | PWA manifest | P3 | PRD optional |

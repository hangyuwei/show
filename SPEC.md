# SPEC: Hang's Portfolio -- 技术规格文档

> 基于 PRD.md v1 生成，反映当前代码库实际实现状态。

---

## 1. 技术栈版本锁定

| 依赖 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.2.6 | SSG/App Router/SSR 框架 |
| React | 19.2.4 | UI 渲染 |
| React DOM | 19.2.4 | DOM 渲染 |
| TypeScript | ^5 | 类型安全 |
| Tailwind CSS | ^4 | 暗色主题 + 响应式样式 (via @tailwindcss/postcss) |
| Three.js | ^0.184.0 | 3D 渲染核心 |
| @react-three/fiber | ^9.6.1 | React Three.js 绑定 |
| @react-three/drei | ^10.7.7 | R3F 辅助组件 (OrbitControls, Html 等) |
| @react-three/postprocessing | ^3.0.4 | Bloom, Vignette 后处理 |
| postprocessing | ^6.39.1 | 后处理底层库 |
| Framer Motion | ^12.40.0 | 页面过渡 + 交互动画 |
| ESLint | ^9 | 代码规范 |
| eslint-config-next | 16.2.6 | Next.js ESLint 规则 |

**未安装但 PRD 提及的依赖**:
- GSAP -- PRD 列出但未安装，当前所有动画由 Framer Motion 驱动
- @next/mdx / @mdx-js/loader / @mdx-js/react -- PRD 计划用于思路链内容，尚未安装，当前内容直接存储在 `projects.ts`
- next-sitemap -- PRD 计划用于 sitemap 生成，尚未安装

---

## 2. 目录结构

```
portfolio/
├── src/
│   ├── app/                            # Next.js App Router 页面
│   │   ├── layout.tsx                  # 根布局: 字体、StarField、Navbar、PageTransition
│   │   ├── page.tsx                    # 首页: Hero + 精选项目占位
│   │   ├── globals.css                 # CSS 变量 + Tailwind theme + 全局样式
│   │   ├── not-found.tsx               # 404: 太空迷失主题
│   │   ├── favicon.ico
│   │   ├── about/
│   │   │   └── page.tsx                # 关于页
│   │   ├── contact/
│   │   │   └── page.tsx                # 联系页
│   │   └── projects/
│   │       ├── page.tsx                # 项目列表页 (client component)
│   │       └── [slug]/
│   │           ├── page.tsx            # 项目详情 (server, SSG + generateMetadata)
│   │           └── ProjectDetailClient.tsx  # 详情页客户端组件
│   ├── components/
│   │   ├── Hero.tsx                    # 首屏英雄区: SolarSystem + 打字机标语
│   │   ├── PageTransition.tsx          # Warp 速度线页面过渡
│   │   ├── ProjectFilter.tsx           # 业务线筛选栏
│   │   ├── three/                      # 3D 组件
│   │   │   ├── SolarSystem.tsx         # 太阳系主场景
│   │   │   ├── StarField.tsx           # 全局星空背景粒子
│   │   │   ├── StarFieldWrapper.tsx    # 条件渲染 (首页不显示)
│   │   │   ├── ParticleBackground.tsx  # 联系页粒子背景
│   │   │   ├── ProjectPlanet.tsx       # 可复用行星+卫星组件
│   │   │   ├── DataFlowGrid.tsx        # 矩阵数据流网格
│   │   │   ├── TechSphere.tsx          # 技术标签 3D 球
│   │   │   ├── SkillRadar3D.tsx        # 能力雷达图
│   │   │   ├── FloatingCard3D.tsx      # 项目 3D 翻转卡片
│   │   │   ├── ProjectSceneContainer.tsx  # 项目详情 3D 场景路由器
│   │   │   └── project-scenes/         # 项目专属 3D 场景
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
│   │   │       └── GenericScene.tsx     # 默认通用 3D 场景
│   │   ├── ui/                         # UI 基础组件
│   │   │   ├── Navbar.tsx              # 玻璃拟态导航栏
│   │   │   ├── Footer.tsx              # 页脚
│   │   │   ├── SkeletonLoader.tsx      # 骨架屏加载
│   │   │   ├── TechBadge.tsx           # 技术标签徽章
│   │   │   ├── SectionTitle.tsx        # 段落标题
│   │   │   ├── ImageGallery.tsx        # 图片画廊 + Lightbox
│   │   │   ├── CodeBlock.tsx           # 代码块 (终端风格)
│   │   │   └── ArchitectureDiagram.tsx # 架构图 (水平/垂直)
│   │   ├── about/
│   │   │   └── AboutContent.tsx        # 关于页内容编排
│   │   └── contact/
│   │       └── ContactContent.tsx      # 联系页内容编排
│   └── data/
│       └── projects.ts                 # 32 项目元数据 + 类型定义
├── public/
│   └── projects/                       # 项目截图资源
├── next.config.ts                      # Next.js 配置
├── tsconfig.json                       # TypeScript 配置
├── eslint.config.mjs                   # ESLint 配置
├── postcss.config.mjs                  # PostCSS (Tailwind)
├── package.json
├── PRD.md
└── SPEC.md
```

---

## 3. 路由表

| 路由 | 文件 | 渲染模式 | Metadata |
|------|------|---------|----------|
| `/` | `src/app/page.tsx` | SSG (default) | `title: "Hang's Portfolio - ..."`, `description: "探索Hang的项目宇宙..."` |
| `/projects` | `src/app/projects/page.tsx` | Client Component | 页面级未导出 metadata，继承根布局 |
| `/projects/[slug]` | `src/app/projects/[slug]/page.tsx` | SSG (`generateStaticParams`) | `generateMetadata` 动态生成 `title: "{name} \| Portfolio"` |
| `/about` | `src/app/about/page.tsx` | SSG (default) | 继承根布局 |
| `/contact` | `src/app/contact/page.tsx` | Client Component | 继承根布局 |
| `/not-found` | `src/app/not-found.tsx` | Static | 无独立 metadata |

**`generateStaticParams`**: 项目详情页预渲染所有 32 个 slug，构建时静态生成。

---

## 4. 数据模型

### 4.1 核心类型

```typescript
// src/data/projects.ts

type BusinessLine = 'health' | 'ai' | 'web' | 'creative' | 'research';

interface ThoughtChain {
  problem: string;        // 原始问题/痛点
  analysis: string;       // 需求分析
  design: string;         // 方案设计
  development: string;    // 开发过程
  challenges: Array<{
    title: string;
    description: string;
    solution: string;
  }>;
  outcome: string;        // 项目成果
}

interface Project {
  id: number;
  slug: string;           // URL slug (kebab-case)
  name: string;           // 中文名称
  nameEn: string;         // 英文名称
  businessLine: BusinessLine;
  tagline: string;        // 一句话描述
  description: string;    // 详细描述 (含 \n 换行)
  techStack: string[];    // 技术栈标签
  scene3d: string;        // 3D 场景类型标识 (映射到 ProjectSceneContainer)
  thoughtChain: ThoughtChain;
  screenshots: string[];  // 截图路径数组
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;      // 是否精选
  year: string;           // 年份
  status: 'completed' | 'active' | 'planning';
}
```

### 4.2 业务线标签映射

```typescript
const businessLineLabels: Record<BusinessLine, {
  name: string;     // 中文名
  nameEn: string;   // 英文名
  emoji: string;    // 图标
  color: string;    // 主题色 (hex)
}> = {
  health:    { name: '大健康行业', nameEn: 'Health Industry', emoji: '🏥', color: '#06b6d4' },
  ai:        { name: 'AI/大模型',  nameEn: 'AI & LLM',        emoji: '🤖', color: '#8b5cf6' },
  web:       { name: 'Web开发',   nameEn: 'Web Dev',         emoji: '💻', color: '#f97316' },
  creative:  { name: '创意/3D',   nameEn: 'Creative',        emoji: '🎨', color: '#eab308' },
  research:  { name: '学术研究',  nameEn: 'Research',        emoji: '📚', color: '#14b8a6' },
};
```

### 4.3 数据查询函数

| 函数 | 签名 | 返回 |
|------|------|------|
| `getProjectsByBusinessLine` | `(line: BusinessLine) => Project[]` | 按业务线筛选 |
| `getFeaturedProjects` | `() => Project[]` | 精选项目 |
| `getProjectBySlug` | `(slug: string) => Project \| undefined` | 按 slug 查找 |
| `getAllSlugs` | `() => string[]` | 所有 slug 列表 |

### 4.4 数据规模

- 总项目数: 32
- 大健康: 17, AI: 7, Web: 4, 创意: 1, 学术: 3
- 精选项目: campus-health, kefu-stats, feasibility-report, medical-ocr, competitor-intel, my-agent, vimax, starry-music-box

---

## 5. 组件 API 规格

### 5.1 页面组件

#### `Hero` (`src/components/Hero.tsx`)
- **导出**: `export default function Hero()`
- **Props**: 无
- **行为**: 全屏 hero 区域，`next/dynamic` 懒加载 SolarSystem，打字机效果轮播标语，"探索项目宇宙" 按钮滚动到 `#featured-projects`

#### `PageTransition` (`src/components/PageTransition.tsx`)
- **导出**: `export default function PageTransition({ children }: PageTransitionProps)`
- **Props**:
  ```typescript
  interface PageTransitionProps {
    children: ReactNode;
  }
  ```
- **行为**: `AnimatePresence mode="wait"` 包裹，key 为 `pathname`，enter/exit 缩放 + warp lines 动画

#### `ProjectFilter` (`src/components/ProjectFilter.tsx`)
- **导出**: `export default function ProjectFilter({ activeFilter, onFilterChange }: ProjectFilterProps)`
- **Props**:
  ```typescript
  type FilterOption = '全部' | BusinessLine;
  interface ProjectFilterProps {
    activeFilter: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
  }
  ```
- **行为**: 水平滚动筛选栏，6 个选项 (全部 + 5 业务线)，Framer Motion `layoutId` 指示器动画

### 5.2 3D 组件

#### `SolarSystem` (`src/components/three/SolarSystem.tsx`)
- **导出**: `export default function SolarSystem()`
- **Props**: 无 (自包含完整太阳系场景)
- **内部子组件**: `Sun`, `PlanetBody`, `Satellite`, `OrbitRing`, `CosmicDust`, `NebulaClouds`, `PlanetSystem`
- **3D 数据**: 5 个行星配置硬编码在 `PLANETS` 常量中
- **加载方式**: 在 Hero 中通过 `next/dynamic` + `{ ssr: false }` 懒加载

#### `StarField` (`src/components/three/StarField.tsx`)
- **导出**: `export default function StarField()`
- **Props**: 无
- **行为**: 全局星空粒子背景，`position: fixed, inset: 0, z-index: -10`，移动端 500 粒子 / 桌面 1200 粒子
- **内部接口**:
  ```typescript
  interface StarParticlesProps {
    count: number;
  }
  ```

#### `StarFieldWrapper` (`src/components/three/StarFieldWrapper.tsx`)
- **导出**: `export default function StarFieldWrapper()`
- **Props**: 无
- **行为**: 条件渲染 StarField，首页 (`/`) 不显示

#### `ParticleBackground` (`src/components/three/ParticleBackground.tsx`)
- **导出**: `export default function ParticleBackground()`
- **Props**: 无
- **行为**: 固定定位粒子背景，移动端 200 粒子 / 桌面 500 粒子

#### `ProjectPlanet` (`src/components/three/ProjectPlanet.tsx`)
- **导出**: `export default function ProjectPlanet({ ... }: ProjectPlanetProps)`
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
- **行为**: 带大气层和卫星的行星组件，hover 放大 + 发光增强 + Html tooltip

#### `DataFlowGrid` (`src/components/three/DataFlowGrid.tsx`)
- **导出**: `export default function DataFlowGrid({ lowPerformance }: DataFlowGridProps)`
- **Props**:
  ```typescript
  interface DataFlowGridProps {
    lowPerformance?: boolean;  // default: false
  }
  ```
- **行为**: 矩阵数据流网格，`lowPerformance` 时网格 8x8，否则 14x14

#### `TechSphere` (`src/components/three/TechSphere.tsx`)
- **导出**: `export default function TechSphere()`
- **Props**: 无 (内置 18 个技术标签)
- **行为**: Fibonacci 球面分布的技术标签，自动旋转 + OrbitControls 交互

#### `SkillRadar3D` (`src/components/three/SkillRadar3D.tsx`)
- **导出**: `export default function SkillRadar3D()`
- **Props**: 无 (内置 6 维度技能数据)
- **行为**: 6 边形雷达图，缓慢旋转，显示百分比标签
- **内部接口**:
  ```typescript
  interface SkillDimension {
    label: string;
    value: number;  // 0-1
  }
  ```

#### `FloatingCard3D` (`src/components/three/FloatingCard3D.tsx`)
- **导出**: `export default function FloatingCard3D({ project, index }: FloatingCard3DProps)`
- **Props**:
  ```typescript
  interface FloatingCard3DProps {
    project: Project;
    index: number;
  }
  ```
- **行为**: CSS perspective 3D 倾斜卡片，鼠标跟踪光泽效果，hover 浮起，链接到项目详情页

#### `ProjectSceneContainer` (`src/components/three/ProjectSceneContainer.tsx`)
- **导出**: `export default function ProjectSceneContainer({ sceneType }: SceneContainerProps)`
- **Props**:
  ```typescript
  interface SceneContainerProps {
    sceneType: string;
  }
  ```
- **行为**: 根据 `sceneType` 动态加载命名 3D 场景或 GenericScene，Canvas + OrbitControls 包裹

### 5.3 UI 组件

#### `Navbar` (`src/components/ui/Navbar.tsx`)
- **导出**: `export default function Navbar()`
- **Props**: 无
- **行为**: 固定顶部玻璃拟态导航，4 个链接 (首页/项目/关于/联系)，`md:` 断点切换桌面/移动菜单

#### `Footer` (`src/components/ui/Footer.tsx`)
- **导出**: `export default function Footer()`
- **Props**: 无
- **行为**: 底部栏，版权 / GitHub 链接 / 回到顶部

#### `SkeletonLoader` (`src/components/ui/SkeletonLoader.tsx`)
- **导出**: `export default function SkeletonLoader({ variant, count, className }: SkeletonLoaderProps)`
- **Props**:
  ```typescript
  interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | '3d' | 'image';
    count?: number;       // default: 1
    className?: string;
  }
  ```

#### `TechBadge` (`src/components/ui/TechBadge.tsx`)
- **导出**: `export default function TechBadge({ name, color }: TechBadgeProps)`
- **Props**:
  ```typescript
  interface TechBadgeProps {
    name: string;
    color?: string;  // 可选自定义颜色
  }
  ```

#### `SectionTitle` (`src/components/ui/SectionTitle.tsx`)
- **导出**: `export default function SectionTitle({ title, subtitle, align }: SectionTitleProps)`
- **Props**:
  ```typescript
  interface SectionTitleProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center';  // default: 'left'
  }
  ```

#### `ImageGallery` (`src/components/ui/ImageGallery.tsx`)
- **导出**: `export default function ImageGallery({ images }: ImageGalleryProps)`
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
- **行为**: 响应式网格 + 全屏 Lightbox，支持键盘/按钮前后翻页

#### `CodeBlock` (`src/components/ui/CodeBlock.tsx`)
- **导出**: `export default function CodeBlock({ code, language }: CodeBlockProps)`
- **Props**:
  ```typescript
  interface CodeBlockProps {
    code: string;
    language?: string;  // default: 'text'
  }
  ```

#### `ArchitectureDiagram` (`src/components/ui/ArchitectureDiagram.tsx`)
- **导出**: `export default function ArchitectureDiagram({ items }: ArchitectureDiagramProps)`
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
- **行为**: 桌面水平排列 + 移动端垂直排列，彩色边框 + 发光效果

### 5.4 页面编排组件

#### `AboutContent` (`src/components/about/AboutContent.tsx`)
- **导出**: `export default function AboutContent()`
- **Props**: 无
- **行为**: 编排 SkillRadar3D + 个人简介 + TechSphere + 职业时间线四个 section

#### `ContactContent` (`src/components/contact/ContactContent.tsx`)
- **导出**: `export default function ContactContent()`
- **Props**: 无
- **行为**: ParticleBackground + GitHub 卡片 + Email 卡片

---

## 6. 3D 场景规格

### 6.1 SolarSystem 太阳系场景

#### Canvas 配置
| 参数 | 值 |
|------|-----|
| Camera position | `[0, 10, 18]` |
| FOV | 50 deg |
| Near / Far | 0.1 / 250 |
| DPR | `[1, 1.5]` |
| Antialias | `true` |
| Tone Mapping | `ACESFilmicToneMapping`, exposure 1.0 |
| Background | `radial-gradient(ellipse, #0a0a1a -> #000005)` |

#### 太阳 (Sun)
| 参数 | 值 |
|------|-----|
| 核心几何体 | SphereGeometry(0.9, 64, 64) |
| 日冕几何体 | SphereGeometry(1.25, 48, 48) |
| 外层晕几何体 | SphereGeometry(1.8, 32, 32) |
| 核心材质 | ShaderMaterial (自定义 vertex + fragment) |
| 日冕材质 | ShaderMaterial, BackSide, AdditiveBlending, transparent |
| 外晕材质 | MeshBasicMaterial, color=#ff8833, opacity=0.04, BackSide, AdditiveBlending |
| 点光源 | intensity=4, distance=40, decay=2, color=#ffaa55 |
| Shader | Simplex Noise 生成动态表面，三层噪声叠加 (freq 2/4/8) |
| 颜色范围 | core #ffc866 -> mid #ff8c26 -> edge #cc400d |

#### 行星系统 (5 颗)
| 行星 | 颜色 | 大小 | 轨道半径 | 速度 | 倾斜 | 卫星数 | Ring |
|------|------|------|---------|------|------|--------|------|
| 大健康 | #0ea5e9 / #0284c7 | 0.55 | 5.5 | 0.12 | 0.15 | 17 | no |
| AI/大模型 | #a78bfa / #7c3aed | 0.45 | 8.0 | 0.09 | -0.10 | 7 | #7c3aed |
| Web开发 | #fb923c / #ea580c | 0.40 | 10.5 | 0.07 | 0.20 | 4 | no |
| 创意 | #facc15 / #ca8a04 | 0.32 | 13.0 | 0.05 | -0.25 | 1 | #ca8a04 |
| 学术研究 | #2dd4bf / #0d9488 | 0.36 | 15.5 | 0.04 | 0.12 | 3 | no |

**行星材质**: MeshStandardMaterial, roughness=0.55, metalness=0.25, emissiveIntensity=0.15 (hover 0.5)
**大气层**: SphereGeometry(1.12), BackSide, AdditiveBlending, opacity=0.08 (hover 0.20)
**Ring**: RingGeometry(1.4, 1.8, 64), DoubleSide, AdditiveBlending, opacity=0.12

#### 星空粒子 (CosmicDust)
| 参数 | 值 |
|------|-----|
| 数量 | 3000 |
| 分布 | 球壳, radius 25-80 |
| 颜色 | 暖白 (60%), 冷蓝 (25%), 琥珀 (15%) |
| 尺寸 | 0.05-0.25, sizeAttenuation |
| 材质 | PointsMaterial, AdditiveBlending, vertexColors, depthWrite=false |
| 旋转 | y 轴, delta * 0.003 |

#### 星云 (NebulaClouds)
| 参数 | 值 |
|------|-----|
| 数量 | 8 个球体 |
| 颜色 | #1a0533, #0a1628, #0d2137, #1a0a2e, #051a2c |
| 大小 | 15-40 |
| 透明度 | 0.15-0.25 |
| 旋转 | y 轴, delta * 0.001 |

#### 后处理
| 效果 | 参数 |
|------|------|
| Bloom | intensity=0.6, luminanceThreshold=0.2, luminanceSmoothing=0.9, mipmapBlur=true |
| Vignette | eskil=false, offset=0.3, darkness=0.6 |

#### OrbitControls
| 参数 | 值 |
|------|-----|
| enableDamping | true, factor=0.04 |
| minDistance / maxDistance | 6 / 35 |
| autoRotate | true, speed=0.2 |
| enablePan | false |
| maxPolarAngle / minPolarAngle | 0.7PI / 0.3PI |

### 6.2 StarField 星空背景

| 参数 | 值 |
|------|-----|
| Camera | position=[0,0,10], fov=60 |
| DPR | [1, 1.5] |
| 粒子数 | 桌面 1200, 移动端 500 |
| 分布 | 球体, radius 5-55 |
| 颜色 | 白色 (70%), 蓝色 (30%) |
| 尺寸 | 0.15, sizeAttenuation |
| 旋转 | y: delta*0.02, x: delta*0.005 |
| Alpha | true (透明背景) |

### 6.3 DataFlowGrid 数据流网格

| 参数 | 值 |
|------|-----|
| Camera | position=[0,12,12], fov=50 |
| DPR | [1, 1.5] |
| 网格大小 | 标准 14x14, 低性能 8x8 |
| 间距 | 2 单位 |
| 线条颜色 | #3b82f6 |
| 脉冲点颜色 | #06b6d4 / #8b5cf6 |
| 旋转 | -PI/4 (透视角度) |
| 脉冲采样步长 | 标准 3, 低性能 4 |
| Antialias | false (性能优化) |
| Power Preference | 'low-power' |

### 6.4 SkillRadar3D 能力雷达

| 参数 | 值 |
|------|-----|
| Camera | position=[0,0,5], fov=50 |
| DPR | [1, 2] |
| 雷达半径 | 2 |
| 网格环数 | 4 |
| 维度数 | 6 (全栈开发/AI应用/数据分析/行业知识/项目管理/创意设计) |
| 填充颜色 | #4a90d9, opacity=0.15 |
| 边缘颜色 | #6cb4ee, opacity=0.9 |
| 顶点圆点 | SphereGeometry(0.04) |
| 旋转 | z 轴, delta * 0.08 |

### 6.5 TechSphere 技术标签球

| 参数 | 值 |
|------|-----|
| Camera | position=[0,0,6], fov=50 |
| DPR | [1, 1.5] |
| 球体半径 | 2.5 |
| 标签数量 | 18 |
| 分布算法 | Fibonacci 球面 (黄金角) |
| 线框球体 | SphereGeometry(2.4, 24, 24), color=#1a3a5c, opacity=0.1 |
| AutoRotate | speed=0.5 |
| OrbitControls | enableZoom=false, enablePan=false |

### 6.6 ProjectSceneContainer 项目场景路由

| 参数 | 值 |
|------|-----|
| Camera | position=[0,1,5], fov=50 |
| DPR | [1, 1.5] |
| 命名场景映射 | campus-health, data-dashboard, desktop-app, dna-helix, neural-network, film-reel, music-box, tai-chi, gallery-3d, radar-scan |
| 通用场景颜色 | health=#0ea5e9, ai=#8b5cf6, web=#f97316, creative=#eab308, research=#14b8a6 |
| OrbitControls | enableZoom=false, enablePan=false, polar=[PI/4, 3PI/4], azimuth=[-PI/3, PI/3] |
| 加载方式 | `next/dynamic` 按场景类型懒加载 |

### 6.7 ParticleBackground 粒子背景

| 参数 | 值 |
|------|-----|
| Camera | position=[0,0,10], fov=60 |
| DPR | [1, 2] |
| 粒子数 | 桌面 500, 移动端 200 |
| 分布 | 球体, radius 5-35 |
| 颜色 | #4a90d9, opacity=0.4 |
| 尺寸 | 0.05, sizeAttenuation |
| 旋转 | y 轴, delta * 0.03 |

---

## 7. 样式规范

### 7.1 CSS 变量表 (globals.css :root)

```css
:root {
  --background: #0a0a1a;      /* 主背景: 深蓝黑 */
  --foreground: #e0e0f0;      /* 主文字: 浅灰蓝 */
  --accent: #6488ff;          /* 强调色: 蓝紫 */
  --accent-dim: #3a5bbf;      /* 强调暗色 */
  --surface: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.1);
  --muted: #8888aa;           /* 弱化文字 */
}
```

### 7.2 Tailwind Theme Token (globals.css @theme inline)

```css
/* 背景色 */
--color-bg-primary: #0a0a1a;
--color-bg-secondary: #111827;
--color-bg-card: #1f2937;

/* 文字色 */
--color-text-primary: #f9fafb;
--color-text-secondary: #9ca3af;

/* 强调色 */
--color-accent-blue: #06b6d4;      /* 大健康 */
--color-accent-purple: #8b5cf6;    /* AI */
--color-accent-orange: #f97316;    /* Web */
--color-accent-gold: #eab308;      /* 创意 */
--color-accent-teal: #14b8a6;      /* 学术 */

/* 发光 */
--color-glow: #3b82f6;

/* 字体 */
--font-sans: var(--font-geist-sans);   /* Geist Sans */
--font-mono: var(--font-geist-mono);   /* Geist Mono */

/* 自定义动画 */
--animate-float: float 6s ease-in-out infinite;
--animate-pulse-glow: pulse-glow 2s ease-in-out infinite;
--animate-warp-in: warp-in 0.6s ease-out forwards;
```

### 7.3 自定义 Keyframes

```css
@keyframes float       { 0%,100%: translateY(0); 50%: translateY(-20px) }
@keyframes pulse-glow  { 0%,100%: opacity 0.4 + 8px glow; 50%: opacity 1 + 20px glow }
@keyframes warp-in     { 0%: scale(0.8) rotateX(10deg) blur(4px); 100%: scale(1) rotateX(0) blur(0) }
```

### 7.4 暗色主题 Color Token 总结

| 用途 | Token | Hex |
|------|-------|-----|
| 页面背景 | --background / --color-bg-primary | #0a0a1a |
| 卡片/次级背景 | --color-bg-secondary | #111827 |
| 卡片内背景 | --color-bg-card | #1f2937 |
| 主文字 | --foreground / --color-text-primary | #e0e0f0 / #f9fafb |
| 次级文字 | --muted / --color-text-secondary | #8888aa / #9ca3af |
| 边框 | --border | rgba(255,255,255,0.1) |
| 强调 | --accent | #6488ff |
| 发光 | --color-glow | #3b82f6 |

### 7.5 全局样式规则

- `html`: `scroll-behavior: smooth`
- `body`: min-height 100vh, overflow-x hidden, Geist Sans 字体
- `canvas`: `touch-action: none` (防止 3D 画布干扰滚动)
- `a, button`: `transition: color/bg/border 0.2s ease`
- `::selection`: `background: rgba(100,136,255,0.3)`, color #fff
- 滚动条: WebKit 8px 圆角, track #0a0a1a, thumb rgba(255,255,255,0.15)

### 7.6 字体

| 字体 | 来源 | CSS 变量 | 用途 |
|------|------|---------|------|
| Geist Sans | `next/font/google` | `--font-geist-sans` | 主字体 |
| Geist Mono | `next/font/google` | `--font-geist-mono` | 代码/等宽 |

---

## 8. 性能目标

### 8.1 Bundle Size 目标

| Chunk | 目标 (gzipped) | 当前状态 |
|-------|---------------|---------|
| 首屏 HTML + CSS | < 50KB | - |
| 首屏 JS (不含 Three.js) | < 100KB | - |
| Three.js chunk (懒加载) | < 300KB | - |

### 8.2 Lighthouse 目标

| 指标 | 目标 |
|------|------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 3s (4G) |
| Lighthouse Performance | > 80 |
| Lighthouse Accessibility | > 85 |

### 8.3 3D 渲染目标

| 指标 | 目标 |
|------|------|
| FPS (桌面) | > 30fps |
| FPS (移动端) | > 20fps |

### 8.4 Bundle 分包策略

- Three.js 及 R3F 全部通过 `next/dynamic` + `{ ssr: false }` 懒加载
- 首屏不包含任何 Three.js 代码
- Three.js chunk 独立为 vendor chunk，仅在 3D 页面加载
- `next.config.ts` 配置 `transpilePackages: ['three', '@react-three/fiber', '@react-three/drei']`

---

## 9. 响应式断点

### 9.1 断点定义 (Tailwind 默认)

| 名称 | 最小宽度 | 使用方式 |
|------|---------|---------|
| sm | 640px | `sm:` prefix |
| md | 768px | `md:` prefix |
| lg | 1024px | `lg:` prefix |
| xl | 1280px | `xl:` prefix |

### 9.2 3D 降级策略

| 设备 | 断点 | 后处理 | 粒子数 | 太阳系 | DPR | 降级检测 |
|------|------|--------|--------|--------|-----|---------|
| 移动端 | < 768px | 关闭 Bloom/Vignette | 500 (StarField) / 200 (ParticleBackground) | 完整 3D (受限于 DPR) | [1, 1.5] | `window.innerWidth < 768` |
| 平板 | 768-1024px | 保留 Bloom (intensity 0.3) | 1200 | 完整 3D | [1, 1.5] | - |
| 桌面 | > 1024px | 完整 Bloom + Vignette | 3000 (SolarSystem) / 1200 (StarField) | 完整 3D | [1, 2] | - |

### 9.3 布局策略

| 页面 | 移动端 | 平板 | 桌面 |
|------|--------|------|------|
| 首页 | 单列 Hero | 单列 Hero | 单列 Hero |
| 项目列表 | 1 列卡片 | 2 列卡片 | 3 列卡片 |
| 项目详情 | 单列全宽 | 单列全宽 | 内容 + 侧边装饰 |
| 关于 | 单列 | 单列 | 单列 max-w-3xl |
| 联系 | 单列居中 | 单列居中 | 单列居中 max-w-lg |

### 9.4 组件级响应式

- **Navbar**: `hidden md:flex` 桌面导航 / `md:hidden` 汉堡菜单
- **ArchitectureDiagram**: `hidden md:flex` 水平 / `md:hidden flex` 垂直
- **FloatingCard3D**: perspective 800px hover 效果仅桌面端 (触摸设备不触发)
- **SkillRadar3D**: `min-h-[400px] sm:min-h-[500px]`
- **TechSphere**: `min-h-[400px] sm:min-h-[500px]`

### 9.5 低端设备检测 (计划)

- `navigator.hardwareConcurrency < 4` -> 降级到移动端配置
- WebGL 支持失败 -> 回退到 CSS 动画背景
- `useMemo` 缓存降级判断

---

## 10. SEO / 可访问性

### 10.1 Metadata 策略

| 页面 | Title | Description | 生成方式 |
|------|-------|-------------|---------|
| 根布局 | "Hang's Portfolio" | "全栈开发 · AI应用 · 大健康行业 - 探索项目宇宙" | `export const metadata` |
| 首页 | "Hang's Portfolio - 全栈开发 · AI应用 · 大健康" | "探索Hang的项目宇宙..." | `export const metadata` |
| 项目详情 | "{project.name} \| Portfolio" | project.description | `generateMetadata()` |

### 10.2 语言与字体

- `<html lang="zh-CN">` 中文语言标记
- Geist Sans + Geist Mono Google Fonts

### 10.3 语义化 HTML 规范

| 元素 | 使用 |
|------|------|
| `<header>` | Navbar 使用 `<header>` 包裹 |
| `<main>` | 根布局 `<main className="flex-1 pt-16">` |
| `<nav>` | Navbar 内 `<nav role="navigation" aria-label="Main navigation">` |
| `<footer>` | Footer 组件使用 `<footer>` |
| `<section>` | 各内容区块使用 section |
| `<article>` | 项目卡片内容 |

### 10.4 ARIA 标签

| 元素 | ARIA |
|------|------|
| 所有 3D Canvas 容器 | `aria-hidden="true"` |
| Navbar 导航 | `role="navigation"`, `aria-label="Main navigation"` |
| 移动菜单按钮 | `aria-expanded`, `aria-label="Toggle navigation menu"` |
| Lightbox 关闭按钮 | `aria-label="Close lightbox"` |
| 前后翻页按钮 | `aria-label="Previous/Next image"` |
| 外部链接 | `rel="noopener noreferrer"` |
| 装饰性 SVG | `aria-hidden="true"` |

### 10.5 可访问性目标

- 颜色对比度: 文字与背景至少 4.5:1 (WCAG AA)
- 焦点指示器: Tailwind 默认 focus ring
- 键盘导航: Tab 可达所有交互元素
- 跳过导航: 计划添加 "Skip to main content"
- 图片 alt: 所有装饰性图片 `alt=""`，信息性图片提供描述

### 10.6 SEO 计划 (未实施)

- **Open Graph**: 计划添加 og:title, og:description, og:image, og:url
- **Twitter Card**: 计划添加 twitter:card, twitter:title 等
- **sitemap.xml**: 计划使用 next-sitemap 自动生成
- **robots.txt**: 计划允许所有爬虫
- **JSON-LD**: 计划添加 WebSite + Person schema

---

## 11. 部署配置

### 11.1 Vercel 部署

| 配置项 | 值 |
|--------|-----|
| 平台 | Vercel |
| 构建命令 | `next build` |
| 输出目录 | `.next` (默认) |
| Node.js 版本 | Vercel 默认 |
| 域名 | show.vercel.app (计划) |
| 环境变量 | 无需 (纯静态内容站点) |
| 部署触发 | GitHub 仓库 push 自动部署 |

### 11.2 CDN 缓存策略 (计划)

| 资源类型 | 策略 |
|---------|------|
| 静态资源 (JS/CSS/images) | immutable 缓存 |
| HTML 页面 | 1 小时缓存 |
| 3D 模型 (.glb/.gltf) | immutable 缓存 |

### 11.3 性能监控 (计划)

- Vercel Analytics + Web Vitals
- 构建后 `next-sitemap` 生成 sitemap.xml

### 11.4 next.config.ts 当前配置

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

### 11.5 TypeScript 配置

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

## 附录 A: 待实施事项 (源自 PRD 但尚未完成)

| 编号 | 事项 | 优先级 | 说明 |
|------|------|--------|------|
| A1 | MDX 内容系统 | P1 | @next/mdx + @mdx-js/loader，思路链 MDX 文件 |
| A2 | GSAP 集成 | P2 | PRD 列出但未安装，当前 Framer Motion 覆盖 |
| A3 | next-sitemap | P1 | sitemap.xml + robots.txt 自动生成 |
| A4 | Open Graph / Twitter Card | P1 | 社交分享元标签 |
| A5 | JSON-LD 结构化数据 | P2 | WebSite + Person + SoftwareSourceCode schema |
| A6 | 联系表单 | P2 | PRD 提及但当前仅 GitHub + Email 卡片 |
| A7 | 鼠标跟随粒子 | P3 | PRD F6 提及，仅桌面端 |
| A8 | 滚动指示 3D 彗星 | P3 | PRD F6 提及 |
| A9 | 低端设备自动检测 | P2 | hardwareConcurrency < 4 降级 |
| A10 | WebGL 失败 CSS 回退 | P1 | ErrorBoundary + CSS 渐变背景 |
| A11 | "Skip to main content" | P2 | 可访问性跳过链接 |
| A12 | 首页精选项目展示 | P0 | 当前为占位内容 |
| A13 | PWA manifest | P3 | PRD 可选 |

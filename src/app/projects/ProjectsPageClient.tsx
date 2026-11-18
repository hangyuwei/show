'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { allProjects, type BusinessLine } from '@/data/projects';
import ProjectFilter from '@/components/ProjectFilter';
import FloatingCard3D from '@/components/three/FloatingCard3D';
import { ProjectsIndexBackdrop, HyperspaceBackdrop } from '@/components/threeui/backdrops';

type FilterOption = '全部' | BusinessLine;

const VALID_LINES: BusinessLine[] = ['health', 'ai', 'web', 'creative', 'research'];

export default function ProjectsPageClient() {
  const searchParams = useSearchParams();
  const initialLine = searchParams.get('line');
  const [activeFilter, setActiveFilter] = useState<FilterOption>(
    initialLine && VALID_LINES.includes(initialLine as BusinessLine)
      ? (initialLine as BusinessLine)
      : '全部'
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === '全部') return allProjects;
    return allProjects.filter((p) => p.businessLine === activeFilter);
  }, [activeFilter]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#02030a]">
      {/* Live dot matrix background — pulsing cyan grid with cursor ripple
          (ThreeUI Community); static dot-grid layer retired in its favor,
          and it bows out under prefers-reduced-motion */}
      <ProjectsIndexBackdrop />
      {/* Grid lines overlay — engineered HUD trace */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(101,216,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(101,216,255,0.014) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 22%, black 6%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 22%, black 6%, transparent 100%)',
        }}
      />
      {/* Cross-hatch diagonal lines for texture depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.014]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 54px, rgba(101,216,255,0.24) 54px, rgba(101,216,255,0.24) 55px), repeating-linear-gradient(-45deg, transparent, transparent 54px, rgba(242,193,102,0.16) 54px, rgba(242,193,102,0.16) 55px)',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 80%)',
        }}
      />
      {/* Restrained spectral wash for depth */}
      <div
        className="pointer-events-none absolute top-[5%] left-[4%] w-[520px] h-[360px] rounded-full z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(101,216,255,0.032) 0%, rgba(101,216,255,0.010) 42%, transparent 72%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[12%] right-[2%] w-[560px] h-[380px] rounded-full z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,242,255,0.018) 0%, rgba(101,216,255,0.008) 45%, transparent 74%)',
        }}
      />
      {/* Subtle noise texture overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.35,
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 28%, black 12%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 28%, black 12%, transparent 100%)',
        }}
      />

      {/* Hyperspace entry — a full-throttle warp corridor pouring into the index */}
      <section
        className="relative isolate flex h-[46dvh] min-h-[340px] shrink-0 flex-col items-center justify-center overflow-hidden px-4 text-center"
        aria-labelledby="projects-hero-title"
      >
        <HyperspaceBackdrop />
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-0 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/60">
            Project Index · Warp Entry
          </p>
          <h1
            id="projects-hero-title"
            className="mt-4 text-4xl font-black leading-none tracking-tight text-white [text-shadow:0_2px_30px_rgba(2,3,10,0.9),0_0_70px_rgba(101,216,255,0.25)] sm:text-6xl lg:text-7xl"
          >
            项目索引
          </h1>
          <p className="mb-0 mt-4 text-sm text-cyan-50/62 [text-shadow:0_1px_14px_rgba(2,3,10,0.95)]">
            {allProjects.length} 个项目 · 五条业务航线 · 按交付证据编排
          </p>
        </motion.div>
      </section>

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-12 sm:pb-20">
        {/* Filter */}
        <motion.div
          className="mt-0 mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProjectFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </motion.div>

        {/* Card grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <FloatingCard3D
                key={project.slug}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-zinc-500"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/35">
              NO PROJECTS MATCH FILTER
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

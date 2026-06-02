'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { allProjects, type BusinessLine } from '@/data/projects';
import SectionTitle from '@/components/ui/SectionTitle';
import ProjectFilter from '@/components/ProjectFilter';
import FloatingCard3D from '@/components/three/FloatingCard3D';

type FilterOption = '全部' | BusinessLine;

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('全部');

  const filteredProjects = useMemo(() => {
    if (activeFilter === '全部') return allProjects;
    return allProjects.filter((p) => p.businessLine === activeFilter);
  }, [activeFilter]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#02030a]">
      {/* Dot grid pattern background — calibrated to the astrolabe palette */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(101,216,255,0.045) 0.6px, transparent 0.6px)',
          backgroundSize: '18px 18px',
          maskImage:
            'radial-gradient(ellipse 85% 75% at 50% 12%, black 4%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 75% at 50% 12%, black 4%, transparent 100%)',
        }}
      />
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

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-18 sm:pb-20">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionTitle
            title="项目索引"
            subtitle="按真实系统、技术路径和交付结果整理的作品集入口。"
          />
        </motion.div>

        {/* Filter */}
        <motion.div
          className="mt-8 mb-8"
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

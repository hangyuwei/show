'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { allProjects, businessLineLabels, type BusinessLine } from '@/data/projects';
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
    <div className="relative min-h-screen flex flex-col bg-black">
      {/* Dot grid pattern background — premium density with color tint */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(139,92,246,0.055) 0.6px, transparent 0.6px)',
          backgroundSize: '16px 16px',
          maskImage:
            'radial-gradient(ellipse 85% 75% at 50% 12%, black 4%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 75% at 50% 12%, black 4%, transparent 100%)',
        }}
      />
      {/* Grid lines overlay — wider, subtler with violet tint */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.022) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 22%, black 6%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 22%, black 6%, transparent 100%)',
        }}
      />
      {/* Cross-hatch diagonal lines for texture depth — premium color tint */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.016]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 52px, rgba(139,92,246,0.30) 52px, rgba(139,92,246,0.30) 53px), repeating-linear-gradient(-45deg, transparent, transparent 52px, rgba(20,184,166,0.22) 52px, rgba(20,184,166,0.22) 53px)',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 30%, black 10%, transparent 80%)',
        }}
      />
      {/* Ambient glow orbs for atmosphere — premium layered light */}
      <div
        className="pointer-events-none absolute top-[8%] left-[4%] w-[650px] h-[650px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(139,92,246,0.025) 40%, rgba(139,92,246,0.008) 60%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[12%] right-[0%] w-[750px] h-[750px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, rgba(6,182,212,0.022) 40%, rgba(6,182,212,0.006) 60%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.03) 0%, rgba(249,115,22,0.012) 40%, rgba(249,115,22,0.004) 60%, transparent 75%)',
        }}
      />
      {/* Fourth orb — subtle blue accent for depth layering */}
      <div
        className="pointer-events-none absolute top-[30%] right-[15%] w-[450px] h-[450px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(45,140,240,0.035) 0%, rgba(45,140,240,0.012) 40%, transparent 70%)',
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
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionTitle
            title="项目宇宙"
            subtitle="探索我在不同领域的作品与实验，从医疗 AI 到创意编程。"
          />
        </motion.div>

        {/* Filter */}
        <motion.div
          className="mt-12 mb-10"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9"
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
            <span className="text-4xl mb-4">🔭</span>
            <p className="text-lg">该分类下暂无项目</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

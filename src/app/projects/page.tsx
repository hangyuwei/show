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
      {/* Dot grid pattern background — denser, more atmospheric */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage:
            'radial-gradient(ellipse 85% 75% at 50% 25%, black 5%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 75% at 50% 25%, black 5%, transparent 100%)',
        }}
      />
      {/* Grid lines overlay — subtler, wider spacing */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, black 10%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, black 10%, transparent 100%)',
        }}
      />
      {/* Cross-hatch diagonal lines for texture depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.3) 35px, rgba(255,255,255,0.3) 36px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.3) 35px, rgba(255,255,255,0.3) 36px)',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, black 15%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 40%, black 15%, transparent 80%)',
        }}
      />
      {/* Ambient glow orbs for atmosphere */}
      <div
        className="pointer-events-none absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[20%] right-[5%] w-[600px] h-[600px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.03) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.02) 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <SectionTitle
            title="项目宇宙"
            subtitle="探索我在不同领域的作品与实验，从医疗 AI 到创意编程。"
          />
        </motion.div>

        {/* Filter */}
        <motion.div
          className="mt-10 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <ProjectFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </motion.div>

        {/* Card grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
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

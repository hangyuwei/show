'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
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
      {/* Enhanced dot grid pattern background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 30%, black 10%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 30%, black 10%, transparent 100%)',
        }}
      />
      {/* Subtle grid lines overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 15%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 15%, transparent 100%)',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Section title */}
        <SectionTitle
          title="项目宇宙"
          subtitle="探索我在不同领域的作品与实验，从医疗 AI 到创意编程。"
        />

        {/* Filter */}
        <div className="mt-10 mb-8">
          <ProjectFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <FloatingCard3D
                key={project.slug}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <span className="text-4xl mb-4">🔭</span>
            <p className="text-lg">该分类下暂无项目</p>
          </div>
        )}
      </main>
    </div>
  );
}

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
      {/* Main content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
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

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>&copy; {new Date().getFullYear()} Portfolio</span>
          <span>
            Built with Next.js, Three.js &amp; Framer Motion
          </span>
        </div>
      </footer>
    </div>
  );
}

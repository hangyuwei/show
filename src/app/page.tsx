import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeaturedProjectsSection from '@/components/projects/FeaturedProjectsSection';
import { getFeaturedProjects } from '@/data/projects';

export const metadata: Metadata = {
  title: "Hang's Portfolio - 全栈开发 · AI应用 · 大健康",
  description:
    '探索Hang的项目宇宙：涵盖大健康、AI应用、Web开发、创意设计与学术研究五大业务线。',
};

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  return (
    <main className="flex flex-col">
      <Hero />
      <FeaturedProjectsSection projects={featuredProjects} />
    </main>
  );
}

import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import UniverseExplorer from '@/components/landing/UniverseExplorer';
import LandingExperienceSection from '@/components/landing/LandingExperienceSection';
import FeaturedProjectsSection from '@/components/projects/FeaturedProjectsSection';
import { allProjects, getFeaturedProjects } from '@/data/projects';

export const metadata: Metadata = {
  description:
    '探索Hang的项目宇宙：涵盖大健康、AI应用、Web开发、创意设计与学术研究五大业务线。',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  return (
    <main className="flex flex-col">
      <Hero />
      <UniverseExplorer />
      <LandingExperienceSection projects={allProjects} />
      <FeaturedProjectsSection projects={featuredProjects} />
    </main>
  );
}

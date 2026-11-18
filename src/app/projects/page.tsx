import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectsPageClient from './ProjectsPageClient';

export const metadata: Metadata = {
  title: '项目索引',
  description:
    '按真实系统、技术路径和交付结果整理的作品集入口：大健康、AI应用、Web开发、创意设计与学术研究。',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: '项目索引',
    description:
      '按真实系统、技术路径和交付结果整理的作品集入口：大健康、AI应用、Web开发、创意设计与学术研究。',
    url: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageClient />
    </Suspense>
  );
}

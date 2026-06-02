import { Metadata } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import { allProjects, getAllSlugs } from '@/data/projects';
import ProjectDetailClient from './ProjectDetailClient';

function publicAssetExists(src: string): boolean {
  if (!src.startsWith('/')) return false;
  return existsSync(join(process.cwd(), 'public', src));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.name} | Portfolio`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const screenshots = project.screenshots.map((src) => ({
    src,
    exists: publicAssetExists(src),
  }));

  return <ProjectDetailClient project={project} screenshots={screenshots} />;
}

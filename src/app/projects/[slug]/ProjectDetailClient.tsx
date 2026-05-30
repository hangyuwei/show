'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';
import CodeBlock from '@/components/ui/CodeBlock';

const ProjectSceneContainer = dynamic(
  () => import('@/components/three/ProjectSceneContainer'),
  { ssr: false }
);

function SectionTitle({ children, step }: { children: React.ReactNode; step?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-center gap-4"
    >
      {step && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-lg font-bold text-indigo-400 ring-1 ring-indigo-500/30">
          {step}
        </span>
      )}
      <h2 className="text-2xl font-bold text-zinc-100 sm:text-3xl">{children}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-zinc-700 to-transparent" />
    </motion.div>
  );
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

function ScrollDownArrow() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        className="h-8 w-8 text-white/60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30',
    active: 'bg-amber-500/20 text-amber-400 ring-amber-500/30',
    planning: 'bg-blue-500/20 text-blue-400 ring-blue-500/30',
  };
  const labelMap: Record<string, string> = {
    completed: '已完成',
    active: '开发中',
    planning: '规划中',
  };
  const classes = colorMap[status] ?? 'bg-zinc-500/20 text-zinc-400 ring-zinc-500/30';
  const label = labelMap[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${classes}`}>
      {label}
    </span>
  );
}

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [showFullCode, setShowFullCode] = useState(false);
  const lineInfo = businessLineLabels[project.businessLine];

  const codePlaceholder = `// ${project.name} - 核心代码示例
import { createApp } from '${project.techStack[0]?.toLowerCase() ?? 'framework'}';

const app = createApp({
  // 项目配置
});

app.start();`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* a) 3D Entry Scene */}
      <section className="relative h-screen w-full overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center bg-zinc-950">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          }
        >
          <ProjectSceneContainer sceneType={project.scene3d} />
        </Suspense>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
              {lineInfo.emoji} {lineInfo.name}
            </span>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              {project.name}
            </h1>
          </motion.div>
        </div>

        <ScrollDownArrow />
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* b) Project Overview */}
        <section className="py-16 sm:py-24">
          <SectionTitle>项目概述</SectionTitle>
          <FadeInSection>
            <h3 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{project.name}</h3>
            <p className="mb-6 text-lg leading-relaxed text-zinc-400">{project.description}</p>

            <div className="mb-6 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-400 ring-1 ring-indigo-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <StatusBadge status={project.status} />
              <span className="text-sm text-zinc-500">{project.year}</span>
            </div>
          </FadeInSection>
        </section>

        {/* c) Step 1: Requirements Analysis */}
        <section className="py-12 sm:py-16">
          <SectionTitle step="①">需求分析</SectionTitle>
          <FadeInSection>
            <div className="relative ml-5 border-l-2 border-indigo-500/30 pl-8">
              <div className="mb-8">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">问题</h4>
                <p className="text-lg leading-relaxed text-zinc-300">{project.thoughtChain.problem}</p>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">分析</h4>
                <p className="text-lg leading-relaxed text-zinc-300">{project.thoughtChain.analysis}</p>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* d) Step 2: Solution Design */}
        <section className="py-12 sm:py-16">
          <SectionTitle step="②">方案设计</SectionTitle>
          <FadeInSection>
            <p className="mb-6 text-lg leading-relaxed text-zinc-300">{project.thoughtChain.design}</p>
            <div className="overflow-hidden rounded-xl border border-zinc-700/50 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                技术架构图
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {project.techStack.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center justify-center rounded-lg border border-zinc-600/30 bg-zinc-800/50 px-4 py-6 text-center text-sm font-medium text-zinc-300 backdrop-blur-sm"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* e) Step 3: Development Process */}
        <section className="py-12 sm:py-16">
          <SectionTitle step="③">开发过程</SectionTitle>
          <FadeInSection>
            <p className="mb-6 text-lg leading-relaxed text-zinc-300">{project.thoughtChain.development}</p>
            <CodeBlock code={showFullCode ? codePlaceholder : codePlaceholder.split('\n').slice(0, 6).join('\n')} language="typescript" />
            {!showFullCode && (
              <button
                onClick={() => setShowFullCode(true)}
                className="mt-3 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
              >
                展开代码...
              </button>
            )}
            {showFullCode && (
              <button
                onClick={() => setShowFullCode(false)}
                className="mt-3 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
              >
                收起代码
              </button>
            )}
          </FadeInSection>
        </section>

        {/* f) Step 4: Challenges */}
        <section className="py-12 sm:py-16">
          <SectionTitle step="④">难点与解决方案</SectionTitle>
          <div className="space-y-6">
            {project.thoughtChain.challenges.map((challenge, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/50 p-6 backdrop-blur-sm">
                  <h4 className="mb-2 text-lg font-semibold text-zinc-100">{challenge.title}</h4>
                  <p className="mb-4 text-zinc-400">{challenge.description}</p>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-emerald-400">解决方案</span>
                    </div>
                    <p className="text-sm text-zinc-300">{challenge.solution}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>

        {/* g) Step 5: Outcome */}
        <section className="py-12 sm:py-16">
          <SectionTitle step="⑤">项目成果</SectionTitle>
          <FadeInSection>
            <p className="mb-8 text-lg leading-relaxed text-zinc-300">{project.thoughtChain.outcome}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex aspect-video items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-sm text-zinc-500"
                >
                  截图 {n}
                </div>
              ))}
            </div>
          </FadeInSection>
        </section>

        {/* h) External Links */}
        <section className="border-t border-zinc-800 py-12 sm:py-16">
          <FadeInSection>
            <div className="flex flex-wrap items-center gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 ring-1 ring-zinc-700 transition-colors hover:bg-zinc-700 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  在线 Demo
                </a>
              )}
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-400 ring-1 ring-zinc-700/50 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                返回项目列表
              </Link>
            </div>
          </FadeInSection>
        </section>
      </div>
    </div>
  );
}

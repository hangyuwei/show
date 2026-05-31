'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';
import CodeBlock from '@/components/ui/CodeBlock';

const ProjectSceneContainer = dynamic(
  () => import('@/components/three/ProjectSceneContainer'),
  { ssr: false }
);

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SECTION_IDS = [
  { id: 'overview', label: '项目概述' },
  { id: 'requirements', label: '需求分析' },
  { id: 'design', label: '方案设计' },
  { id: 'development', label: '开发过程' },
  { id: 'challenges', label: '难点与解决' },
  { id: 'outcome', label: '项目成果' },
] as const;

const TECH_COLORS: Record<string, string> = {
  react: '#61dafb',
  'react.js': '#61dafb',
  nextjs: '#ffffff',
  'next.js': '#ffffff',
  typescript: '#3178c6',
  javascript: '#f7df1e',
  python: '#3776ab',
  node: '#339933',
  'node.js': '#339933',
  tailwind: '#06b6d4',
  'tailwindcss': '#06b6d4',
  'tailwind css': '#06b6d4',
  three: '#ffffff',
  threejs: '#ffffff',
  'three.js': '#ffffff',
  framer: '#0055ff',
  'framer motion': '#0055ff',
  prisma: '#2d3748',
  postgresql: '#336791',
  mongodb: '#47a248',
  redis: '#dc382d',
  docker: '#2496ed',
  kubernetes: '#326ce5',
  aws: '#ff9900',
  graphql: '#e10098',
  rust: '#ce422b',
  golang: '#00add8',
  go: '#00add8',
  vue: '#4fc08d',
  'vue.js': '#4fc08d',
  angular: '#dd0031',
  svelte: '#ff3e00',
  firebase: '#ffca28',
  supabase: '#3ecf8e',
  vercel: '#ffffff',
  git: '#f05032',
  github: '#ffffff',
};

function getTechColor(tech: string): string {
  const lower = tech.toLowerCase();
  for (const [key, color] of Object.entries(TECH_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#8b5cf6';
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionTitle({
  children,
  step,
  id,
}: {
  children: React.ReactNode;
  step?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mb-14 flex items-center gap-4 sm:gap-5"
    >
      {step && (
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 to-violet-500/20 text-base font-bold text-indigo-300 ring-1 ring-indigo-400/25 sm:h-12 sm:w-12 sm:text-lg" style={{ boxShadow: '0 4px 20px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
          {step}
          <span className="absolute inset-0 rounded-xl bg-indigo-400/10 blur-md" />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl">
          {children}
        </h2>
        <div className="mt-3 h-[2px] w-24 overflow-hidden rounded-full">
          <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-violet-500/70 to-transparent" />
          <div className="h-full w-full -mt-[2px] bg-gradient-to-r from-indigo-500 via-violet-500/50 to-transparent blur-sm opacity-60" />
        </div>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-zinc-700/30 via-zinc-800/15 to-transparent" />
    </motion.div>
  );
}

function FadeInSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
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
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${classes}`}
    >
      {label}
    </span>
  );
}

function TechPill({ tech }: { tech: string }) {
  const color = getTechColor(tech);
  return (
    <span
      className="group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        border: `1px solid ${color}30`,
        color: `${color}dd`,
        boxShadow: `0 0 12px ${color}06, inset 0 1px 0 ${color}10`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${color}50`;
        el.style.boxShadow = `0 0 20px ${color}15, 0 0 8px ${color}10, inset 0 1px 0 ${color}15`;
        el.style.background = `linear-gradient(135deg, ${color}25, ${color}10)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${color}30`;
        el.style.boxShadow = `0 0 12px ${color}06, inset 0 1px 0 ${color}10`;
        el.style.background = `linear-gradient(135deg, ${color}18, ${color}08)`;
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:h-2 group-hover:w-2 group-hover:shadow-[0_0_10px_currentColor]"
        style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
      />
      {tech}
    </span>
  );
}

function Breadcrumb({ project }: { project: Project }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      aria-label="Breadcrumb"
      className="inline-flex items-center gap-2.5 rounded-full border border-zinc-800/50 bg-zinc-900/50 px-5 py-2.5 text-sm shadow-lg shadow-black/10 backdrop-blur-md ring-1 ring-white/[0.04]"
    >
      <Link
        href="/"
        className="text-zinc-500 transition-all duration-200 hover:text-zinc-200 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </Link>
      <span className="text-zinc-700">/</span>
      <Link
        href="/projects"
        className="text-zinc-400 transition-all duration-200 hover:text-zinc-200 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
      >
        项目
      </Link>
      <span className="text-zinc-700">/</span>
      <span className="max-w-[200px] truncate font-medium text-zinc-200">{project.name}</span>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky Table of Contents sidebar (desktop only)                    */
/* ------------------------------------------------------------------ */

function TableOfContents({ activeId }: { activeId: string }) {
  const activeIndex = SECTION_IDS.findIndex((s) => s.id === activeId);
  const progress = SECTION_IDS.length > 0 ? ((activeIndex + 1) / SECTION_IDS.length) * 100 : 0;

  return (
    <nav className="hidden xl:block" aria-label="Table of contents">
      <div className="sticky top-24">
        <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-4 backdrop-blur-sm shadow-lg shadow-black/5 ring-1 ring-white/[0.03]">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            目录
          </p>
          {/* Progress bar */}
          <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-zinc-800/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <ul className="space-y-0.5">
            {SECTION_IDS.map((section, index) => {
              const isActive = activeId === section.id;
              const isPast = index < activeIndex;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`group relative flex items-center gap-2.5 rounded-lg py-2 pl-3 pr-4 text-[13px] transition-all duration-200 ${
                      isActive
                        ? 'text-indigo-300 bg-indigo-500/10 shadow-sm shadow-indigo-500/5'
                        : isPast
                          ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                          : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="toc-active-bar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-indigo-400 to-violet-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/20'
                        : isPast
                          ? 'bg-zinc-800/60 text-zinc-500'
                          : 'bg-zinc-800/40 text-zinc-600'
                    }`}>
                      {index + 1}
                    </span>
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline connector line between thought-chain steps                */
/* ------------------------------------------------------------------ */

function TimelineConnector() {
  return (
    <div className="absolute left-[22px] top-0 bottom-0 w-px sm:left-[23px]">
      {/* Main line with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/50 via-violet-500/30 via-40% to-indigo-500/5" />
      {/* Wider glow alongside the line */}
      <div className="absolute inset-0 w-4 -translate-x-1.5 bg-gradient-to-b from-indigo-500/10 via-violet-500/5 via-40% to-transparent blur-sm" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Back-to-top floating button                                        */
/* ------------------------------------------------------------------ */

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800/90 text-zinc-400 shadow-xl shadow-black/25 ring-1 ring-white/[0.06] backdrop-blur-md transition-all duration-300 hover:bg-zinc-700/90 hover:text-white hover:ring-white/10 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [showFullCode, setShowFullCode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const lineInfo = businessLineLabels[project.businessLine];

  /* Track which section is in view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    SECTION_IDS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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

        {/* 1. Gradient mask at the bottom of 3D scene for smooth text transition */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

        <ScrollDownArrow />
      </section>

      {/* Main content area with optional sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-12">
          {/* Sticky TOC sidebar */}
          <aside className="hidden xl:block w-52 shrink-0">
            <TableOfContents activeId={activeSection} />
          </aside>

          {/* Main content column */}
          <div className="min-w-0 max-w-4xl flex-1">
            {/* 6. Breadcrumb navigation */}
            <div className="pt-10 pb-6">
              <Breadcrumb project={project} />
            </div>

            {/* b) Project Overview */}
            <section id="overview" className="py-16 sm:py-24">
              <SectionTitle>项目概述</SectionTitle>
              <FadeInSection>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {project.name}
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                {/* 7. Tech stack with colored pills */}
                <div className="mb-8 flex flex-wrap gap-2.5">
                  {project.techStack.map((tech) => (
                    <TechPill key={tech} tech={tech} />
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <StatusBadge status={project.status} />
                  <div className="h-4 w-px bg-zinc-700/50" />
                  <span className="text-sm text-zinc-500">{project.year}</span>
                </div>
              </FadeInSection>
              {/* Premium divider after overview */}
              <div className="mt-20 flex items-center gap-3 sm:mt-24">
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/25 via-violet-500/15 to-zinc-700/20" />
                <div className="h-1 w-1 rounded-full bg-indigo-500/30" />
                <div className="h-px w-12 bg-gradient-to-r from-zinc-700/20 to-transparent" />
              </div>
            </section>

            {/* 4. Timeline-style thought-chain sections with connector line */}
            <div className="relative">
              <TimelineConnector />

              {/* c) Step 1: Requirements Analysis */}
              <section id="requirements" className="relative py-14 sm:py-20">
                <SectionTitle step="①">需求分析</SectionTitle>
                <FadeInSection>
                  <div className="relative ml-5 border-l border-indigo-500/15 pl-8 sm:ml-6">
                    {/* Decorative dot at top of border */}
                    <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border-2 border-indigo-400/50 bg-indigo-500/70 shadow-[0_0_12px_rgba(99,102,241,0.35)]" />
                    <div className="mb-10">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-400">
                        <span className="inline-block h-px w-5 bg-gradient-to-r from-indigo-400/50 to-transparent" />
                        问题
                      </h4>
                      <p className="text-lg leading-[1.8] text-zinc-300/90">
                        {project.thoughtChain.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
                        <span className="inline-block h-px w-5 bg-gradient-to-r from-cyan-400/50 to-transparent" />
                        分析
                      </h4>
                      <p className="text-lg leading-[1.8] text-zinc-300/90">
                        {project.thoughtChain.analysis}
                      </p>
                    </div>
                  </div>
                </FadeInSection>
              </section>

              {/* d) Step 2: Solution Design */}
              <section id="design" className="relative py-14 sm:py-20">
                <SectionTitle step="②">方案设计</SectionTitle>
                <FadeInSection>
                  <p className="mb-8 text-lg leading-[1.8] text-zinc-300/90">
                    {project.thoughtChain.design}
                  </p>
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-700/30 bg-gradient-to-br from-indigo-500/[0.08] via-violet-500/[0.05] to-purple-500/[0.03] p-8 ring-1 ring-white/[0.04] shadow-xl shadow-black/10">
                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-indigo-500/10 via-indigo-500/5 to-transparent" />
                    <div className="absolute bottom-0 left-0 h-24 w-24 bg-gradient-to-tr from-violet-500/5 to-transparent" />
                    <div className="relative flex items-center gap-2.5 text-sm text-zinc-400">
                      <svg
                        className="h-5 w-5 text-indigo-400/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                        />
                      </svg>
                      <span className="font-semibold tracking-wide">技术架构图</span>
                    </div>
                    <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {project.techStack.map((tech) => {
                        const color = getTechColor(tech);
                        return (
                          <div
                            key={tech}
                            className="group flex items-center justify-center rounded-xl border border-zinc-600/15 bg-zinc-800/30 px-4 py-5 text-center text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-zinc-500/25 hover:bg-zinc-800/50 hover:shadow-md hover:shadow-black/10 hover:-translate-y-0.5"
                            style={{
                              ['--tech-color' as string]: color,
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = `${color}30`;
                              el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px ${color}10`;
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = '';
                              el.style.boxShadow = '';
                            }}
                          >
                            <span className="mr-2 h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:h-2 group-hover:w-2" style={{ background: color, boxShadow: `0 0 6px ${color}40` }} />
                            {tech}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </FadeInSection>
              </section>

              {/* e) Step 3: Development Process */}
              <section id="development" className="relative py-14 sm:py-20">
                <SectionTitle step="③">开发过程</SectionTitle>
                <FadeInSection>
                  <p className="mb-8 text-lg leading-[1.8] text-zinc-300">
                    {project.thoughtChain.development}
                  </p>
                  <div className="rounded-xl ring-1 ring-white/[0.04] overflow-hidden shadow-xl shadow-black/10">
                    <CodeBlock
                      code={
                        showFullCode
                          ? codePlaceholder
                          : codePlaceholder.split('\n').slice(0, 6).join('\n')
                      }
                      language="typescript"
                    />
                  </div>
                  {!showFullCode && (
                    <button
                      onClick={() => setShowFullCode(true)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-400 transition-all duration-200 hover:text-indigo-300 hover:bg-indigo-500/10"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                      展开代码
                    </button>
                  )}
                  {showFullCode && (
                    <button
                      onClick={() => setShowFullCode(false)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-400 transition-all duration-200 hover:text-indigo-300 hover:bg-indigo-500/10"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75l7.5-7.5 7.5 7.5" />
                      </svg>
                      收起代码
                    </button>
                  )}
                </FadeInSection>
              </section>

              {/* f) Step 4: Challenges */}
              <section id="challenges" className="relative py-14 sm:py-20">
                <SectionTitle step="④">难点与解决方案</SectionTitle>
                <div className="space-y-6">
                  {project.thoughtChain.challenges.map((challenge, i) => (
                    <FadeInSection key={i} delay={i * 0.1}>
                      <div className="group relative rounded-2xl border border-zinc-700/30 bg-zinc-900/40 p-7 backdrop-blur-sm transition-all duration-300 hover:border-zinc-600/35 hover:shadow-lg hover:shadow-black/5 ring-1 ring-white/[0.02] hover:ring-white/[0.04]">
                        {/* Subtle top accent */}
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <h4 className="mb-3 text-lg font-semibold text-zinc-100">
                          {challenge.title}
                        </h4>
                        <p className="mb-6 leading-[1.8] text-zinc-400">
                          {challenge.description}
                        </p>
                        <div className="rounded-xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] to-emerald-500/[0.02] p-5 ring-1 ring-emerald-500/[0.05]">
                          <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/10">
                              <svg
                                className="h-3 w-3 text-emerald-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-emerald-400">
                              解决方案
                            </span>
                          </div>
                          <p className="text-sm leading-[1.75] text-zinc-300/90">
                            {challenge.solution}
                          </p>
                        </div>
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </section>

              {/* g) Step 5: Outcome */}
              <section id="outcome" className="relative py-14 sm:py-20">
                <SectionTitle step="⑤">项目成果</SectionTitle>
                <FadeInSection>
                  <p className="mb-10 text-lg leading-[1.8] text-zinc-300/90">
                    {project.thoughtChain.outcome}
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-zinc-700/25 bg-zinc-800/25 text-sm text-zinc-600 backdrop-blur-sm transition-all duration-300 hover:border-zinc-600/35 hover:bg-zinc-800/40 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 ring-1 ring-white/[0.02]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="relative z-10 flex items-center gap-1.5">
                          <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                          截图 {n}
                        </span>
                      </div>
                    ))}
                  </div>
                </FadeInSection>
              </section>
            </div>

            {/* h) External Links */}
            <section className="relative py-14 sm:py-20">
              {/* Premium divider */}
              <div className="absolute top-0 left-0 right-0 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-indigo-500/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-600/50" />
                  <div className="h-1 w-1 rounded-full bg-violet-500/30" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
              </div>
              <FadeInSection>
                <div className="flex flex-wrap items-center gap-3 pt-6">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full bg-zinc-800/80 px-5 py-2.5 text-sm font-medium text-zinc-300 ring-1 ring-zinc-700/60 backdrop-blur-sm transition-all duration-200 hover:bg-zinc-700/80 hover:text-white hover:ring-zinc-600/60 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5"
                    >
                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                    >
                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      在线 Demo
                    </a>
                  )}
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-800/40 px-5 py-2.5 text-sm font-medium text-zinc-400 ring-1 ring-zinc-700/40 backdrop-blur-sm transition-all duration-200 hover:bg-zinc-800/70 hover:text-zinc-200 hover:ring-zinc-600/40 hover:-translate-y-0.5"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                    返回项目列表
                  </Link>
                </div>
              </FadeInSection>
            </section>
          </div>
        </div>
      </div>

      {/* 8. Back-to-top floating button */}
      <BackToTop />
    </div>
  );
}

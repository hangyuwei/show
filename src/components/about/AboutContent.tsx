'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const SkillRadar3D = dynamic(() => import('@/components/three/SkillRadar3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          {/* Premium loader with triple ring */}
          <div className="absolute inset-0 rounded-full border border-accent-blue/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-blue/60 animate-spin" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-4 rounded-full border border-accent-blue/40 animate-pulse" />
          <div className="absolute inset-5 rounded-full bg-accent-blue/15 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="text-white/35 text-sm tracking-wide font-mono">Loading 3D Radar...</div>
      </div>
    </div>
  ),
});

const TechSphere = dynamic(() => import('@/components/three/TechSphere'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          {/* Premium loader with triple ring */}
          <div className="absolute inset-0 rounded-full border border-accent-teal/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-teal/60 animate-spin" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-4 rounded-full border border-accent-purple/40 animate-pulse" />
          <div className="absolute inset-5 rounded-full bg-accent-teal/15 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="text-white/35 text-sm tracking-wide font-mono">Loading Tech Sphere...</div>
      </div>
    </div>
  ),
});

interface TimelineItem {
  period: string;
  title: string;
  description: string;
  icon: string;
}

const TIMELINE: TimelineItem[] = [
  {
    period: '2020 - 2022',
    title: '全栈开发工程师',
    description:
      '负责多个 Web 应用的架构设计与开发，掌握前后端技术栈，完成从需求分析到上线交付的全流程。',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
  {
    period: '2022 - 2023',
    title: '大健康行业技术专家',
    description:
      '深耕大健康领域，将数据分析与行业知识结合，为健康科技产品提供技术解决方案。',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    period: '2023 - 2024',
    title: 'AI 应用开发',
    description:
      '深入研究大语言模型应用，使用 LangChain、PyTorch 等框架构建智能问答、数据分析等 AI 产品。',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    period: '2024 - 至今',
    title: '技术顾问 / 独立开发者',
    description:
      '为多个项目提供技术咨询，同时探索 3D 可视化、创意编程等前沿方向，持续输出技术内容。',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

/* ── Animation Variants ──────────────────────────────────── */

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const heroTitleVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const heroSubtitleVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const heroLineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const fadeInScaleVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardHoverShadow = '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.08)';
const cardBaseShadow = '0 2px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1), 0 0 1px rgba(255,255,255,0.04)';

/* ── Sub-Components ──────────────────────────────────────── */

function SectionDivider({ variant = 'default' }: { variant?: 'default' | 'warm' | 'cool' }) {
  const colors = {
    default: { left: '#2196ff', center: '#14b8a6', right: '#8b5cf6' },
    warm: { left: '#8b5cf6', center: '#eab308', right: '#f43f5e' },
    cool: { left: '#14b8a6', center: '#2196ff', right: '#8b5cf6' },
  }[variant];

  return (
    <div className="relative flex items-center justify-center my-10 sm:my-14">
      {/* Background glow behind divider — wider and softer */}
      <div
        className="pointer-events-none absolute h-12 w-72 rounded-full opacity-[0.06]"
        style={{
          background: `radial-gradient(ellipse, ${colors.left} 0%, ${colors.right} 40%, transparent 70%)`,
          filter: 'blur(24px)',
        }}
      />
      {/* Left tapering line — longer with gradient color */}
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/[0.04] to-white/[0.08]" />
      <div className="h-px w-14 bg-gradient-to-r from-white/[0.08] to-white/[0.14]" />
      {/* Center ornament with enhanced multi-glow dots and diamond */}
      <div className="mx-4 flex items-center gap-2 relative">
        <div className="h-1 w-1 rounded-full bg-accent-blue/40 shadow-[0_0_6px_rgba(33,150,255,0.35)]" />
        <div className="h-[2px] w-4 bg-gradient-to-r from-accent-blue/20 to-accent-teal/20 rounded-full" />
        <div className="h-[3px] w-[3px] rounded-full bg-white/20" />
        {/* Center diamond — rotated square with glow */}
        <div className="relative">
          <div
            className="w-2.5 h-2.5 rotate-45 rounded-[1px]"
            style={{
              background: `linear-gradient(135deg, ${colors.left}, ${colors.center})`,
              boxShadow: `0 0 8px ${colors.left}50, 0 0 16px ${colors.center}25`,
            }}
          />
          <div
            className="absolute inset-0 w-2.5 h-2.5 rotate-45 rounded-[1px] opacity-40"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)',
            }}
          />
        </div>
        <div className="h-[3px] w-[3px] rounded-full bg-white/20" />
        <div className="h-[2px] w-4 bg-gradient-to-r from-accent-teal/20 to-accent-purple/20 rounded-full" />
        <div className="h-1 w-1 rounded-full bg-accent-purple/40 shadow-[0_0_6px_rgba(139,92,246,0.35)]" />
      </div>
      {/* Right tapering line with traveling shimmer */}
      <div className="relative h-px w-14 bg-gradient-to-l from-white/[0.14] to-white/[0.08] overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colors.right}80 50%, transparent 100%)`,
            animation: 'shimmer 3.5s ease-in-out infinite',
          }}
        />
      </div>
      <div className="h-px w-24 bg-gradient-to-l from-transparent via-white/[0.04] to-white/[0.08]" />
    </div>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-7 sm:mb-9">
      {/* Title with enhanced gradient text including drop-shadow glow */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-heading heading-section">
        <span
          style={{
            background: 'linear-gradient(135deg, #e8f2ff 0%, #65d8ff 48%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px rgba(101,216,255,0.12))',
          }}
        >
          {children}
        </span>
      </h2>
      {subtitle && (
        <p className="text-sm text-white/30 tracking-wide mt-2 max-w-sm mx-auto leading-relaxed">{subtitle}</p>
      )}
      {/* Refined underline accent with animated shimmer */}
      <div className="relative flex justify-center mt-4 gap-0.5 overflow-hidden">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent-blue/25" />
        <div className="relative h-px w-14 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/30 via-white/15 to-accent-teal/28" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              animation: 'shimmer 2.5s ease-in-out infinite',
            }}
          />
        </div>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent-teal/25" />
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export default function AboutContent() {
  return (
    <>
      {/* Injected keyframes for premium timeline traveling light */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes timeline-light {
              0% { top: -12px; opacity: 0; }
              10% { opacity: 0.7; }
              90% { opacity: 0.7; }
              100% { top: calc(100% + 12px); opacity: 0; }
            }
          `,
        }}
      />
      {/* ── Gradient Hero Header ─────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative w-full mb-4 sm:mb-6"
        style={{ padding: 0, background: 'none' }}
      >
        <div
          className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[680px] h-[300px] rounded-full opacity-[0.055]"
          style={{
            background: 'radial-gradient(ellipse, #65d8ff 0%, #14b8a6 44%, transparent 76%)',
            filter: 'blur(86px)',
          }}
        />
        <div
          className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[480px] h-[180px] rounded-full opacity-[0.035]"
          style={{
            background: 'radial-gradient(ellipse, #e8f2ff 0%, #65d8ff 42%, transparent 76%)',
            filter: 'blur(70px)',
          }}
        />

        <div className="relative text-center pt-12 sm:pt-14 pb-8 sm:pb-10">
          {/* Premium label pill with animated border */}
          <motion.span
            variants={heroSubtitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#65d8ff]/70 mb-4"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#65d8ff]/70" />
            ABOUT
          </motion.span>

          {/* Main title with enhanced gradient and glow */}
          <motion.h1
            variants={heroTitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 heading-premium"
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #e8f2ff 0%, #65d8ff 52%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 14px rgba(101,216,255,0.14))',
              }}
            >
              关于我
            </span>
          </motion.h1>

          {/* Subtitle line with refined spacing */}
          <motion.p
            variants={heroSubtitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-sm sm:text-base text-white/42 max-w-xl mx-auto leading-relaxed"
          >
            全栈开发 / 大健康技术 / AI 应用 / 创意可视化
          </motion.p>

          {/* Enhanced separator with animated shimmer pass */}
          <motion.div
            variants={heroLineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative flex justify-center items-center gap-2 mt-5 origin-center"
          >
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-[#65d8ff]/35 to-transparent" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#65d8ff]/55" />
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-[#f2c166]/24 to-transparent" />
          </motion.div>
        </div>
      </motion.section>

      {/* ── 3D Skill Radar Section ───────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative w-full mb-14 sm:mb-20"
        style={{ padding: 0, background: 'none' }}
      >
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[460px] rounded-full opacity-[0.035]"
          style={{
            background: 'radial-gradient(circle, #65d8ff 0%, #14b8a6 42%, transparent 76%)',
            filter: 'blur(84px)',
          }}
        />
        <div
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[460px] h-20 opacity-[0.025]"
          style={{
            background: 'radial-gradient(ellipse, #65d8ff 0%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />

        <SectionTitle subtitle="跨领域复合能力全景 — 涵盖工程、设计、数据与 AI">能力雷达</SectionTitle>

        <div
          className="relative w-full max-w-xl mx-auto h-[340px] sm:h-[420px] rounded-xl overflow-hidden border border-white/[0.055] group/panel transition-all duration-500 hover:border-white/[0.10]"
          style={{
            background: 'rgba(7, 17, 31, 0.68)',
            boxShadow: '0 12px 34px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 rounded-full opacity-[0.055] group-hover/panel:opacity-[0.08] transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse, #65d8ff, #14b8a6 60%, transparent 80%)',
              filter: 'blur(24px)',
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.025), inset 0 24px 70px rgba(101,216,255,0.014)',
            }}
          />

          <SkillRadar3D />
        </div>
      </motion.section>

      <SectionDivider variant="cool" />

      {/* ── Bio Card with Premium Gradient Border ──────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative max-w-3xl mx-auto mb-20 sm:mb-28"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Mesh gradient background — dual layer with breathing */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.05] animate-breathe"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #2196ff 40%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #2196ff 0%, #14b8a6 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <SectionTitle subtitle="了解更多关于我的故事">关于我</SectionTitle>

        {/* Bio Card with conic rotating gradient border */}
        <div className="relative rounded-2xl p-px overflow-hidden group">
          {/* Rotating conic gradient border */}
          <div
            className="absolute inset-0 rounded-2xl opacity-35 group-hover:opacity-65 transition-opacity duration-700"
            style={{
              background: 'conic-gradient(from 0deg, #2196ff, #14b8a6, #8b5cf6, #eab308, #2196ff)',
              animation: 'border-spin-slow 10s linear infinite',
            }}
          />
          {/* Shimmer sweep overlay on border */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 62%, transparent 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
          <div
            className="relative rounded-2xl p-6 sm:p-10 transition-all duration-700 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.3),0_0_40px_rgba(139,92,246,0.06)]"
            style={{
              background: 'var(--glass-bg)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 20px rgba(139,92,246,0.03)',
            }}
          >
            {/* Inner top ambient light — stronger gradient */}
            <div
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-28 opacity-[0.06] group-hover:opacity-[0.09] transition-opacity duration-700"
              style={{
                background: 'radial-gradient(ellipse, #8b5cf6 0%, #2196ff 50%, transparent 75%)',
                filter: 'blur(22px)',
              }}
            />
            {/* Inner bottom subtle warmth */}
            <div
              className="pointer-events-none absolute bottom-0 right-1/4 w-1/3 h-20 opacity-[0.04] group-hover:opacity-[0.06] transition-opacity duration-700"
              style={{
                background: 'radial-gradient(ellipse, #14b8a6, transparent 70%)',
                filter: 'blur(18px)',
              }}
            />
            {/* Subtle corner accents — top-left and bottom-right */}
            <div className="pointer-events-none absolute top-0 left-0 w-20 h-20 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
              style={{ background: 'radial-gradient(circle at 0% 0%, #2196ff, transparent 65%)', filter: 'blur(16px)' }}
            />
            <div className="pointer-events-none absolute bottom-0 right-0 w-20 h-20 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
              style={{ background: 'radial-gradient(circle at 100% 100%, #14b8a6, transparent 65%)', filter: 'blur(16px)' }}
            />

            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Avatar with enhanced multi-layer gradient ring */}
              <div className="shrink-0 self-center sm:self-start">
                <div className="relative">
                  {/* Outermost glow halo — expanded */}
                  <div
                    className="absolute -inset-4 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                    style={{
                      background: 'conic-gradient(from 0deg, #2196ff, #8b5cf6, #14b8a6, #2196ff)',
                      filter: 'blur(14px)',
                      animation: 'border-spin-slow 12s linear infinite',
                    }}
                  />
                  {/* Middle glow ring */}
                  <div
                    className="absolute -inset-2 rounded-full opacity-35 group-hover:opacity-60 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(135deg, #2196ff, #8b5cf6, #14b8a6)',
                      filter: 'blur(7px)',
                    }}
                  />
                  {/* Inner crisp ring */}
                  <div
                    className="absolute -inset-1 rounded-full opacity-25 group-hover:opacity-45 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(135deg, #2196ff, #8b5cf6, #14b8a6)',
                      filter: 'blur(3px)',
                    }}
                  />
                  <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #2196ff 0%, #8b5cf6 50%, #14b8a6 100%)',
                      boxShadow: '0 0 35px rgba(33, 150, 255, 0.18), 0 0 70px rgba(139, 92, 246, 0.10), 0 4px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
                    }}
                  >
                    H
                  </div>
                  {/* Online status indicator with enhanced glow */}
                  <div
                    className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-[var(--glass-bg)]"
                    style={{ boxShadow: '0 0 8px rgba(74,222,128,0.6), 0 0 20px rgba(74,222,128,0.25), 0 0 40px rgba(74,222,128,0.08)' }}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold mb-1.5 tracking-tight">
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #2196ff 0%, #00e5ff 50%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 12px rgba(33,150,255,0.2))',
                    }}
                  >
                    Hang
                  </span>
                </h3>

                {/* Location + availability line */}
                <div className="flex items-center gap-3 mb-4 text-xs text-white/28">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    China
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/15" />
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 shadow-[0_0_5px_rgba(74,222,128,0.45)]" />
                    Open to collaborate
                  </span>
                </div>

                {/* Role tags with enhanced glow hover */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-accent-blue border border-accent-blue/25 transition-all duration-300 hover:border-accent-blue/50 hover:shadow-[0_0_14px_rgba(33,150,255,0.18)]"
                    style={{ background: 'rgba(33, 150, 255, 0.06)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_4px_rgba(33,150,255,0.4)]" />
                    全栈开发
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-accent-teal/25 transition-all duration-300 hover:border-accent-teal/50 hover:shadow-[0_0_14px_rgba(20,184,166,0.18)]"
                    style={{ background: 'rgba(20, 184, 166, 0.06)', color: '#14b8a6' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-teal shadow-[0_0_4px_rgba(20,184,166,0.4)]" />
                    大健康行业
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-accent-purple/25 transition-all duration-300 hover:border-accent-purple/50 hover:shadow-[0_0_14px_rgba(139,92,246,0.18)]"
                    style={{ background: 'rgba(139, 92, 246, 0.06)', color: '#8b5cf6' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple shadow-[0_0_4px_rgba(139,92,246,0.4)]" />
                    AI 应用
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-accent-warm/25 transition-all duration-300 hover:border-accent-warm/50 hover:shadow-[0_0_14px_rgba(245,158,11,0.18)]"
                    style={{ background: 'rgba(245, 158, 11, 0.06)', color: '#eab308' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-warm shadow-[0_0_4px_rgba(245,158,11,0.4)]" />
                    创意可视化
                  </span>
                </div>

                <div className="space-y-3.5">
                  <p className="text-sm sm:text-base leading-[1.75] text-white/60">
                    拥有多年全栈开发经验，专注于将技术与行业深度结合。在大健康领域深耕多年，
                    擅长将数据分析、AI 技术与医疗健康场景融合，打造有价值的数字产品。
                  </p>
                  <p className="text-sm sm:text-base leading-[1.75] text-white/60">
                    技术视野覆盖前端工程、后端服务、数据智能与创意可视化。相信技术的价值在于解决真实问题，
                    追求工程卓越与用户体验的平衡。
                  </p>
                </div>

                {/* Quick stats row with subtle dividers */}
                <motion.div
                  variants={fadeInScaleVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap gap-x-6 gap-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono" style={{ color: '#2196ff' }}>5+</span>
                    <span className="text-xs text-white/30">年开发经验</span>
                  </div>
                  <div className="w-px h-4 bg-white/[0.08] self-center" />
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono" style={{ color: '#14b8a6' }}>20+</span>
                    <span className="text-xs text-white/30">项目交付</span>
                  </div>
                  <div className="w-px h-4 bg-white/[0.08] self-center" />
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono" style={{ color: '#8b5cf6' }}>3+</span>
                    <span className="text-xs text-white/30">行业领域</span>
                  </div>
                </motion.div>

                {/* GitHub link with refined styling */}
                <div className="mt-5 pt-4 border-t border-white/[0.04]">
                  <a
                    href="https://github.com/hangyuwei"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-white/35 hover:text-accent-blue transition-all duration-300 group/link"
                  >
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/8 group-hover/link:border-accent-blue/25 group-hover/link:bg-accent-blue/8 group-hover/link:shadow-[0_0_12px_rgba(33,150,255,0.12)] transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="font-mono text-xs">github.com/hangyuwei</span>
                    <svg
                      className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <SectionDivider variant="warm" />

      {/* ── Tech Stack Sphere ────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative w-full mb-20 sm:mb-28"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Mesh gradient background with breathing */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full opacity-[0.05] animate-breathe"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #2196ff 30%, #14b8a6 55%, transparent 75%)',
            filter: 'blur(85px)',
            animationDelay: '2s',
          }}
        />
        {/* Secondary warm accent for color harmony */}
        <div
          className="pointer-events-none absolute bottom-1/4 right-[20%] w-[250px] h-[250px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #eab308 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <SectionTitle subtitle="拖拽旋转探索我的技术版图 — 从前端到后端、从数据到 AI">技术栈</SectionTitle>

        <div
          className="relative w-full max-w-xl mx-auto h-[400px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/[0.06] group/panel transition-all duration-700 hover:border-white/[0.12]"
          style={{
            background: 'var(--glass-bg)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px rgba(139,92,246,0.04), 0 0 80px rgba(33,150,255,0.02)',
          }}
        >
          {/* Inner ambient gradient at bottom with enhanced glow */}
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-28 rounded-full opacity-[0.09] group-hover/panel:opacity-[0.14] transition-opacity duration-700"
            style={{
              background: 'radial-gradient(ellipse, #8b5cf6, #2196ff 60%, transparent 80%)',
              filter: 'blur(24px)',
            }}
          />
          {/* Inner top ambient glow */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 rounded-full opacity-[0.05] group-hover/panel:opacity-[0.08] transition-opacity duration-700"
            style={{
              background: 'radial-gradient(ellipse, #14b8a6, transparent 70%)',
              filter: 'blur(18px)',
            }}
          />

          {/* Corner accents with enhanced hover glow — purple/blue themed */}
          <div className="absolute top-0 left-0 w-14 h-14 border-t border-l border-accent-purple/20 rounded-tl-2xl group-hover/panel:border-accent-purple/40 group-hover/panel:shadow-[-2px_-2px_12px_rgba(139,92,246,0.08)] transition-all duration-500" />
          <div className="absolute top-0 right-0 w-14 h-14 border-t border-r border-accent-blue/20 rounded-tr-2xl group-hover/panel:border-accent-blue/40 group-hover/panel:shadow-[2px_-2px_12px_rgba(33,150,255,0.08)] transition-all duration-500" />
          <div className="absolute bottom-0 left-0 w-14 h-14 border-b border-l border-accent-blue/20 rounded-bl-2xl group-hover/panel:border-accent-blue/40 group-hover/panel:shadow-[-2px_2px_12px_rgba(33,150,255,0.08)] transition-all duration-500" />
          <div className="absolute bottom-0 right-0 w-14 h-14 border-b border-r border-accent-purple/20 rounded-br-2xl group-hover/panel:border-accent-purple/40 group-hover/panel:shadow-[2px_2px_12px_rgba(139,92,246,0.08)] transition-all duration-500" />

          {/* Top border shimmer — traveling light */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 h-full w-[40%]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4) 30%, rgba(20,184,166,0.5) 50%, rgba(139,92,246,0.4) 70%, transparent)',
                animation: 'shimmer 3.2s ease-in-out infinite',
              }}
            />
          </div>

          <TechSphere />
        </div>
      </motion.section>

      <SectionDivider variant="default" />

      {/* ── Career Timeline ──────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative max-w-3xl mx-auto mb-8 sm:mb-12"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Mesh gradient background — dual layer */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.04] animate-breathe"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, #2196ff 40%, transparent 70%)',
            filter: 'blur(65px)',
            animationDelay: '4s',
          }}
        />
        <div
          className="pointer-events-none absolute top-1/4 right-0 w-72 h-72 rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #eab308 40%, transparent 70%)',
            filter: 'blur(55px)',
          }}
        />
        {/* Subtle bridge gradient connecting to the section above */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-24 opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse, #8b5cf6 0%, #14b8a6 50%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />

        <SectionTitle subtitle="持续成长的技术之旅">职业经历</SectionTitle>

        <div className="relative">
          {/* Timeline line — multi-layer glow with segment coloring */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-5 sm:left-7 top-3 bottom-3 w-px origin-top"
          >
            {/* Outermost wide bloom */}
            <div className="absolute inset-0 w-10 -translate-x-[18px] bg-gradient-to-b from-accent-blue/8 via-accent-purple/6 to-accent-teal/8 blur-xl" />
            {/* Wide soft glow */}
            <div className="absolute inset-0 w-6 -translate-x-[10px] bg-gradient-to-b from-accent-blue/12 via-accent-purple/8 to-accent-teal/12 blur-lg" />
            {/* Medium glow */}
            <div className="absolute inset-0 w-3 -translate-x-1 bg-gradient-to-b from-accent-blue/20 via-accent-purple/15 to-accent-teal/18 blur-md" />
            {/* Narrower sharper glow */}
            <div className="absolute inset-0 w-1.5 -translate-x-0.25 bg-gradient-to-b from-accent-blue/30 via-accent-purple/25 to-accent-teal/25 blur-sm" />
            {/* Main crisp line */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent-blue via-accent-purple to-accent-teal opacity-30" />
            {/* Traveling light along the line */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-12 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)',
                  animation: 'timeline-light 4s ease-in-out infinite',
                }}
              />
            </div>
            {/* Start cap — enhanced triple glow for premium feel */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full opacity-15"
              style={{ background: '#2196ff', filter: 'blur(10px)' }}
            />
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full opacity-25"
              style={{ background: '#2196ff', filter: 'blur(5px)' }}
            />
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent-blue"
              style={{ boxShadow: '0 0 10px rgba(33,150,255,0.6), 0 0 20px rgba(33,150,255,0.3), 0 0 40px rgba(33,150,255,0.1), inset 0 1px 0 rgba(255,255,255,0.25)' }}
            />
            {/* End cap — enhanced triple glow for premium feel */}
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full opacity-15"
              style={{ background: '#14b8a6', filter: 'blur(10px)' }}
            />
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full opacity-25"
              style={{ background: '#14b8a6', filter: 'blur(5px)' }}
            />
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent-teal"
              style={{ boxShadow: '0 0 10px rgba(20,184,166,0.6), 0 0 20px rgba(20,184,166,0.3), 0 0 40px rgba(20,184,166,0.1), inset 0 1px 0 rgba(255,255,255,0.25)' }}
            />
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {TIMELINE.map((item, i) => {
              const dotColors = [
                { bg: '#2196ff', glow: 'rgba(33, 150, 255, 0.5)', ring: 'rgba(33, 150, 255, 0.2)' },
                { bg: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.5)', ring: 'rgba(139, 92, 246, 0.2)' },
                { bg: '#14b8a6', glow: 'rgba(20, 184, 166, 0.5)', ring: 'rgba(20, 184, 166, 0.2)' },
                { bg: '#eab308', glow: 'rgba(234, 179, 8, 0.5)', ring: 'rgba(234, 179, 8, 0.2)' },
              ];
              const color = dotColors[i % dotColors.length];
              const isLast = i === TIMELINE.length - 1;
              const nextColor = dotColors[(i + 1) % dotColors.length];

              return (
                <motion.div
                  key={item.period}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  variants={timelineItemVariants}
                  className="relative pl-14 sm:pl-18"
                >
                  {/* Timeline dot — enhanced multi-layer glow with diamond highlight */}
                  <div className="absolute left-3 sm:left-5 top-5">
                    {/* Outermost wide aura */}
                    <div
                      className="absolute -inset-5 rounded-full opacity-10"
                      style={{ background: color.bg, filter: 'blur(8px)' }}
                    />
                    {/* Outer pulse ring — subtle breathing */}
                    <div
                      className="absolute -inset-3 rounded-full opacity-20 animate-breathe"
                      style={{ backgroundColor: color.glow, animationDelay: `${i * 1.5}s` }}
                    />
                    {/* Middle ring with glow */}
                    <div
                      className="absolute -inset-2 rounded-full opacity-18"
                      style={{ boxShadow: `0 0 16px ${color.glow}` }}
                    />
                    {/* Inner ring */}
                    <div
                      className="absolute -inset-1 rounded-full opacity-20"
                      style={{ background: color.bg, filter: 'blur(3px)' }}
                    />
                    {/* Core dot with premium inset highlight */}
                    <div
                      className="relative w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: color.bg,
                        borderColor: `${color.bg}55`,
                        boxShadow: `0 0 12px ${color.glow}, 0 0 24px ${color.ring}, 0 0 48px ${color.ring.replace('0.2', '0.06')}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                      }}
                    >
                      {/* Inner shine — diamond highlight */}
                      <div
                        className="absolute top-[2px] left-[3px] w-[6px] h-[4px] rounded-full"
                        style={{ background: 'rgba(255,255,255,0.4)', filter: 'blur(1px)' }}
                      />
                    </div>
                  </div>

                  {/* Gradient bridge connector between this card and the next */}
                  {!isLast && (
                    <div
                      className="absolute left-[22px] sm:left-[34px] bottom-0 -translate-x-1/2 translate-y-1/2 w-px h-6 opacity-15 pointer-events-none"
                      style={{
                        background: `linear-gradient(180deg, ${color.bg}, ${nextColor.bg})`,
                      }}
                    />
                  )}

                  {/* Card with enhanced shadow and border shimmer */}
                  <div
                    className="relative rounded-xl overflow-hidden group transition-all duration-600"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      boxShadow: cardBaseShadow,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `${cardHoverShadow}, 0 0 24px ${color.ring}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = cardBaseShadow;
                    }}
                  >
                    {/* Left accent bar with gradient fade — wider on hover */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0.5 opacity-50 group-hover:opacity-90 group-hover:w-1 transition-all duration-500"
                      style={{
                        background: `linear-gradient(180deg, ${color.bg}, ${color.bg}50, ${color.bg}10)`,
                      }}
                    />

                    {/* Top highlight on hover with shimmer */}
                    <div
                      className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${color.bg}30, transparent)`,
                      }}
                    />

                    {/* Traveling shimmer on top edge on hover */}
                    <div className="absolute top-0 left-0 right-0 h-px overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div
                        className="absolute top-0 h-full w-[30%]"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${color.bg}50, transparent)`,
                          animation: 'shimmer 2.5s ease-in-out infinite',
                        }}
                      />
                    </div>

                    {/* Bottom edge glow — subtle color bleed */}
                    <div
                      className="absolute bottom-0 left-1/4 right-1/4 h-px opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${color.bg}25, transparent)`,
                      }}
                    />

                    <div className="p-5 sm:p-6 group-hover:bg-white/[0.02] transition-colors duration-500">
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_10px_var(--ring-color)]"
                            style={{ backgroundColor: `${color.bg}12`, '--ring-color': color.ring } as React.CSSProperties}
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke={color.bg}
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                          </span>
                          <h3 className="text-base sm:text-lg font-semibold text-white/88 group-hover:text-white tracking-tight transition-colors duration-300">
                            {item.title}
                          </h3>
                        </div>
                        {isLast && (
                          <span
                            className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border"
                            style={{ background: `${color.bg}12`, color: color.bg, borderColor: `${color.bg}25`, boxShadow: `0 0 8px ${color.ring}` }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <span
                        className="text-xs font-mono mb-3 block ml-[38px] tracking-wide"
                        style={{ color: `${color.bg}80` }}
                      >
                        {item.period}
                      </span>
                      <p className="text-sm text-white/48 leading-[1.7] ml-[38px] group-hover:text-white/62 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── Footer Spacer with fade-out gradient ──────────── */}
      <div className="relative h-16 sm:h-24">
        {/* Closing gradient orb — subtle fade to background */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-16 opacity-[0.04]"
          style={{
            background: 'radial-gradient(ellipse, #14b8a6 0%, #2196ff 40%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      </div>
    </>
  );
}

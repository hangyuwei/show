'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const SkillRadar3D = dynamic(() => import('@/components/three/SkillRadar3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-ping rounded-full border border-accent-blue/30" />
          <div className="absolute inset-2 animate-pulse rounded-full border border-accent-blue/50" />
          <div className="absolute inset-4 rounded-full bg-accent-blue/20 animate-pulse" />
        </div>
        <div className="text-white/40 text-sm tracking-wide">Loading 3D Radar...</div>
      </div>
    </div>
  ),
});

const TechSphere = dynamic(() => import('@/components/three/TechSphere'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-ping rounded-full border border-accent-blue/30" />
          <div className="absolute inset-2 animate-pulse rounded-full border border-accent-teal/50" />
          <div className="absolute inset-4 rounded-full bg-accent-teal/20 animate-pulse" />
        </div>
        <div className="text-white/40 text-sm tracking-wide">Loading Tech Sphere...</div>
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const heroTitleVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const heroSubtitleVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' as const },
  },
};

const heroLineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, delay: 0.4, ease: 'easeOut' as const },
  },
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

/* ── Sub-Components ──────────────────────────────────────── */

function SectionDivider() {
  return (
    <div className="flex items-center justify-center my-4 sm:my-8">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/10" />
      <div className="mx-3 flex gap-1">
        <div className="h-1 w-1 rounded-full bg-accent-blue/40" />
        <div className="h-1 w-1 rounded-full bg-accent-teal/40" />
        <div className="h-1 w-1 rounded-full bg-accent-purple/40" />
      </div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-8 sm:mb-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-heading">
        <span className="accent-gradient-text">{children}</span>
      </h2>
      {subtitle && (
        <p className="text-sm text-white/40 tracking-wide">{subtitle}</p>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export default function AboutContent() {
  return (
    <>
      {/* ── Gradient Hero Header ─────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative w-full py-16 sm:py-24 mb-4"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Background gradient glow behind title */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[700px] h-[400px] rounded-full opacity-[0.12]"
          style={{
            background: 'radial-gradient(ellipse, #2196ff 0%, #8b5cf6 30%, #14b8a6 60%, transparent 80%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative text-center pt-16 sm:pt-24 pb-12 sm:pb-16">
          {/* Label */}
          <motion.span
            variants={heroSubtitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block text-xs font-mono tracking-display uppercase text-accent-teal/60 mb-4"
          >
            About
          </motion.span>

          {/* Main title */}
          <motion.h1
            variants={heroTitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-bold tracking-tight mb-5"
          >
            <span className="accent-gradient-text">关于我</span>
          </motion.h1>

          {/* Subtitle line */}
          <motion.p
            variants={heroSubtitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-base sm:text-lg text-white/40 max-w-md mx-auto leading-relaxed"
          >
            全栈开发 / 大健康技术 / AI 应用 / 创意可视化
          </motion.p>

          {/* Decorative line */}
          <motion.div
            variants={heroLineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center items-center gap-2 mt-6 origin-center"
          >
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-accent-blue/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/50" />
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-accent-purple/50" />
          </motion.div>
        </div>
      </motion.section>

      {/* ── 3D Skill Radar Section ───────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative w-full mb-16 sm:mb-24"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Background gradient orb */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #2196ff 0%, #14b8a6 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <SectionTitle subtitle="跨领域复合能力全景 — 涵盖工程、设计、数据与 AI">能力雷达</SectionTitle>

        <div className="relative w-full max-w-xl mx-auto h-[400px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ background: 'var(--glass-bg)' }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-accent-blue/20 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-accent-teal/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-accent-teal/20 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-accent-blue/20 rounded-br-2xl" />

          <SkillRadar3D />
        </div>
      </motion.section>

      <SectionDivider />

      {/* ── Bio Card with Accent Border ──────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative max-w-3xl mx-auto mb-16 sm:mb-24"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Subtle background glow */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <SectionTitle subtitle="了解更多关于我的故事">关于我</SectionTitle>

        {/* Bio Card with gradient border */}
        <div className="relative rounded-2xl p-px overflow-hidden group">
          {/* Animated gradient border */}
          <div
            className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(135deg, #2196ff, #8b5cf6, #14b8a6, #2196ff)',
              backgroundSize: '300% 300%',
              animation: 'gradient-shift 8s ease infinite',
            }}
          />
          <div
            className="relative rounded-2xl p-6 sm:p-10"
            style={{ background: 'var(--glass-bg)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Avatar with gradient ring */}
              <div className="shrink-0 self-center sm:self-start">
                <div className="relative">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #2196ff 0%, #8b5cf6 50%, #14b8a6 100%)',
                      boxShadow: '0 0 30px rgba(33, 150, 255, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)',
                    }}
                  >
                    H
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-400 border-2 border-[var(--glass-bg)] shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold mb-1">
                  <span className="accent-gradient-text">Hang</span>
                </h3>

                {/* Role tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-accent-blue border border-accent-blue/30"
                    style={{ background: 'rgba(33, 150, 255, 0.1)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                    全栈开发
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-accent-teal/30"
                    style={{ background: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
                    大健康行业
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-accent-purple/30"
                    style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                    AI 应用
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm sm:text-base leading-relaxed text-white/70">
                    拥有多年全栈开发经验，专注于将技术与行业深度结合。在大健康领域深耕多年，
                    擅长将数据分析、AI 技术与医疗健康场景融合，打造有价值的数字产品。
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed text-white/70">
                    技术视野覆盖前端工程、后端服务、数据智能与创意可视化。相信技术的价值在于解决真实问题，
                    追求工程卓越与用户体验的平衡。
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <a
                    href="https://github.com/hangyuwei"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-white/50 hover:text-accent-blue transition-all duration-300 group/link"
                  >
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 group-hover/link:border-accent-blue/30 group-hover/link:bg-accent-blue/10 transition-all duration-300"
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

      <SectionDivider />

      {/* ── Tech Stack Sphere ────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative w-full mb-16 sm:mb-24"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Background gradient orb */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #2196ff 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <SectionTitle subtitle="拖拽旋转探索我的技术版图 — 从前端到后端、从数据到 AI">技术栈</SectionTitle>

        <div
          className="relative w-full max-w-xl mx-auto h-[400px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ background: 'var(--glass-bg)' }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-accent-purple/20 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-accent-blue/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-accent-blue/20 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-accent-purple/20 rounded-br-2xl" />

          <TechSphere />
        </div>
      </motion.section>

      <SectionDivider />

      {/* ── Career Timeline ──────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative max-w-3xl mx-auto"
        style={{ padding: 0, background: 'none' }}
      >
        {/* Background gradient orb */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, #2196ff 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <SectionTitle subtitle="持续成长的技术之旅">职业经历</SectionTitle>

        <div className="relative">
          {/* Timeline line - enhanced gradient with glow */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="absolute left-5 sm:left-7 top-3 bottom-3 w-px origin-top"
          >
            {/* Glow behind line */}
            <div className="absolute inset-0 w-3 -translate-x-1 bg-gradient-to-b from-accent-blue/20 via-accent-purple/15 to-accent-teal/15 blur-sm" />
            {/* Main line */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent-blue via-accent-purple to-accent-teal opacity-30" />
            {/* Start cap */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(33,150,255,0.6)]" />
            {/* End cap */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
          </motion.div>

          <div className="space-y-8 sm:space-y-10">
            {TIMELINE.map((item, i) => {
              const dotColors = [
                { bg: '#2196ff', glow: 'rgba(33, 150, 255, 0.5)', ring: 'rgba(33, 150, 255, 0.2)' },
                { bg: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.5)', ring: 'rgba(139, 92, 246, 0.2)' },
                { bg: '#14b8a6', glow: 'rgba(20, 184, 166, 0.5)', ring: 'rgba(20, 184, 166, 0.2)' },
                { bg: '#eab308', glow: 'rgba(234, 179, 8, 0.5)', ring: 'rgba(234, 179, 8, 0.2)' },
              ];
              const color = dotColors[i % dotColors.length];
              const isLast = i === TIMELINE.length - 1;

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
                  {/* Timeline dot - pulsing with color */}
                  <div className="absolute left-3 sm:left-5 top-5">
                    {/* Outer pulse ring */}
                    <div
                      className="absolute -inset-2 rounded-full animate-ping opacity-20"
                      style={{ backgroundColor: color.glow }}
                    />
                    {/* Middle ring */}
                    <div
                      className="absolute -inset-1 rounded-full opacity-30"
                      style={{ boxShadow: `0 0 12px ${color.glow}` }}
                    />
                    {/* Core dot */}
                    <div
                      className="relative w-3.5 h-3.5 rounded-full border-2"
                      style={{
                        backgroundColor: color.bg,
                        borderColor: `${color.bg}80`,
                        boxShadow: `0 0 10px ${color.glow}, 0 0 20px ${color.ring}`,
                      }}
                    />
                  </div>

                  {/* Card with left accent bar */}
                  <div
                    className="relative rounded-xl overflow-hidden group"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0.5 opacity-60 group-hover:opacity-100 group-hover:w-1 transition-all duration-500"
                      style={{
                        background: `linear-gradient(180deg, ${color.bg}, ${color.bg}40)`,
                      }}
                    />

                    <div className="p-5 sm:p-6 group-hover:bg-white/[0.03] transition-colors duration-500">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex items-center justify-center w-7 h-7 rounded-md"
                            style={{ backgroundColor: `${color.bg}15` }}
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
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-accent-blue transition-colors duration-300">
                            {item.title}
                          </h3>
                        </div>
                        {isLast && (
                          <span
                            className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase"
                            style={{ background: `${color.bg}20`, color: color.bg }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <span
                        className="text-xs font-mono mb-3 block ml-[38px]"
                        style={{ color: `${color.bg}99` }}
                      >
                        {item.period}
                      </span>
                      <p className="text-sm text-white/60 leading-relaxed ml-[38px]">
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

      {/* ── Footer Spacer ────────────────────────────────── */}
      <div className="h-16 sm:h-24" />
    </>
  );
}

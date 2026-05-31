'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const SolarSystem = dynamic(
  () => import('./three/SolarSystem'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Skeleton animation - pulsing ring */}
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full border border-accent/30" />
            <div className="absolute inset-2 animate-pulse rounded-full border border-accent-blue/50" />
            <div className="absolute inset-4 rounded-full bg-accent/20 animate-pulse" />
          </div>
          {/* Skeleton text bars */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      </div>
    ),
  },
);

const SLOGANS = [
  '用代码构建未来',
  '以AI赋能行业',
  '让创意照进现实',
  '技术驱动价值',
];

function TypewriterSlogan() {
  const [renderText, setRenderText] = useState('');
  const stateRef = useRef({
    sloganIndex: 0,
    isDeleting: false,
    displayText: '',
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const s = stateRef.current;
      const current = SLOGANS[s.sloganIndex];

      if (!s.isDeleting) {
        if (s.displayText.length < current.length) {
          s.displayText = current.slice(0, s.displayText.length + 1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 100);
        } else {
          s.isDeleting = true;
          timer = setTimeout(tick, 2000);
        }
      } else {
        if (s.displayText.length > 0) {
          s.displayText = s.displayText.slice(0, -1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 50);
        } else {
          s.isDeleting = false;
          s.sloganIndex = (s.sloganIndex + 1) % SLOGANS.length;
          timer = setTimeout(tick, 100);
        }
      }
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="inline-block min-h-[1.5em]">
      {renderText}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}

/* ── Animated gradient background behind text ── */
function AnimatedGradientBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Radial gradient that slowly shifts */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(33,150,255,0.12) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 45% 48%, rgba(139,92,246,0.10) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 55% 52%, rgba(0,229,255,0.10) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(33,150,255,0.12) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ── Animated divider line between title and subtitle ── */
function AnimatedDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
      className="my-4 flex items-center justify-center sm:my-5"
    >
      <div className="relative h-px w-32 sm:w-48">
        {/* Background line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
        {/* Animated traveling highlight */}
        <motion.div
          className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ x: ['-3rem', '12rem'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]" />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExplore = useCallback(() => {
    const el = document.getElementById('featured-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/projects';
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#000005]">
      {/* 3D Canvas - lazy loaded after mount to avoid SSR issues */}
      <div className="absolute inset-0">
        {mounted && <SolarSystem />}
      </div>

      {/* Dark overlay gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Text overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* Animated gradient backdrop behind text area */}
        <AnimatedGradientBackdrop />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative text-center"
        >
          {/* ── 1. Title: larger, blue glow text-shadow ── */}
          <h1
            className="mb-2 text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              textShadow:
                '0 0 20px rgba(33,150,255,0.5), 0 0 60px rgba(33,150,255,0.25), 0 0 120px rgba(33,150,255,0.1), 0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Hang&apos;s Portfolio
            </span>
          </h1>

          {/* ── 6. Animated divider line ── */}
          <AnimatedDivider />

          {/* ── 3. Subtitle with gradient text effect ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-6 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-teal bg-clip-text text-lg text-transparent sm:text-xl md:text-2xl"
          >
            全栈开发 · AI应用 · 大健康行业
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-10 h-8 text-base text-muted sm:text-lg"
          >
            <AnimatePresence mode="wait">
              <TypewriterSlogan />
            </AnimatePresence>
          </motion.div>

          {/* ── 4. CTA button: gradient border, glow on hover, scale ── */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExplore}
            className="group relative rounded-full px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 sm:text-lg"
          >
            {/* Gradient border layer */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-teal p-[1.5px] transition-opacity duration-300 group-hover:opacity-100 opacity-70" />
            {/* Inner background */}
            <span className="absolute inset-[1.5px] rounded-full bg-black/70 transition-colors duration-300 group-hover:bg-black/50" />
            {/* Glow on hover */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-blue/0 via-accent-purple/0 to-accent-teal/0 blur-md transition-all duration-500 group-hover:from-accent-blue/30 group-hover:via-accent-purple/20 group-hover:to-accent-teal/30" />
            {/* Button text */}
            <span className="relative z-10">探索项目宇宙</span>
          </motion.button>
        </motion.div>
      </div>

      {/* ── 5. Scroll indicator with pulsing ring ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted">Scroll</span>
          {/* Pulsing ring container */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulsing ring */}
            <motion.span
              className="absolute inline-flex h-10 w-10 rounded-full border border-accent/40"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Inner pulsing ring */}
            <motion.span
              className="absolute inline-flex h-8 w-8 rounded-full border border-accent-blue/50"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />
            {/* Arrow icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="relative z-10 text-muted"
            >
              <path
                d="M10 4v12m0 0l-4-4m4 4l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

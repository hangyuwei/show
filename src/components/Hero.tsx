'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

/* ── Typewriter with improved cursor ── */
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
          timer = setTimeout(tick, 80 + Math.random() * 40);
        } else {
          s.isDeleting = true;
          timer = setTimeout(tick, 2200);
        }
      } else {
        if (s.displayText.length > 0) {
          s.displayText = s.displayText.slice(0, -1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 35);
        } else {
          s.isDeleting = false;
          s.sloganIndex = (s.sloganIndex + 1) % SLOGANS.length;
          timer = setTimeout(tick, 400);
        }
      }
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="inline-block min-h-[1.5em] text-white/80">
      {renderText}
      <span
        className="ml-[2px] inline-block w-[2px] translate-y-[2px] bg-accent-blue align-middle"
        style={{
          height: '1.1em',
          animation: 'cursor-blink 1s step-end infinite',
        }}
      />
    </span>
  );
}

/* ── Floating ambient particles ── */
function AmbientParticles() {
  const particles = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 2 + Math.random() * 3,
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 60,
      duration: 12 + Math.random() * 10,
      delay: Math.random() * 5,
      drift: 10 + Math.random() * 20,
    })),
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, rgba(33,150,255,0.6) 0%, rgba(33,150,255,0) 70%)`,
          }}
          animate={{
            y: [-p.drift, p.drift, -p.drift],
            x: [-p.drift * 0.3, p.drift * 0.3, -p.drift * 0.3],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Radial light beams from behind title ── */
function LightBeams() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Top-center cone of light */}
      <motion.div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '120vw',
          height: '80vh',
          background:
            'conic-gradient(from 170deg at 50% 100%, transparent 0deg, rgba(33,150,255,0.03) 15deg, transparent 30deg, rgba(139,92,246,0.025) 45deg, transparent 60deg, transparent 300deg)',
        }}
        animate={{ rotate: [0, 3, -2, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle secondary glow */}
      <motion.div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(33,150,255,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ── Animated gradient backdrop behind text ── */
function AnimatedGradientBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
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

/* ── Animated divider with traveling shimmer ── */
function AnimatedDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
      className="my-5 flex items-center justify-center sm:my-6"
    >
      <div className="relative h-px w-40 sm:w-56 md:w-64">
        {/* Background line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
        {/* Animated traveling highlight */}
        <motion.div
          className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ x: ['-4rem', '16rem'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Center diamond */}
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent shadow-[0_0_8px_var(--color-accent),0_0_16px_rgba(33,150,255,0.3)]" />
      </div>
    </motion.div>
  );
}

/* ── Staggered entrance wrapper ── */
const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

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
      {/* Inject keyframes for cursor blink */}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        {mounted && <SolarSystem />}
      </div>

      {/* Ambient particles */}
      <AmbientParticles />

      {/* Light beams behind text */}
      <LightBeams />

      {/* Dark overlay gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      {/* Subtle noise/grain texture */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Text overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <AnimatedGradientBackdrop />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-5xl text-center"
        >
          {/* ── Title: animated gradient with shimmer ── */}
          <motion.h1
            {...fadeUp(0.2)}
            className="mb-2 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            style={{
              letterSpacing: '-0.02em',
              textShadow:
                '0 0 30px rgba(33,150,255,0.5), 0 0 80px rgba(33,150,255,0.2), 0 0 140px rgba(33,150,255,0.08), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              {/* Shimmer sweep overlay */}
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite]"
                aria-hidden
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              />
              Hang&apos;s Portfolio
            </span>
          </motion.h1>

          {/* ── Animated divider ── */}
          <AnimatedDivider />

          {/* ── Subtitle with gradient text ── */}
          <motion.p
            {...fadeUp(0.5)}
            className="mb-8 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-teal bg-clip-text text-lg font-medium text-transparent sm:text-xl md:text-2xl"
            style={{ letterSpacing: '0.06em' }}
          >
            全栈开发 · AI应用 · 大健康行业
          </motion.p>

          {/* ── Typewriter slogan ── */}
          <motion.div
            {...fadeUp(0.8)}
            className="mb-12 h-8 text-base tracking-wide sm:text-lg"
          >
            <AnimatePresence mode="wait">
              <TypewriterSlogan />
            </AnimatePresence>
          </motion.div>

          {/* ── CTA button: premium glass with animated border sweep ── */}
          <motion.div {...fadeUp(1.1)}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExplore}
              className="group relative rounded-full px-9 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 sm:text-lg cursor-pointer"
            >
              {/* Animated gradient border - rotating sweep */}
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-accent-blue/70 via-accent-purple/70 to-accent-teal/70 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                <motion.span
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,transparent_60%,rgba(255,255,255,0.4)_80%,transparent_100%)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </span>
              {/* Inner background */}
              <span className="absolute inset-[1.5px] rounded-full bg-[#06091a]/80 transition-colors duration-300 group-hover:bg-[#06091a]/60" />
              {/* Glow halo on hover */}
              <motion.span
                className="absolute -inset-2 rounded-full blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(33,150,255,0.25), rgba(139,92,246,0.2), rgba(20,184,166,0.2))',
                }}
              />
              {/* Button text with arrow */}
              <span className="relative z-10 flex items-center gap-2">
                探索项目宇宙
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator: mouse metaphor ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            Scroll
          </span>
          {/* Mouse shape */}
          <div className="relative flex h-9 w-[22px] items-start justify-center rounded-full border border-white/25 p-1.5">
            {/* Scrolling dot inside mouse */}
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-accent-blue"
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

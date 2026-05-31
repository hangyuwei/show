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
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full border border-accent/30" />
            <div className="absolute inset-2 animate-pulse rounded-full border border-accent-blue/50" />
            <div className="absolute inset-4 rounded-full bg-accent/20 animate-pulse" />
          </div>
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

/* ── Typewriter with refined cursor and pulse effect ── */
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
          timer = setTimeout(tick, 75 + Math.random() * 35);
        } else {
          s.isDeleting = true;
          timer = setTimeout(tick, 2800);
        }
      } else {
        if (s.displayText.length > 0) {
          s.displayText = s.displayText.slice(0, -1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 25);
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
    <span className="inline-flex min-h-[1.5em] items-center">
      <span className="text-white/65">{renderText}</span>
      <span
        className="ml-[3px] inline-block w-[2.5px] align-middle"
        style={{
          height: '1.1em',
          background: 'linear-gradient(180deg, #2196ff 0%, #8b5cf6 45%, #14b8a6 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 8px rgba(33,150,255,0.5), 0 0 18px rgba(139,92,246,0.25), 0 0 28px rgba(20,184,166,0.1)',
          animation: 'cursor-blink 1s step-end infinite',
        }}
      />
      {/* Typing pulse ring */}
      <span
        className="absolute inline-block w-2 h-2 rounded-full opacity-0"
        style={{
          animation: 'typing-pulse 0.6s ease-out',
        }}
      />
    </span>
  );
}

/* ── Floating ambient particles with softer glow and varied sizes ── */
function AmbientParticles() {
  const particles = useRef(
    Array.from({ length: 14 }, (_, i) => {
      const colorSet = [
        'rgba(33,150,255,',    // blue
        'rgba(139,92,246,',    // purple
        'rgba(20,184,166,',    // teal
        'rgba(99,102,241,',    // indigo
      ];
      const color = colorSet[i % 4];
      return {
        id: i,
        size: 1 + Math.random() * 4,
        x: 5 + Math.random() * 90,
        y: 10 + Math.random() * 70,
        duration: 16 + Math.random() * 14,
        delay: Math.random() * 8,
        drift: 6 + Math.random() * 16,
        color,
      };
    }),
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
            background: `radial-gradient(circle, ${p.color}0.55) 0%, ${p.color}0.15) 40%, ${p.color}0) 70%)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}0.2)`,
          }}
          animate={{
            y: [-p.drift, p.drift, -p.drift],
            x: [-p.drift * 0.35, p.drift * 0.35, -p.drift * 0.35],
            opacity: [0.08, 0.3, 0.08],
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

/* ── Constellation lines connecting nearby particles ── */
function ConstellationLines() {
  const lines = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x1: 15 + Math.random() * 30,
      y1: 20 + Math.random() * 30,
      x2: 50 + Math.random() * 35,
      y2: 25 + Math.random() * 40,
      duration: 18 + Math.random() * 12,
      delay: Math.random() * 5,
      opacity: 0.015 + Math.random() * 0.02,
    })),
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {lines.map((l) => (
          <motion.line
            key={l.id}
            x1={`${l.x1}%`}
            y1={`${l.y1}%`}
            x2={`${l.x2}%`}
            y2={`${l.y2}%`}
            stroke="rgba(33,150,255,0.06)"
            strokeWidth="0.5"
            animate={{
              opacity: [l.opacity * 0.5, l.opacity, l.opacity * 0.5],
              stroke: [
                'rgba(33,150,255,0.06)',
                'rgba(139,92,246,0.06)',
                'rgba(20,184,166,0.05)',
                'rgba(33,150,255,0.06)',
              ],
            }}
            transition={{
              duration: l.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: l.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Radial light beams with richer, smoother gradient ── */
function LightBeams() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Primary cone of light - wider and softer */}
      <motion.div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '160vw',
          height: '100vh',
          background:
            'conic-gradient(from 170deg at 50% 100%, transparent 0deg, rgba(33,150,255,0.025) 10deg, transparent 20deg, rgba(139,92,246,0.022) 30deg, transparent 42deg, rgba(20,184,166,0.018) 52deg, transparent 64deg, rgba(99,102,241,0.015) 74deg, transparent 86deg, transparent 274deg)',
        }}
        animate={{ rotate: [0, 3.5, -2.5, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Breathing central glow - larger and more diffuse */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 900,
          height: 550,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(33,150,255,0.05) 0%, rgba(99,102,241,0.03) 25%, rgba(139,92,246,0.025) 45%, rgba(20,184,166,0.015) 65%, transparent 80%)',
        }}
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.4, 0.85, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle top-left accent */}
      <motion.div
        className="absolute left-[20%] top-0 h-[45%] w-[35%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(33,150,255,0.035) 0%, transparent 55%)',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle bottom-right accent for balance */}
      <motion.div
        className="absolute bottom-0 right-[15%] h-[40%] w-[30%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.03) 0%, rgba(20,184,166,0.015) 40%, transparent 60%)',
        }}
        animate={{ opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ── Animated gradient backdrop behind text - smoother transitions ── */
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
            'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(33,150,255,0.08) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 50% at 48% 48%, rgba(99,102,241,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 48% at 52% 52%, rgba(139,92,246,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(20,184,166,0.05) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(33,150,255,0.08) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ── Subtle grid pattern behind content ── */
function SubtleGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.015]"
      aria-hidden
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 15%, transparent 65%)',
        WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 15%, transparent 65%)',
      }}
    />
  );
}

/* ── Animated divider with traveling shimmer and center glow ── */
function AnimatedDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 1.0, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className="my-5 flex items-center justify-center sm:my-6"
    >
      <div className="relative h-px w-52 sm:w-72 md:w-96">
        {/* Background line with richer gradient using design system colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />
        {/* Primary animated traveling highlight */}
        <motion.div
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
          animate={{ x: ['-6rem', '24rem'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary delayed shimmer */}
        <motion.div
          className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-accent-purple/25 to-transparent"
          animate={{ x: ['-4rem', '24rem'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        {/* Center diamond with multi-layer glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px]"
          style={{
            background: 'linear-gradient(135deg, #2196ff, #8b5cf6)',
            boxShadow: '0 0 4px rgba(33,150,255,0.6), 0 0 10px rgba(33,150,255,0.3), 0 0 20px rgba(139,92,246,0.15), 0 0 40px rgba(20,184,166,0.06)',
          }}
        />
        {/* Secondary dot accents */}
        <div className="absolute left-[12%] top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 rounded-sm bg-accent-blue/30" />
        <div className="absolute right-[12%] top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 rounded-sm bg-accent-teal/30" />
      </div>
    </motion.div>
  );
}

/* ── Staggered entrance wrapper ── */
const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
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
      {/* Inject keyframes */}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes hero-shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(300%); }
        }
        @keyframes title-glow-breathe {
          0%, 100% {
            text-shadow:
              0 0 25px rgba(33,150,255,0.3),
              0 0 60px rgba(33,150,255,0.12),
              0 0 120px rgba(33,150,255,0.05),
              0 0 200px rgba(139,92,246,0.03),
              0 2px 4px rgba(0,0,0,0.8);
          }
          50% {
            text-shadow:
              0 0 35px rgba(33,150,255,0.45),
              0 0 80px rgba(33,150,255,0.18),
              0 0 140px rgba(33,150,255,0.08),
              0 0 220px rgba(139,92,246,0.06),
              0 0 320px rgba(20,184,166,0.02),
              0 2px 4px rgba(0,0,0,0.8);
          }
        }
        @keyframes gradient-title-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 0%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 100%;
          }
        }
        @keyframes scroll-ring-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        @keyframes scroll-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        @keyframes typing-pulse {
          0% { transform: scale(0.5); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        {mounted && <SolarSystem />}
      </div>

      {/* Subtle grid pattern */}
      <SubtleGrid />

      {/* Constellation lines */}
      <ConstellationLines />

      {/* Ambient particles */}
      <AmbientParticles />

      {/* Light beams behind text */}
      <LightBeams />

      {/* Dark overlay gradient for text readability - smoother blend */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Subtle noise/grain texture */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.018]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
          {/* ── Title: premium gradient with multi-layer glow ── */}
          <motion.h1
            {...fadeUp(0.15)}
            className="mb-2 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem]"
            style={{
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              animation: 'title-glow-breathe 6s ease-in-out infinite',
            }}
          >
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #ffffff 0%, #e0e7ff 15%, #a5b4fc 30%, #818cf8 42%, #93c5fd 55%, #a78bfa 65%, #c4b5fd 78%, #e0e7ff 90%, #ffffff 100%)',
                backgroundSize: '300% 300%',
                animation: 'gradient-title-shift 10s ease infinite',
              }}
            >
              {/* Shimmer sweep overlay - wider and softer */}
              <span
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <span
                  className="absolute inset-y-0 w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    animation: 'hero-shimmer 6s ease-in-out infinite',
                  }}
                />
              </span>
              Hang&apos;s Portfolio
            </span>
          </motion.h1>

          {/* ── Animated divider ── */}
          <AnimatedDivider />

          {/* ── Subtitle with refined gradient and spacing ── */}
          <motion.p
            {...fadeUp(0.45)}
            className="mb-8 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-teal bg-clip-text text-lg font-medium text-transparent sm:text-xl md:text-2xl"
            style={{
              letterSpacing: '0.06em',
              filter: 'drop-shadow(0 0 10px rgba(33,150,255,0.12)) drop-shadow(0 0 30px rgba(139,92,246,0.06))',
            }}
          >
            全栈开发 · AI应用 · 大健康行业
          </motion.p>

          {/* ── Typewriter slogan ── */}
          <motion.div
            {...fadeUp(0.75)}
            className="mb-12 h-8 text-base tracking-wide sm:text-lg"
          >
            <AnimatePresence mode="wait">
              <TypewriterSlogan />
            </AnimatePresence>
          </motion.div>

          {/* ── CTA button: premium glass with multi-layer depth ── */}
          <motion.div {...fadeUp(1.05)}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExplore}
              className="group relative cursor-pointer rounded-full px-12 py-4 text-base font-semibold text-white backdrop-blur-xl transition-all duration-500 sm:text-lg"
            >
              {/* Deep outer shadow layer */}
              <span
                className="absolute -inset-4 rounded-full opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-60"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(33,150,255,0.15), rgba(139,92,246,0.12), rgba(20,184,166,0.12))',
                }}
              />
              {/* Mid glow halo - always visible, stronger on hover */}
              <span
                className="absolute -inset-2 rounded-full opacity-20 blur-lg transition-all duration-700 group-hover:opacity-60 group-hover:blur-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(33,150,255,0.25), rgba(139,92,246,0.18), rgba(20,184,166,0.15))',
                }}
              />
              {/* Animated gradient border - rotating conic sweep */}
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-accent-blue/50 via-accent-purple/50 to-accent-teal/50 opacity-40 transition-opacity duration-500 group-hover:opacity-90" />
                <motion.span
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,rgba(255,255,255,0.3)_70%,transparent_90%)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
              </span>
              {/* Inner glass background with multi-layer depth */}
              <span
                className="absolute inset-[1.5px] rounded-full transition-all duration-500"
                style={{
                  background: 'linear-gradient(180deg, rgba(6,10,28,0.88) 0%, rgba(4,8,22,0.92) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.15)',
                }}
              />
              {/* Hover state inner highlight */}
              <span
                className="absolute inset-[1.5px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(180deg, rgba(33,150,255,0.06) 0%, rgba(6,12,30,0.85) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 24px rgba(33,150,255,0.04)',
                }}
              />
              {/* Button text with arrow */}
              <span className="relative z-10 flex items-center gap-3">
                <span className="transition-all duration-300 group-hover:tracking-wider">
                  探索项目宇宙
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-all duration-400 group-hover:translate-x-2 group-hover:opacity-90"
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

      {/* ── Scroll indicator: refined mouse with pulsing ring ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 1.8, ease: 'easeOut' }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span
            className="text-[10px] font-medium uppercase tracking-[0.3em]"
            style={{ color: 'rgba(255,255,255,0.22)' }}
          >
            Scroll
          </span>
          {/* Mouse shape with refined glow */}
          <div className="relative flex h-11 w-[22px] items-start justify-center rounded-full border border-white/15 p-1.5">
            {/* Pulsing outer ring */}
            <span
              className="absolute -inset-2 rounded-full"
              style={{
                border: '1px solid rgba(33,150,255,0.1)',
                animation: 'scroll-ring-pulse 3s ease-in-out infinite',
              }}
            />
            {/* Static outer glow */}
            <span
              className="absolute -inset-1 rounded-full opacity-30"
              style={{
                border: '1px solid rgba(33,150,255,0.12)',
                boxShadow: '0 0 6px rgba(33,150,255,0.08), 0 0 12px rgba(139,92,246,0.04)',
              }}
            />
            {/* Scrolling dot inside mouse */}
            <motion.div
              className="h-1 w-1 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #2196ff, #8b5cf6)',
                boxShadow: '0 0 4px rgba(33,150,255,0.4), 0 0 10px rgba(139,92,246,0.2)',
              }}
              animate={{ y: [0, 14, 0], opacity: [1, 0.15, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          {/* Down chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="opacity-15"
            style={{ animation: 'scroll-float 3s ease-in-out infinite' }}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

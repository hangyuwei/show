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

/* ── Typewriter with glowing gradient cursor ── */
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
          timer = setTimeout(tick, 2400);
        }
      } else {
        if (s.displayText.length > 0) {
          s.displayText = s.displayText.slice(0, -1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 30);
        } else {
          s.isDeleting = false;
          s.sloganIndex = (s.sloganIndex + 1) % SLOGANS.length;
          timer = setTimeout(tick, 500);
        }
      }
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="inline-flex min-h-[1.5em] items-center text-white/70">
      {renderText}
      <span
        className="ml-[2px] inline-block w-[2px] align-middle"
        style={{
          height: '1.15em',
          background: 'linear-gradient(180deg, #2196ff 0%, #8b5cf6 50%, #14b8a6 100%)',
          borderRadius: '1px',
          boxShadow: '0 0 6px rgba(33,150,255,0.6), 0 0 14px rgba(139,92,246,0.3)',
          animation: 'cursor-blink 1s step-end infinite',
        }}
      />
    </span>
  );
}

/* ── Floating ambient particles with varied colors ── */
function AmbientParticles() {
  const particles = useRef(
    Array.from({ length: 10 }, (_, i) => {
      const colorSet = [
        'rgba(33,150,255,',    // blue
        'rgba(139,92,246,',    // purple
        'rgba(20,184,166,',    // teal
      ];
      const color = colorSet[i % 3];
      return {
        id: i,
        size: 1.5 + Math.random() * 3,
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 65,
        duration: 14 + Math.random() * 12,
        delay: Math.random() * 6,
        drift: 8 + Math.random() * 18,
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
            background: `radial-gradient(circle, ${p.color}0.7) 0%, ${p.color}0) 70%)`,
          }}
          animate={{
            y: [-p.drift, p.drift, -p.drift],
            x: [-p.drift * 0.4, p.drift * 0.4, -p.drift * 0.4],
            opacity: [0.1, 0.35, 0.1],
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

/* ── Radial light beams with richer gradient ── */
function LightBeams() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Primary cone of light */}
      <motion.div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '140vw',
          height: '90vh',
          background:
            'conic-gradient(from 170deg at 50% 100%, transparent 0deg, rgba(33,150,255,0.035) 12deg, transparent 24deg, rgba(139,92,246,0.03) 36deg, transparent 48deg, rgba(20,184,166,0.02) 58deg, transparent 70deg, transparent 290deg)',
        }}
        animate={{ rotate: [0, 4, -3, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Breathing central glow */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 700,
          height: 450,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(33,150,255,0.06) 0%, rgba(139,92,246,0.035) 35%, rgba(20,184,166,0.02) 60%, transparent 75%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle top vignette accent */}
      <motion.div
        className="absolute left-[30%] top-0 h-[40%] w-[40%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(33,150,255,0.04) 0%, transparent 60%)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
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
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(33,150,255,0.10) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 55% at 45% 48%, rgba(139,92,246,0.08) 0%, transparent 70%)',
            'radial-gradient(ellipse 65% 50% at 55% 52%, rgba(0,229,255,0.08) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(33,150,255,0.10) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ── Subtle grid pattern behind content ── */
function SubtleGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.02]"
      aria-hidden
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 20%, transparent 70%)',
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
      transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
      className="my-4 flex items-center justify-center sm:my-5"
    >
      <div className="relative h-px w-48 sm:w-64 md:w-80">
        {/* Background line with richer gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue/25 to-transparent" />
        {/* Animated traveling highlight */}
        <motion.div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ x: ['-5rem', '20rem'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Center diamond with glow */}
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent shadow-[0_0_6px_var(--color-accent),0_0_12px_rgba(33,150,255,0.4),0_0_24px_rgba(33,150,255,0.15)]" />
        {/* Secondary dot accents */}
        <div className="absolute left-[15%] top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 rounded-sm bg-accent-blue/40" />
        <div className="absolute right-[15%] top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 rounded-sm bg-accent-teal/40" />
      </div>
    </motion.div>
  );
}

/* ── Staggered entrance wrapper ── */
const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
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
          100% { transform: translateX(250%); }
        }
        @keyframes title-glow-breathe {
          0%, 100% {
            text-shadow:
              0 0 30px rgba(33,150,255,0.4),
              0 0 80px rgba(33,150,255,0.15),
              0 0 140px rgba(33,150,255,0.06),
              0 2px 4px rgba(0,0,0,0.8);
          }
          50% {
            text-shadow:
              0 0 40px rgba(33,150,255,0.55),
              0 0 100px rgba(33,150,255,0.22),
              0 0 160px rgba(33,150,255,0.10),
              0 0 240px rgba(139,92,246,0.05),
              0 2px 4px rgba(0,0,0,0.8);
          }
        }
      `}</style>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        {mounted && <SolarSystem />}
      </div>

      {/* Subtle grid pattern */}
      <SubtleGrid />

      {/* Ambient particles */}
      <AmbientParticles />

      {/* Light beams behind text */}
      <LightBeams />

      {/* Dark overlay gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      {/* Subtle noise/grain texture */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.02]"
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
          {/* ── Title: premium gradient with breathing glow ── */}
          <motion.h1
            {...fadeUp(0.2)}
            className="mb-3 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            style={{
              letterSpacing: '-0.025em',
              animation: 'title-glow-breathe 5s ease-in-out infinite',
            }}
          >
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #ffffff 0%, #c7d2fe 25%, #93c5fd 45%, #a78bfa 55%, #c7d2fe 75%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 8s ease infinite',
              }}
            >
              {/* Shimmer sweep overlay */}
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
                  className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'hero-shimmer 5s ease-in-out infinite',
                  }}
                />
              </span>
              Hang&apos;s Portfolio
            </span>
          </motion.h1>

          {/* ── Animated divider ── */}
          <AnimatedDivider />

          {/* ── Subtitle with richer gradient ── */}
          <motion.p
            {...fadeUp(0.5)}
            className="mb-7 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-teal bg-clip-text text-lg font-medium text-transparent sm:text-xl md:text-2xl"
            style={{
              letterSpacing: '0.08em',
              filter: 'drop-shadow(0 0 12px rgba(33,150,255,0.15))',
            }}
          >
            全栈开发 · AI应用 · 大健康行业
          </motion.p>

          {/* ── Typewriter slogan ── */}
          <motion.div
            {...fadeUp(0.8)}
            className="mb-10 h-8 text-base tracking-wide sm:text-lg"
          >
            <AnimatePresence mode="wait">
              <TypewriterSlogan />
            </AnimatePresence>
          </motion.div>

          {/* ── CTA button: premium glass with refined hover ── */}
          <motion.div {...fadeUp(1.1)}>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExplore}
              className="group relative rounded-full px-10 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-500 sm:text-lg cursor-pointer"
            >
              {/* Outer glow halo — always faintly visible, stronger on hover */}
              <span
                className="absolute -inset-3 rounded-full blur-2xl opacity-30 transition-opacity duration-700 group-hover:opacity-80"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(33,150,255,0.2), rgba(139,92,246,0.15), rgba(20,184,166,0.15))',
                }}
              />
              {/* Animated gradient border - rotating sweep */}
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-accent-blue/60 via-accent-purple/60 to-accent-teal/60 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                <motion.span
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,transparent_55%,rgba(255,255,255,0.35)_75%,transparent_100%)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />
              </span>
              {/* Inner glass background with hover brightness */}
              <span className="absolute inset-[1.5px] rounded-full bg-[#04081a]/85 transition-all duration-500 group-hover:bg-[#060c22]/70 group-hover:shadow-[inset_0_0_20px_rgba(33,150,255,0.08)]" />
              {/* Button text with arrow */}
              <span className="relative z-10 flex items-center gap-2.5">
                <span className="transition-all duration-300 group-hover:tracking-wide">
                  探索项目宇宙
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-all duration-400 group-hover:translate-x-1.5 group-hover:opacity-90"
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

      {/* ── Scroll indicator: premium mouse with glow ring ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0, duration: 1.5, ease: 'easeOut' }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2.5"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/30">
            Scroll
          </span>
          {/* Mouse shape with glow */}
          <div className="relative flex h-10 w-[22px] items-start justify-center rounded-full border border-white/20 p-1.5">
            {/* Outer glow ring */}
            <span
              className="absolute -inset-1 rounded-full opacity-40"
              style={{
                border: '1px solid rgba(33,150,255,0.15)',
                boxShadow: '0 0 8px rgba(33,150,255,0.1)',
              }}
            />
            {/* Scrolling dot inside mouse */}
            <motion.div
              className="h-1 w-1 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #2196ff, #8b5cf6)',
                boxShadow: '0 0 4px rgba(33,150,255,0.5)',
              }}
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

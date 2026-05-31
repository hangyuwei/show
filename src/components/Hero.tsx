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

/* ── Typewriter with premium cursor glow and character reveal ── */
function TypewriterSlogan() {
  const [renderText, setRenderText] = useState('');
  const [charIndex, setCharIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
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
          setCharIndex(s.displayText.length);
          setIsPaused(false);
          // Natural typing rhythm: faster for common chars, pause on punctuation
          const lastChar = s.displayText[s.displayText.length - 1];
          const isPunctuation = /[，。·、！？,.]/.test(lastChar);
          timer = setTimeout(tick, isPunctuation ? 140 + Math.random() * 60 : 65 + Math.random() * 45);
        } else {
          s.isDeleting = true;
          setIsPaused(true);
          timer = setTimeout(tick, 2800);
        }
      } else {
        if (s.displayText.length > 0) {
          s.displayText = s.displayText.slice(0, -1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 22);
        } else {
          s.isDeleting = false;
          s.sloganIndex = (s.sloganIndex + 1) % SLOGANS.length;
          timer = setTimeout(tick, 400);
        }
      }
    };

    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="inline-flex min-h-[1.5em] items-center">
      <span className="text-white/60">
        {renderText.split('').map((ch, i) => {
          const isLatest = i === charIndex && charIndex > 0;
          const distance = charIndex - i;
          // Characters near the cursor get a subtle gradient fade
          const isNearCursor = distance >= 0 && distance <= 2;
          return (
            <span
              key={`${ch}-${i}`}
              className="inline-block"
              style={{
                opacity: i <= charIndex ? 1 : 0,
                color: isLatest
                  ? 'rgba(167, 197, 253, 0.95)'
                  : isNearCursor && !isLatest
                    ? 'rgba(180, 200, 240, 0.8)'
                    : 'rgba(255,255,255,0.6)',
                textShadow: isLatest
                  ? '0 0 14px rgba(96,165,250,0.5), 0 0 28px rgba(139,92,246,0.2), 0 0 48px rgba(96,165,250,0.08)'
                  : isNearCursor
                    ? '0 0 8px rgba(96,165,250,0.2), 0 0 16px rgba(139,92,246,0.08)'
                    : 'none',
                transform: isLatest
                  ? 'translateY(-1.5px) scale(1.04)'
                  : 'translateY(0) scale(1)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {ch}
            </span>
          );
        })}
      </span>
      <span
        className="ml-[3px] inline-block w-[2px] align-middle"
        style={{
          height: '1.2em',
          background: 'linear-gradient(180deg, #60a5fa 0%, #a78bfa 35%, #818cf8 60%, #2dd4bf 85%, transparent 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 8px rgba(96,165,250,0.7), 0 0 18px rgba(167,139,250,0.4), 0 0 32px rgba(45,212,191,0.18), 0 0 48px rgba(96,165,250,0.06)',
          animation: isPaused ? 'cursor-blink-pause 1.2s ease-in-out infinite' : 'cursor-blink 1s step-end infinite',
        }}
      />
    </span>
  );
}

/* ── Floating ambient particles with premium multi-layer glow ── */
function AmbientParticles() {
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => {
      const colorSet = [
        'rgba(96,165,250,',    // blue-400
        'rgba(167,139,250,',   // violet-400
        'rgba(45,212,191,',    // teal-400
        'rgba(129,140,248,',   // indigo-400
        'rgba(192,132,252,',   // purple-400
      ];
      const color = colorSet[i % 5];
      const isLarge = i < 4;
      return {
        id: i,
        size: isLarge ? 3 + Math.random() * 5 : 1 + Math.random() * 3,
        x: 3 + Math.random() * 94,
        y: 8 + Math.random() * 75,
        duration: 18 + Math.random() * 16,
        delay: Math.random() * 10,
        drift: 5 + Math.random() * 18,
        color,
        isLarge,
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
            background: p.isLarge
              ? `radial-gradient(circle, ${p.color}0.5) 0%, ${p.color}0.2) 30%, ${p.color}0.06) 60%, transparent 80%)`
              : `radial-gradient(circle, ${p.color}0.45) 0%, ${p.color}0.1) 50%, transparent 75%)`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}0.15), 0 0 ${p.size * 6}px ${p.color}0.06)`,
          }}
          animate={{
            y: [-p.drift, p.drift, -p.drift],
            x: [-p.drift * 0.4, p.drift * 0.4, -p.drift * 0.4],
            opacity: p.isLarge ? [0.06, 0.28, 0.06] : [0.1, 0.35, 0.1],
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

/* ── Subtle orbit rings behind content for cosmic depth ── */
function OrbitRings() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Primary orbit ring — wide, tilted */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(900px, 120vw)',
          height: 'min(900px, 120vw)',
          borderRadius: '50%',
          border: '1px solid rgba(96,165,250,0.04)',
          boxShadow: '0 0 40px rgba(96,165,250,0.015), inset 0 0 40px rgba(96,165,250,0.01)',
          animation: 'orbit-ring-spin 60s linear infinite',
        }}
      />
      {/* Secondary orbit ring — smaller, offset color */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(620px, 85vw)',
          height: 'min(620px, 85vw)',
          borderRadius: '50%',
          border: '1px solid rgba(167,139,250,0.035)',
          boxShadow: '0 0 30px rgba(167,139,250,0.012), inset 0 0 30px rgba(167,139,250,0.008)',
          animation: 'orbit-ring-spin 45s linear infinite reverse',
        }}
      />
      {/* Tertiary ring — teal accent, faintest */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(400px, 55vw)',
          height: 'min(400px, 55vw)',
          borderRadius: '50%',
          border: '1px solid rgba(45,212,191,0.03)',
          animation: 'orbit-ring-spin 35s linear infinite',
        }}
      />
    </div>
  );
}

/* ── Premium light system with aurora borealis effect ── */
function LightBeams() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Aurora borealis - slow undulating color bands */}
      <motion.div
        className="absolute left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '180vw',
          height: '80vh',
          background:
            'conic-gradient(from 165deg at 50% 100%, transparent 0deg, rgba(96,165,250,0.022) 8deg, transparent 16deg, rgba(167,139,250,0.02) 24deg, transparent 36deg, rgba(45,212,191,0.018) 46deg, transparent 58deg, rgba(129,140,248,0.015) 68deg, transparent 80deg, transparent 280deg)',
        }}
        animate={{ rotate: [0, 4, -3, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Breathing central aura - warm core glow */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 1000,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(96,165,250,0.06) 0%, rgba(129,140,248,0.04) 20%, rgba(167,139,250,0.03) 40%, rgba(45,212,191,0.018) 60%, transparent 78%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.45, 0.9, 0.45],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Top-left cool accent */}
      <motion.div
        className="absolute left-[18%] top-0 h-[50%] w-[38%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(96,165,250,0.04) 0%, rgba(129,140,248,0.015) 40%, transparent 60%)',
        }}
        animate={{ opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom-right warm accent for chromatic balance */}
      <motion.div
        className="absolute bottom-0 right-[12%] h-[42%] w-[32%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(167,139,250,0.035) 0%, rgba(45,212,191,0.018) 40%, transparent 58%)',
        }}
        animate={{ opacity: [0.15, 0.45, 0.15] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle center-left warm accent for depth */}
      <motion.div
        className="absolute left-[5%] top-[55%] h-[35%] w-[25%]"
        style={{
          background:
            'radial-gradient(ellipse at 30% 70%, rgba(192,132,252,0.02) 0%, transparent 60%)',
        }}
        animate={{ opacity: [0.1, 0.35, 0.1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
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

/* ── Animated divider with premium traveling shimmer and aurora glow ── */
function AnimatedDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="my-5 flex items-center justify-center sm:my-6"
    >
      <div className="relative h-px w-56 sm:w-80 md:w-[28rem]">
        {/* Background line with aurora gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/15 to-transparent" />
        {/* Primary animated traveling highlight */}
        <motion.div
          className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-blue-400/35 to-transparent"
          animate={{ x: ['-7rem', '28rem'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary delayed shimmer - purple */}
        <motion.div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-violet-400/22 to-transparent"
          animate={{ x: ['-5rem', '28rem'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        />
        {/* Tertiary shimmer - teal, very subtle */}
        <motion.div
          className="absolute inset-y-0 w-14 bg-gradient-to-r from-transparent via-teal-400/15 to-transparent"
          animate={{ x: ['-3.5rem', '28rem'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 3.2 }}
        />
        {/* Center diamond with premium multi-layer glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px]"
          style={{
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #2dd4bf)',
            boxShadow: '0 0 6px rgba(96,165,250,0.70), 0 0 14px rgba(96,165,250,0.35), 0 0 28px rgba(167,139,250,0.20), 0 0 50px rgba(45,212,191,0.08)',
          }}
        />
        {/* Secondary dot accents - blue and teal */}
        <div
          className="absolute left-[12%] top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 rounded-sm"
          style={{
            background: 'rgba(96,165,250,0.35)',
            boxShadow: '0 0 4px rgba(96,165,250,0.2)',
          }}
        />
        <div
          className="absolute right-[12%] top-1/2 h-1 w-1 -translate-y-1/2 rotate-45 rounded-sm"
          style={{
            background: 'rgba(45,212,191,0.35)',
            boxShadow: '0 0 4px rgba(45,212,191,0.2)',
          }}
        />
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
  transition: { delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
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
        @keyframes cursor-blink-pause {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          30% { opacity: 0.15; transform: scaleY(0.85); }
          60% { opacity: 1; transform: scaleY(1); }
        }
        @keyframes hero-shimmer {
          0% { transform: translateX(-180%); }
          100% { transform: translateX(350%); }
        }
        @keyframes title-glow-breathe {
          0%, 100% {
            text-shadow:
              0 0 30px rgba(96,165,250,0.35),
              0 0 70px rgba(96,165,250,0.14),
              0 0 130px rgba(96,165,250,0.06),
              0 0 220px rgba(167,139,250,0.035),
              0 0 350px rgba(129,140,248,0.015),
              0 2px 4px rgba(0,0,0,0.85);
          }
          50% {
            text-shadow:
              0 0 40px rgba(96,165,250,0.5),
              0 0 90px rgba(96,165,250,0.2),
              0 0 160px rgba(129,140,248,0.1),
              0 0 260px rgba(167,139,250,0.06),
              0 0 400px rgba(45,212,191,0.025),
              0 2px 4px rgba(0,0,0,0.85);
          }
        }
        @keyframes orbit-ring-spin {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to { transform: rotateX(72deg) rotateZ(360deg); }
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
            opacity: 0.25;
          }
          50% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes scroll-ring-pulse-outer {
          0%, 100% {
            transform: scale(1);
            opacity: 0.12;
          }
          50% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        @keyframes scroll-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        @keyframes cta-border-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

      {/* Orbit rings for cosmic depth */}
      <OrbitRings />

      {/* Ambient particles */}
      <AmbientParticles />

      {/* Light beams behind text */}
      <LightBeams />

      {/* Dark overlay gradient for text readability - premium vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />

      {/* Premium noise/grain texture for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.015]"
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
          {/* ── Title: iridescent gradient with premium multi-layer glow ── */}
          <motion.h1
            {...fadeUp(0.15)}
            className="mb-3 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]"
            style={{
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              animation: 'title-glow-breathe 7s ease-in-out infinite',
            }}
          >
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #ffffff 0%, #eef2ff 8%, #dbe4ff 16%, #c7d2fe 22%, #a5b4fc 30%, #818cf8 38%, #93c5fd 44%, #a78bfa 50%, #c084fc 56%, #c4b5fd 62%, #bae6fd 70%, #99f6e4 78%, #bae6fd 85%, #e0e7ff 92%, #ffffff 100%)',
                backgroundSize: '500% 500%',
                animation: 'gradient-title-shift 14s ease infinite',
                filter: 'drop-shadow(0 0 50px rgba(96,165,250,0.10)) drop-shadow(0 0 100px rgba(167,139,250,0.05)) drop-shadow(0 0 150px rgba(45,212,191,0.02))',
              }}
            >
              {/* Shimmer sweep overlay - premium iridescent sweep */}
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
                  className="absolute inset-y-0 w-[55%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'hero-shimmer 6s ease-in-out infinite',
                    filter: 'blur(1.5px)',
                  }}
                />
              </span>
              {/* Secondary delayed shimmer for depth */}
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
                  className="absolute inset-y-0 w-[30%] bg-gradient-to-r from-transparent via-blue-300/18 to-transparent"
                  style={{
                    animation: 'hero-shimmer 9s ease-in-out infinite',
                    animationDelay: '3.5s',
                  }}
                />
              </span>
              {/* Tertiary teal shimmer for color richness */}
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
                  className="absolute inset-y-0 w-[25%] bg-gradient-to-r from-transparent via-teal-300/10 to-transparent"
                  style={{
                    animation: 'hero-shimmer 11s ease-in-out infinite',
                    animationDelay: '6s',
                  }}
                />
              </span>
              Hang&apos;s Portfolio
            </span>
          </motion.h1>

          {/* ── Animated divider ── */}
          <AnimatedDivider />

          {/* ── Subtitle with refined iridescent gradient and glow ── */}
          <motion.p
            {...fadeUp(0.45)}
            className="mb-8 bg-clip-text text-lg font-medium text-transparent sm:text-xl md:text-2xl"
            style={{
              letterSpacing: '0.08em',
              backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 22%, #a78bfa 40%, #c084fc 55%, #a78bfa 68%, #2dd4bf 82%, #60a5fa 100%)',
              backgroundSize: '250% 250%',
              animation: 'gradient-title-shift 9s ease infinite',
              filter: 'drop-shadow(0 0 14px rgba(96,165,250,0.18)) drop-shadow(0 0 40px rgba(167,139,250,0.08)) drop-shadow(0 0 70px rgba(45,212,191,0.04))',
            }}
          >
            全栈开发 · AI应用 · 大健康行业
          </motion.p>

          {/* ── Typewriter slogan ── */}
          <motion.div
            {...fadeUp(0.75)}
            className="mb-14 h-8 text-base tracking-wide sm:text-lg"
          >
            <AnimatePresence mode="wait">
              <TypewriterSlogan />
            </AnimatePresence>
          </motion.div>

          {/* ── CTA button: premium glass with expanding aurora glow ── */}
          <motion.div {...fadeUp(1.05)}>
            <motion.button
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={handleExplore}
              className="group relative cursor-pointer rounded-full px-14 py-5 text-base font-semibold text-white backdrop-blur-xl transition-all duration-700 sm:text-lg"
            >
              {/* Deep expanding aurora aura */}
              <span
                className="absolute -inset-7 rounded-full opacity-0 blur-2xl transition-all duration-1000 group-hover:opacity-55"
                style={{
                  background:
                    'radial-gradient(ellipse, rgba(96,165,250,0.14) 0%, rgba(167,139,250,0.10) 35%, rgba(45,212,191,0.08) 65%, transparent 85%)',
                }}
              />
              {/* Mid glow halo - breathing ambient */}
              <motion.span
                className="absolute -inset-3 rounded-full blur-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(96,165,250,0.18), rgba(167,139,250,0.14), rgba(45,212,191,0.1))',
                }}
                animate={{
                  opacity: [0.15, 0.35, 0.15],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Strong hover glow halo */}
              <span
                className="absolute -inset-2 rounded-full opacity-0 blur-lg transition-all duration-700 group-hover:opacity-75"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.22), rgba(45,212,191,0.18))',
                }}
              />
              {/* Animated gradient border - rotating conic sweep */}
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/45 via-violet-400/45 to-teal-400/40 opacity-35 transition-opacity duration-500 group-hover:opacity-90" />
                <motion.span
                  className="absolute inset-0"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(255,255,255,0.30) 60%, transparent 80%)',
                    animation: 'cta-border-spin 7s linear infinite',
                  }}
                />
                {/* Secondary conic sweep offset */}
                <motion.span
                  className="absolute inset-0"
                  style={{
                    background: 'conic-gradient(from 180deg, transparent 0%, transparent 50%, rgba(192,132,252,0.14) 70%, transparent 90%)',
                    animation: 'cta-border-spin 11s linear infinite reverse',
                  }}
                />
              </span>
              {/* Inner glass background with premium depth */}
              <span
                className="absolute inset-[1.5px] rounded-full transition-all duration-700"
                style={{
                  background: 'linear-gradient(180deg, rgba(8,12,35,0.92) 0%, rgba(4,8,24,0.95) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15)',
                }}
              />
              {/* Hover state inner highlight */}
              <span
                className="absolute inset-[1.5px] rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(180deg, rgba(96,165,250,0.10) 0%, rgba(8,14,38,0.90) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 35px rgba(96,165,250,0.06)',
                }}
              />
              {/* Button text with animated arrow */}
              <span className="relative z-10 flex items-center gap-3">
                <span className="transition-all duration-500 group-hover:tracking-[0.12em]">
                  探索项目宇宙
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-all duration-500 group-hover:translate-x-3"
                  style={{ opacity: 0.85 }}
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

      {/* ── Scroll indicator: premium mouse with aurora glow trail ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2.5"
        >
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.4em]"
            style={{
              color: 'rgba(255,255,255,0.15)',
              textShadow: '0 0 20px rgba(96,165,250,0.12)',
            }}
          >
            Scroll
          </span>
          {/* Mouse shape with premium glow */}
          <div className="relative flex h-10 w-[20px] items-start justify-center rounded-full border border-white/10 p-1.5">
            {/* Outer pulsing ring - large aurora ring */}
            <span
              className="absolute -inset-3 rounded-full"
              style={{
                border: '1px solid rgba(96,165,250,0.06)',
                animation: 'scroll-ring-pulse-outer 4.5s ease-in-out infinite',
              }}
            />
            {/* Inner pulsing ring */}
            <span
              className="absolute -inset-2 rounded-full"
              style={{
                border: '1px solid rgba(167,139,250,0.08)',
                animation: 'scroll-ring-pulse 3s ease-in-out infinite',
              }}
            />
            {/* Static ambient glow ring */}
            <span
              className="absolute -inset-1 rounded-full opacity-20"
              style={{
                border: '1px solid rgba(96,165,250,0.08)',
                boxShadow: '0 0 6px rgba(96,165,250,0.04), 0 0 14px rgba(167,139,250,0.02)',
              }}
            />
            {/* Scrolling dot with trailing glow */}
            <motion.div
              className="relative h-1 w-0.5 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #60a5fa, #a78bfa)',
                boxShadow: '0 0 4px rgba(96,165,250,0.5), 0 0 10px rgba(167,139,250,0.25)',
              }}
              animate={{ y: [0, 14, 0], opacity: [1, 0.15, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Dot glow trail */}
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 h-2.5 w-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(96,165,250,0.30), transparent)',
                  top: '-6px',
                }}
                animate={{ opacity: [0, 0.45, 0], scaleY: [0.5, 1, 0.5] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
          {/* Down chevron with premium fade */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            style={{ opacity: 0.12, animation: 'scroll-float 4s ease-in-out infinite' }}
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

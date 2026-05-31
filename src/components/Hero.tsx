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
          timer = setTimeout(tick, 80 + Math.random() * 40);
        } else {
          s.isDeleting = true;
          timer = setTimeout(tick, 3200);
        }
      } else {
        if (s.displayText.length > 0) {
          s.displayText = s.displayText.slice(0, -1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 28);
        } else {
          s.isDeleting = false;
          s.sloganIndex = (s.sloganIndex + 1) % SLOGANS.length;
          timer = setTimeout(tick, 500);
        }
      }
    };

    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="inline-flex min-h-[1.5em] items-center">
      <span className="text-white/60">
        {renderText.split('').map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            className="inline-block transition-all duration-300"
            style={{
              opacity: i <= charIndex ? 1 : 0,
              color: i === charIndex && charIndex > 0
                ? 'rgba(147, 197, 253, 0.9)'
                : undefined,
              textShadow: i === charIndex && charIndex > 0
                ? '0 0 12px rgba(33,150,255,0.4), 0 0 24px rgba(139,92,246,0.15)'
                : 'none',
              transform: i === charIndex ? 'translateY(-1px)' : 'translateY(0)',
            }}
          >
            {ch}
          </span>
        ))}
      </span>
      <span
        className="ml-[3px] inline-block w-[2px] align-middle"
        style={{
          height: '1.15em',
          background: 'linear-gradient(180deg, #60a5fa 0%, #a78bfa 40%, #818cf8 70%, #2dd4bf 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 6px rgba(96,165,250,0.6), 0 0 14px rgba(167,139,250,0.35), 0 0 28px rgba(45,212,191,0.15), 0 0 40px rgba(96,165,250,0.08)',
          animation: 'cursor-blink 1s step-end infinite',
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
            boxShadow: '0 0 5px rgba(96,165,250,0.65), 0 0 12px rgba(96,165,250,0.3), 0 0 24px rgba(167,139,250,0.18), 0 0 45px rgba(45,212,191,0.08)',
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
          50% { transform: translateY(7px); }
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
            className="mb-2 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]"
            style={{
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              animation: 'title-glow-breathe 7s ease-in-out infinite',
            }}
          >
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #ffffff 0%, #e0e7ff 10%, #c7d2fe 18%, #a5b4fc 26%, #818cf8 36%, #93c5fd 44%, #a78bfa 52%, #c084fc 60%, #c4b5fd 68%, #bae6fd 76%, #e0e7ff 86%, #ffffff 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradient-title-shift 12s ease infinite',
                filter: 'drop-shadow(0 0 40px rgba(96,165,250,0.08)) drop-shadow(0 0 80px rgba(167,139,250,0.04))',
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
                  className="absolute inset-y-0 w-[60%] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  style={{
                    animation: 'hero-shimmer 7s ease-in-out infinite',
                    filter: 'blur(1px)',
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
                  className="absolute inset-y-0 w-[35%] bg-gradient-to-r from-transparent via-blue-300/15 to-transparent"
                  style={{
                    animation: 'hero-shimmer 9s ease-in-out infinite',
                    animationDelay: '3s',
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
              letterSpacing: '0.07em',
              backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 30%, #a78bfa 55%, #2dd4bf 80%, #60a5fa 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-title-shift 8s ease infinite',
              filter: 'drop-shadow(0 0 12px rgba(96,165,250,0.15)) drop-shadow(0 0 35px rgba(167,139,250,0.07)) drop-shadow(0 0 60px rgba(45,212,191,0.03))',
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
              className="group relative cursor-pointer rounded-full px-14 py-4.5 text-base font-semibold text-white backdrop-blur-xl transition-all duration-600 sm:text-lg"
            >
              {/* Deep expanding aurora aura */}
              <span
                className="absolute -inset-6 rounded-full opacity-0 blur-2xl transition-all duration-800 group-hover:opacity-50"
                style={{
                  background:
                    'radial-gradient(ellipse, rgba(96,165,250,0.12) 0%, rgba(167,139,250,0.1) 35%, rgba(45,212,191,0.08) 65%, transparent 85%)',
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
                className="absolute -inset-2 rounded-full opacity-0 blur-lg transition-all duration-700 group-hover:opacity-70"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.22), rgba(45,212,191,0.18))',
                }}
              />
              {/* Animated gradient border - rotating conic sweep */}
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/45 via-violet-400/45 to-teal-400/40 opacity-35 transition-opacity duration-500 group-hover:opacity-85" />
                <motion.span
                  className="absolute inset-0"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, transparent 45%, rgba(255,255,255,0.28) 65%, transparent 85%)',
                    animation: 'cta-border-spin 8s linear infinite',
                  }}
                />
                {/* Secondary conic sweep offset */}
                <motion.span
                  className="absolute inset-0"
                  style={{
                    background: 'conic-gradient(from 180deg, transparent 0%, transparent 55%, rgba(192,132,252,0.12) 72%, transparent 90%)',
                    animation: 'cta-border-spin 12s linear infinite reverse',
                  }}
                />
              </span>
              {/* Inner glass background with premium depth */}
              <span
                className="absolute inset-[1.5px] rounded-full transition-all duration-600"
                style={{
                  background: 'linear-gradient(180deg, rgba(8,12,35,0.9) 0%, rgba(4,8,24,0.94) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.12)',
                }}
              />
              {/* Hover state inner highlight */}
              <span
                className="absolute inset-[1.5px] rounded-full opacity-0 transition-opacity duration-600 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(180deg, rgba(96,165,250,0.08) 0%, rgba(8,14,38,0.88) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 30px rgba(96,165,250,0.05)',
                }}
              />
              {/* Button text with animated arrow */}
              <span className="relative z-10 flex items-center gap-3">
                <span className="transition-all duration-400 group-hover:tracking-widest">
                  探索项目宇宙
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-all duration-500 group-hover:translate-x-2.5"
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
        transition={{ delay: 3.4, duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span
            className="text-[10px] font-medium uppercase tracking-[0.35em]"
            style={{
              color: 'rgba(255,255,255,0.18)',
              textShadow: '0 0 20px rgba(96,165,250,0.15)',
            }}
          >
            Scroll
          </span>
          {/* Mouse shape with premium glow */}
          <div className="relative flex h-12 w-[22px] items-start justify-center rounded-full border border-white/12 p-1.5">
            {/* Outer pulsing ring - large aurora ring */}
            <span
              className="absolute -inset-3 rounded-full"
              style={{
                border: '1px solid rgba(96,165,250,0.08)',
                animation: 'scroll-ring-pulse-outer 4s ease-in-out infinite',
              }}
            />
            {/* Inner pulsing ring */}
            <span
              className="absolute -inset-2 rounded-full"
              style={{
                border: '1px solid rgba(167,139,250,0.1)',
                animation: 'scroll-ring-pulse 3s ease-in-out infinite',
              }}
            />
            {/* Static ambient glow ring */}
            <span
              className="absolute -inset-1 rounded-full opacity-25"
              style={{
                border: '1px solid rgba(96,165,250,0.1)',
                boxShadow: '0 0 8px rgba(96,165,250,0.06), 0 0 16px rgba(167,139,250,0.03), 0 0 28px rgba(45,212,191,0.02)',
              }}
            />
            {/* Scrolling dot with trailing glow */}
            <motion.div
              className="relative h-1 w-1 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #60a5fa, #a78bfa)',
                boxShadow: '0 0 5px rgba(96,165,250,0.5), 0 0 12px rgba(167,139,250,0.25), 0 0 22px rgba(45,212,191,0.1)',
              }}
              animate={{ y: [0, 16, 0], opacity: [1, 0.12, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Dot glow trail */}
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 h-3 w-[3px] rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(96,165,250,0.35), transparent)',
                  top: '-8px',
                }}
                animate={{ opacity: [0, 0.5, 0], scaleY: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
          {/* Down chevron with premium fade */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="opacity-12"
            style={{ animation: 'scroll-float 3.5s ease-in-out infinite' }}
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

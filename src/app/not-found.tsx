'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, type Variants, type Transition } from 'framer-motion';
import usePrefersReducedMotion from '@/components/usePrefersReducedMotion';

const EASE_SPRING_OUT: [number, number, number, number] = [0.18, 1, 0.25, 1];

const STAR_PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const n = i + 1;
  return {
    id: i,
    x: 5 + ((n * 37) % 90),
    y: 5 + ((n * 53) % 90),
    size: 1 + ((n * 19) % 20) / 10,
    duration: 8 + ((n * 29) % 120) / 10,
    delay: ((n * 17) % 40) / 10,
    drift: 6 + ((n * 31) % 140) / 10,
    opacity: 0.1 + ((n * 23) % 20) / 100,
  };
});

const CONSTELLATION_LINES = Array.from({ length: 6 }, (_, i) => {
  const n = i + 1;
  return {
    id: i,
    x1: 10 + ((n * 41) % 80),
    y1: 10 + ((n * 59) % 80),
    x2: 10 + ((n * 67) % 80),
    y2: 10 + ((n * 73) % 80),
    delay: ((n * 11) % 30) / 10,
  };
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE_SPRING_OUT } as Transition,
  },
};

/* ── Glitch digit with chromatic aberration burst ── */
function GlitchDigit({ digit, delay = 0 }: { digit: string; delay?: number }) {
  return (
    <motion.span
      className="inline-block"
      animate={{
        textShadow: [
          '2px 0 rgba(45,140,240,0.5), -2px 0 rgba(139,92,246,0.5), 0 0 20px rgba(139,92,246,0.15)',
          '-1px 0 rgba(45,140,240,0.4), 1px 0 rgba(139,92,246,0.4), 0 0 8px rgba(45,140,240,0.1)',
          '0 0 0 transparent, 0 0 0 transparent, 0 0 30px rgba(139,92,246,0.08)',
          '1px 0 rgba(45,140,240,0.4), -1px 0 rgba(139,92,246,0.4), 0 0 12px rgba(45,140,240,0.1)',
          '0 0 0 transparent, 0 0 0 transparent, 0 0 0 transparent',
        ],
      }}
      transition={{
        duration: 4.5,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {digit}
    </motion.span>
  );
}

/* ── Scanning line with wider glow trail ── */
function ScanningLine({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(45,140,240,0.25) 15%, rgba(139,92,246,0.45) 40%, rgba(139,92,246,0.5) 50%, rgba(20,184,166,0.35) 65%, rgba(45,140,240,0.2) 85%, transparent 100%)',
        boxShadow:
          '0 0 12px 2px rgba(45,140,240,0.12), 0 0 32px 4px rgba(139,92,246,0.06), 0 0 60px 8px rgba(20,184,166,0.03)',
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

/* ── Ambient floating orb with smooth breathing ── */
function FloatingOrb({
  x,
  y,
  size,
  color,
  delay,
  duration = 5,
  reduced,
}: {
  x: string;
  y: string;
  size: number;
  color: string;
  delay: number;
  duration?: number;
  reduced: boolean;
}) {
  if (reduced) {
    return (
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: x,
          top: y,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          opacity: 0.15,
        }}
      />
    );
  }
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, -24, 0],
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.12, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ── Star particles with depth-based parallax drift ── */
function StarParticles({ reduced }: { reduced: boolean }) {
  if (reduced) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {STAR_PARTICLES.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            background: 'rgba(255,255,255,0.8)',
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.2), 0 0 ${s.size * 4}px rgba(139,92,246,0.05)`,
          }}
          animate={{
            y: [-s.drift, s.drift, -s.drift],
            x: [-s.drift * 0.25, s.drift * 0.25, -s.drift * 0.25],
            opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated coordinate readout ── */
function CoordinateReadout() {
  const [coords, setCoords] = useState({ x: '---', y: '---', z: '---' });

  useEffect(() => {
    let frame: number;
    const tick = () => {
      const t = Date.now() * 0.001;
      setCoords({
        x: (Math.sin(t * 0.7) * 12.4).toFixed(2),
        y: (Math.cos(t * 0.5) * 8.7).toFixed(2),
        z: (Math.sin(t * 0.3) * -3.2).toFixed(2),
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.p
      className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-white/[0.12] font-mono tracking-wider"
      variants={itemVariants}
    >
      COORDINATES &middot; X:{coords.x} Y:{coords.y} Z:{coords.z}
    </motion.p>
  );
}

/* ── Constellation line pattern for extra depth ── */
function ConstellationLines({ reduced }: { reduced: boolean }) {
  if (reduced) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.05 }}
    >
      {CONSTELLATION_LINES.map((l) => (
        <motion.line
          key={l.id}
          x1={`${l.x1}%`}
          y1={`${l.y1}%`}
          x2={`${l.x2}%`}
          y2={`${l.y2}%`}
          stroke="url(#constellation-gradient)"
          strokeWidth={0.5}
          strokeDasharray="4 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.7, 0.3] }}
          transition={{
            duration: 3,
            delay: l.delay + 0.8,
            ease: 'easeOut',
          }}
        />
      ))}
      <defs>
        <linearGradient id="constellation-gradient">
          <stop offset="0%" stopColor="rgba(45,140,240,0.6)" />
          <stop offset="50%" stopColor="rgba(139,92,246,0.8)" />
          <stop offset="100%" stopColor="rgba(20,184,166,0.6)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Mouse parallax hook ── */
function useMouseParallax(intensity: number = 0.02) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setOffset({
        x: (e.clientX - cx) * intensity,
        y: (e.clientY - cy) * intensity,
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [intensity]);

  return offset;
}

/* ── Radial glow behind 404 text ── */
function BackgroundGlow() {
  const parallax = useMouseParallax(0.015);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ x: parallax.x, y: parallax.y }}
    >
      {/* Primary purple-blue glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.07]"
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(45,140,240,0.15) 35%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Secondary teal glow offset */}
      <div
        className="absolute top-[40%] left-[55%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
      />
    </motion.div>
  );
}

export default function NotFound() {
  const reduced = usePrefersReducedMotion();
  const router = useRouter();

  /* Keyboard navigation: Backspace or H to go home */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Backspace' || e.key === 'h' || e.key === 'H') {
      if (e.key === 'h' || e.key === 'H') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      }
      e.preventDefault();
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] sm:min-h-[80vh] md:min-h-[85vh] bg-bg-primary overflow-hidden px-5 sm:px-6 md:px-8">
      {/* Dot-grid background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 10%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Radial background glow with parallax */}
      <BackgroundGlow />

      {/* Constellation lines for depth */}
      <ConstellationLines reduced={reduced} />

      {/* Ambient orbs — positioned for mobile-first, using CSS custom property colors */}
      <FloatingOrb x="10%" y="15%" size={80} color="rgba(45,140,240,0.12)" delay={0} reduced={reduced} />
      <FloatingOrb x="80%" y="20%" size={60} color="rgba(139,92,246,0.12)" delay={1} reduced={reduced} />
      <FloatingOrb x="25%" y="75%" size={70} color="rgba(20,184,166,0.10)" delay={0.5} reduced={reduced} />
      <FloatingOrb x="70%" y="70%" size={90} color="rgba(45,140,240,0.08)" delay={1.5} reduced={reduced} />
      <FloatingOrb x="50%" y="40%" size={100} color="rgba(139,92,246,0.06)" delay={2} duration={7} reduced={reduced} />
      <FloatingOrb x="85%" y="55%" size={50} color="rgba(20,184,166,0.08)" delay={0.8} duration={6} reduced={reduced} />

      {/* Star particles */}
      <StarParticles reduced={reduced} />

      {/* Scanning line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <ScanningLine reduced={reduced} />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number — enhanced glow with multi-layer drop-shadow, responsive sizing */}
        <motion.div
          className="text-[6rem] leading-none tracking-tighter select-none sm:text-[9rem] md:text-[11rem] lg:text-[13rem]"
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 30%, #c084fc 50%, #14b8a6 75%, #60a5fa 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: !reduced ? 'gradient-shift 6s ease infinite' : undefined,
            filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.2)) drop-shadow(0 0 60px rgba(45,140,240,0.08))',
          }}
          variants={itemVariants}
        >
          <GlitchDigit digit="4" delay={0} />
          <GlitchDigit digit="0" delay={0.3} />
          <GlitchDigit digit="4" delay={0.6} />
        </motion.div>

        {/* Decorative line — wider with richer gradient */}
        <motion.div
          className="mx-auto mt-3 mb-4 h-px w-24 sm:mt-4 sm:mb-5 sm:w-36"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(45,140,240,0.4) 15%, rgba(139,92,246,0.5) 35%, rgba(20,184,166,0.5) 65%, rgba(45,140,240,0.4) 85%, transparent 100%)',
            boxShadow: '0 0 12px rgba(139,92,246,0.15), 0 0 24px rgba(45,140,240,0.06)',
          }}
          variants={itemVariants}
        />

        {/* Title */}
        <motion.h1
          className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-2 sm:mb-3"
          variants={itemVariants}
        >
          Lost in Space
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-text-secondary text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-sm mx-auto"
          variants={itemVariants}
        >
          The page you are looking for has drifted beyond the stars.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Let&apos;s navigate you back to known space.
        </motion.p>

        {/* Actions — enhanced CTA buttons with glow, larger touch targets on mobile */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          variants={itemVariants}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto
              px-7 py-3.5 sm:px-6 sm:py-3 rounded-xl text-sm font-medium
              bg-glow/20 text-white border border-glow/30
              hover:bg-glow/30 hover:border-glow/50 hover:scale-[1.03] active:scale-[0.98]
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{
              boxShadow:
                '0 0 20px rgba(45,140,240,0.10), 0 0 40px rgba(139,92,246,0.05), 0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {/* Animated glow background on hover */}
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)',
              }}
            />
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="relative z-10">Return to Home</span>
          </Link>

          <Link
            href="/projects"
            className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto
              px-7 py-3.5 sm:px-6 sm:py-3 rounded-xl text-sm font-medium
              text-text-secondary border border-white/10
              hover:text-white hover:border-white/20 hover:bg-white/5 hover:scale-[1.03] active:scale-[0.98]
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
            Browse Projects
          </Link>
        </motion.div>

        {/* Animated coordinate readout */}
        <CoordinateReadout />

        {/* Error code hint with keyboard shortcut */}
        <motion.div
          className="mt-3 flex flex-col items-center gap-1.5"
          variants={itemVariants}
        >
          <p className="text-[10px] sm:text-xs text-white/[0.12] font-mono">
            ERROR_CODE: 404 &middot; PAGE_NOT_FOUND
          </p>
          <p className="text-[10px] sm:text-xs text-white/[0.08] font-mono hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-white/[0.15] text-[9px]">Backspace</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-white/[0.15] text-[9px]">H</kbd> to go home
          </p>
        </motion.div>
      </motion.div>

      {/* Top and bottom gradient fades — taller for smoother blend */}
      <div
        className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-bg-primary to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

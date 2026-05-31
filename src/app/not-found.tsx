'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function GlitchDigit({ digit }: { digit: string }) {
  return (
    <motion.span
      className="inline-block"
      animate={{
        textShadow: [
          '2px 0 #2196ff, -2px 0 #8b5cf6',
          '-1px 0 #2196ff, 1px 0 #8b5cf6',
          '0 0 0 transparent',
          '1px 0 #2196ff, -1px 0 #8b5cf6',
          '0 0 0 transparent',
        ],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {digit}
    </motion.span>
  );
}

function ScanningLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(33,150,255,0.3) 20%, rgba(139,92,246,0.5) 50%, rgba(33,150,255,0.3) 80%, transparent 100%)',
        boxShadow: '0 0 16px 3px rgba(33,150,255,0.1)',
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

function FloatingOrb({
  x,
  y,
  size,
  color,
  delay,
  duration = 5,
}: {
  x: string;
  y: string;
  size: number;
  color: string;
  delay: number;
  duration?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.12, 0.35, 0.12],
        scale: [1, 1.1, 1],
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

/* ── Tiny drifting star particles ── */
function StarParticles() {
  const stars = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 90,
    size: 1 + Math.random() * 2,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 4,
    drift: 6 + Math.random() * 14,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            background: 'rgba(255,255,255,0.8)',
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
      className="mt-8 sm:mt-10 text-[10px] sm:text-xs text-white/15 font-mono tracking-wider"
      variants={itemVariants}
    >
      COORDINATES &middot; X:{coords.x} Y:{coords.y} Z:{coords.z}
    </motion.p>
  );
}

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-bg-primary overflow-hidden px-4 sm:px-6">
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

      {/* Ambient orbs */}
      <FloatingOrb x="10%" y="15%" size={80} color="rgba(33,150,255,0.12)" delay={0} />
      <FloatingOrb x="80%" y="20%" size={60} color="rgba(139,92,246,0.12)" delay={1} />
      <FloatingOrb x="25%" y="75%" size={70} color="rgba(20,184,166,0.10)" delay={0.5} />
      <FloatingOrb x="70%" y="70%" size={90} color="rgba(33,150,255,0.08)" delay={1.5} />
      <FloatingOrb x="50%" y="40%" size={100} color="rgba(139,92,246,0.06)" delay={2} duration={7} />
      <FloatingOrb x="85%" y="55%" size={50} color="rgba(20,184,166,0.08)" delay={0.8} duration={6} />

      {/* Star particles */}
      <StarParticles />

      {/* Scanning line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <ScanningLine />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div
          className="text-[6rem] sm:text-[9rem] md:text-[11rem] lg:text-[13rem] font-bold leading-none tracking-tighter select-none"
          style={{
            background: 'linear-gradient(135deg, #2196ff 0%, #8b5cf6 40%, #06b6d4 70%, #2196ff 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient-shift 6s ease infinite',
            filter: 'drop-shadow(0 0 40px rgba(33,150,255,0.15))',
          }}
          variants={itemVariants}
        >
          <GlitchDigit digit="4" />
          <GlitchDigit digit="0" />
          <GlitchDigit digit="4" />
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="mx-auto mt-4 mb-5 sm:mb-6 h-px w-24 sm:w-32"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(33,150,255,0.5) 30%, rgba(139,92,246,0.5) 50%, rgba(20,184,166,0.5) 70%, transparent 100%)',
          }}
          variants={itemVariants}
        />

        {/* Title */}
        <motion.h1
          className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-3"
          variants={itemVariants}
        >
          Lost in Space
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-text-secondary text-sm sm:text-base md:text-lg mb-8 sm:mb-10 leading-relaxed max-w-sm mx-auto"
          variants={itemVariants}
        >
          The page you are looking for has drifted beyond the stars.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Let&apos;s navigate you back to known space.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          variants={itemVariants}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
              bg-glow/20 text-white border border-glow/30
              hover:bg-glow/30 hover:border-glow/50 hover:scale-[1.03] active:scale-[0.98]
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{ boxShadow: '0 0 20px rgba(33, 150, 255, 0.10)' }}
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
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
            Return to Home
          </Link>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
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

        {/* Error code hint */}
        <motion.p
          className="mt-3 text-[10px] sm:text-xs text-white/15 font-mono"
          variants={itemVariants}
        >
          ERROR_CODE: 404 &middot; PAGE_NOT_FOUND
        </motion.p>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

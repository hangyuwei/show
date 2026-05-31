'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
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
          'linear-gradient(90deg, transparent 0%, rgba(33,150,255,0.4) 30%, rgba(139,92,246,0.6) 50%, rgba(33,150,255,0.4) 70%, transparent 100%)',
        boxShadow: '0 0 12px 2px rgba(33,150,255,0.15)',
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{
        duration: 4,
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
}: {
  x: string;
  y: string;
  size: number;
  color: string;
  delay: number;
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
        opacity: [0.15, 0.4, 0.15],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] bg-bg-primary overflow-hidden px-4">
      {/* Ambient orbs */}
      <FloatingOrb x="10%" y="15%" size={80} color="rgba(33,150,255,0.15)" delay={0} />
      <FloatingOrb x="80%" y="20%" size={60} color="rgba(139,92,246,0.15)" delay={1} />
      <FloatingOrb x="25%" y="75%" size={70} color="rgba(20,184,166,0.12)" delay={0.5} />
      <FloatingOrb x="70%" y="70%" size={90} color="rgba(33,150,255,0.1)" delay={1.5} />
      <FloatingOrb x="50%" y="40%" size={100} color="rgba(139,92,246,0.08)" delay={2} />

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
          className="text-[7rem] sm:text-[9rem] md:text-[11rem] font-bold leading-none tracking-tighter select-none"
          style={{
            background: 'linear-gradient(135deg, #2196ff 0%, #8b5cf6 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          variants={itemVariants}
        >
          <GlitchDigit digit="4" />
          <GlitchDigit digit="0" />
          <GlitchDigit digit="4" />
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="mx-auto mt-4 mb-6 h-px w-24 sm:w-32"
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
          className="text-text-secondary text-sm sm:text-base md:text-lg mb-10 leading-relaxed max-w-sm mx-auto"
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
              bg-glow/20 text-white border border-glow/30
              hover:bg-glow/30 hover:border-glow/50 transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{ boxShadow: '0 0 20px rgba(33, 150, 255, 0.12)' }}
          >
            <svg
              className="w-4 h-4"
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
              text-text-secondary border border-white/10
              hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <svg
              className="w-4 h-4"
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

        {/* Error code hint */}
        <motion.p
          className="mt-10 text-xs text-white/20 font-mono"
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

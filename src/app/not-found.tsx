'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function FloatingParticle({ delay, x, y, size, duration }: {
  delay: number;
  x: string;
  y: string;
  size: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-glow/30"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.2, 1],
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

function SpaceParticleField() {
  const particles = [
    { delay: 0, x: '10%', y: '20%', size: 4, duration: 4 },
    { delay: 0.5, x: '25%', y: '60%', size: 3, duration: 5 },
    { delay: 1, x: '40%', y: '30%', size: 5, duration: 3.5 },
    { delay: 1.5, x: '55%', y: '70%', size: 3, duration: 4.5 },
    { delay: 0.3, x: '70%', y: '25%', size: 4, duration: 5.5 },
    { delay: 0.8, x: '85%', y: '55%', size: 3, duration: 4 },
    { delay: 1.2, x: '15%', y: '80%', size: 5, duration: 3 },
    { delay: 0.6, x: '50%', y: '45%', size: 6, duration: 6 },
    { delay: 1.8, x: '75%', y: '85%', size: 3, duration: 4.5 },
    { delay: 0.2, x: '35%', y: '10%', size: 4, duration: 5 },
    { delay: 1.4, x: '90%', y: '40%', size: 3, duration: 3.5 },
    { delay: 0.9, x: '5%', y: '50%', size: 5, duration: 4 },
    { delay: 1.6, x: '60%', y: '15%', size: 4, duration: 5.5 },
    { delay: 0.4, x: '80%', y: '70%', size: 3, duration: 4 },
    { delay: 1.1, x: '45%', y: '90%', size: 4, duration: 3.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-bg-primary overflow-hidden px-4">
      {/* Particle field */}
      <SpaceParticleField />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* 404 Number */}
        <motion.div
          className="text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-text-primary mt-4 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Lost in Space
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-text-secondary text-base sm:text-lg mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          The page you are looking for has drifted beyond the stars.
          <br />
          Let&apos;s navigate you back to known space.
        </motion.p>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
              bg-glow/20 text-white border border-glow/30
              hover:bg-glow/30 hover:border-glow/50 transition-all duration-300"
            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom stars decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" aria-hidden="true" />
    </div>
  );
}

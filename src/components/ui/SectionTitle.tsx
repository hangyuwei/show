'use client';

import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  label?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({
  title,
  subtitle,
  label,
  align = 'left',
}: SectionTitleProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <motion.div
      className={`flex flex-col gap-4 ${alignment}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Optional label — small tracked-out uppercase tag with glow dot */}
      {label && (
        <motion.span
          className="text-overline inline-flex items-center gap-2.5"
          style={{ color: 'rgba(20, 184, 166, 0.65)' }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.span
            className="inline-block h-[5px] w-[5px] rounded-full"
            style={{
              background: 'linear-gradient(135deg, #14b8a6, #2d8cf0)',
              boxShadow: '0 0 6px rgba(20, 184, 166, 0.5), 0 0 14px rgba(20, 184, 166, 0.2)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="inline-block h-px w-6 bg-gradient-to-r from-accent-teal/50 to-transparent" />
          {label}
        </motion.span>
      )}

      {/* Decorative accent bar — 5-layer premium glow with animated shimmer */}
      <div className="relative h-[3px] w-28 overflow-hidden rounded-full">
        {/* Layer 1: Rich base gradient — wider color range */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />
        {/* Layer 2: Soft glow bloom — medium spread */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 blur-md opacity-60" />
        {/* Layer 3: Outer ambient glow — wide diffuse bloom */}
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500/25 via-violet-500/20 to-cyan-400/25 blur-xl opacity-40" />
        {/* Layer 4: Deep scatter — very wide faint halo */}
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-blue-500/10 via-violet-500/8 to-cyan-400/10 blur-2xl opacity-30" />
        {/* Shimmer sweep — wider, softer travel */}
        <motion.div
          className="absolute inset-y-0 w-16 rounded-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
          animate={{ x: ['-5rem', '8rem'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
        />
      </div>

      {/* Section heading — premium gradient text with cinematic depth */}
      <h2
        className="text-[2.25rem] tracking-[-0.022em] leading-[1.08] sm:text-[2.75rem] lg:text-[3.5rem]"
        style={{
          fontWeight: 900,
          background:
            'linear-gradient(135deg, #ffffff 0%, #f0f4ff 10%, #d4deff 22%, #b8c8fe 35%, #a5b4fc 45%, #93a3f8 52%, #a5b4fc 59%, #c4d0fe 70%, #e0e8ff 82%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter:
            'drop-shadow(0 0 1px rgba(255, 255, 255, 0.12)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 12px 28px rgba(99, 102, 241, 0.10))',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <motion.p
          className="max-w-2xl text-[0.9375rem] leading-[1.8] tracking-[0.003em] text-zinc-300/55 sm:text-[1.0625rem]"
          style={{ fontWeight: 300 }}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

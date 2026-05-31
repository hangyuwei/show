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
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Optional label — small tracked-out uppercase tag */}
      {label && (
        <motion.span
          className="text-caption text-accent-teal/60 inline-flex items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-block h-px w-5 bg-accent-teal/40" />
          {label}
        </motion.span>
      )}

      {/* Decorative accent bar — layered glow with animated shimmer */}
      <div className="relative h-[3px] w-24 overflow-hidden rounded-full">
        {/* Base gradient — wider with richer stops */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />
        {/* Soft glow bloom layer */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 blur-md opacity-60" />
        {/* Outer ambient glow — very soft bloom */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/30 via-violet-500/20 to-cyan-400/30 blur-xl opacity-40" />
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-y-0 w-14 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-4rem', '6rem'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3.5 }}
        />
      </div>

      {/* Section heading — premium gradient text with refined depth */}
      <h2
        className="text-[2.125rem] font-extrabold tracking-[-0.02em] leading-[1.1] sm:text-[2.625rem] lg:text-[3.375rem]"
        style={{
          background:
            'linear-gradient(135deg, #ffffff 0%, #eef2ff 15%, #c7d2fe 35%, #a5b4fc 50%, #c7d2fe 65%, #eef2ff 85%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter:
            'drop-shadow(0 0 1px rgba(255, 255, 255, 0.1)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5)) drop-shadow(0 6px 18px rgba(99, 102, 241, 0.12))',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <motion.p
          className="max-w-2xl text-[0.9375rem] font-light leading-[1.75] tracking-[0.005em] text-zinc-300/60 sm:text-[1rem]"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

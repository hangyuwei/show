'use client';

import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'left',
}: SectionTitleProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <motion.div
      className={`flex flex-col gap-3 ${alignment}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Decorative accent bar — layered glow with animated shimmer */}
      <div className="relative h-[3px] w-20 overflow-hidden rounded-full">
        {/* Base gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />
        {/* Soft glow layer */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 blur-md opacity-60" />
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-y-0 w-12 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-3rem', '5rem'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
        />
      </div>

      {/* Section heading — premium gradient text with depth shadow */}
      <h2
        className="text-[2rem] font-black tracking-[0.02em] leading-[1.15] sm:text-[2.5rem] lg:text-[3.25rem]"
        style={{
          background:
            'linear-gradient(135deg, #ffffff 0%, #e0e7ff 25%, #c7d2fe 45%, #a5b4fc 65%, #c7d2fe 85%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter:
            'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5)) drop-shadow(0 4px 12px rgba(99, 102, 241, 0.15))',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <motion.p
          className="max-w-2xl text-[0.9375rem] font-light leading-[1.7] tracking-[0.005em] text-zinc-300/70 sm:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

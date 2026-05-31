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
      className={`flex flex-col gap-4 ${alignment}`}
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

      {/* Section heading — gradient text with depth shadow */}
      <h2
        className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 40%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <motion.p
          className="max-w-2xl text-base leading-relaxed text-zinc-300/80 sm:text-lg"
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

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
      {/* Decorative glow line */}
      <div className="relative h-[2px] w-16 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-transparent blur-sm opacity-60" />
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <motion.p
          className="max-w-2xl text-base text-zinc-400 sm:text-lg"
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

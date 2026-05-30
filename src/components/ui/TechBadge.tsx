'use client';

import { motion } from 'framer-motion';

interface TechBadgeProps {
  name: string;
  color?: string;
}

export default function TechBadge({ name, color }: TechBadgeProps) {
  return (
    <motion.span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        bg-white/5 border border-white/10 backdrop-blur-sm
        text-zinc-300 whitespace-nowrap"
      style={
        color
          ? {
              borderColor: `${color}40`,
              boxShadow: `0 0 6px ${color}20`,
            }
          : undefined
      }
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {name}
    </motion.span>
  );
}

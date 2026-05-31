'use client';

import { motion } from 'framer-motion';

interface TechBadgeProps {
  name: string;
  color?: string;
  delay?: number;
}

export default function TechBadge({ name, color, delay = 0 }: TechBadgeProps) {
  const badgeColor = color || '#8b5cf6';

  return (
    <motion.span
      className="inline-flex items-center rounded-full px-2 py-[3px] text-[11px] font-medium tracking-wider uppercase
        backdrop-blur-sm whitespace-nowrap select-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        delay,
      }}
      style={{
        background: `linear-gradient(135deg, ${badgeColor}15, ${badgeColor}06)`,
        border: `1px solid ${badgeColor}22`,
        color: `${badgeColor}cc`,
        boxShadow: `0 0 1px ${badgeColor}15, 0 1px 2px rgba(0,0,0,0.15)`,
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
      }}
      whileHover={{
        scale: 1.1,
        borderColor: `${badgeColor}50`,
      }}
    >
      <span
        className="mr-1.5 inline-block h-[5px] w-[5px] rounded-full"
        style={{
          background: `linear-gradient(135deg, ${badgeColor}, ${badgeColor}aa)`,
          boxShadow: `0 0 5px ${badgeColor}50`,
        }}
      />
      {name}
    </motion.span>
  );
}

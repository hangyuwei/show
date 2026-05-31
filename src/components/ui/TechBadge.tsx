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
      className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-medium tracking-wider uppercase
        backdrop-blur-sm whitespace-nowrap select-none cursor-default"
      initial={{ opacity: 0, scale: 0.75, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 550,
        damping: 28,
        delay,
      }}
      style={{
        background: `linear-gradient(145deg, ${badgeColor}18, ${badgeColor}08 50%, ${badgeColor}04)`,
        border: `1px solid ${badgeColor}25`,
        color: `${badgeColor}dd`,
        boxShadow: `0 0 2px ${badgeColor}12, 0 1px 3px rgba(0,0,0,0.18), inset 0 1px 0 ${badgeColor}08`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
      }}
      whileHover={{
        scale: 1.12,
        boxShadow: `0 0 12px ${badgeColor}25, 0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 ${badgeColor}12`,
      }}
    >
      <span
        className="mr-1.5 inline-block h-[5px] w-[5px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${badgeColor}, ${badgeColor}90)`,
          boxShadow: `0 0 6px ${badgeColor}60, 0 0 2px ${badgeColor}40`,
        }}
      />
      {name}
    </motion.span>
  );
}

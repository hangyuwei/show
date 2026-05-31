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
      initial={{ opacity: 0, scale: 0.7, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 25,
        delay,
      }}
      style={{
        background: `linear-gradient(150deg, ${badgeColor}1c, ${badgeColor}08 50%, ${badgeColor}05)`,
        border: `1px solid ${badgeColor}28`,
        color: `${badgeColor}dd`,
        boxShadow: `0 0 3px ${badgeColor}14, 0 1px 4px rgba(0,0,0,0.20), inset 0 1px 0 ${badgeColor}0a`,
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease',
      }}
      whileHover={{
        scale: 1.15,
        boxShadow: `0 0 14px ${badgeColor}28, 0 2px 8px rgba(0,0,0,0.22), inset 0 1px 0 ${badgeColor}15`,
      }}
    >
      <span
        className="mr-1.5 inline-block h-[5px] w-[5px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${badgeColor}, ${badgeColor}90)`,
          boxShadow: `0 0 8px ${badgeColor}70, 0 0 3px ${badgeColor}50`,
        }}
      />
      {name}
    </motion.span>
  );
}

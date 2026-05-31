'use client';

import { motion } from 'framer-motion';

interface TechBadgeProps {
  name: string;
  color?: string;
}

export default function TechBadge({ name, color }: TechBadgeProps) {
  const badgeColor = color || '#8b5cf6';

  return (
    <motion.span
      className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-wide uppercase
        backdrop-blur-sm whitespace-nowrap transition-shadow duration-300"
      style={{
        background: `linear-gradient(135deg, ${badgeColor}18, ${badgeColor}08)`,
        border: `1px solid ${badgeColor}28`,
        color: `${badgeColor}dd`,
        boxShadow: `0 1px 3px ${badgeColor}10, 0 0 6px ${badgeColor}08`,
      }}
      whileHover={{
        scale: 1.08,
        boxShadow: `0 0 12px ${badgeColor}25, 0 0 4px ${badgeColor}15, 0 1px 3px ${badgeColor}15`,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span
        className="mr-1 inline-block h-1 w-1 rounded-full"
        style={{
          background: badgeColor,
          boxShadow: `0 0 4px ${badgeColor}60`,
        }}
      />
      {name}
    </motion.span>
  );
}

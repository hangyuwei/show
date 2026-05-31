'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TechBadgeProps {
  name: string;
  color?: string;
  delay?: number;
}

export default function TechBadge({ name, color, delay = 0 }: TechBadgeProps) {
  const badgeColor = color || '#8b5cf6';
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);

  return (
    <motion.span
      className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.04em] uppercase
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
        background: isBadgeHovered
          ? `linear-gradient(150deg, ${badgeColor}28, ${badgeColor}12 50%, ${badgeColor}0a)`
          : `linear-gradient(150deg, ${badgeColor}18, ${badgeColor}06 50%, ${badgeColor}04)`,
        border: `1px solid ${isBadgeHovered ? `${badgeColor}48` : `${badgeColor}22`}`,
        color: `${badgeColor}dd`,
        boxShadow: isBadgeHovered
          ? `0 0 14px ${badgeColor}28, 0 0 6px ${badgeColor}15, 0 2px 6px rgba(0,0,0,0.22), inset 0 1px 0 ${badgeColor}15, inset 0 0 10px ${badgeColor}06`
          : `0 0 3px ${badgeColor}10, 0 1px 3px rgba(0,0,0,0.18), inset 0 1px 0 ${badgeColor}08`,
        transition: 'border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.35s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease',
      }}
      whileHover={{ scale: 1.08, y: -1 }}
      onMouseEnter={() => setIsBadgeHovered(true)}
      onMouseLeave={() => setIsBadgeHovered(false)}
    >
      <span
        className="mr-1.5 inline-block h-[5px] w-[5px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${badgeColor}, ${badgeColor}80)`,
          boxShadow: isBadgeHovered
            ? `0 0 10px ${badgeColor}90, 0 0 4px ${badgeColor}60, 0 0 16px ${badgeColor}25`
            : `0 0 6px ${badgeColor}60, 0 0 2px ${badgeColor}40`,
          transition: 'box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
      {name}
    </motion.span>
  );
}

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
      className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-wider uppercase
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
          ? `linear-gradient(150deg, ${badgeColor}30, ${badgeColor}15 50%, ${badgeColor}0c)`
          : `linear-gradient(150deg, ${badgeColor}1c, ${badgeColor}08 50%, ${badgeColor}05)`,
        border: `1px solid ${isBadgeHovered ? `${badgeColor}50` : `${badgeColor}28`}`,
        color: `${badgeColor}ee`,
        boxShadow: isBadgeHovered
          ? `0 0 18px ${badgeColor}30, 0 0 8px ${badgeColor}18, 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 ${badgeColor}18, inset 0 0 12px ${badgeColor}08`
          : `0 0 4px ${badgeColor}14, 0 1px 4px rgba(0,0,0,0.20), inset 0 1px 0 ${badgeColor}0a`,
        transition: 'border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease',
      }}
      whileHover={{ scale: 1.12 }}
      onMouseEnter={() => setIsBadgeHovered(true)}
      onMouseLeave={() => setIsBadgeHovered(false)}
    >
      <span
        className="mr-1.5 inline-block h-[5px] w-[5px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${badgeColor}, ${badgeColor}90)`,
          boxShadow: isBadgeHovered
            ? `0 0 12px ${badgeColor}a0, 0 0 5px ${badgeColor}70, 0 0 20px ${badgeColor}30`
            : `0 0 8px ${badgeColor}70, 0 0 3px ${badgeColor}50`,
          transition: 'box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
      {name}
    </motion.span>
  );
}

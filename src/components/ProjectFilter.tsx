'use client';

import { motion } from 'framer-motion';
import type { BusinessLine } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';

export type FilterOption = '全部' | BusinessLine;

interface FilterItem {
  label: FilterOption;
  emoji: string;
}

const FILTERS: FilterItem[] = [
  { label: '全部', emoji: '🌌' },
  ...Object.entries(businessLineLabels).map(([key, val]) => ({
    label: key as BusinessLine,
    emoji: val.emoji,
  })),
];

interface ProjectFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export default function ProjectFilter({
  activeFilter,
  onFilterChange,
}: ProjectFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex gap-2 min-w-max px-1">
        {FILTERS.map((filter, filterIdx) => {
          const isActive = activeFilter === filter.label;
          const displayLabel =
            filter.label === '全部'
              ? '全部'
              : businessLineLabels[filter.label as BusinessLine]?.name ?? filter.label;

          // Get business line color for active glow
          const lineColor =
            filter.label === '全部'
              ? '#8b5cf6'
              : businessLineLabels[filter.label as BusinessLine]?.color ?? '#8b5cf6';

          return (
            <motion.button
              key={filter.label}
              onClick={() => onFilterChange(filter.label)}
              className={`
                relative flex items-center gap-2 whitespace-nowrap rounded-full
                px-5 py-2.5 text-sm font-medium tracking-wide
                border transition-all duration-500
                ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'bg-white/[0.015] text-zinc-500 border-white/[0.05] hover:bg-white/[0.06] hover:text-zinc-300 hover:border-white/[0.12]'
                }
              `}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${lineColor}25, ${lineColor}10 55%, ${lineColor}06)`,
                      borderColor: 'transparent',
                      boxShadow: `
                        0 0 40px ${lineColor}35,
                        0 0 16px ${lineColor}20,
                        0 0 6px ${lineColor}50,
                        0 2px 12px rgba(0,0,0,0.25),
                        inset 0 1px 0 ${lineColor}30,
                        inset 0 0 24px ${lineColor}0e`,
                    }
                  : undefined
              }
              whileTap={{ scale: 0.95 }}
              whileHover={!isActive ? {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.10)',
              } : {}}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.45,
                delay: filterIdx * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="text-base leading-none">{filter.emoji}</span>
              <span>{displayLabel}</span>

              {/* Active indicator pill with layered glow */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  layoutId="activeFilterGlow"
                  style={{
                    border: `1.5px solid ${lineColor}70`,
                    boxShadow: `
                      0 0 36px ${lineColor}40,
                      0 0 72px ${lineColor}18,
                      0 0 120px ${lineColor}08,
                      0 0 200px ${lineColor}03,
                      inset 0 0 18px ${lineColor}0e`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 26,
                  }}
                />
              )}

              {/* Active dot indicator with premium pulse */}
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${lineColor}, ${lineColor}cc)`,
                    boxShadow: `0 0 14px ${lineColor}c0, 0 0 6px ${lineColor}, 0 0 24px ${lineColor}40`,
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.75, 1],
                  }}
                  transition={{
                    scale: {
                      duration: 2.0,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    opacity: {
                      duration: 2.0,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    layout: {
                      type: 'spring',
                      stiffness: 480,
                      damping: 30,
                    },
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

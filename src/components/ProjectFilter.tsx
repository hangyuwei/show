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
                border transition-all duration-400
                ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'bg-white/[0.015] text-zinc-500 border-white/[0.05] hover:bg-white/[0.06] hover:text-zinc-300 hover:border-white/[0.10]'
                }
              `}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${lineColor}20, ${lineColor}0c 55%, ${lineColor}05)`,
                      borderColor: 'transparent',
                      boxShadow: `
                        0 0 32px ${lineColor}30,
                        0 0 12px ${lineColor}1c,
                        0 0 4px ${lineColor}45,
                        inset 0 1px 0 ${lineColor}28,
                        inset 0 0 20px ${lineColor}0c`,
                    }
                  : undefined
              }
              whileTap={{ scale: 0.95 }}
              whileHover={!isActive ? {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.10)',
              } : {}}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: filterIdx * 0.05,
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
                    border: `1.5px solid ${lineColor}60`,
                    boxShadow: `
                      0 0 28px ${lineColor}38,
                      0 0 56px ${lineColor}14,
                      0 0 96px ${lineColor}06,
                      inset 0 0 14px ${lineColor}0c`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                  }}
                />
              )}

              {/* Active dot indicator with pulse */}
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${lineColor}, ${lineColor}cc)`,
                    boxShadow: `0 0 10px ${lineColor}a0, 0 0 4px ${lineColor}`,
                  }}
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    scale: {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    opacity: {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    layout: {
                      type: 'spring',
                      stiffness: 500,
                      damping: 32,
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

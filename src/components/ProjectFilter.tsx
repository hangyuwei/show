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
      <div className="flex gap-2.5 min-w-max px-1">
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
                px-5 py-2.5 text-sm font-medium
                border transition-all duration-300
                ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'bg-white/[0.02] text-zinc-500 border-white/[0.06] hover:bg-white/[0.05] hover:text-zinc-300 hover:border-white/[0.1]'
                }
              `}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${lineColor}18, ${lineColor}08)`,
                      borderColor: 'transparent',
                      boxShadow: `
                        0 0 24px ${lineColor}25,
                        0 0 8px ${lineColor}15,
                        0 0 2px ${lineColor}35,
                        inset 0 1px 0 ${lineColor}20},
                        inset 0 0 12px ${lineColor}08`,
                    }
                  : undefined
              }
              whileTap={{ scale: 0.95 }}
              whileHover={!isActive ? {
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.1)',
              } : {}}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: filterIdx * 0.04,
                ease: [0.22, 0.61, 0.36, 1],
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
                    border: `1.5px solid ${lineColor}50`,
                    boxShadow: `
                      0 0 20px ${lineColor}30,
                      0 0 40px ${lineColor}10,
                      inset 0 0 10px ${lineColor}08`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              {/* Active dot indicator */}
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: lineColor,
                    boxShadow: `0 0 6px ${lineColor}80, 0 0 2px ${lineColor}`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
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

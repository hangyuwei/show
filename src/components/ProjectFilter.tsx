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
        {FILTERS.map((filter) => {
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
                relative flex items-center gap-1.5 whitespace-nowrap rounded-full
                px-4 py-2 text-sm font-medium transition-all duration-300
                border
                ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-300 hover:border-white/[0.12]'
                }
              `}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${lineColor}20, ${lineColor}10)`,
                      borderColor: `${lineColor}50`,
                      boxShadow: `0 0 20px ${lineColor}30, 0 0 8px ${lineColor}20, 0 0 2px ${lineColor}40, inset 0 1px 0 ${lineColor}25`,
                    }
                  : undefined
              }
              whileTap={{ scale: 0.96 }}
              layout
            >
              <span className="text-base">{filter.emoji}</span>
              <span>{displayLabel}</span>

              {/* Active glow indicator with enhanced glow */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  layoutId="activeFilterGlow"
                  style={{
                    border: `1.5px solid ${lineColor}60`,
                    boxShadow: `0 0 16px ${lineColor}35, 0 0 32px ${lineColor}12, inset 0 0 8px ${lineColor}10`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
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

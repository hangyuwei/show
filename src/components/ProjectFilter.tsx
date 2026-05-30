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

          return (
            <motion.button
              key={filter.label}
              onClick={() => onFilterChange(filter.label)}
              className={`
                relative flex items-center gap-1.5 whitespace-nowrap rounded-full
                px-4 py-2 text-sm font-medium transition-colors duration-200
                border
                ${
                  isActive
                    ? 'bg-violet-500/15 text-violet-300 border-violet-500/40'
                    : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-300'
                }
              `}
              whileTap={{ scale: 0.96 }}
              layout
            >
              <span className="text-base">{filter.emoji}</span>
              <span>{displayLabel}</span>

              {/* Active glow indicator */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-violet-400/30"
                  layoutId="activeFilterGlow"
                  style={{
                    boxShadow: '0 0 12px rgba(139, 92, 246, 0.2)',
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

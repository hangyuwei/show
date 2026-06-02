'use client';

import { motion } from 'framer-motion';
import type { BusinessLine } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';

export type FilterOption = '全部' | BusinessLine;

interface FilterItem {
  label: FilterOption;
}

const FILTERS: FilterItem[] = [
  { label: '全部' },
  ...Object.entries(businessLineLabels).map(([key]) => ({
    label: key as BusinessLine,
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
    <div className="w-full py-2">
      <div className="flex flex-wrap gap-2 px-1">
        {FILTERS.map((filter, filterIdx) => {
          const isActive = activeFilter === filter.label;
          const displayLabel =
            filter.label === '全部'
              ? '全部'
              : businessLineLabels[filter.label as BusinessLine]?.name ?? filter.label;

          const lineColor =
            filter.label === '全部'
              ? '#65d8ff'
              : businessLineLabels[filter.label as BusinessLine]?.color ?? '#65d8ff';
          const code =
            filter.label === '全部'
              ? 'ALL'
              : businessLineLabels[filter.label as BusinessLine]?.nameEn
                  .split(/\s|&/)
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 3)
                  .toUpperCase();

          return (
            <motion.button
              key={filter.label}
              onClick={() => onFilterChange(filter.label)}
              className={`
                relative flex items-center gap-2 whitespace-nowrap rounded-lg
                px-3.5 py-2 text-sm font-medium
                border transition-all duration-300
                ${
                  isActive
                    ? 'border-white/[0.16] bg-white/[0.08] text-white'
                    : 'bg-white/[0.02] text-white/46 border-white/[0.07] hover:bg-white/[0.055] hover:text-white/72 hover:border-white/[0.12]'
                }
              `}
              style={
                isActive
                  ? {
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px ${lineColor}18`,
                    }
                  : undefined
              }
              whileTap={{ scale: 0.95 }}
              whileHover={!isActive ? {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.10)',
              } : {}}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.90 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.35,
                delay: filterIdx * 0.035,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: isActive ? lineColor : undefined }}
              >
                {code}
              </span>
              <span>{displayLabel}</span>

              {isActive && (
                <motion.div
                  className="pointer-events-none absolute inset-x-2 -bottom-px h-px"
                  layoutId="activeFilterGlow"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${lineColor}, transparent)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
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

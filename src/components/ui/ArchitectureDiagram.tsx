'use client';

import { motion } from 'framer-motion';

interface ArchitectureItem {
  name: string;
  description: string;
  connections?: number[];
}

interface ArchitectureDiagramProps {
  items: ArchitectureItem[];
}

const ACCENT_COLORS = [
  'border-accent-blue',
  'border-accent-purple',
  'border-accent-orange',
  'border-accent-gold',
  'border-accent-teal',
  'border-accent-blue',
  'border-accent-purple',
  'border-accent-orange',
];

const GLOW_COLORS = [
  'rgba(6, 182, 212, 0.15)',
  'rgba(139, 92, 246, 0.15)',
  'rgba(249, 115, 22, 0.15)',
  'rgba(234, 179, 8, 0.15)',
  'rgba(20, 184, 166, 0.15)',
  'rgba(6, 182, 212, 0.15)',
  'rgba(139, 92, 246, 0.15)',
  'rgba(249, 115, 22, 0.15)',
];

function ArrowIcon() {
  return (
    <svg
      className="w-6 h-6 text-text-secondary flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      className="w-6 h-6 text-text-secondary flex-shrink-0 rotate-90"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function ArchitectureDiagram({ items }: ArchitectureDiagramProps) {
  return (
    <div className="w-full rounded-2xl bg-bg-secondary/60 border border-white/10 backdrop-blur-sm p-6 overflow-x-auto">
      {/* Desktop: horizontal layout */}
      <div className="hidden md:flex items-center justify-center gap-0 min-w-max">
        {items.map((item, index) => (
          <div key={item.name} className="flex items-center">
            <motion.div
              className={`
                relative flex-shrink-0 rounded-xl border-2 ${ACCENT_COLORS[index % ACCENT_COLORS.length]}
                bg-bg-card/80 backdrop-blur-sm px-5 py-4 min-w-[160px] max-w-[200px]
              `}
              style={{
                boxShadow: `0 0 16px ${GLOW_COLORS[index % GLOW_COLORS.length]}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <h4 className="text-sm font-semibold text-text-primary mb-1 truncate">
                {item.name}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </motion.div>

            {/* Arrow between nodes */}
            {index < items.length - 1 && (
              <motion.div
                className="flex-shrink-0 px-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.12 + 0.2 }}
              >
                <ArrowIcon />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical layout */}
      <div className="flex md:hidden flex-col items-center gap-0">
        {items.map((item, index) => (
          <div key={item.name} className="flex flex-col items-center">
            <motion.div
              className={`
                relative w-full max-w-[280px] rounded-xl border-2 ${ACCENT_COLORS[index % ACCENT_COLORS.length]}
                bg-bg-card/80 backdrop-blur-sm px-4 py-3
              `}
              style={{
                boxShadow: `0 0 16px ${GLOW_COLORS[index % GLOW_COLORS.length]}`,
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h4 className="text-sm font-semibold text-text-primary mb-1">
                {item.name}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </motion.div>

            {/* Arrow between nodes */}
            {index < items.length - 1 && (
              <motion.div
                className="py-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.15 }}
              >
                <ArrowDownIcon />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

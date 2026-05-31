'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | '3d' | 'image';
  count?: number;
  className?: string;
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-bg-card ${className ?? ''}`}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
          animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
        }}
      />
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-bg-secondary/60 p-5 space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonPulse className="h-4 w-3/4" />
          <SkeletonPulse className="h-3 w-1/2" />
        </div>
      </div>
      {/* Body */}
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-5/6" />
        <SkeletonPulse className="h-3 w-4/6" />
      </div>
      {/* Footer */}
      <div className="flex gap-2 pt-2">
        <SkeletonPulse className="h-6 w-16 rounded-full" />
        <SkeletonPulse className="h-6 w-16 rounded-full" />
        <SkeletonPulse className="h-6 w-16 rounded-full" />
      </div>
    </motion.div>
  );
}

function TextSkeleton() {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <SkeletonPulse className="h-6 w-2/3" />
      <SkeletonPulse className="h-4 w-full" />
      <SkeletonPulse className="h-4 w-5/6" />
      <SkeletonPulse className="h-4 w-4/6" />
    </motion.div>
  );
}

function Scene3DSkeleton() {
  return (
    <motion.div
      className="relative w-full aspect-square max-w-md mx-auto rounded-2xl border border-white/10 bg-bg-secondary/60 overflow-hidden"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Sphere-like skeleton */}
      <div
        className="absolute inset-8 rounded-full bg-bg-card"
        style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
      />

      {/* Orbit rings */}
      <div
        className="absolute inset-4 rounded-full border border-white/5"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      />
      <div
        className="absolute inset-0 rounded-full border border-white/5"
        style={{ animation: 'float 6s ease-in-out infinite 1s' }}
      />

      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-4 w-4 rounded-full bg-glow/40 animate-pulse" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 h-2 w-8 rounded-full bg-white/10" />
      <div className="absolute top-3 right-3 h-2 w-12 rounded-full bg-white/10" />
      <div className="absolute bottom-3 left-3 h-2 w-16 rounded-full bg-white/10" />
    </motion.div>
  );
}

function ImageSkeleton() {
  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="aspect-[4/3] relative bg-bg-card">
        <div
          className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-card to-bg-card"
          style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
        />
        {/* Image icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white/10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

type SkeletonVariant = 'card' | 'text' | '3d' | 'image';

const VARIANT_COMPONENTS: Record<SkeletonVariant, () => React.JSX.Element> = {
  card: CardSkeleton,
  text: TextSkeleton,
  '3d': Scene3DSkeleton,
  image: ImageSkeleton,
};

export default function SkeletonLoader({
  variant = 'card',
  count = 1,
  className,
}: SkeletonLoaderProps) {
  const Component = VARIANT_COMPONENTS[variant as SkeletonVariant];

  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: i * 0.08,
            ease: 'easeOut',
          }}
        >
          <Component />
        </motion.div>
      ))}
    </div>
  );
}

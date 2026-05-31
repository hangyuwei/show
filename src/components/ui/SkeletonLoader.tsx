'use client';

import { useEffect, useState } from 'react';
import { motion, type Transition } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | '3d' | 'image' | 'avatar' | 'wave' | 'page';
  count?: number;
  className?: string;
  /** Gap between repeated skeleton items (Tailwind class, e.g. "gap-4") */
  gap?: string;
}

/* ── Shared easing ── */
const EASE_OUT_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Shimmer gradient constants — tinted with accent colors for premium feel ── */
const SHIMMER_GRADIENT =
  'linear-gradient(105deg, transparent 0%, transparent 30%, rgba(139,92,246,0.02) 38%, rgba(255,255,255,0.05) 44%, rgba(45,140,240,0.06) 50%, rgba(255,255,255,0.04) 56%, rgba(20,184,166,0.02) 62%, transparent 70%, transparent 100%)';

const TOP_EDGE_GLOW =
  'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.05) 20%, rgba(255,255,255,0.06) 50%, rgba(45,140,240,0.05) 80%, transparent 100%)';

const BOTTOM_EDGE_GLOW =
  'linear-gradient(90deg, transparent 0%, rgba(20,184,166,0.03) 30%, rgba(139,92,246,0.04) 50%, rgba(20,184,166,0.03) 70%, transparent 100%)';

/* ── Reduced-motion-safe duration multiplier ── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ── Base skeleton pulse block ── */
function SkeletonPulse({ className, style, reduced }: { className?: string; style?: React.CSSProperties; reduced: boolean }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-bg-card ${className ?? ''}`}
      style={style}
      animate={reduced ? { opacity: 0.6 } : { opacity: [0.35, 0.6, 0.35] }}
      transition={reduced ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Primary shimmer overlay — wider, softer sweep with color tint */}
      {!reduced && (
        <div
          className="absolute inset-0"
          style={{
            background: SHIMMER_GRADIENT,
            animation: 'skeleton-shimmer 2.2s ease-in-out infinite',
          }}
        />
      )}
      {/* Subtle inner glow at top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: TOP_EDGE_GLOW }}
      />
      {/* Bottom edge glow — subtle teal anchor */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: BOTTOM_EDGE_GLOW }}
      />
      {/* Secondary softer shimmer — delayed for layered depth */}
      {!reduced && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: SHIMMER_GRADIENT,
            animation: 'skeleton-shimmer 3.2s ease-in-out infinite 0.6s',
          }}
        />
      )}
    </motion.div>
  );
}

/* ── Card skeleton ── */
function CardSkeleton({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="rounded-xl border border-white/[0.06] bg-bg-secondary/60 p-4 sm:p-5 space-y-4"
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: EASE_OUT_SMOOTH } as Transition}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 w-10 rounded-full shrink-0" reduced={reduced} />
        <div className="flex-1 space-y-2">
          <SkeletonPulse className="h-4 w-3/4" reduced={reduced} />
          <SkeletonPulse className="h-3 w-1/2" reduced={reduced} />
        </div>
      </div>
      {/* Body */}
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-full" reduced={reduced} />
        <SkeletonPulse className="h-3 w-5/6" reduced={reduced} />
        <SkeletonPulse className="h-3 w-4/6" reduced={reduced} />
      </div>
      {/* Footer */}
      <div className="flex gap-2 pt-2">
        <SkeletonPulse className="h-6 w-14 sm:w-16 rounded-full" reduced={reduced} />
        <SkeletonPulse className="h-6 w-14 sm:w-16 rounded-full" reduced={reduced} />
        <SkeletonPulse className="h-6 w-14 sm:w-16 rounded-full" reduced={reduced} />
      </div>
    </motion.div>
  );
}

/* ── Text skeleton ── */
function TextSkeleton({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: EASE_OUT_SMOOTH } as Transition}
    >
      <SkeletonPulse className="h-6 w-2/3" reduced={reduced} />
      <SkeletonPulse className="h-4 w-full" reduced={reduced} />
      <SkeletonPulse className="h-4 w-5/6" reduced={reduced} />
      <SkeletonPulse className="h-4 w-4/6" reduced={reduced} />
      <div className="pt-1">
        <SkeletonPulse className="h-4 w-3/4" reduced={reduced} />
      </div>
    </motion.div>
  );
}

/* ── 3D scene skeleton ── */
function Scene3DSkeleton({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="relative w-full aspect-square max-w-[200px] sm:max-w-xs md:max-w-sm mx-auto rounded-2xl border border-white/[0.06] bg-bg-secondary/60 overflow-hidden"
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, ease: EASE_OUT_SMOOTH } as Transition}
    >
      {/* Sphere-like skeleton with layered glow */}
      <div
        className="absolute inset-6 sm:inset-8 md:inset-10 rounded-full bg-bg-card"
        style={!reduced ? { animation: 'pulse-glow 2s ease-in-out infinite' } : undefined}
      />
      {/* Inner radial highlight — blue-purple gradient */}
      <div
        className="absolute inset-8 sm:inset-10 md:inset-12 rounded-full"
        style={{
          background: 'radial-gradient(circle at 38% 32%, rgba(139,92,246,0.06) 0%, rgba(45,140,240,0.04) 40%, transparent 65%)',
        }}
      />
      {/* Secondary radial — teal accent at bottom-right */}
      <div
        className="absolute inset-10 sm:inset-12 md:inset-14 rounded-full"
        style={{
          background: 'radial-gradient(circle at 65% 70%, rgba(20,184,166,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Orbit rings with staggered animation */}
      <div
        className="absolute inset-3 sm:inset-4 rounded-full border border-white/[0.04]"
        style={!reduced ? { animation: 'float 6s ease-in-out infinite' } : undefined}
      />
      <div
        className="absolute -inset-1 sm:inset-0 rounded-full border border-white/[0.04]"
        style={!reduced ? { animation: 'float 6s ease-in-out infinite 1s' } : undefined}
      />
      <div
        className="absolute -inset-5 sm:-inset-4 rounded-full border border-white/[0.02]"
        style={!reduced ? { animation: 'float 8s ease-in-out infinite 0.5s' } : undefined}
      />

      {/* Center glow — breathing animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-glow/40"
          style={
            !reduced
              ? { animation: 'breathe 2s ease-in-out infinite' }
              : { opacity: 0.3 }
          }
        />
      </div>

      {/* Corner decorations — responsive sizing */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 h-1.5 sm:h-2 w-6 sm:w-8 rounded-full bg-white/[0.07]" />
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 h-1.5 sm:h-2 w-8 sm:w-12 rounded-full bg-white/[0.07]" />
      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 h-1.5 sm:h-2 w-10 sm:w-16 rounded-full bg-white/[0.07]" />
    </motion.div>
  );
}

/* ── Image skeleton ── */
function ImageSkeleton({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: EASE_OUT_SMOOTH } as Transition}
    >
      <div className="aspect-[4/3] relative bg-bg-card">
        <div
          className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-card to-bg-card"
          style={!reduced ? { animation: 'pulse-glow 2s ease-in-out infinite' } : undefined}
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0.375.375 0 01.75 0z"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Avatar skeleton ── */
function AvatarSkeleton({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-3 sm:gap-4"
      initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH } as Transition}
    >
      <SkeletonPulse className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0" reduced={reduced} />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-2/3 sm:w-1/2" reduced={reduced} />
        <SkeletonPulse className="h-3 w-1/2 sm:w-1/3" reduced={reduced} />
      </div>
    </motion.div>
  );
}

/* ── Wave skeleton — horizontal bars for list loading ── */
const WAVE_WIDTHS = ['100%', '85%', '92%', '70%', '60%'];

function WaveSkeleton({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH } as Transition}
    >
      {WAVE_WIDTHS.map((w, i) => (
        <SkeletonPulse
          key={i}
          className="h-3 rounded-full"
          style={{ width: w }}
          reduced={reduced}
        />
      ))}
    </motion.div>
  );
}

/* ── Page skeleton — full-page loading placeholder with hero, text, and card areas ── */
function PageSkeleton({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="space-y-8 sm:space-y-10 max-w-5xl mx-auto px-4 sm:px-6"
      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, ease: EASE_OUT_SMOOTH } as Transition}
    >
      {/* Hero area */}
      <div className="flex flex-col items-center gap-4 pt-8 sm:pt-12">
        <SkeletonPulse className="h-8 sm:h-10 w-3/5 sm:w-2/5" reduced={reduced} />
        <SkeletonPulse className="h-4 sm:h-5 w-4/5 sm:w-3/5" reduced={reduced} />
        <SkeletonPulse className="h-3 sm:h-4 w-2/5 sm:w-1/4" reduced={reduced} />
      </div>

      {/* Divider shimmer */}
      <div className="flex justify-center">
        <SkeletonPulse className="h-px w-48 sm:w-64 rounded-full" reduced={reduced} />
      </div>

      {/* Card grid area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(3px)' }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={
              reduced
                ? { duration: 0.1, delay: i * 0.03 }
                : ({ duration: 0.4, delay: 0.1 + i * 0.06, ease: EASE_OUT_SMOOTH } as Transition)
            }
          >
            <div className="rounded-xl border border-white/[0.06] bg-bg-secondary/60 p-4 space-y-3">
              <SkeletonPulse className="h-28 sm:h-32 w-full rounded-lg" reduced={reduced} />
              <SkeletonPulse className="h-4 w-3/4" reduced={reduced} />
              <SkeletonPulse className="h-3 w-full" reduced={reduced} />
              <SkeletonPulse className="h-3 w-4/6" reduced={reduced} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

type SkeletonVariant = 'card' | 'text' | '3d' | 'image' | 'avatar' | 'wave' | 'page';

const VARIANT_COMPONENTS: Record<SkeletonVariant, React.ComponentType<{ reduced: boolean }>> = {
  card: CardSkeleton,
  text: TextSkeleton,
  '3d': Scene3DSkeleton,
  image: ImageSkeleton,
  avatar: AvatarSkeleton,
  wave: WaveSkeleton,
  page: PageSkeleton,
};

export default function SkeletonLoader({
  variant = 'card',
  count = 1,
  className,
  gap = 'space-y-4',
}: SkeletonLoaderProps) {
  const reduced = useReducedMotion();
  const Component = VARIANT_COMPONENTS[variant as SkeletonVariant];

  return (
    <div className={`${gap} ${className ?? ''}`}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={
            reduced
              ? { duration: 0.1, delay: i * 0.02 }
              : ({
                  duration: 0.45,
                  delay: i * 0.07,
                  ease: EASE_OUT_SMOOTH,
                  filter: { duration: 0.4 },
                } as Transition)
          }
        >
          <Component reduced={reduced} />
        </motion.div>
      ))}
    </div>
  );
}

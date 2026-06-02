'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, type Variants, type Transition } from 'framer-motion';
import { usePathname } from 'next/navigation';
import usePrefersReducedMotion from './usePrefersReducedMotion';

interface PageTransitionProps {
  children: ReactNode;
}

/* ── Shared easing curves ── */
const EASE_OUT_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_QUAD: [number, number, number, number] = [0.55, 0.06, 0.68, 0.19];
const EASE_SPRING_OUT: [number, number, number, number] = [0.18, 1, 0.25, 1];

/* ── Page transition variants — multi-layer entrance/exit with premium depth ── */
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.995,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: EASE_SPRING_OUT,
      opacity: { duration: 0.35, ease: 'easeOut' },
      filter: { duration: 0.45, ease: 'easeOut' },
      y: { duration: 0.5, ease: EASE_SPRING_OUT },
      scale: { duration: 0.5, ease: EASE_OUT_SMOOTH },
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.998,
    filter: 'blur(6px)',
    transition: {
      duration: 0.25,
      ease: EASE_IN_QUAD,
      opacity: { duration: 0.18, ease: 'easeIn' },
      filter: { duration: 0.2, ease: 'easeIn' },
    } as Transition,
  },
};

/* ── Reduced-motion variants — instant, no blur, no transforms ── */
const reducedVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

/* ── Scroll-triggered reveal variants — responsive-aware ── */
export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: 'blur(5px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: EASE_SPRING_OUT,
      opacity: { duration: 0.4, ease: 'easeOut' },
      filter: { duration: 0.45, ease: 'easeOut' },
    } as Transition,
  },
};

/* ── Stagger container for sequential child reveals ── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

/* ── Responsive stagger — wider gaps on larger viewports for readability ── */
export const staggerContainerResponsive: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
};

/* ── Lightweight reveal child variant for stagger containers ── */
export const revealChild: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: EASE_SPRING_OUT,
      opacity: { duration: 0.35, ease: 'easeOut' },
      filter: { duration: 0.38, ease: 'easeOut' },
    } as Transition,
  },
};

/* ── Directional reveal variants ── */
export const revealFromLeft: Variants = {
  hidden: { opacity: 0, x: -24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: EASE_SPRING_OUT,
      opacity: { duration: 0.35, ease: 'easeOut' },
    } as Transition,
  },
};

export const revealFromRight: Variants = {
  hidden: { opacity: 0, x: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: EASE_SPRING_OUT,
      opacity: { duration: 0.35, ease: 'easeOut' },
    } as Transition,
  },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: EASE_OUT_SMOOTH,
      opacity: { duration: 0.35, ease: 'easeOut' },
    } as Transition,
  },
};

/* ── Loading bar transition overlay — gradient with ambient glow ── */
function TransitionBar({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Primary gradient bar */}
          <motion.div
            className="h-[2px]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 0.25, 0.55, 0.78] }}
            exit={{ scaleX: 1 }}
            transition={{
              duration: 0.7,
              ease: EASE_OUT_SMOOTH,
            }}
            style={{
              transformOrigin: 'left',
              background:
                'linear-gradient(90deg, rgba(45,140,240,0) 0%, rgba(45,140,240,0.5) 10%, rgba(139,92,246,0.75) 40%, rgba(139,92,246,0.85) 50%, rgba(20,184,166,0.7) 80%, rgba(20,184,166,0) 100%)',
            }}
          />
          {/* Ambient glow spread below the bar */}
          <motion.div
            className="h-[6px] -mt-[2px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(45,140,240,0.08) 15%, rgba(139,92,246,0.12) 50%, rgba(20,184,166,0.08) 85%, transparent 100%)',
              filter: 'blur(2px)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 0.3, 0.6, 0.8], opacity: [0, 0.6, 0.5, 0.3] }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: EASE_OUT_SMOOTH,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Radial glow burst that flashes on route change ── */
function GlowBurst({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[55] pointer-events-none"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.06) 0%, rgba(45,140,240,0.03) 30%, transparent 60%)',
          }}
        />
      )}
    </AnimatePresence>
  );
}

/* ── Hook: useScrollReveal — programmatic scroll-triggered reveal with responsive threshold ── */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
  } = {},
) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(() => Boolean(prefersReducedMotion));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.triggerOnce !== false) {
            observer.unobserve(el);
          }
        } else if (options.triggerOnce === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.triggerOnce, prefersReducedMotion]);

  return { ref, isVisible: prefersReducedMotion || isVisible };
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Detect route changes to trigger the loading bar */
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsLoading(true);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  /* Clear loading state once the entrance animation settles */
  const handleAnimationComplete = useCallback(() => {
    timerRef.current = setTimeout(() => setIsLoading(false), 60);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const activeVariants = prefersReducedMotion ? reducedVariants : pageVariants;

  return (
    <>
      <TransitionBar isLoading={isLoading} />
      <GlowBurst isActive={isLoading} />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={activeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={handleAnimationComplete}
          style={{
            willChange: prefersReducedMotion ? 'opacity' : 'opacity, transform, filter',
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

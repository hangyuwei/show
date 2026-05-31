'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, type Variants, type Transition } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

/* ── Shared easing curves ── */
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_QUAD: [number, number, number, number] = [0.55, 0.06, 0.68, 0.19];

/* ── Page transition variants — multi-layer entrance/exit ── */
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.993,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: EASE_OUT_EXPO,
      opacity: { duration: 0.4, ease: 'easeOut' },
      filter: { duration: 0.5, ease: 'easeOut' },
      y: { duration: 0.55, ease: EASE_OUT_EXPO },
      scale: { duration: 0.55, ease: EASE_OUT_SMOOTH },
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.997,
    filter: 'blur(8px)',
    transition: {
      duration: 0.3,
      ease: EASE_IN_QUAD,
      opacity: { duration: 0.2, ease: 'easeIn' },
      filter: { duration: 0.24, ease: 'easeIn' },
    } as Transition,
  },
};

/* ── Scroll-triggered reveal variants ── */
export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: EASE_OUT_EXPO,
      opacity: { duration: 0.45, ease: 'easeOut' },
      filter: { duration: 0.5, ease: 'easeOut' },
    } as Transition,
  },
};

/* ── Stagger container for sequential child reveals ── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/* ── Loading bar transition overlay ── */
function TransitionBar({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 0.3, 0.65, 0.85],
            opacity: [0, 1, 1, 0.7],
          }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: EASE_OUT_SMOOTH,
            opacity: { duration: 0.3 },
          }}
          style={{
            transformOrigin: 'left',
            background:
              'linear-gradient(90deg, rgba(33,150,255,0) 0%, rgba(33,150,255,0.6) 15%, rgba(139,92,246,0.8) 50%, rgba(20,184,166,0.6) 85%, rgba(20,184,166,0) 100%)',
            boxShadow: '0 0 8px rgba(33,150,255,0.3), 0 0 20px rgba(139,92,246,0.15)',
          }}
        />
      )}
    </AnimatePresence>
  );
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
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
    timerRef.current = setTimeout(() => setIsLoading(false), 80);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <TransitionBar isLoading={isLoading} />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={handleAnimationComplete}
          style={{ willChange: 'opacity, transform, filter' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

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
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      opacity: { duration: 0.35, ease: 'easeOut' },
      filter: { duration: 0.45, ease: 'easeOut' },
      scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.998,
    filter: 'blur(6px)',
    transition: {
      duration: 0.28,
      ease: [0.55, 0.06, 0.68, 0.19] as [number, number, number, number],
      opacity: { duration: 0.18, ease: 'easeIn' },
      filter: { duration: 0.22, ease: 'easeIn' },
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: 'opacity, transform, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

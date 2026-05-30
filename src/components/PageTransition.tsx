'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

// Warp speed lines that emanate from center on exit
function WarpLines() {
  const lineCount = 24;
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      {Array.from({ length: lineCount }).map((_, i) => {
        const angle = (i / lineCount) * 360;
        return (
          <motion.div
            key={i}
            className="absolute w-[1px] bg-gradient-to-t from-transparent via-blue-400/60 to-transparent"
            style={{
              height: '120vh',
              transform: `rotate(${angle}deg)`,
              originX: '50%',
              originY: '50%',
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
              delay: i * 0.01,
            }}
          />
        );
      })}
    </div>
  );
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: 'easeOut',
          },
        }}
        exit={{
          opacity: 0,
          scale: 1.05,
          transition: {
            duration: 0.3,
            ease: 'easeIn',
          },
        }}
      >
        <WarpLines />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

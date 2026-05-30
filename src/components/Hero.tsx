'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const SolarSystem = dynamic(
  () => import('./three/SolarSystem'),
  { ssr: false },
);

const SLOGANS = [
  '用代码构建未来',
  '以AI赋能行业',
  '让创意照进现实',
  '技术驱动价值',
];

function TypewriterSlogan() {
  const [renderText, setRenderText] = useState('');
  const stateRef = useRef({
    sloganIndex: 0,
    isDeleting: false,
    displayText: '',
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const s = stateRef.current;
      const current = SLOGANS[s.sloganIndex];

      if (!s.isDeleting) {
        if (s.displayText.length < current.length) {
          s.displayText = current.slice(0, s.displayText.length + 1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 100);
        } else {
          s.isDeleting = true;
          timer = setTimeout(tick, 2000);
        }
      } else {
        if (s.displayText.length > 0) {
          s.displayText = s.displayText.slice(0, -1);
          setRenderText(s.displayText);
          timer = setTimeout(tick, 50);
        } else {
          s.isDeleting = false;
          s.sloganIndex = (s.sloganIndex + 1) % SLOGANS.length;
          timer = setTimeout(tick, 100);
        }
      }
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="inline-block min-h-[1.5em]">
      {renderText}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExplore = useCallback(() => {
    const el = document.getElementById('featured-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/projects';
    }
  }, []);

  const loadingFallback = useMemo(
    () => (
      <div className="flex h-full items-center justify-center text-muted">
        Loading 3D Scene...
      </div>
    ),
    [],
  );

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#000005]">
      {/* 3D Canvas - lazy loaded after mount to avoid SSR issues */}
      <div className="absolute inset-0">
        {mounted && <SolarSystem />}
      </div>

      {/* Dark overlay gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Text overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Hang&apos;s Portfolio
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-6 text-lg text-blue-200/80 sm:text-xl md:text-2xl"
          >
            全栈开发 · AI应用 · 大健康行业
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-10 h-8 text-base text-muted sm:text-lg"
          >
            <AnimatePresence mode="wait">
              <TypewriterSlogan />
            </AnimatePresence>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExplore}
            className="rounded-full border border-accent/40 bg-accent/10 px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent/20 sm:text-lg"
          >
            探索项目宇宙
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted">Scroll</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-muted"
          >
            <path
              d="M10 4v12m0 0l-4-4m4 4l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

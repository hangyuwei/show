'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '/', label: '首页' },
  { href: '/projects', label: '项目' },
  { href: '/about', label: '关于' },
  { href: '/contact', label: '联系' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tickingRef = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleScroll = useCallback(() => {
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Smooth ease-out interpolation from 0 to 1 over first 100px of scroll
        const raw = Math.min(scrollY / 100, 1);
        // Quintic ease-out for ultra-smooth perceived transition
        const progress = 1 - Math.pow(1 - raw, 4);
        setScrollProgress(progress);
        tickingRef.current = false;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // ── Premium glass effect interpolation ──
  // Enhanced: deeper color range, smoother opacity ramp
  const glassBgOpacity = 0.02 + scrollProgress * 0.28;
  const glassBorderOpacity = 0.04 + scrollProgress * 0.22;
  const glassBlur = 16 + scrollProgress * 26;
  const glassSaturation = 1.3 + scrollProgress * 0.6;

  // Refined color tint: deep navy shifting toward richer indigo
  const bgR = Math.round(5 + scrollProgress * 10);
  const bgG = Math.round(6 + scrollProgress * 5);
  const bgB = Math.round(24 + scrollProgress * 28);

  // ── Enhanced shadow system: 5-tier depth with color-shifted ambient glow ──
  const shadowLayer1 = `0 1px 2px rgba(0,0,0,${0.06 + scrollProgress * 0.10})`;
  const shadowLayer2 = `0 3px 8px rgba(0,0,0,${scrollProgress * 0.12})`;
  const shadowLayer3 = `0 8px 24px rgba(0,0,0,${scrollProgress * 0.18})`;
  const shadowLayer4 = `0 20px 56px -4px rgba(0,0,0,${scrollProgress * 0.22})`;
  const shadowLayer5 = `0 40px 80px -8px rgba(0,0,0,${scrollProgress * 0.12})`;
  const shadowInsetTop = `inset 0 1px 0 rgba(255,255,255,${0.04 + scrollProgress * 0.08})`;
  const shadowInsetBot = `inset 0 -1px 0 rgba(0,0,0,${0.04 + scrollProgress * 0.06})`;
  // Multi-hue ambient glow that intensifies on scroll
  const shadowGlowPurple = scrollProgress > 0.15
    ? `0 0 60px -12px rgba(139,92,246,${scrollProgress * 0.07})`
    : 'none';
  const shadowGlowBlue = scrollProgress > 0.25
    ? `0 0 80px -16px rgba(45,140,240,${scrollProgress * 0.04})`
    : 'none';

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          ref={navRef}
          className="relative flex h-16 items-center justify-between rounded-b-2xl px-6 transition-[box-shadow] duration-700 ease-out"
          style={{
            backgroundColor: `rgba(${bgR}, ${bgG}, ${bgB}, ${glassBgOpacity})`,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderTopWidth: '0px',
            borderBottomWidth: '1px',
            borderLeftColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.4})`,
            borderRightColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.4})`,
            borderBottomColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.8})`,
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
            backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation})`,
            WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation})`,
            boxShadow: [
              shadowLayer1,
              shadowLayer2,
              shadowLayer3,
              shadowLayer4,
              shadowLayer5,
              shadowInsetTop,
              shadowInsetBot,
              shadowGlowPurple,
              shadowGlowBlue,
            ].join(', '),
          }}
        >
          {/* ── Noise texture overlay for realistic frost grain ── */}
          <div
            className="pointer-events-none absolute inset-0 rounded-b-2xl"
            style={{
              opacity: 0.015 + scrollProgress * 0.035,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* ── Primary refraction highlight — top edge light caustic ── */}
          <div
            className="pointer-events-none absolute top-0 left-[6%] right-[6%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.03 + scrollProgress * 0.09}) 20%, rgba(200,220,255,${0.05 + scrollProgress * 0.13}) 40%, rgba(255,255,255,${0.06 + scrollProgress * 0.16}) 50%, rgba(200,220,255,${0.05 + scrollProgress * 0.13}) 60%, rgba(255,255,255,${0.03 + scrollProgress * 0.09}) 80%, transparent)`,
            }}
          />

          {/* ── Secondary refraction band — prismatic light scatter ── */}
          <div
            className="pointer-events-none absolute top-[1px] left-[12%] right-[12%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(139,92,246,${scrollProgress * 0.035}) 25%, rgba(45,140,240,${scrollProgress * 0.05}) 45%, rgba(20,184,166,${scrollProgress * 0.04}) 55%, rgba(139,92,246,${scrollProgress * 0.035}) 75%, transparent)`,
              opacity: scrollProgress,
            }}
          />

          {/* ── Tertiary refraction — ultra-subtle warm band for color depth ── */}
          <div
            className="pointer-events-none absolute top-[2px] left-[20%] right-[20%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(245,158,11,${scrollProgress * 0.02}) 40%, rgba(245,158,11,${scrollProgress * 0.02}) 60%, transparent)`,
              opacity: scrollProgress * 0.6,
            }}
          />

          {/* ── Animated gradient border bottom — tri-layer with prismatic flow ── */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden"
            style={{ height: '2px' }}
          >
            {/* Primary rotating gradient — expanded color palette */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, #3b82f6 0%, #6366f1 15%, #8b5cf6 30%, #a855f7 42%, #14b8a6 58%, #06b6d4 72%, #3b82f6 100%)`,
                backgroundSize: '250% 100%',
                animation: 'navbar-border-flow 5s linear infinite',
              }}
            />
            {/* Fade mask — refined center fade for edge emphasis */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.25) 10%, rgba(4,6,15,0.55) 35%, rgba(4,6,15,0.65) 50%, rgba(4,6,15,0.55) 65%, rgba(4,6,15,0.25) 90%, transparent 100%)`,
              }}
            />
            {/* Traveling shimmer highlight — brighter core with wider spread */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 25%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.6) 55%, transparent 75%, transparent 100%)',
                animation: 'navbar-shimmer 7s ease-in-out infinite',
              }}
            />
          </div>

          {/* ── Logo ── */}
          <Link
            href="/"
            className="relative group flex items-center gap-2.5"
          >
            {/* Logo ambient glow — wider, softer radial with multi-hue bleed */}
            <span
              className="absolute -inset-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.12) 0%, rgba(45,140,240,0.06) 35%, rgba(20,184,166,0.03) 60%, transparent 75%)',
              }}
            />

            {/* Logo outer ring — containment glow on hover with inner shimmer */}
            <span
              className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-[1.03]"
              style={{
                border: '1px solid rgba(139,92,246,0.12)',
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.04) 0%, transparent 70%)',
                boxShadow: 'inset 0 0 12px rgba(139,92,246,0.03)',
              }}
            />

            {/* "Hang" text — expanded gradient with richer color stops */}
            <span
              className="relative text-lg font-bold tracking-wide transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 15%, #a78bfa 30%, #c084fc 45%, #e879f9 55%, #a78bfa 70%, #818cf8 85%, #60a5fa 100%)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-gradient 10s ease infinite',
                filter: `drop-shadow(0 0 ${8 + scrollProgress * 8}px rgba(139, 92, 246, ${0.18 + scrollProgress * 0.18})) drop-shadow(0 0 ${16 + scrollProgress * 12}px rgba(45, 140, 240, ${scrollProgress * 0.08}))`,
              }}
            >
              Hang
            </span>

            {/* Separator dot — slightly larger, with layered glow */}
            <span
              className="relative w-[3.5px] h-[3.5px] rounded-full opacity-40 group-hover:opacity-90 transition-all duration-500 group-hover:scale-125"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                boxShadow: '0 0 4px rgba(139,92,246,0.35), 0 0 8px rgba(45,140,240,0.15)',
              }}
            />

            {/* "Portfolio" text — silver with warmer shimmer and glow layer */}
            <span
              className="relative text-base font-light tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #94a3b8 0%, #c8d3e3 25%, #e2e8f0 40%, #d1d9e6 55%, #94a3b8 80%, #7c8aa6 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-subtle 12s ease infinite',
                filter: 'drop-shadow(0 0 4px rgba(148, 163, 184, 0.15)) drop-shadow(0 0 12px rgba(200, 211, 227, 0.06))',
              }}
            >
              Portfolio
            </span>

            {/* Hover underline accent — wider gradient sweep with color depth */}
            <span
              className="absolute -bottom-1.5 left-0 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, rgba(20,184,166,0.15), rgba(139,92,246,0.35), rgba(59,130,246,0.45), rgba(139,92,246,0.35), rgba(20,184,166,0.15))',
                boxShadow: '0 0 8px rgba(139,92,246,0.15)',
              }}
            />
          </Link>

          {/* ── Desktop Navigation ── */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative group/nav">
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out ${
                      active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {/* Active background pill — enhanced glass with triple inner glow */}
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139,92,246,0.14) 0%, rgba(45,140,240,0.08) 40%, rgba(20,184,166,0.10) 70%, rgba(139,92,246,0.06) 100%)',
                          boxShadow: [
                            'inset 0 1px 0 rgba(255,255,255,0.14)',
                            'inset 0 -1px 0 rgba(0,0,0,0.06)',
                            'inset 0 0 0 1px rgba(255,255,255,0.08)',
                            '0 0 20px rgba(139,92,246,0.06)',
                            '0 0 8px rgba(139,92,246,0.10)',
                            '0 0 40px rgba(45,140,240,0.03)',
                          ].join(', '),
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Hover background glow for inactive items — radial with color hint */}
                    {!active && (
                      <span
                        className="absolute inset-0 rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 ease-out"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.04) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.01) 100%)',
                        }}
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>

                    {/* Underline — active: triple-glow gradient; hover: gentle prismatic */}
                    <span
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ease-out ${
                        active ? 'w-5' : 'w-0 group-hover/nav:w-4'
                      }`}
                      style={
                        active
                          ? {
                              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6 40%, #a855f7 60%, #14b8a6)',
                              boxShadow: '0 0 6px rgba(139,92,246,0.50), 0 0 16px rgba(59,130,246,0.20), 0 0 32px rgba(139,92,246,0.08)',
                            }
                          : { background: 'linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.50), rgba(255,255,255,0.12))' }
                      }
                    />
                  </Link>

                  {/* Active route glowing dot — refined multi-layer pulse */}
                  {active && (
                    <motion.span
                      layoutId="navbar-glowing-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #ede9fe 0%, #c4b5fd 20%, #8b5cf6 45%, rgba(139,92,246,0.30) 70%, transparent 100%)',
                        boxShadow: [
                          '0 0 2px 1px rgba(139, 92, 246, 0.55)',
                          '0 0 8px 2px rgba(139, 92, 246, 0.25)',
                          '0 0 20px 4px rgba(139, 92, 246, 0.08)',
                        ].join(', '),
                        animation: 'navbar-dot-pulse 3.5s ease-in-out infinite',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── Mobile Menu Button ── */}
          <button
            type="button"
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white transition-colors duration-300"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.05)';
              el.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.boxShadow = 'none';
            }}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 h-5 relative flex flex-col items-center justify-center">
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full origin-center"
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 0 : -5,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full origin-center"
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  scaleX: mobileMenuOpen ? 0.3 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full origin-center"
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? 0 : 5,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Button tap feedback ring — dual-ring effect */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    exit={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      border: '1px solid rgba(139,92,246,0.25)',
                    }}
                  />
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0.3 }}
                    animate={{ scale: 2.0, opacity: 0 }}
                    exit={{ scale: 2.0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      border: '1px solid rgba(45,140,240,0.12)',
                    }}
                  />
                </>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.25, delay: 0.05 },
              }}
              className="md:hidden overflow-hidden relative"
              style={{
                backgroundColor: `rgba(${bgR}, ${bgG}, ${bgB}, 0.92)`,
                backdropFilter: 'blur(40px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopWidth: '0px',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
                borderLeftColor: `rgba(255,255,255,${glassBorderOpacity * 0.45})`,
                borderRightColor: `rgba(255,255,255,${glassBorderOpacity * 0.45})`,
                borderBottomColor: `rgba(255,255,255,${glassBorderOpacity * 0.8})`,
                boxShadow: [
                  `0 16px 48px rgba(0,0,0,0.40)`,
                  `0 6px 16px rgba(0,0,0,0.25)`,
                  `inset 0 1px 0 rgba(255,255,255,0.07)`,
                  `0 0 60px -12px rgba(139,92,246,0.06)`,
                  `0 0 40px -8px rgba(45,140,240,0.04)`,
                ].join(', '),
              }}
            >
              {/* Mobile menu noise overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-b-2xl"
                style={{
                  opacity: 0.02,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay',
                }}
              />

              {/* Animated bottom gradient border for mobile — matching prismatic palette */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden"
                style={{ height: '2px' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, #3b82f6 0%, #6366f1 15%, #8b5cf6 30%, #a855f7 42%, #14b8a6 58%, #06b6d4 72%, #3b82f6 100%)`,
                    backgroundSize: '250% 100%',
                    animation: 'navbar-border-flow 5s linear infinite',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.3) 12%, rgba(4,6,15,0.55) 35%, rgba(4,6,15,0.60) 50%, rgba(4,6,15,0.55) 65%, rgba(4,6,15,0.3) 88%, transparent 100%)`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, transparent 25%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.5) 55%, transparent 75%, transparent 100%)',
                    animation: 'navbar-shimmer 7s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Top separator line — softer, with prismatic gradient fade */}
              <div
                className="mx-6 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.04) 15%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.06) 70%, rgba(45,140,240,0.04) 85%, transparent)',
                }}
              />

              <ul className="flex flex-col gap-0.5 px-3 py-3">
                {NAV_LINKS.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
                      transition={{
                        duration: 0.45,
                        delay: 0.06 + index * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`relative block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out ${
                          active
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        style={
                          active
                            ? {
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(45,140,240,0.07) 40%, rgba(20,184,166,0.09) 70%, rgba(139,92,246,0.05) 100%)',
                                boxShadow: [
                                  'inset 0 1px 0 rgba(255,255,255,0.12)',
                                  'inset 0 0 0 1px rgba(255,255,255,0.07)',
                                  '0 0 24px rgba(139,92,246,0.05)',
                                  '0 0 48px rgba(45,140,240,0.02)',
                                ].join(', '),
                              }
                            : {}
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          {/* Active indicator bar on left — gradient with layered glow */}
                          {active && (
                            <motion.span
                              layoutId="navbar-mobile-active-bar"
                              className="w-[3px] h-4 rounded-full"
                              style={{
                                background: 'linear-gradient(180deg, #60a5fa 0%, #818cf8 25%, #8b5cf6 50%, #a855f7 75%, #14b8a6 100%)',
                                boxShadow: [
                                  '0 0 6px rgba(139,92,246,0.50)',
                                  '0 0 2px rgba(96,165,250,0.35)',
                                  '0 0 12px rgba(139,92,246,0.15)',
                                ].join(', '),
                              }}
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          {link.label}
                          {active && (
                            <span
                              className="ml-auto w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'radial-gradient(circle, #ede9fe 0%, #c4b5fd 20%, #8b5cf6 45%, rgba(139,92,246,0.35) 65%, transparent 100%)',
                                boxShadow: [
                                  '0 0 3px 1px rgba(139, 92, 246, 0.40)',
                                  '0 0 8px 2px rgba(139, 92, 246, 0.15)',
                                ].join(', '),
                                animation: 'navbar-dot-pulse 3.5s ease-in-out infinite',
                              }}
                            />
                          )}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Scoped keyframes — refined timing and motion curves ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes navbar-shimmer {
            0% { transform: translateX(-250%); }
            100% { transform: translateX(250%); }
          }
          @keyframes navbar-logo-gradient {
            0% { background-position: 0% 50%; }
            25% { background-position: 50% 100%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 50% 0%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes navbar-logo-subtle {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes navbar-border-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 250% 50%; }
          }
          @keyframes navbar-dot-pulse {
            0%, 100% {
              opacity: 0.55;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateX(-50%) scale(1.4);
            }
          }
        `}} />
      </nav>
    </motion.header>
  );
}

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
        // Smooth ease-out interpolation from 0 to 1 over first 120px of scroll
        const raw = Math.min(scrollY / 120, 1);
        // Quintic ease-out for ultra-smooth perceived transition
        const progress = 1 - Math.pow(1 - raw, 5);
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
  // Deeper color range with richer indigo undertone, smoother opacity ramp
  const glassBgOpacity = 0.01 + scrollProgress * 0.32;
  const glassBorderOpacity = 0.03 + scrollProgress * 0.24;
  const glassBlur = 14 + scrollProgress * 28;
  const glassSaturation = 1.2 + scrollProgress * 0.7;

  // Refined color tint: deep navy shifting toward richer indigo with slight warmth
  const bgR = Math.round(4 + scrollProgress * 12);
  const bgG = Math.round(5 + scrollProgress * 6);
  const bgB = Math.round(22 + scrollProgress * 32);

  // ── Enhanced shadow system: 6-tier depth with color-shifted ambient glow ──
  const shadowLayer1 = `0 1px 2px rgba(0,0,0,${0.05 + scrollProgress * 0.10})`;
  const shadowLayer2 = `0 2px 6px rgba(0,0,0,${scrollProgress * 0.10})`;
  const shadowLayer3 = `0 6px 20px rgba(0,0,0,${scrollProgress * 0.16})`;
  const shadowLayer4 = `0 16px 48px -4px rgba(0,0,0,${scrollProgress * 0.20})`;
  const shadowLayer5 = `0 32px 72px -8px rgba(0,0,0,${scrollProgress * 0.14})`;
  const shadowLayer6 = `0 48px 100px -16px rgba(0,0,0,${scrollProgress * 0.08})`;
  const shadowInsetTop = `inset 0 1px 0 rgba(255,255,255,${0.03 + scrollProgress * 0.10})`;
  const shadowInsetBot = `inset 0 -1px 0 rgba(0,0,0,${0.03 + scrollProgress * 0.06})`;
  // Multi-hue ambient glow that intensifies on scroll
  const shadowGlowPurple = scrollProgress > 0.1
    ? `0 0 60px -12px rgba(139,92,246,${scrollProgress * 0.08})`
    : 'none';
  const shadowGlowBlue = scrollProgress > 0.2
    ? `0 0 80px -16px rgba(45,140,240,${scrollProgress * 0.05})`
    : 'none';
  const shadowGlowTeal = scrollProgress > 0.4
    ? `0 0 100px -24px rgba(20,184,166,${scrollProgress * 0.025})`
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
            borderLeftColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.35})`,
            borderRightColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.35})`,
            borderBottomColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.7})`,
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
              shadowLayer6,
              shadowInsetTop,
              shadowInsetBot,
              shadowGlowPurple,
              shadowGlowBlue,
              shadowGlowTeal,
            ].join(', '),
          }}
        >
          {/* ── Conic rotating gradient border ── */}
          <div
            className="pointer-events-none absolute inset-0 rounded-b-2xl overflow-hidden"
            style={{ opacity: 0.25 + scrollProgress * 0.75 }}
          >
            <div
              className="absolute -inset-[100%]"
              style={{
                background: `conic-gradient(from 0deg, rgba(59,130,246,0.18), rgba(99,102,241,0.22), rgba(139,92,246,0.28), rgba(168,85,247,0.22), rgba(20,184,166,0.18), rgba(6,182,212,0.15), rgba(59,130,246,0.18))`,
                animation: 'navbar-conic-spin 8s linear infinite',
              }}
            />
            <div
              className="absolute inset-0 rounded-b-2xl"
              style={{
                background: `rgb(${bgR}, ${bgG}, ${bgB})`,
                margin: '1px',
              }}
            />
          </div>

          {/* ── Noise texture overlay for realistic frost grain ── */}
          <div
            className="pointer-events-none absolute inset-0 rounded-b-2xl"
            style={{
              opacity: 0.012 + scrollProgress * 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* ── Primary refraction highlight — top edge light caustic ── */}
          <div
            className="pointer-events-none absolute top-0 left-[5%] right-[5%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.02 + scrollProgress * 0.10}) 15%, rgba(200,220,255,${0.04 + scrollProgress * 0.14}) 35%, rgba(255,255,255,${0.06 + scrollProgress * 0.18}) 50%, rgba(200,220,255,${0.04 + scrollProgress * 0.14}) 65%, rgba(255,255,255,${0.02 + scrollProgress * 0.10}) 85%, transparent)`,
            }}
          />

          {/* ── Secondary refraction band — prismatic light scatter ── */}
          <div
            className="pointer-events-none absolute top-[1px] left-[10%] right-[10%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(99,102,241,${scrollProgress * 0.04}) 20%, rgba(139,92,246,${scrollProgress * 0.05}) 35%, rgba(45,140,240,${scrollProgress * 0.06}) 50%, rgba(20,184,166,${scrollProgress * 0.05}) 65%, rgba(99,102,241,${scrollProgress * 0.04}) 80%, transparent)`,
              opacity: scrollProgress,
            }}
          />

          {/* ── Tertiary refraction — ultra-subtle warm band for color depth ── */}
          <div
            className="pointer-events-none absolute top-[2px] left-[18%] right-[18%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(245,158,11,${scrollProgress * 0.02}) 35%, rgba(245,158,11,${scrollProgress * 0.02}) 65%, transparent)`,
              opacity: scrollProgress * 0.5,
            }}
          />

          {/* ── Animated gradient border bottom — quad-layer with prismatic flow ── */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden"
            style={{ height: '2px' }}
          >
            {/* Primary rotating gradient — expanded color palette with indigo bridge */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, #3b82f6 0%, #6366f1 12%, #8b5cf6 25%, #a855f7 37%, #14b8a6 50%, #06b6d4 62%, #3b82f6 75%, #6366f1 87%, #8b5cf6 100%)`,
                backgroundSize: '300% 100%',
                animation: 'navbar-border-flow 6s linear infinite',
              }}
            />
            {/* Fade mask — refined center fade for edge emphasis */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.20) 8%, rgba(4,6,15,0.50) 30%, rgba(4,6,15,0.60) 50%, rgba(4,6,15,0.50) 70%, rgba(4,6,15,0.20) 92%, transparent 100%)`,
              }}
            />
            {/* Traveling shimmer highlight — wider spread with softer core */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(255,255,255,0.50) 40%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.50) 60%, transparent 80%, transparent 100%)',
                animation: 'navbar-shimmer 8s ease-in-out infinite',
              }}
            />
            {/* Fourth layer: slow color-pulsing ambient band for depth shimmer */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(99,102,241,0.12) 25%, rgba(139,92,246,0.18) 50%, rgba(99,102,241,0.12) 75%, transparent)`,
                animation: 'navbar-border-flow 12s linear infinite reverse',
                opacity: 0.4 + scrollProgress * 0.6,
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
              className="absolute -inset-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.07) 30%, rgba(45,140,240,0.05) 50%, rgba(20,184,166,0.03) 70%, transparent 80%)',
              }}
            />

            {/* Logo outer ring — containment glow on hover with inner shimmer */}
            <span
              className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-[1.03]"
              style={{
                border: '1px solid rgba(99,102,241,0.14)',
                background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
                boxShadow: 'inset 0 0 16px rgba(99,102,241,0.04), inset 0 0 32px rgba(139,92,246,0.02)',
              }}
            />

            {/* Logo hover light sweep effect */}
            <span
              className="absolute inset-0 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                animation: 'navbar-logo-sweep 3s ease-in-out infinite',
              }}
            >
              <span
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 55%, transparent 70%)',
                  animation: 'navbar-logo-sweep-move 3s ease-in-out infinite',
                }}
              />
            </span>

            {/* "Hang" text — expanded gradient with richer color stops */}
            <span
              className="relative text-lg font-bold tracking-wide transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 12%, #a78bfa 24%, #c084fc 36%, #e879f9 48%, #c084fc 60%, #a78bfa 72%, #818cf8 84%, #60a5fa 100%)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-gradient 10s ease infinite',
                filter: `drop-shadow(0 0 ${6 + scrollProgress * 10}px rgba(99, 102, 241, ${0.15 + scrollProgress * 0.20})) drop-shadow(0 0 ${14 + scrollProgress * 14}px rgba(139, 92, 246, ${scrollProgress * 0.10}))`,
              }}
            >
              Hang
            </span>

            {/* Separator dot — slightly larger, with layered glow */}
            <span
              className="relative w-[3.5px] h-[3.5px] rounded-full opacity-40 group-hover:opacity-90 transition-all duration-500 group-hover:scale-125"
              style={{
                background: 'linear-gradient(135deg, #818cf8, #3b82f6)',
                boxShadow: '0 0 5px rgba(99,102,241,0.40), 0 0 10px rgba(45,140,240,0.18)',
              }}
            />

            {/* "Portfolio" text — silver with warmer shimmer and glow layer */}
            <span
              className="relative text-base font-light tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #94a3b8 0%, #c8d3e3 20%, #e2e8f0 38%, #d1d9e6 52%, #b0bfd4 68%, #94a3b8 84%, #7c8aa6 100%)',
                backgroundSize: '350% 350%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-subtle 14s ease infinite',
                filter: 'drop-shadow(0 0 5px rgba(148, 163, 184, 0.18)) drop-shadow(0 0 14px rgba(200, 211, 227, 0.08))',
              }}
            >
              Portfolio
            </span>

            {/* Hover underline accent — wider gradient sweep with color depth */}
            <span
              className="absolute -bottom-1.5 left-0 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, rgba(20,184,166,0.12), rgba(99,102,241,0.30), rgba(139,92,246,0.40), rgba(59,130,246,0.45), rgba(139,92,246,0.40), rgba(99,102,241,0.30), rgba(20,184,166,0.12))',
                boxShadow: '0 0 10px rgba(99,102,241,0.18)',
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
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.10) 30%, rgba(45,140,240,0.08) 60%, rgba(20,184,166,0.10) 100%)',
                          boxShadow: [
                            'inset 0 1px 0 rgba(255,255,255,0.16)',
                            'inset 0 -1px 0 rgba(0,0,0,0.06)',
                            'inset 0 0 0 1px rgba(255,255,255,0.10)',
                            '0 0 24px rgba(99,102,241,0.08)',
                            '0 0 10px rgba(139,92,246,0.12)',
                            '0 0 48px rgba(45,140,240,0.04)',
                          ].join(', '),
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}

                    {/* Hover background glow for inactive items — radial with color hint */}
                    {!active && (
                      <span
                        className="absolute inset-0 rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 ease-out"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.03) 40%, rgba(255,255,255,0.02) 70%, rgba(255,255,255,0.01) 100%)',
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
                              background: 'linear-gradient(90deg, #3b82f6, #6366f1 25%, #8b5cf6 50%, #a855f7 75%, #14b8a6)',
                              boxShadow: '0 0 6px rgba(99,102,241,0.50), 0 0 18px rgba(139,92,246,0.25), 0 0 36px rgba(99,102,241,0.10)',
                            }
                          : { background: 'linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.48), rgba(255,255,255,0.10))' }
                      }
                    />
                  </Link>

                  {/* Active route glowing dot — refined multi-layer pulse with aurora colors */}
                  {active && (
                    <motion.span
                      layoutId="navbar-glowing-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #e0e7ff 0%, #c7d2fe 18%, #a5b4fc 32%, #818cf8 48%, rgba(99,102,241,0.35) 68%, transparent 100%)',
                        boxShadow: [
                          '0 0 2px 1px rgba(99, 102, 241, 0.60)',
                          '0 0 8px 2px rgba(99, 102, 241, 0.30)',
                          '0 0 20px 4px rgba(139, 92, 246, 0.12)',
                          '0 0 40px 6px rgba(99, 102, 241, 0.05)',
                        ].join(', '),
                        animation: 'navbar-dot-pulse 3.5s ease-in-out infinite',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
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
              el.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.08)';
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
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full origin-center"
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  scaleX: mobileMenuOpen ? 0.3 : 1,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full origin-center"
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? 0 : 5,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                      border: '1px solid rgba(99,102,241,0.30)',
                    }}
                  />
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0.3 }}
                    animate={{ scale: 2.0, opacity: 0 }}
                    exit={{ scale: 2.0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      border: '1px solid rgba(139,92,246,0.15)',
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
              initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
              exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.2, delay: 0.08 },
                height: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                scaleY: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              }}
              className="md:hidden overflow-hidden relative origin-top"
              style={{
                backgroundColor: `rgba(${bgR}, ${bgG}, ${bgB}, 0.93)`,
                backdropFilter: 'blur(44px) saturate(1.9)',
                WebkitBackdropFilter: 'blur(44px) saturate(1.9)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopWidth: '0px',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
                borderLeftColor: `rgba(255,255,255,${glassBorderOpacity * 0.40})`,
                borderRightColor: `rgba(255,255,255,${glassBorderOpacity * 0.40})`,
                borderBottomColor: `rgba(255,255,255,${glassBorderOpacity * 0.75})`,
                boxShadow: [
                  `0 20px 56px rgba(0,0,0,0.42)`,
                  `0 8px 20px rgba(0,0,0,0.28)`,
                  `inset 0 1px 0 rgba(255,255,255,0.08)`,
                  `0 0 70px -12px rgba(99,102,241,0.08)`,
                  `0 0 48px -8px rgba(139,92,246,0.05)`,
                  `0 0 90px -16px rgba(20,184,166,0.03)`,
                ].join(', '),
              }}
            >
              {/* Mobile menu noise overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-b-2xl"
                style={{
                  opacity: 0.018,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
                    background: `linear-gradient(90deg, #3b82f6 0%, #6366f1 12%, #8b5cf6 25%, #a855f7 37%, #14b8a6 50%, #06b6d4 62%, #3b82f6 75%, #6366f1 87%, #8b5cf6 100%)`,
                    backgroundSize: '300% 100%',
                    animation: 'navbar-border-flow 6s linear infinite',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.25) 10%, rgba(4,6,15,0.55) 35%, rgba(4,6,15,0.60) 50%, rgba(4,6,15,0.55) 65%, rgba(4,6,15,0.25) 90%, transparent 100%)`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.60) 50%, rgba(255,255,255,0.45) 60%, transparent 80%, transparent 100%)',
                    animation: 'navbar-shimmer 8s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Top separator line — softer, with prismatic gradient fade */}
              <div
                className="mx-6 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.05) 12%, rgba(139,92,246,0.06) 28%, rgba(255,255,255,0.08) 50%, rgba(139,92,246,0.06) 72%, rgba(45,140,240,0.05) 88%, transparent)',
                }}
              />

              <ul className="flex flex-col gap-0.5 px-3 py-3">
                {NAV_LINKS.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -16, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -16, filter: 'blur(8px)' }}
                      transition={{
                        duration: 0.5,
                        delay: 0.08 + index * 0.06,
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
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.09) 35%, rgba(45,140,240,0.07) 65%, rgba(20,184,166,0.09) 100%)',
                                boxShadow: [
                                  'inset 0 1px 0 rgba(255,255,255,0.14)',
                                  'inset 0 0 0 1px rgba(255,255,255,0.09)',
                                  '0 0 28px rgba(99,102,241,0.06)',
                                  '0 0 56px rgba(139,92,246,0.03)',
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
                                background: 'linear-gradient(180deg, #60a5fa 0%, #818cf8 20%, #8b5cf6 40%, #a855f7 60%, #14b8a6 80%, #06b6d4 100%)',
                                boxShadow: [
                                  '0 0 6px rgba(99,102,241,0.55)',
                                  '0 0 3px rgba(96,165,250,0.40)',
                                  '0 0 14px rgba(139,92,246,0.18)',
                                ].join(', '),
                              }}
                              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            />
                          )}
                          {link.label}
                          {active && (
                            <span
                              className="ml-auto w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'radial-gradient(circle, #e0e7ff 0%, #c7d2fe 18%, #a5b4fc 35%, #818cf8 50%, rgba(99,102,241,0.40) 70%, transparent 100%)',
                                boxShadow: [
                                  '0 0 3px 1px rgba(99, 102, 241, 0.45)',
                                  '0 0 10px 2px rgba(99, 102, 241, 0.18)',
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
            0% { transform: translateX(-300%); }
            100% { transform: translateX(300%); }
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
            100% { background-position: 300% 50%; }
          }
          @keyframes navbar-dot-pulse {
            0%, 100% {
              opacity: 0.50;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateX(-50%) scale(1.5);
            }
          }
          @keyframes navbar-conic-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes navbar-logo-sweep-move {
            0% { transform: translateX(-120%); }
            40% { transform: translateX(120%); }
            100% { transform: translateX(120%); }
          }
        `}} />
      </nav>
    </motion.header>
  );
}

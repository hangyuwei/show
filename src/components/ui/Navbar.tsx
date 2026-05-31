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
        // Ease-out curve for smoother perceived transition
        const progress = 1 - Math.pow(1 - raw, 3);
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

  // ── Enhanced glass effect interpolation ──
  // Wider range: nearly transparent at top, richly frosted when scrolled
  const glassBgOpacity = 0.02 + scrollProgress * 0.18;
  const glassBorderOpacity = 0.04 + scrollProgress * 0.16;
  const glassShadowOpacity = scrollProgress * 0.45;
  const glassBlur = 12 + scrollProgress * 20;
  const glassSaturation = 1.15 + scrollProgress * 0.45;
  // Subtle color tint shift: cooler at top, warmer purple tint when scrolled
  const bgR = Math.round(6 + scrollProgress * 6);
  const bgG = Math.round(9 + scrollProgress * 3);
  const bgB = Math.round(26 + scrollProgress * 20);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className="relative flex h-16 items-center justify-between rounded-b-2xl px-6 transition-[box-shadow] duration-500"
          style={{
            backgroundColor: `rgba(${bgR}, ${bgG}, ${bgB}, ${glassBgOpacity})`,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderTopWidth: '0px',
            borderBottomWidth: '1px',
            borderLeftColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.6})`,
            borderRightColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.6})`,
            borderBottomColor: `rgba(255, 255, 255, ${glassBorderOpacity})`,
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
            backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation})`,
            WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation})`,
            boxShadow: [
              `0 1px 2px rgba(0,0,0,${0.1 + scrollProgress * 0.15})`,
              `0 4px 16px rgba(0,0,0,${glassShadowOpacity * 0.4})`,
              `0 12px 40px rgba(0,0,0,${glassShadowOpacity})`,
              `0 24px 80px rgba(0,0,0,${glassShadowOpacity * 0.5})`,
              `inset 0 1px 0 rgba(255,255,255,${0.02 + scrollProgress * 0.06})`,
              `inset 0 -1px 0 rgba(0,0,0,${0.05 + scrollProgress * 0.1})`,
            ].join(', '),
          }}
        >
          {/* ── Noise texture overlay for realistic frost ── */}
          <div
            className="pointer-events-none absolute inset-0 rounded-b-2xl"
            style={{
              opacity: 0.015 + scrollProgress * 0.025,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* ── Ambient top-edge highlight (simulates light reflection) ── */}
          <div
            className="pointer-events-none absolute top-0 left-[10%] right-[10%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.03 + scrollProgress * 0.08}) 30%, rgba(255,255,255,${0.05 + scrollProgress * 0.12}) 50%, rgba(255,255,255,${0.03 + scrollProgress * 0.08}) 70%, transparent)`,
              borderTopLeftRadius: '0',
              borderTopRightRadius: '0',
            }}
          />

          {/* ── Animated gradient border bottom — rotating conic + shimmer ── */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden"
            style={{ height: '2px' }}
          >
            {/* Rotating conic gradient border */}
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from var(--navbar-border-angle, 0deg), #3b82f6, #8b5cf6, #14b8a6, #3b82f6)`,
                animation: 'navbar-border-spin 6s linear infinite',
              }}
            />
            {/* Center fade mask to only show edges and hide the middle slightly */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.5) 20%, rgba(4,6,15,0.7) 50%, rgba(4,6,15,0.5) 80%, transparent 100%)`,
              }}
            />
            {/* Traveling shimmer highlight */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 35%, rgba(255,255,255,0.6) 50%, transparent 65%, transparent 100%)',
                animation: 'navbar-shimmer 5s ease-in-out infinite',
              }}
            />
          </div>

          {/* ── Logo ── */}
          <Link
            href="/"
            className="relative group flex items-center gap-2"
          >
            {/* Logo ambient glow backdrop */}
            <span
              className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.06) 45%, transparent 70%)',
              }}
            />
            {/* Logo outer ring pulse on hover */}
            <span
              className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
              style={{
                border: '1px solid rgba(139,92,246,0.12)',
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.04) 0%, transparent 70%)',
              }}
            />

            {/* "Hang" text — animated gradient with stronger colors */}
            <span
              className="relative text-lg font-bold tracking-wide transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #93c5fd 0%, #a78bfa 25%, #c084fc 50%, #818cf8 75%, #93c5fd 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-gradient 8s ease infinite',
                filter: `drop-shadow(0 0 12px rgba(139, 92, 246, ${0.25 + scrollProgress * 0.15}))`,
              }}
            >
              Hang
            </span>

            {/* "Portfolio" text — subtle silver with gentle shimmer */}
            <span
              className="relative text-lg font-light tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #94a3b8 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-subtle 10s ease infinite',
                filter: 'drop-shadow(0 0 6px rgba(148, 163, 184, 0.15))',
              }}
            >
              Portfolio
            </span>

            {/* Hover underline accent */}
            <span
              className="absolute -bottom-1 left-0 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, rgba(139,92,246,0.4), rgba(59,130,246,0.6), rgba(20,184,166,0.3))',
              }}
            />
          </Link>

          {/* ── Desktop Navigation ── */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative group/nav">
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {/* Active background pill with animated gradient */}
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(59,130,246,0.06) 50%, rgba(20,184,166,0.08) 100%)',
                          boxShadow: [
                            'inset 0 1px 0 rgba(255,255,255,0.10)',
                            'inset 0 0 0 1px rgba(255,255,255,0.06)',
                            '0 0 16px rgba(139,92,246,0.06)',
                            '0 0 4px rgba(139,92,246,0.10)',
                          ].join(', '),
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Hover background glow for inactive items */}
                    {!active && (
                      <span
                        className="absolute inset-0 rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                        }}
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>

                    {/* Underline animation — active: gradient glow; hover: subtle white */}
                    <span
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ease-out ${
                        active ? 'w-6' : 'w-0 group-hover/nav:w-5'
                      }`}
                      style={
                        active
                          ? {
                              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #14b8a6)',
                              boxShadow: '0 0 10px rgba(139,92,246,0.5), 0 0 3px rgba(59,130,246,0.8)',
                            }
                          : { background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5), rgba(255,255,255,0.2))' }
                      }
                    />
                  </Link>

                  {/* Active route glowing dot with pulse */}
                  {active && (
                    <motion.span
                      layoutId="navbar-glowing-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #e0d4ff 0%, #c4b5fd 20%, #8b5cf6 50%, rgba(139,92,246,0.3) 80%, transparent 100%)',
                        boxShadow: '0 0 4px 1px rgba(139, 92, 246, 0.6), 0 0 12px 3px rgba(139, 92, 246, 0.20)',
                        animation: 'navbar-dot-pulse 3s ease-in-out infinite',
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
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-all duration-300"
            style={{
              // Subtle hover background
            }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
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
                  width: mobileMenuOpen ? '20px' : '20px',
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Button tap feedback ring */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    border: '1px solid rgba(139,92,246,0.3)',
                  }}
                />
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden rounded-b-2xl relative"
              style={{
                backgroundColor: `rgba(${bgR}, ${bgG}, ${bgB}, 0.92)`,
                backdropFilter: 'blur(32px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopWidth: '0px',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
                borderLeftColor: `rgba(255,255,255,${glassBorderOpacity * 0.6})`,
                borderRightColor: `rgba(255,255,255,${glassBorderOpacity * 0.6})`,
                borderBottomColor: `rgba(255,255,255,${glassBorderOpacity})`,
                boxShadow: [
                  `0 8px 32px rgba(0,0,0,0.4)`,
                  `0 2px 8px rgba(0,0,0,0.2)`,
                  `inset 0 1px 0 rgba(255,255,255,0.05)`,
                ].join(', '),
              }}
            >
              {/* Mobile menu noise overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-b-2xl"
                style={{
                  opacity: 0.02,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay',
                }}
              />

              {/* Animated bottom gradient border for mobile */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden"
                style={{ height: '2px' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(from var(--navbar-border-angle, 0deg), #3b82f6, #8b5cf6, #14b8a6, #3b82f6)`,
                    animation: 'navbar-border-spin 6s linear infinite',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.5) 20%, rgba(4,6,15,0.7) 50%, rgba(4,6,15,0.5) 80%, transparent 100%)`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%, transparent 100%)',
                    animation: 'navbar-shimmer 5s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Top separator line */}
              <div
                className="mx-4 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
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
                        duration: 0.35,
                        delay: index * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`relative block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          active
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        style={
                          active
                            ? {
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(59,130,246,0.06) 50%, rgba(20,184,166,0.08) 100%)',
                                boxShadow: [
                                  'inset 0 1px 0 rgba(255,255,255,0.08)',
                                  'inset 0 0 0 1px rgba(255,255,255,0.05)',
                                  '0 0 20px rgba(139,92,246,0.04)',
                                ].join(', '),
                              }
                            : {}
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          {/* Active indicator bar on left — gradient with glow */}
                          {active && (
                            <motion.span
                              layoutId="navbar-mobile-active-bar"
                              className="w-[3px] h-4 rounded-full"
                              style={{
                                background: 'linear-gradient(180deg, #60a5fa 0%, #8b5cf6 50%, #14b8a6 100%)',
                                boxShadow: '0 0 8px rgba(139,92,246,0.5), 0 0 3px rgba(96,165,250,0.4)',
                              }}
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          {link.label}
                          {active && (
                            <span
                              className="ml-auto w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'radial-gradient(circle, #e0d4ff 0%, #c4b5fd 30%, rgba(139,92,246,0.5) 60%, transparent 100%)',
                                boxShadow: '0 0 5px 2px rgba(139, 92, 246, 0.35)',
                                animation: 'navbar-dot-pulse 3s ease-in-out infinite',
                              }}
                            />
                          )}
                        </span>

                        {/* Mobile hover state — right-side highlight edge */}
                        {!active && (
                          <span
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover/nav:h-4 rounded-full bg-white/20 transition-all duration-300 opacity-0"
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Scoped keyframes ── */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes navbar-shimmer {
            0% { transform: translateX(-200%); }
            100% { transform: translateX(200%); }
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
          @keyframes navbar-border-spin {
            from { --navbar-border-angle: 0deg; }
            to { --navbar-border-angle: 360deg; }
          }
          @keyframes navbar-dot-pulse {
            0%, 100% {
              opacity: 0.6;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateX(-50%) scale(1.4);
            }
          }
          /* Fallback for browsers that don't support @property for custom properties in keyframes */
          @property --navbar-border-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
        `}} />
      </nav>
    </motion.header>
  );
}

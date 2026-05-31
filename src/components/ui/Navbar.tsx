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
  // At top: nearly invisible. When scrolled: richly frosted with depth.
  const glassBgOpacity = 0.03 + scrollProgress * 0.22;
  const glassBorderOpacity = 0.05 + scrollProgress * 0.18;
  const glassBlur = 14 + scrollProgress * 22;
  const glassSaturation = 1.2 + scrollProgress * 0.5;

  // Refined color tint: deep navy that shifts subtly toward indigo when scrolled
  const bgR = Math.round(6 + scrollProgress * 8);
  const bgG = Math.round(8 + scrollProgress * 4);
  const bgB = Math.round(28 + scrollProgress * 22);

  // Shadow layers: four-tier depth system for premium feel
  const shadowLayer1 = `0 1px 2px rgba(0,0,0,${0.08 + scrollProgress * 0.12})`;
  const shadowLayer2 = `0 4px 12px rgba(0,0,0,${scrollProgress * 0.15})`;
  const shadowLayer3 = `0 12px 36px rgba(0,0,0,${scrollProgress * 0.25})`;
  const shadowLayer4 = `0 28px 72px -4px rgba(0,0,0,${scrollProgress * 0.18})`;
  const shadowInsetTop = `inset 0 1px 0 rgba(255,255,255,${0.03 + scrollProgress * 0.07})`;
  const shadowInsetBot = `inset 0 -1px 0 rgba(0,0,0,${0.05 + scrollProgress * 0.08})`;
  const shadowGlow = scrollProgress > 0.3
    ? `0 0 60px -12px rgba(139,92,246,${scrollProgress * 0.06})`
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
            borderLeftColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.5})`,
            borderRightColor: `rgba(255, 255, 255, ${glassBorderOpacity * 0.5})`,
            borderBottomColor: `rgba(255, 255, 255, ${glassBorderOpacity})`,
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
            backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation})`,
            WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation})`,
            boxShadow: [
              shadowLayer1,
              shadowLayer2,
              shadowLayer3,
              shadowLayer4,
              shadowInsetTop,
              shadowInsetBot,
              shadowGlow,
            ].join(', '),
          }}
        >
          {/* ── Noise texture overlay for realistic frost grain ── */}
          <div
            className="pointer-events-none absolute inset-0 rounded-b-2xl"
            style={{
              opacity: 0.018 + scrollProgress * 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* ── Refraction highlight — top edge light caustic ── */}
          <div
            className="pointer-events-none absolute top-0 left-[8%] right-[8%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.04 + scrollProgress * 0.1}) 25%, rgba(200,220,255,${0.06 + scrollProgress * 0.14}) 50%, rgba(255,255,255,${0.04 + scrollProgress * 0.1}) 75%, transparent)`,
            }}
          />

          {/* ── Secondary refraction band — subtle second light scatter ── */}
          <div
            className="pointer-events-none absolute top-[1px] left-[15%] right-[15%] h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(139,92,246,${scrollProgress * 0.04}) 30%, rgba(59,130,246,${scrollProgress * 0.06}) 50%, rgba(139,92,246,${scrollProgress * 0.04}) 70%, transparent)`,
              opacity: scrollProgress,
            }}
          />

          {/* ── Animated gradient border bottom — dual-layer with smoother rotation ── */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden"
            style={{ height: '2px' }}
          >
            {/* Primary rotating gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, #3b82f6, #8b5cf6 30%, #14b8a6 60%, #3b82f6)`,
                backgroundSize: '200% 100%',
                animation: 'navbar-border-flow 4s linear infinite',
              }}
            />
            {/* Fade mask to soften center, show edges */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.35) 15%, rgba(4,6,15,0.6) 50%, rgba(4,6,15,0.35) 85%, transparent 100%)`,
              }}
            />
            {/* Traveling shimmer highlight */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%, transparent 100%)',
                animation: 'navbar-shimmer 6s ease-in-out infinite',
              }}
            />
          </div>

          {/* ── Logo ── */}
          <Link
            href="/"
            className="relative group flex items-center gap-2.5"
          >
            {/* Logo ambient glow — wider, softer radial */}
            <span
              className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.10) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
              }}
            />

            {/* Logo outer ring — subtle containment glow on hover */}
            <span
              className="absolute -inset-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-[1.02]"
              style={{
                border: '1px solid rgba(139,92,246,0.10)',
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.03) 0%, transparent 70%)',
              }}
            />

            {/* "Hang" text — animated gradient with refined color stops */}
            <span
              className="relative text-lg font-bold tracking-wide transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #93c5fd 0%, #a78bfa 20%, #c084fc 40%, #818cf8 60%, #60a5fa 80%, #93c5fd 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-gradient 8s ease infinite',
                filter: `drop-shadow(0 0 ${10 + scrollProgress * 6}px rgba(139, 92, 246, ${0.20 + scrollProgress * 0.15}))`,
              }}
            >
              Hang
            </span>

            {/* Separator dot between logo words */}
            <span
              className="relative w-[3px] h-[3px] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                boxShadow: '0 0 4px rgba(139,92,246,0.3)',
              }}
            />

            {/* "Portfolio" text — refined silver with gentle shimmer */}
            <span
              className="relative text-base font-light tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #94a3b8 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-subtle 10s ease infinite',
                filter: 'drop-shadow(0 0 4px rgba(148, 163, 184, 0.12))',
              }}
            >
              Portfolio
            </span>

            {/* Hover underline accent — refined gradient sweep */}
            <span
              className="absolute -bottom-1.5 left-0 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(59,130,246,0.5), rgba(20,184,166,0.25))',
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
                    {/* Active background pill — premium glass pill with inner glow */}
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.07) 50%, rgba(20,184,166,0.09) 100%)',
                          boxShadow: [
                            'inset 0 1px 0 rgba(255,255,255,0.12)',
                            'inset 0 0 0 1px rgba(255,255,255,0.07)',
                            '0 0 20px rgba(139,92,246,0.05)',
                            '0 0 6px rgba(139,92,246,0.08)',
                          ].join(', '),
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Hover background glow for inactive items */}
                    {!active && (
                      <span
                        className="absolute inset-0 rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 ease-out"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
                        }}
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>

                    {/* Underline — active: gradient glow with soft spread; hover: gentle white */}
                    <span
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ease-out ${
                        active ? 'w-5' : 'w-0 group-hover/nav:w-4'
                      }`}
                      style={
                        active
                          ? {
                              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #14b8a6)',
                              boxShadow: '0 0 8px rgba(139,92,246,0.45), 0 0 20px rgba(59,130,246,0.15)',
                            }
                          : { background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.45), rgba(255,255,255,0.15))' }
                      }
                    />
                  </Link>

                  {/* Active route glowing dot — softer, more refined pulse */}
                  {active && (
                    <motion.span
                      layoutId="navbar-glowing-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #ede9fe 0%, #c4b5fd 25%, #8b5cf6 55%, rgba(139,92,246,0.25) 80%, transparent 100%)',
                        boxShadow: '0 0 3px 1px rgba(139, 92, 246, 0.50), 0 0 10px 2px rgba(139, 92, 246, 0.15)',
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
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
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
                  animate={{ scale: 1.6, opacity: 0 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    border: '1px solid rgba(139,92,246,0.25)',
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.3 },
              }}
              className="md:hidden overflow-hidden relative"
              style={{
                backgroundColor: `rgba(${bgR}, ${bgG}, ${bgB}, 0.94)`,
                backdropFilter: 'blur(36px) saturate(1.7)',
                WebkitBackdropFilter: 'blur(36px) saturate(1.7)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopWidth: '0px',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
                borderLeftColor: `rgba(255,255,255,${glassBorderOpacity * 0.5})`,
                borderRightColor: `rgba(255,255,255,${glassBorderOpacity * 0.5})`,
                borderBottomColor: `rgba(255,255,255,${glassBorderOpacity})`,
                boxShadow: [
                  `0 12px 40px rgba(0,0,0,0.35)`,
                  `0 4px 12px rgba(0,0,0,0.20)`,
                  `inset 0 1px 0 rgba(255,255,255,0.06)`,
                  `0 0 50px -10px rgba(139,92,246,0.05)`,
                ].join(', '),
              }}
            >
              {/* Mobile menu noise overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-b-2xl"
                style={{
                  opacity: 0.022,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
                    background: `linear-gradient(90deg, #3b82f6, #8b5cf6 30%, #14b8a6 60%, #3b82f6)`,
                    backgroundSize: '200% 100%',
                    animation: 'navbar-border-flow 4s linear infinite',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(4,6,15,0.4) 15%, rgba(4,6,15,0.55) 50%, rgba(4,6,15,0.4) 85%, transparent 100%)`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%, transparent 100%)',
                    animation: 'navbar-shimmer 6s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Top separator line — softer, with gradient fade */}
              <div
                className="mx-6 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.06) 80%, transparent)',
                }}
              />

              <ul className="flex flex-col gap-0.5 px-3 py-3">
                {NAV_LINKS.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05 + index * 0.06,
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
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(59,130,246,0.06) 50%, rgba(20,184,166,0.08) 100%)',
                                boxShadow: [
                                  'inset 0 1px 0 rgba(255,255,255,0.10)',
                                  'inset 0 0 0 1px rgba(255,255,255,0.06)',
                                  '0 0 24px rgba(139,92,246,0.04)',
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
                                boxShadow: '0 0 6px rgba(139,92,246,0.45), 0 0 2px rgba(96,165,250,0.35)',
                              }}
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          {link.label}
                          {active && (
                            <span
                              className="ml-auto w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'radial-gradient(circle, #ede9fe 0%, #c4b5fd 25%, rgba(139,92,246,0.4) 60%, transparent 100%)',
                                boxShadow: '0 0 4px 1px rgba(139, 92, 246, 0.30)',
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
          @keyframes navbar-border-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          @keyframes navbar-dot-pulse {
            0%, 100% {
              opacity: 0.55;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateX(-50%) scale(1.35);
            }
          }
        `}} />
      </nav>
    </motion.header>
  );
}

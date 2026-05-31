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
        // Smoothly interpolate from 0 to 1 over first 80px of scroll
        const progress = Math.min(scrollY / 80, 1);
        setScrollProgress(progress);
        tickingRef.current = false;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Set initial scroll state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Interpolated glass effect values based on scroll
  const glassBgOpacity = 0.04 + scrollProgress * 0.1;
  const glassBorderOpacity = 0.06 + scrollProgress * 0.12;
  const glassShadowOpacity = scrollProgress * 0.35;
  const glassBlur = 16 + scrollProgress * 8;

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
            backgroundColor: `rgba(6, 9, 26, ${glassBgOpacity})`,
            borderColor: `rgba(255, 255, 255, ${glassBorderOpacity})`,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderTopWidth: '0px',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
            backdropFilter: `blur(${glassBlur}px) saturate(${1.2 + scrollProgress * 0.3})`,
            WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${1.2 + scrollProgress * 0.3})`,
            boxShadow: `0 8px 32px rgba(0,0,0,${glassShadowOpacity}), 0 2px 8px rgba(0,0,0,${glassShadowOpacity * 0.6}), inset 0 1px 0 rgba(255,255,255,${0.02 + scrollProgress * 0.04})`,
          }}
        >
          {/* Animated gradient border bottom - shimmer effect */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] rounded-b-2xl overflow-hidden"
          >
            {/* Base gradient line */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 15%, rgba(139,92,246,0.5) 50%, rgba(20,184,166,0.3) 85%, transparent 100%)',
              }}
            />
            {/* Traveling shimmer highlight */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, transparent 100%)',
                animation: 'navbar-shimmer 4s ease-in-out infinite',
              }}
            />
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="relative group flex items-center gap-2"
          >
            {/* Logo glow backdrop */}
            <span
              className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 75%)',
              }}
            />
            <span
              className="relative text-lg font-bold tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 40%, #c084fc 70%, #60a5fa 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'navbar-logo-gradient 6s ease infinite',
                filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.35))',
              }}
            >
              Hang
            </span>
            <span
              className="relative text-lg font-light tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.2))',
              }}
            >
              Portfolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 12px rgba(139,92,246,0.08)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>

                    {/* Underline animation */}
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ease-out ${
                        active
                          ? 'w-5'
                          : 'w-0 group-hover:w-4'
                      }`}
                      style={
                        active
                          ? {
                              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #14b8a6)',
                              boxShadow: '0 0 8px rgba(139,92,246,0.5), 0 0 2px rgba(59,130,246,0.8)',
                            }
                          : { background: 'rgba(255,255,255,0.4)' }
                      }
                    />
                  </Link>

                  {/* Active route glowing dot with pulse */}
                  {active && (
                    <motion.span
                      layoutId="navbar-glowing-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #c4b5fd 0%, #8b5cf6 40%, rgba(139,92,246,0.4) 70%, transparent 100%)',
                        boxShadow: '0 0 6px 2px rgba(139, 92, 246, 0.5), 0 0 16px 4px rgba(139, 92, 246, 0.15)',
                        animation: 'navbar-dot-pulse 2.5s ease-in-out infinite',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 h-5 relative flex flex-col items-center justify-center">
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full"
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 0 : -5,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full"
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  scaleX: mobileMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full"
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? 0 : 5,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden rounded-b-2xl"
              style={{
                backgroundColor: 'rgba(6, 9, 26, 0.85)',
                backdropFilter: 'blur(24px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderTopWidth: '0px',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {/* Animated bottom gradient border for mobile */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] rounded-b-2xl overflow-hidden"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 15%, rgba(139,92,246,0.5) 50%, rgba(20,184,166,0.3) 85%, transparent 100%)',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%, transparent 100%)',
                    animation: 'navbar-shimmer 4s ease-in-out infinite',
                  }}
                />
              </div>

              <ul className="flex flex-col gap-1 px-4 py-3">
                {NAV_LINKS.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`relative block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                          active
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        style={
                          active
                            ? {
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%)',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 16px rgba(139,92,246,0.06)',
                              }
                            : {}
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          {/* Active indicator bar on left */}
                          {active && (
                            <motion.span
                              layoutId="navbar-mobile-active-bar"
                              className="w-[3px] h-4 rounded-full"
                              style={{
                                background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)',
                                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
                              }}
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          {link.label}
                          {active && (
                            <span
                              className="ml-auto w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'radial-gradient(circle, #c4b5fd 0%, rgba(139,92,246,0.6) 60%, transparent 100%)',
                                boxShadow: '0 0 6px 2px rgba(139, 92, 246, 0.4)',
                                animation: 'navbar-dot-pulse 2.5s ease-in-out infinite',
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

        {/* Scoped keyframes */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes navbar-shimmer {
            0% { transform: translateX(-150%); }
            100% { transform: translateX(150%); }
          }
          @keyframes navbar-logo-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes navbar-dot-pulse {
            0%, 100% {
              opacity: 0.7;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 1;
              transform: translateX(-50%) scale(1.3);
            }
          }
        `}} />
      </nav>
    </motion.header>
  );
}

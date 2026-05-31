'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

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
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className={`relative flex h-16 items-center justify-between rounded-b-2xl px-6 transition-all duration-500 backdrop-blur-xl bg-white/[0.06] border border-white/[0.08] border-t-0 ${
            scrolled
              ? 'shadow-[0_8px_32px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2)]'
              : 'shadow-none'
          }`}
        >
          {/* Bottom gradient border (blue to purple to transparent) */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] rounded-b-2xl"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.6) 20%, rgba(139,92,246,0.6) 50%, rgba(139,92,246,0.3) 70%, transparent 100%)',
            }}
          />

          {/* Logo */}
          <Link
            href="/"
            className="relative text-lg font-bold tracking-wide transition-opacity hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.4))',
            }}
          >
            Hang&apos;s Portfolio
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors group ${
                      active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        className="absolute inset-0 rounded-lg bg-white/10 border border-white/20"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>

                    {/* Underline animation from center outward on hover */}
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ease-out ${
                        active
                          ? 'w-4 bg-gradient-to-r from-blue-400 to-purple-400'
                          : 'w-0 group-hover:w-4 bg-white/50'
                      }`}
                    />
                  </Link>

                  {/* Active route glowing dot */}
                  {active && (
                    <motion.span
                      layoutId="navbar-glowing-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #a78bfa 0%, rgba(139,92,246,0.6) 60%, transparent 100%)',
                        boxShadow: '0 0 6px 2px rgba(139, 92, 246, 0.5), 0 0 12px 4px rgba(139, 92, 246, 0.2)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button - smoother animated hamburger */}
          <button
            type="button"
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full"
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  scaleX: mobileMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className="absolute block w-5 h-[1.5px] bg-current rounded-full"
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? 0 : 5,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden rounded-b-2xl backdrop-blur-xl bg-white/[0.06] border border-white/[0.08] border-t-0"
            >
              {/* Bottom gradient border for mobile menu */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] rounded-b-2xl"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 20%, rgba(139,92,246,0.4) 50%, rgba(139,92,246,0.2) 70%, transparent 100%)',
                }}
              />
              <ul className="flex flex-col gap-1 px-4 py-3">
                {NAV_LINKS.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.05,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`relative block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? 'text-white bg-white/10 border border-white/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          {link.label}
                          {active && (
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: 'radial-gradient(circle, #a78bfa 0%, rgba(139,92,246,0.6) 60%, transparent 100%)',
                                boxShadow: '0 0 6px 2px rgba(139, 92, 246, 0.4)',
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
      </nav>
    </motion.header>
  );
}

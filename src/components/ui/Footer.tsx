'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto relative">
      {/* Multi-color gradient top border — five-stop aurora shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/35 via-[var(--accent-purple)]/28 via-[var(--color-accent-teal)]/22 to-transparent" />
      {/* Soft glow bleed below the border */}
      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-r from-transparent via-[var(--accent)]/[0.035] to-transparent blur-lg pointer-events-none" />
      {/* Ambient glow at center — wider spread with aurora warmth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-12 bg-gradient-to-b from-[var(--accent-purple)]/[0.04] to-transparent blur-xl pointer-events-none" />
      {/* Secondary teal ambient glow offset left */}
      <div className="absolute top-0 left-1/4 w-1/4 h-8 bg-gradient-to-b from-[var(--color-accent-teal)]/[0.025] to-transparent blur-lg pointer-events-none" />
      {/* Warm anchor glow offset right — for color harmony */}
      <div className="absolute top-0 right-1/4 w-1/5 h-6 bg-gradient-to-b from-[var(--accent)]/[0.02] to-transparent blur-md pointer-events-none" />

      {/* Subtle background pattern — refined dot grid */}
      <div
        className="absolute inset-0 opacity-[0.010]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 pt-5">
        <div className="relative rounded-2xl backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden shadow-[0_4px_28px_rgba(0,0,0,0.18),0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_36px_rgba(0,0,0,0.24),0_2px_8px_rgba(0,0,0,0.10)] transition-shadow duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {/* Inner top gradient accent line — aurora three-stop */}
          <div className="h-px bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/22 via-[var(--accent-purple)]/14 to-[var(--accent)]/0" />
          {/* Soft inner glow reflection at top */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
          {/* Traveling border shimmer — aurora spectrum */}
          <div className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent animate-[shimmer_7s_ease-in-out_infinite] pointer-events-none" />

          <div className="flex items-center justify-between px-7 py-5">
            {/* Left: Copyright with animated accent dot */}
            <span className="text-xs text-white/28 flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--color-accent-teal)] opacity-45 animate-[breathe_5s_ease-in-out_infinite] shadow-[0_0_10px_rgba(45,140,240,0.30),0_0_20px_rgba(20,184,166,0.12)]" />
              <span className="tracking-wide">&copy; 2024&ndash;2026 Hang</span>
            </span>

            {/* Center: Navigation links */}
            <nav className="hidden sm:flex items-center gap-4">
              <a
                href="https://github.com/hangyuwei"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-xs text-white/28 hover:text-[var(--accent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2 relative"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(45,140,240,0.28)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="relative">
                  GitHub
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[var(--accent)] via-[var(--accent-purple)]/55 to-[var(--color-accent-teal)] transition-all duration-600 group-hover:w-full" />
                </span>
              </a>

              {/* Separator with gradient */}
              <span className="w-px h-3.5 bg-gradient-to-b from-transparent via-white/8 to-transparent" />

              <a
                href="mailto:13811282241@163.com"
                className="group text-xs text-white/28 hover:text-[var(--accent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2 relative"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(45,140,240,0.28)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span className="relative">
                  Email
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[var(--accent)] via-[var(--accent-purple)]/55 to-[var(--color-accent-teal)] transition-all duration-600 group-hover:w-full" />
                </span>
              </a>
            </nav>

            {/* Mobile: links (visible on small screens) */}
            <div className="sm:hidden flex items-center gap-3">
              <a
                href="https://github.com/hangyuwei"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/28 hover:text-[var(--accent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </a>
              <span className="w-px h-3 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
              <a
                href="mailto:13811282241@163.com"
                className="text-xs text-white/28 hover:text-[var(--accent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Email
              </a>
            </div>

            {/* Right: Back to top */}
            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              className="group/btn text-xs text-white/28 hover:text-[var(--accent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-1.5 relative"
            >
              <svg
                className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:-translate-y-1 group-hover/btn:drop-shadow-[0_0_8px_rgba(45,140,240,0.30)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
              </svg>
              <span className="relative">
                顶部
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[var(--accent)] via-[var(--accent-purple)]/45 to-[var(--color-accent-teal)] transition-all duration-600 group-hover/btn:w-full" />
              </span>
            </motion.button>
          </div>

          {/* Bottom inner gradient line — teal anchor for visual balance */}
          <div className="h-px bg-gradient-to-r from-[var(--accent)]/0 via-[var(--color-accent-teal)]/12 via-[var(--accent-purple)]/6 to-[var(--accent)]/0" />
        </div>
      </div>
    </footer>
  );
}

'use client';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto relative">
      {/* Enhanced gradient top border with glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-transparent via-[var(--accent)]/5 to-transparent blur-sm pointer-events-none" />

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 pt-6">
        <div className="rounded-2xl backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden">
          {/* Inner gradient accent line at top of card */}
          <div className="h-px bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/30 to-[var(--accent)]/0" />

          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Copyright with subtle accent */}
            <span className="text-xs text-white/40 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--color-accent-teal)] opacity-60" />
              &copy; 2024&ndash;2026 Hang
            </span>

            {/* Center: Navigation links */}
            <nav className="hidden sm:flex items-center gap-4">
              <a
                href="https://github.com/hangyuwei"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-xs text-white/45 hover:text-[var(--accent)] transition-all duration-300 flex items-center gap-1.5 relative"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110"
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
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>

              <span className="w-px h-3 bg-gradient-to-b from-transparent via-white/15 to-transparent" />

              <a
                href="mailto:13811282241@163.com"
                className="group text-xs text-white/45 hover:text-[var(--accent)] transition-all duration-300 flex items-center gap-1.5 relative"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110"
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
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
            </nav>

            {/* Mobile: GitHub link (visible on small screens) */}
            <a
              href="https://github.com/hangyuwei"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden text-xs text-white/45 hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-1.5"
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

            {/* Right: Back to top with enhanced hover */}
            <button
              type="button"
              onClick={scrollToTop}
              className="group/btn text-xs text-white/45 hover:text-[var(--accent)] transition-all duration-300 flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5"
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
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--accent)] transition-all duration-300 group-hover/btn:w-full" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

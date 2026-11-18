'use client';

/**
 * HUD frame overlay — brings the Project Universe's telemetry language to the
 * other pages: corner brackets, live-ticking readouts, a slow scanline sweep.
 * Purely decorative, entirely pointer-events-none, cheap DOM (one 500ms ticker).
 */

import { useEffect, useState } from 'react';

const CORNER = 'pointer-events-none absolute h-7 w-7 border-cyan-300/45';

function pad(value: number, length = 2) {
  return String(Math.floor(value)).padStart(length, '0');
}

export default function HudFrame({
  label,
  meta,
  sideTicks = false,
  className = '',
}: {
  label: string;
  meta?: string;
  sideTicks?: boolean;
  className?: string;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 500);
    return () => window.clearInterval(id);
  }, []);

  const elapsed = tick * 0.5;
  const az = (214 + Math.sin(elapsed * 0.3) * 18).toFixed(1);
  const el = (12 + Math.cos(elapsed * 0.22) * 6).toFixed(1);
  const vel = (0.82 + Math.sin(elapsed * 0.7) * 0.14).toFixed(2);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-30 overflow-hidden font-mono text-[10px] tracking-[0.22em] text-cyan-200/70 ${className}`}
    >
      {/* corner brackets */}
      <div className={`${CORNER} left-3 top-3 border-l border-t sm:left-5 sm:top-5`} />
      <div className={`${CORNER} right-3 top-3 border-r border-t sm:right-5 sm:top-5`} />
      <div className={`${CORNER} bottom-3 left-3 border-b border-l sm:bottom-5 sm:left-5`} />
      <div className={`${CORNER} bottom-3 right-3 border-b border-r sm:bottom-5 sm:right-5`} />

      {/* top-left telemetry */}
      <div className="absolute left-6 top-6 hidden items-center gap-2.5 sm:left-9 sm:top-9 md:flex">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
        </span>
        <span>SYS/ONLINE</span>
        <span className="text-cyan-200/40">·</span>
        <span>
          T+{pad(elapsed / 60)}:{pad(elapsed % 60)}
        </span>
        <span className="text-cyan-200/40">·</span>
        <span>V {vel}</span>
      </div>

      {/* top-right label chip */}
      <div className="absolute right-6 top-6 hidden rounded-sm border border-cyan-300/25 bg-cyan-300/[0.05] px-2.5 py-1 backdrop-blur-[2px] sm:right-9 sm:top-9 md:block">
        {label}
      </div>

      {/* bottom-left coordinates */}
      <div className="absolute bottom-6 left-6 hidden sm:bottom-9 sm:left-9 md:block">
        AZ {az}° · EL {el}° · SIG 98.2%
      </div>

      {/* bottom-right meta */}
      {meta ? (
        <div className="absolute bottom-6 right-6 hidden text-cyan-200/45 sm:bottom-9 sm:right-9 md:block">
          {meta}
        </div>
      ) : null}

      {/* optional side depth scale */}
      {sideTicks ? (
        <div className="absolute left-4 top-1/2 hidden h-[38vh] -translate-y-1/2 sm:left-6 md:block">
          <div
            className="h-full w-2"
            style={{
              backgroundImage: 'repeating-linear-gradient(180deg, rgba(103,232,249,0.42) 0px, rgba(103,232,249,0.42) 1px, transparent 1px, transparent 14px)',
            }}
          />
          <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border border-cyan-200/70 bg-cyan-300/20 shadow-[0_0_12px_rgba(103,232,249,0.5)]" style={{ left: '-0.3rem' }} />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-cyan-200/50">
            DEPTH {(0.31 + Math.sin(elapsed * 0.4) * 0.02).toFixed(3)} AU
          </div>
        </div>
      ) : null}

      {/* scanline sweep */}
      <div className="absolute inset-x-0 h-px animate-[hud-scan_7s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
    </div>
  );
}

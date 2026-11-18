'use client';

/**
 * Page integration wrappers for the copy-adapted ThreeUI Community components
 * (https://github.com/MengTo/threeui — MIT). Each wrapper fixes positioning,
 * loads its canvas lazily, and bows out entirely under prefers-reduced-motion
 * so the underlying CSS backgrounds take over.
 */

import dynamic from 'next/dynamic';
import usePrefersReducedMotion from '@/components/usePrefersReducedMotion';

const WarpFieldBackground = dynamic(
  () => import('@/components/threeui/WarpFieldBackground'),
  { ssr: false }
);
const DotMatrixBackground = dynamic(
  () => import('@/components/threeui/DotMatrixBackground'),
  { ssr: false }
);
const OrbitalSphereBackground = dynamic(
  () => import('@/components/threeui/OrbitalSphereBackground'),
  { ssr: false }
);
const TypographyVortexCanvas = dynamic(
  () => import('@/components/threeui/TypographyVortexCanvas'),
  { ssr: false }
);

/** Home "Mission Control" section — warp streaks flying past behind the telemetry panel. */
export function MissionControlBackdrop() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <WarpFieldBackground
        variant="streaks"
        speed={20}
        streakOpacity={0.78}
        tileOpacity={0.26}
        className="h-full w-full"
      />
      {/* Fade the corridor into the page above and below the section */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02030a_0%,rgba(2,3,10,0.30)_14%,rgba(2,3,10,0)_46%,rgba(2,3,10,0)_60%,rgba(2,3,10,0.30)_86%,#02030a_100%)]" />
    </div>
  );
}

/** Home featured projects — neon glyph stream rushing past the section header. */
export function GlyphStreamBackdrop() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <WarpFieldBackground
        variant="letters"
        speed={18}
        streakOpacity={0.62}
        tileOpacity={0.85}
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02030a_0%,rgba(2,3,10,0.34)_18%,rgba(2,3,10,0.08)_52%,rgba(2,3,10,0.30)_86%,#02030a_100%)]" />
    </div>
  );
}

/** Projects index hero — full-throttle hyperspace corridor behind the page title. */
export function HyperspaceBackdrop() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <WarpFieldBackground
        variant="hyperspace"
        speed={22}
        streakOpacity={0.8}
        tileOpacity={0.55}
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02030a_0%,rgba(2,3,10,0.30)_26%,rgba(2,3,10,0.10)_55%,#02030a_100%)]" />
    </div>
  );
}

/** Projects index — live cyan dot matrix with cursor ripple (replaces the static dot grid). */
export function ProjectsIndexBackdrop() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <DotMatrixBackground
        speed={1.3}
        gridScale={72}
        pulseSpeed={0.5}
        mouseAmount={0.07}
        radius={0.17}
        opacity={0.55}
        className="h-full w-full"
      />
    </div>
  );
}

/** Contact — astrolabe orbital sphere (cyan orbits, gold calibration nodes) instead of loose particles. */
export function ContactAstrolabeBackdrop() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <OrbitalSphereBackground
        speed={1.7}
        particleOpacity={0.95}
        orbitOpacity={0.72}
        haloOpacity={0.75}
        particleSize={0.042}
        className="h-full w-full"
      />
    </div>
  );
}

/** 404 — interactive "LOST IN SPACE" typography vortex: hover dissolves the rings, click sucks them in. */
export function NotFoundVortexBackdrop() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <TypographyVortexCanvas
        mode="dark"
        phrase="404 / LOST IN SPACE / SIGNAL LOST / NAV OFFLINE / "
        speed={0.9}
        opacity={0.82}
        className="h-full w-full"
      />
    </div>
  );
}

/** About — ambient identity ink vortex: cold-white word rings drifting behind the story.
 *  Fills its parent; place inside a viewport-tall top band (absolute-positioned ancestors
 *  with transforms break `fixed` containment, so the band pattern is the reliable one). */
export function AboutInkVortexBackdrop() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <TypographyVortexCanvas
        mode="dark"
        phrase="HANG / FULL-STACK / AI APPS / HEALTHCARE / BUILDER / 关于杭 / "
        speed={0.8}
        opacity={0.95}
        className="h-full w-full"
      />
    </div>
  );
}

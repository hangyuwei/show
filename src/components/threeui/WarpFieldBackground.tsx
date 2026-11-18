"use client";

/**
 * Adapted from ThreeUI Community (https://github.com/MengTo/threeui) — MIT License.
 * Changes: static single-frame mode under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import { createWarpFieldRenderer, WARP_FIELD_DEFAULTS, type WarpFieldOptions } from "./warpFieldRenderer";

export type WarpFieldBackgroundProps = Partial<WarpFieldOptions> & { className?: string };
export function WarpFieldBackground({ className = "", ...props }: WarpFieldBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), optionsRef = useRef({ ...WARP_FIELD_DEFAULTS, ...props }); optionsRef.current = { ...WARP_FIELD_DEFAULTS, ...props };
  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = createWarpFieldRenderer(canvas, () => optionsRef.current);
    let frame = 0, visible = true;
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      renderer.resize(bounds.width, bounds.height);
      renderer.render();
      if (reduced) renderer.render();
    };
    const tick = () => { renderer.render(); frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0; };
    const resizeObserver = new ResizeObserver(resize), intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !frame && !reduced) frame = requestAnimationFrame(tick);
      if (!visible && frame) cancelAnimationFrame(frame), frame = 0;
    });
    resizeObserver.observe(host); intersection.observe(host);
    resize();
    if (!reduced) frame = requestAnimationFrame(tick);
    return () => { if (frame) cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect(); renderer.dispose(); };
  }, []);
  return (
    <div ref={hostRef} className={`threeui-background warp-field${className ? ` ${className}` : ""}`}>
      <canvas ref={canvasRef} style={{ filter: `hue-rotate(${optionsRef.current.hue}deg) saturate(${optionsRef.current.saturation}) brightness(${optionsRef.current.brightness})` }} />
    </div>
  );
}

export default WarpFieldBackground;

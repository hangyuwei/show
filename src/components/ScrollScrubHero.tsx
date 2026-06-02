'use client';

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

type ScrollScrubHeroProps = {
  mp4Src: string;
  webmSrc: string;
  posterSrc: string;
  duration: number;
  children: ReactNode;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function ScrollScrubHero({
  mp4Src,
  webmSrc,
  posterSrc,
  duration,
  children,
}: ScrollScrubHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(-1);
  const [metadataReady, setMetadataReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrubDuration = useMemo(() => Math.max(duration, 0.1), [duration]);

  const seekToScroll = useCallback(() => {
    frameRef.current = null;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || prefersReducedMotion) return;

    const rect = section.getBoundingClientRect();
    const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
    const progress = clamp(-rect.top / scrollableDistance, 0, 1);
    const nextTime = progress * scrubDuration;

    if (!metadataReady && video.readyState < 1) {
      return;
    }

    if (Math.abs(nextTime - lastTimeRef.current) < 0.025) {
      return;
    }

    try {
      video.currentTime = clamp(nextTime, 0, scrubDuration);
      lastTimeRef.current = nextTime;
    } catch {
      // Browsers can reject seeks before metadata is fully ready. The next
      // scroll/resize frame will retry after loadedmetadata fires.
    }
  }, [metadataReady, prefersReducedMotion, scrubDuration]);

  const requestSeek = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(seekToScroll);
  }, [seekToScroll]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    requestSeek();
    window.addEventListener('scroll', requestSeek, { passive: true });
    window.addEventListener('resize', requestSeek);

    return () => {
      window.removeEventListener('scroll', requestSeek);
      window.removeEventListener('resize', requestSeek);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [prefersReducedMotion, requestSeek]);

  useEffect(() => {
    if (metadataReady) requestSeek();
  }, [metadataReady, requestSeek]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] bg-[#02030a]"
      aria-label="Cosmic astrolabe portfolio hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {prefersReducedMotion ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${posterSrc})` }}
            aria-hidden="true"
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={posterSrc}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            onLoadedMetadata={() => {
              videoRef.current?.pause();
              setMetadataReady(true);
            }}
          >
            <source src={webmSrc} type="video/webm" />
            <source src={mp4Src} type="video/mp4" />
          </video>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(2,3,10,0.08)_34%,rgba(2,3,10,0.64)_78%,rgba(2,3,10,0.92)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.18)_0%,rgba(2,3,10,0.02)_38%,rgba(2,3,10,0.42)_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(101,216,255,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(101,216,255,0.20) 1px, transparent 1px)',
            backgroundSize: '96px 96px',
            maskImage:
              'radial-gradient(circle at 50% 45%, black 0%, transparent 66%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 45%, black 0%, transparent 66%)',
          }}
        />

        <div className="pointer-events-none absolute inset-x-4 top-4 z-10 hidden justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-100/38 sm:flex">
          <span>Portfolio Atlas / 00.31 AU</span>
          <span>Scroll-Scrub Timeline</span>
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 hidden justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-100/30 md:flex">
          <span>GSAP Multi-Camera Render</span>
          <span>Reduced Runtime WebGL: Off</span>
        </div>

        <div className="relative z-20 flex h-full items-center justify-center px-5 py-24 text-center">
          {children}
        </div>
      </div>
    </section>
  );
}

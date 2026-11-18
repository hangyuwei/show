'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import usePrefersReducedMotion from '@/components/usePrefersReducedMotion';
import { allProjects, businessLineLabels, type BusinessLine } from '@/data/projects';

const SolarSystem = dynamic(() => import('@/components/three/SolarSystem'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,#060814_0%,#000105_100%)]">
      <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-100/45">
        Calibrating star field · 校准星图
      </p>
      <span className="block h-px w-40 overflow-hidden bg-white/10">
        <span className="block h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent motion-safe:animate-[shimmer_1.6s_ease-in-out_infinite]" />
      </span>
    </div>
  ),
});

const businessLineOrder: BusinessLine[] = ['health', 'ai', 'web', 'creative', 'research'];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const hudContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const hudItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

function useLineLegend() {
  return businessLineOrder.map((line) => ({
    line,
    ...businessLineLabels[line],
    count: allProjects.filter((project) => project.businessLine === line).length,
  }));
}

/* Static fallback when the user prefers reduced motion — keeps the navigation value. */
function StaticUniverse() {
  const legend = useLineLegend();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_42%,#0a1226_0%,#02030a_62%)] px-4">
      <div className="w-full max-w-xl rounded-xl border border-cyan-100/10 bg-[#050b14]/80 p-6 backdrop-blur-sm sm:p-8">
        <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.26em] text-amber-100/58">
          Project Universe · Static Chart
        </p>
        <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
          项目宇宙 · 五条业务航线
        </h2>
        <ul className="mt-6 space-y-2.5">
          {legend.map((item) => (
            <li key={item.line}>
              <Link
                href={`/projects?line=${item.line}`}
                className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition hover:border-cyan-100/22 hover:bg-white/[0.06]"
              >
                <span className="flex items-center gap-3 text-sm text-cyan-50/80 group-hover:text-white">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: item.color, boxShadow: `0 0 12px ${item.color}88` }}
                  />
                  {item.name}
                </span>
                <span className="font-mono text-xs text-cyan-50/45">
                  {item.count} 项 →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type FlightPhase = 'approach' | 'traverse' | 'explore';

const PHASE_COPY: Record<FlightPhase, { en: string; zh: string }> = {
  approach: { en: 'Scroll to dive', zh: '继续滚动，俯冲进入星系' },
  traverse: { en: 'Traversing the ecliptic', zh: '正在穿越轨道面' },
  explore: { en: 'Drag to orbit · Click a planet', zh: '拖拽旋转 · 悬停扫描 · 点击行星进入航线' },
};

export default function UniverseExplorer() {
  const reduced = usePrefersReducedMotion();
  const router = useRouter();
  const legend = useLineLegend();
  const sectionRef = useRef<HTMLElement>(null);
  /* scroll progress 0→1 across the tall section — read by the scene every
     frame via ref, never through state (no re-renders at scroll rate) */
  const progressRef = useRef(0);
  const [phase, setPhase] = useState<FlightPhase>('approach');
  /* the scene only renders once the section approaches the viewport — the
     heavy canvas never burns frames while it sits below the fold */
  const [visible, setVisible] = useState(false);
  const [telemetry, setTelemetry] = useState({ az: 0, el: 0, dist: 0 });
  /* target-lock overlay while the camera swoops to a clicked planet */
  const [lock, setLock] = useState<{ line: string; name: string } | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      progressRef.current = p;
      const next: FlightPhase = p >= 0.97 ? 'explore' : p >= 0.3 ? 'traverse' : 'approach';
      setPhase((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { rootMargin: '15% 0px' },
    );
    observer.observe(el);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer.disconnect();
    };
  }, []);

  const azDeg = ((telemetry.az * 180) / Math.PI + 360) % 360;
  const elDeg = (telemetry.el * 180) / Math.PI;

  /* Reduced motion: no flight, no canvas — a static chart in a normal section. */
  if (reduced) {
    return (
      <section
        className="universe-explorer relative isolate h-svh min-h-[600px] overflow-hidden bg-[#02030a]"
        aria-labelledby="universe-explorer-title"
      >
        <StaticUniverse />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="universe-explorer relative isolate h-[240dvh] bg-[#02030a]"
      aria-labelledby="universe-explorer-title"
    >
      {/* Sticky viewport — scrolling flies the camera instead of moving the page */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0">
          <SolarSystem
            active={visible}
            getProgress={() => progressRef.current}
            onTelemetry={(az, el, dist) => setTelemetry({ az, el, dist })}
            onPlanetFocusStart={(line) =>
              setLock({ line, name: businessLineLabels[line as BusinessLine]?.name ?? line })
            }
            onPlanetClick={(line) => router.push(`/projects?line=${line}`)}
          />
        </div>

        {/* Target-lock transition — plays while the camera dives to the planet */}
        {lock && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#02030a]/38 backdrop-blur-[2px]">
            <div className="universe-warp-streaks absolute inset-0" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-5">
              <div className="relative h-28 w-28">
                <span className="absolute inset-0 animate-[universe-lock-spin_7s_linear_infinite] rounded-full border border-cyan-100/45 border-t-transparent" />
                <span className="absolute inset-3 animate-[universe-lock-spin_4.5s_linear_infinite_reverse] rounded-full border border-amber-100/55 border-b-transparent" />
                <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_18px_#65d8ff]" />
              </div>
              <div className="text-center">
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.34em] text-cyan-50/95">
                  Target Lock · {lock.name}
                </p>
                <p className="mb-0 font-mono text-[9px] uppercase tracking-[0.3em] text-cyan-100/45">
                  Jump plotted — engaging drive
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Corner brackets — the astrolabe instrument frame */}
        <div className="pointer-events-none absolute inset-4 z-10 sm:inset-6" aria-hidden="true">
          <span className="absolute left-0 top-0 h-7 w-7 border-l border-t border-cyan-100/25" />
          <span className="absolute right-0 top-0 h-7 w-7 border-r border-t border-cyan-100/25" />
          <span className="absolute bottom-0 left-0 h-7 w-7 border-b border-l border-cyan-100/25" />
          <span className="absolute bottom-0 right-0 h-7 w-7 border-b border-r border-cyan-100/25" />
        </div>

        {/* HUD layer — choreographed to arrive with the camera */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-8 py-12 sm:px-14 sm:py-14"
          variants={hudContainer}
          initial="hidden"
          animate={visible ? 'show' : 'hidden'}
        >
          <div className="flex items-start justify-between gap-6">
            <motion.div variants={hudItem}>
              <p className="mb-0 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/56">
                Project Universe · 实时星图
              </p>
              <h2
                id="universe-explorer-title"
                className="mt-4 text-2xl font-black leading-tight tracking-tight text-white [text-shadow:0_2px_28px_rgba(2,3,10,0.95),0_0_60px_rgba(101,216,255,0.12)] sm:text-4xl"
              >
                项目宇宙
              </h2>
              <p className="mb-0 mt-3 max-w-[19rem] text-xs leading-5 text-cyan-50/58 [text-shadow:0_1px_14px_rgba(2,3,10,0.95)] sm:text-sm">
                五条业务航线绕核心运行，卫星数量即真实项目数。
              </p>
            </motion.div>

            {/* Live instrument readout — real camera orbit state from the scene */}
            <motion.p
              variants={hudItem}
              className="mb-0 hidden text-right font-mono text-[10px] leading-[1.9] tracking-[0.16em] text-cyan-100/40 md:block"
              aria-hidden="true"
            >
              AZ {azDeg.toFixed(1).padStart(5, '0')}°
              <br />
              EL {elDeg >= 0 ? '+' : ''}{elDeg.toFixed(1)}°
              <br />
              R {telemetry.dist > 0 ? telemetry.dist.toFixed(1) : '——'} AU
            </motion.p>
          </div>

          <motion.div variants={hudItem} className="flex flex-col items-center gap-5">
            <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-100/44 [text-shadow:0_1px_12px_rgba(2,3,10,0.95)]">
              {PHASE_COPY[phase].en} · {PHASE_COPY[phase].zh}
            </p>

            {/* Star-chart index — the only interactive HUD elements */}
            <nav
              className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-1 gap-y-2"
              aria-label="业务航线快速入口"
            >
              {legend.map((item, index) => (
                <Link
                  key={item.line}
                  href={`/projects?line=${item.line}`}
                  className="group flex items-center gap-2.5 px-4 py-1.5 transition-colors sm:px-5"
                  style={{
                    borderLeft: index === 0 ? 'none' : `1px solid rgba(232, 242, 255, 0.09)`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-[1.7]"
                    style={{ background: item.color, boxShadow: `0 0 9px ${item.color}cc` }}
                  />
                  <span className="text-xs font-medium text-cyan-50/66 transition-colors group-hover:text-white">
                    {item.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-cyan-50/38 transition-colors group-hover:text-cyan-100/70">
                    {String(item.count).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </nav>
          </motion.div>
        </motion.div>

        {/* Blend into neighbouring sections */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/22 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#02030a] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#02030a] to-transparent" />
      </div>
    </section>
  );
}

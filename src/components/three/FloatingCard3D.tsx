'use client';

import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TechBadge from '@/components/ui/TechBadge';
import type { Project } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';

interface FloatingCard3DProps {
  project: Project;
  index: number;
}

export default function FloatingCard3D({ project, index }: FloatingCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glossPosition, setGlossPosition] = useState({ x: 50, y: 50 });
  const [borderAngle, setBorderAngle] = useState(0);
  const animFrameRef = useRef<number>(0);

  const lineInfo = businessLineLabels[project.businessLine];
  const accentColor = lineInfo.color;

  // Smoothed mouse tracking target for buttery tilt
  const targetTilt = useRef({ x: 0, y: 0 });
  const rafTiltRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Smooth tilt with eased deadzone
      const rotateY = (mouseX / (rect.width / 2)) * 8;
      const rotateX = -(mouseY / (rect.height / 2)) * 8;

      targetTilt.current = { x: rotateX, y: rotateY };

      const glossX = ((e.clientX - rect.left) / rect.width) * 100;
      const glossY = ((e.clientY - rect.top) / rect.height) * 100;
      setGlossPosition({ x: glossX, y: glossY });
    },
    [],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    targetTilt.current = { x: tilt.x, y: tilt.y };

    // Smooth tilt interpolation loop
    const interpolateTilt = () => {
      setTilt((prev) => ({
        x: prev.x + (targetTilt.current.x - prev.x) * 0.15,
        y: prev.y + (targetTilt.current.y - prev.y) * 0.15,
      }));
      rafTiltRef.current = requestAnimationFrame(interpolateTilt);
    };
    rafTiltRef.current = requestAnimationFrame(interpolateTilt);

    // Start rotating border angle
    const animate = () => {
      setBorderAngle((prev) => (prev + 0.8) % 360);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [tilt.x, tilt.y]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    targetTilt.current = { x: 0, y: 0 };
    setTilt({ x: 0, y: 0 });
    setGlossPosition({ x: 50, y: 50 });
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (rafTiltRef.current) {
      cancelAnimationFrame(rafTiltRef.current);
    }
  }, []);

  const visibleTechs = project.techStack.slice(0, 4);
  const extraCount = project.techStack.length - 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, scale: 0.88, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 24, scale: 0.9, filter: 'blur(8px)' }}
      transition={{
        duration: 0.8,
        delay: index * 0.065,
        ease: [0.16, 1, 0.3, 1],
        scale: { duration: 0.6, delay: index * 0.065, ease: [0.34, 1.56, 0.64, 1] },
        filter: { duration: 0.5, delay: index * 0.065 },
      }}
      layout
      style={{ perspective: '1200px' }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -16 : 0}px) scale(${isHovered ? 1.04 : 1})`,
            transformStyle: 'preserve-3d',
            transition: isHovered
              ? 'box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
              : 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: isHovered
              ? `0 52px 100px rgba(0,0,0,0.50),
                 0 22px 44px rgba(0,0,0,0.38),
                 0 10px 22px rgba(0,0,0,0.26),
                 0 0 70px ${accentColor}22,
                 0 0 140px ${accentColor}0e,
                 0 0 240px ${accentColor}06,
                 inset 0 1px 0 rgba(255,255,255,0.20),
                 inset 0 -1px 0 rgba(0,0,0,0.20),
                 inset 0 0 36px ${accentColor}05`
              : `0 8px 28px rgba(0,0,0,0.28),
                 0 2px 8px rgba(0,0,0,0.18),
                 0 0 24px ${accentColor}0a,
                 inset 0 1px 0 rgba(255,255,255,0.05),
                 inset 0 -1px 0 rgba(0,0,0,0.06)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Animated conic-gradient border — premium rotating glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              padding: '1.5px',
              background: isHovered
                ? `conic-gradient(from ${borderAngle}deg at 50% 50%, ${accentColor}ff, ${accentColor}dd 5%, ${accentColor}aa 10%, ${accentColor}70 16%, ${accentColor}40 22%, ${accentColor}20 28%, transparent 36%, transparent 50%, ${accentColor}20 58%, ${accentColor}40 64%, ${accentColor}70 72%, ${accentColor}aa 80%, ${accentColor}dd 90%, ${accentColor}ff)`
                : `linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.10))`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              transition: isHovered ? 'none' : 'background 0.8s ease',
              pointerEvents: 'none' as const,
            }}
          />

          {/* Card inner background */}
          <div
            className="relative rounded-2xl backdrop-blur-xl"
            style={{
              background: isHovered
                ? `linear-gradient(180deg, ${accentColor}0a, rgba(24,24,27,0.92) 35%, rgba(24,24,27,0.88))`
                : 'rgba(24,24,27,0.78)',
              transition: 'background 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Business line color accent - top border bar with enhanced glow */}
            <div
              className="h-[3px] w-full rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${accentColor}cc 12%, ${accentColor}ee 30%, ${accentColor}ff 50%, ${accentColor}ee 70%, ${accentColor}cc 88%, transparent 100%)`,
                boxShadow: isHovered
                  ? `0 0 32px ${accentColor}90, 0 0 64px ${accentColor}40, 0 0 120px ${accentColor}15, 0 2px 12px ${accentColor}60, 0 4px 20px ${accentColor}20`
                  : `0 0 20px ${accentColor}50, 0 0 40px ${accentColor}18, 0 0 60px ${accentColor}08`,
                transition: 'box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />

            {/* Shimmer/shine animation on hover — premium light sweep */}
            <div
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(
                    105deg,
                    transparent 18%,
                    ${accentColor}0c 25%,
                    ${accentColor}14 30%,
                    rgba(255,255,255,0.08) 36%,
                    rgba(255,255,255,0.18) 42%,
                    rgba(255,255,255,0.24) 47%,
                    rgba(255,255,255,0.18) 52%,
                    rgba(255,255,255,0.08) 58%,
                    ${accentColor}14 64%,
                    ${accentColor}0c 70%,
                    transparent 78%
                  )`,
                  animation: isHovered ? 'shimmer 2.8s ease-in-out infinite' : 'none',
                  transform: 'translateX(-100%)',
                }}
              />
            </div>

            {/* Gloss overlay follows cursor — wider, richer light pool */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-600 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse 65% 50% at ${glossPosition.x}% ${glossPosition.y}%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.08) 25%, ${accentColor}08 45%, transparent 65%)`,
              }}
            />

            {/* Subtle dot grid pattern on card background */}
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
              style={{
                backgroundImage: `radial-gradient(circle, ${accentColor}44 0.4px, transparent 0.4px)`,
                backgroundSize: '14px 14px',
                opacity: isHovered ? 0.05 : 0.018,
                transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />

            {/* Top gradient block (project icon area) */}
            <div
              className="relative h-36 flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(155deg, ${accentColor}22, ${accentColor}06 30%, ${accentColor}0e 55%, ${accentColor}08)`,
                transition: 'background 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {/* Hovered icon area gets a richer gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(155deg, ${accentColor}50, ${accentColor}18 28%, ${accentColor}28 55%, ${accentColor}10)`,
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              <span
                className="text-4xl relative z-10"
                style={{
                  transform: isHovered ? 'translateZ(30px) scale(1.25)' : 'translateZ(30px) scale(1)',
                  transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: isHovered ? `drop-shadow(0 0 16px ${accentColor}60) drop-shadow(0 0 32px ${accentColor}25)` : 'none',
                }}
              >
                {lineInfo.emoji}
              </span>
              {/* Radial light overlay */}
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_30%_50%,white,transparent_70%)]" />

              {/* Business line color side accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
                style={{
                  background: `linear-gradient(180deg, ${accentColor}ff, ${accentColor}90 30%, ${accentColor}60 60%, ${accentColor}25)`,
                  boxShadow: isHovered
                    ? `4px 0 24px ${accentColor}55, 4px 0 48px ${accentColor}20`
                    : `2px 0 14px ${accentColor}30`,
                  transition: 'box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />

              {/* Corner glow — top-right, enlarges on hover */}
              <div
                className="absolute -top-14 -right-14 w-36 h-36 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}c0, ${accentColor}50 35%, ${accentColor}18 60%, transparent 75%)`,
                  opacity: isHovered ? 0.5 : 0.22,
                  transform: isHovered ? 'scale(1.6)' : 'scale(1)',
                  transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              {/* Secondary corner glow bottom-left */}
              <div
                className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}80, ${accentColor}30 35%, ${accentColor}10 60%, transparent 75%)`,
                  opacity: isHovered ? 0.35 : 0,
                  transform: isHovered ? 'scale(1.5)' : 'scale(0.5)',
                  transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3 p-5 pt-4">
              {/* Title with premium hover glow */}
              <h3
                className="text-lg font-semibold text-white leading-snug tracking-tight"
                style={{
                  textShadow: isHovered
                    ? `0 0 32px ${accentColor}25, 0 0 64px ${accentColor}0e, 0 0 120px ${accentColor}05`
                    : 'none',
                  transition: 'text-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {project.name}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-zinc-400 leading-relaxed line-clamp-2 group-hover:text-zinc-300/85 transition-colors duration-500">
                {project.tagline}
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {visibleTechs.map((tech, techIdx) => (
                  <TechBadge key={tech} name={tech} color={accentColor} delay={techIdx * 0.04} />
                ))}
                {extraCount > 0 && (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wider backdrop-blur-sm whitespace-nowrap"
                    style={{
                      background: isHovered ? `${accentColor}25` : `${accentColor}12`,
                      border: `1px solid ${isHovered ? `${accentColor}50` : `${accentColor}25`}`,
                      color: `${accentColor}ee`,
                      boxShadow: isHovered
                        ? `0 0 20px ${accentColor}30, 0 0 8px ${accentColor}15, inset 0 0 10px ${accentColor}08`
                        : `0 0 10px ${accentColor}0a`,
                      transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    +{extraCount}
                  </span>
                )}
              </div>

              {/* Bottom: business line + arrow */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.06] group-hover:border-white/[0.16] transition-colors duration-600">
                <span
                  className="text-xs font-semibold tracking-wide"
                  style={{
                    color: `${accentColor}dd`,
                    textShadow: isHovered
                      ? `0 0 20px ${accentColor}50, 0 0 40px ${accentColor}18, 0 0 5px ${accentColor}30`
                      : 'none',
                    transition: 'text-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {lineInfo.emoji} {lineInfo.name}
                </span>
                <motion.span
                  className="text-zinc-500 group-hover:text-white"
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 0 14px ${accentColor}90) drop-shadow(0 0 28px ${accentColor}30)`
                      : 'none',
                    transition: 'filter 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.4s ease',
                  }}
                  animate={isHovered ? { x: [0, 7, 0] } : { x: 0 }}
                  transition={isHovered ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

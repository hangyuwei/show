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
      initial={{ opacity: 0, y: 50, scale: 0.94, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
        scale: { duration: 0.5, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] },
        filter: { duration: 0.5, delay: index * 0.08 },
      }}
      layout
      style={{ perspective: '1200px' }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -12 : 0}px) scale(${isHovered ? 1.03 : 1})`,
            transformStyle: 'preserve-3d',
            transition: isHovered
              ? 'box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
              : 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: isHovered
              ? `0 40px 80px rgba(0,0,0,0.50),
                 0 16px 32px rgba(0,0,0,0.35),
                 0 6px 16px rgba(0,0,0,0.25),
                 0 0 60px ${accentColor}18,
                 0 0 120px ${accentColor}0a,
                 0 0 200px ${accentColor}04,
                 inset 0 1px 0 rgba(255,255,255,0.14),
                 inset 0 -1px 0 rgba(0,0,0,0.20)`
              : `0 10px 30px rgba(0,0,0,0.30),
                 0 3px 10px rgba(0,0,0,0.20),
                 0 0 24px ${accentColor}06,
                 inset 0 1px 0 rgba(255,255,255,0.06),
                 inset 0 -1px 0 rgba(0,0,0,0.08)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Animated conic-gradient border — rotates smoothly on hover */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              padding: '1.5px',
              background: isHovered
                ? `conic-gradient(from ${borderAngle}deg at 50% 50%, ${accentColor}f0, ${accentColor}80 12%, ${accentColor}35 22%, transparent 32%, transparent 48%, ${accentColor}35 58%, ${accentColor}80 78%, ${accentColor}f0)`
                : `linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.12))`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              transition: isHovered ? 'none' : 'background 0.7s ease',
              pointerEvents: 'none' as const,
            }}
          />

          {/* Card inner background */}
          <div className="relative rounded-2xl bg-zinc-900/80 backdrop-blur-xl">
            {/* Business line color accent - top border bar with pulse */}
            <div
              className="h-[3px] w-full rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${accentColor} 18%, ${accentColor}dd 45%, ${accentColor}ee 55%, ${accentColor} 82%, transparent 100%)`,
                boxShadow: isHovered
                  ? `0 0 24px ${accentColor}80, 0 0 48px ${accentColor}30, 0 0 80px ${accentColor}10, 0 2px 10px ${accentColor}50`
                  : `0 0 16px ${accentColor}40, 0 0 32px ${accentColor}15`,
                transition: 'box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />

            {/* Shimmer/shine animation on hover — loops while hovered */}
            <div
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(
                    105deg,
                    transparent 20%,
                    ${accentColor}08 28%,
                    rgba(255,255,255,0.07) 35%,
                    rgba(255,255,255,0.14) 42%,
                    rgba(255,255,255,0.18) 48%,
                    rgba(255,255,255,0.14) 54%,
                    rgba(255,255,255,0.07) 61%,
                    ${accentColor}08 68%,
                    transparent 76%
                  )`,
                  animation: isHovered ? 'shimmer 2.8s ease-in-out infinite' : 'none',
                  transform: 'translateX(-100%)',
                }}
              />
            </div>

            {/* Gloss overlay follows cursor — wider, softer */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse 70% 55% at ${glossPosition.x}% ${glossPosition.y}%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)`,
              }}
            />

            {/* Subtle dot grid pattern on card background */}
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 0.5px, transparent 0.5px)',
                backgroundSize: '18px 18px',
                opacity: isHovered ? 0.04 : 0.018,
                transition: 'opacity 0.6s ease',
              }}
            />

            {/* Top gradient block (project icon area) */}
            <div
              className="relative h-36 flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(155deg, ${accentColor}20, ${accentColor}05 35%, ${accentColor}0c 60%, ${accentColor}06)`,
                transition: 'background 0.6s ease',
              }}
            >
              {/* Hovered icon area gets a richer gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(155deg, ${accentColor}40, ${accentColor}10 30%, ${accentColor}1c 60%, ${accentColor}0c)`,
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              <span
                className="text-4xl relative z-10"
                style={{
                  transform: isHovered ? 'translateZ(30px) scale(1.25)' : 'translateZ(30px) scale(1)',
                  transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: isHovered ? `drop-shadow(0 0 16px ${accentColor}60)` : 'none',
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
                  background: `linear-gradient(180deg, ${accentColor}f0, ${accentColor}70 40%, ${accentColor}40 70%, ${accentColor}18)`,
                  boxShadow: isHovered
                    ? `3px 0 16px ${accentColor}45`
                    : `2px 0 12px ${accentColor}28`,
                  transition: 'box-shadow 0.5s ease',
                }}
              />

              {/* Corner glow — top-right, enlarges on hover */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}a0, ${accentColor}35 40%, transparent 70%)`,
                  opacity: isHovered ? 0.4 : 0.2,
                  transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                  transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              {/* Secondary corner glow bottom-left */}
              <div
                className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}70, ${accentColor}25 40%, transparent 70%)`,
                  opacity: isHovered ? 0.3 : 0,
                  transform: isHovered ? 'scale(1.4)' : 'scale(0.6)',
                  transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3 p-5 pt-4">
              {/* Title with enhanced hover glow */}
              <h3
                className="text-lg font-semibold text-white leading-snug tracking-tight"
                style={{
                  textShadow: isHovered ? `0 0 28px ${accentColor}1c, 0 0 56px ${accentColor}0a` : 'none',
                  transition: 'text-shadow 0.5s ease',
                }}
              >
                {project.name}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-zinc-400 leading-relaxed line-clamp-2 group-hover:text-zinc-300/80 transition-colors duration-400">
                {project.tagline}
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {visibleTechs.map((tech, techIdx) => (
                  <TechBadge key={tech} name={tech} color={accentColor} delay={techIdx * 0.05} />
                ))}
                {extraCount > 0 && (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wider backdrop-blur-sm whitespace-nowrap"
                    style={{
                      background: isHovered ? `${accentColor}20` : `${accentColor}12`,
                      border: `1px solid ${isHovered ? `${accentColor}40` : `${accentColor}25`}`,
                      color: `${accentColor}dd`,
                      boxShadow: isHovered
                        ? `0 0 16px ${accentColor}25, 0 0 6px ${accentColor}12`
                        : `0 0 10px ${accentColor}0a`,
                      transition: 'all 0.4s ease',
                    }}
                  >
                    +{extraCount}
                  </span>
                )}
              </div>

              {/* Bottom: business line + arrow */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.06] group-hover:border-white/[0.14] transition-colors duration-500">
                <span
                  className="text-xs font-medium tracking-wide"
                  style={{
                    color: `${accentColor}cc`,
                    textShadow: isHovered ? `0 0 16px ${accentColor}40, 0 0 4px ${accentColor}25` : 'none',
                    transition: 'text-shadow 0.5s ease',
                  }}
                >
                  {lineInfo.emoji} {lineInfo.name}
                </span>
                <motion.span
                  className="text-zinc-500 group-hover:text-white"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 10px ${accentColor}80)` : 'none',
                    transition: 'filter 0.4s ease, color 0.4s ease',
                  }}
                  animate={isHovered ? { x: [0, 6, 0] } : { x: 0 }}
                  transition={isHovered ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
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

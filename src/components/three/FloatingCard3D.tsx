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
      initial={{ opacity: 0, y: 60, scale: 0.92, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 20, scale: 0.96, filter: 'blur(4px)' }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.22, 0.61, 0.36, 1],
        filter: { duration: 0.45, delay: index * 0.06 },
      }}
      layout
      style={{ perspective: '1200px' }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -10 : 0}px) scale(${isHovered ? 1.02 : 1})`,
            transformStyle: 'preserve-3d',
            transition: isHovered
              ? 'box-shadow 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)'
              : 'transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)',
            boxShadow: isHovered
              ? `0 30px 60px rgba(0,0,0,0.55),
                 0 12px 28px rgba(0,0,0,0.35),
                 0 4px 14px rgba(0,0,0,0.25),
                 0 0 50px ${accentColor}20,
                 0 0 100px ${accentColor}0a,
                 0 0 150px ${accentColor}05,
                 inset 0 1px 0 rgba(255,255,255,0.12),
                 inset 0 -1px 0 rgba(0,0,0,0.18)`
              : `0 8px 24px rgba(0,0,0,0.28),
                 0 2px 8px rgba(0,0,0,0.18),
                 0 0 20px ${accentColor}05,
                 inset 0 1px 0 rgba(255,255,255,0.05),
                 inset 0 -1px 0 rgba(0,0,0,0.05)`,
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
                ? `conic-gradient(from ${borderAngle}deg at 50% 50%, ${accentColor}ee, ${accentColor}60 15%, ${accentColor}20 25%, transparent 35%, transparent 50%, ${accentColor}20 65%, ${accentColor}60 85%, ${accentColor}ee)`
                : `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 70%, rgba(255,255,255,0.1))`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              transition: isHovered ? 'none' : 'background 0.6s ease',
              pointerEvents: 'none' as const,
            }}
          />

          {/* Card inner background */}
          <div className="relative rounded-2xl bg-zinc-900/80 backdrop-blur-md">
            {/* Business line color accent - top border bar with pulse */}
            <div
              className="h-[3px] w-full rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, transparent 2%, ${accentColor} 20%, ${accentColor}cc 50%, ${accentColor} 80%, transparent 98%)`,
                boxShadow: isHovered
                  ? `0 0 20px ${accentColor}70, 0 0 40px ${accentColor}25, 0 2px 8px ${accentColor}40`
                  : `0 0 14px ${accentColor}35, 0 0 28px ${accentColor}12`,
                transition: 'box-shadow 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
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
                    transparent 25%,
                    ${accentColor}06 32%,
                    rgba(255,255,255,0.06) 38%,
                    rgba(255,255,255,0.12) 44%,
                    rgba(255,255,255,0.16) 50%,
                    rgba(255,255,255,0.12) 56%,
                    rgba(255,255,255,0.06) 62%,
                    ${accentColor}06 68%,
                    transparent 75%
                  )`,
                  animation: isHovered ? 'shimmer 2.2s ease-in-out infinite' : 'none',
                  transform: 'translateX(-100%)',
                }}
              />
            </div>

            {/* Gloss overlay follows cursor — wider, softer */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse 60% 50% at ${glossPosition.x}% ${glossPosition.y}%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)`,
              }}
            />

            {/* Subtle dot grid pattern on card background */}
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 0.5px, transparent 0.5px)',
                backgroundSize: '16px 16px',
                opacity: isHovered ? 0.035 : 0.02,
                transition: 'opacity 0.5s ease',
              }}
            />

            {/* Top gradient block (project icon area) */}
            <div
              className="relative h-32 flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${accentColor}22, ${accentColor}05 40%, ${accentColor}0e 70%, ${accentColor}08)`,
                transition: 'background 0.5s ease',
              }}
            >
              {/* Hovered icon area gets a richer gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(145deg, ${accentColor}38, ${accentColor}0c 35%, ${accentColor}18 65%, ${accentColor}0a)`,
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
                }}
              />
              <span
                className="text-4xl relative z-10"
                style={{
                  transform: isHovered ? 'translateZ(30px) scale(1.2)' : 'translateZ(30px) scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)',
                  filter: isHovered ? `drop-shadow(0 0 12px ${accentColor}50)` : 'none',
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
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}90, ${accentColor}30 40%, transparent 70%)`,
                  opacity: isHovered ? 0.35 : 0.18,
                  transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                  transition: 'all 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
                }}
              />
              {/* Secondary corner glow bottom-left */}
              <div
                className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}60, ${accentColor}20 40%, transparent 70%)`,
                  opacity: isHovered ? 0.25 : 0,
                  transform: isHovered ? 'scale(1.3)' : 'scale(0.7)',
                  transition: 'all 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3 p-5">
              {/* Title with enhanced hover glow */}
              <h3
                className="text-lg font-semibold text-white leading-snug transition-all duration-400"
                style={{
                  textShadow: isHovered ? `0 0 24px ${accentColor}18, 0 0 48px ${accentColor}08` : 'none',
                  transition: 'text-shadow 0.4s ease',
                }}
              >
                {project.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 group-hover:text-zinc-300/80 transition-colors duration-300">
                {project.tagline}
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {visibleTechs.map((tech, techIdx) => (
                  <TechBadge key={tech} name={tech} color={accentColor} delay={techIdx * 0.04} />
                ))}
                {extraCount > 0 && (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-sm whitespace-nowrap"
                    style={{
                      background: isHovered ? `${accentColor}1c` : `${accentColor}10`,
                      border: `1px solid ${isHovered ? `${accentColor}35` : `${accentColor}22`}`,
                      color: `${accentColor}dd`,
                      boxShadow: isHovered
                        ? `0 0 14px ${accentColor}20, 0 0 4px ${accentColor}10`
                        : `0 0 8px ${accentColor}08`,
                      transition: 'all 0.35s ease',
                    }}
                  >
                    +{extraCount}
                  </span>
                )}
              </div>

              {/* Bottom: business line + arrow */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.06] group-hover:border-white/[0.12] transition-colors duration-400">
                <span
                  className="text-xs font-medium"
                  style={{
                    color: `${accentColor}cc`,
                    textShadow: isHovered ? `0 0 12px ${accentColor}35, 0 0 4px ${accentColor}20` : 'none',
                    transition: 'text-shadow 0.4s ease',
                  }}
                >
                  {lineInfo.emoji} {lineInfo.name}
                </span>
                <motion.span
                  className="text-zinc-500 group-hover:text-white"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${accentColor}70)` : 'none',
                    transition: 'filter 0.35s ease, color 0.35s ease',
                  }}
                  animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
                  transition={isHovered ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
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

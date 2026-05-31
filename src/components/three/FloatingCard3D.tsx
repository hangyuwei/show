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

  const lineInfo = businessLineLabels[project.businessLine];
  const accentColor = lineInfo.color;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / (rect.width / 2)) * 10;
      const rotateX = -(mouseY / (rect.height / 2)) * 10;

      setTilt({ x: rotateX, y: rotateY });

      const glossX = ((e.clientX - rect.left) / rect.width) * 100;
      const glossY = ((e.clientY - rect.top) / rect.height) * 100;
      setGlossPosition({ x: glossX, y: glossY });
    },
    [],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlossPosition({ x: 50, y: 50 });
  }, []);

  const visibleTechs = project.techStack.slice(0, 4);
  const extraCount = project.techStack.length - 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      layout
      style={{ perspective: '800px' }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -10 : 0}px)`,
            transformStyle: 'preserve-3d',
            transition: isHovered
              ? 'box-shadow 0.4s ease'
              : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
            boxShadow: isHovered
              ? `0 30px 60px rgba(0,0,0,0.5),
                 0 15px 30px rgba(0,0,0,0.3),
                 0 5px 15px rgba(0,0,0,0.2),
                 0 0 50px ${accentColor}20,
                 0 0 100px ${accentColor}08,
                 inset 0 1px 0 rgba(255,255,255,0.08),
                 inset 0 -1px 0 rgba(0,0,0,0.1)`
              : `0 8px 24px rgba(0,0,0,0.3),
                 0 2px 8px rgba(0,0,0,0.2),
                 0 0 20px ${accentColor}06,
                 inset 0 1px 0 rgba(255,255,255,0.05),
                 inset 0 -1px 0 rgba(0,0,0,0.05)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Animated gradient border */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              padding: '1.5px',
              background: isHovered
                ? `conic-gradient(from ${isHovered ? '180deg' : '0deg'} at 50% 50%, ${accentColor}cc, ${accentColor}30, transparent 30%, transparent 70%, ${accentColor}30, ${accentColor}cc)`
                : `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.1))`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              transition: 'background 0.5s ease',
              pointerEvents: 'none' as const,
            }}
          />

          {/* Card inner background */}
          <div className="relative rounded-2xl bg-zinc-900/80 backdrop-blur-md">
            {/* Business line color accent - top border bar */}
            <div
              className="h-[3px] w-full rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, transparent 5%, ${accentColor} 30%, ${accentColor}cc 50%, ${accentColor} 70%, transparent 95%)`,
                boxShadow: `0 0 12px ${accentColor}40, 0 0 24px ${accentColor}15`,
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
                    transparent 35%,
                    ${accentColor}08 40%,
                    rgba(255,255,255,0.07) 45%,
                    rgba(255,255,255,0.12) 50%,
                    rgba(255,255,255,0.07) 55%,
                    ${accentColor}08 60%,
                    transparent 65%
                  )`,
                  animation: isHovered ? 'shimmer 1.5s ease-in-out infinite' : 'none',
                  transform: 'translateX(-100%)',
                }}
              />
            </div>

            {/* Gloss overlay follows cursor */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at ${glossPosition.x}% ${glossPosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
              }}
            />

            {/* Subtle dot grid pattern on card background */}
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] rounded-2xl"
              style={{
                backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)',
                backgroundSize: '12px 12px',
              }}
            />

            {/* Top gradient block (project icon area) */}
            <div
              className="relative h-32 flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}08, ${accentColor}15)`,
              }}
            >
              <span className="text-4xl relative z-10" style={{ transform: 'translateZ(30px)' }}>
                {lineInfo.emoji}
              </span>
              {/* Radial light overlay */}
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_30%_50%,white,transparent_70%)]" />

              {/* Business line color side accent — wider & more visible */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
                style={{
                  background: `linear-gradient(180deg, ${accentColor}ee, ${accentColor}60, ${accentColor}20)`,
                  boxShadow: `2px 0 12px ${accentColor}30`,
                }}
              />

              {/* Corner glow */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
                style={{
                  background: `radial-gradient(circle, ${accentColor}80, transparent 70%)`,
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3 p-5">
              {/* Title */}
              <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-white/95 transition-colors duration-300">
                {project.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                {project.tagline}
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {visibleTechs.map((tech) => (
                  <TechBadge key={tech} name={tech} color={accentColor} />
                ))}
                {extraCount > 0 && (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-sm whitespace-nowrap"
                    style={{
                      background: `${accentColor}12`,
                      border: `1px solid ${accentColor}30`,
                      color: `${accentColor}dd`,
                      boxShadow: `0 0 8px ${accentColor}10`,
                    }}
                  >
                    +{extraCount}
                  </span>
                )}
              </div>

              {/* Bottom: business line + arrow */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.06]">
                <span
                  className="text-xs font-medium"
                  style={{ color: `${accentColor}cc` }}
                >
                  {lineInfo.emoji} {lineInfo.name}
                </span>
                <motion.span
                  className="text-zinc-500 group-hover:text-white transition-colors duration-300"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 4px ${accentColor}60)` : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                  whileHover={{ x: 4 }}
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

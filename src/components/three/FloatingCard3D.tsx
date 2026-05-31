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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Smoother tilt with slight deadzone
      const rotateY = (mouseX / (rect.width / 2)) * 8;
      const rotateX = -(mouseY / (rect.height / 2)) * 8;

      setTilt({ x: rotateX, y: rotateY });

      const glossX = ((e.clientX - rect.left) / rect.width) * 100;
      const glossY = ((e.clientY - rect.top) / rect.height) * 100;
      setGlossPosition({ x: glossX, y: glossY });
    },
    [],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Start rotating border angle
    const animate = () => {
      setBorderAngle((prev) => (prev + 0.8) % 360);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlossPosition({ x: 50, y: 50 });
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  const visibleTechs = project.techStack.slice(0, 4);
  const extraCount = project.techStack.length - 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 0.61, 0.36, 1],
        filter: { duration: 0.4, delay: index * 0.07 },
      }}
      layout
      style={{ perspective: '1000px' }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl cursor-pointer"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -8 : 0}px) scale(${isHovered ? 1.02 : 1})`,
            transformStyle: 'preserve-3d',
            transition: isHovered
              ? 'box-shadow 0.35s ease, scale 0.35s ease'
              : 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.35s ease',
            boxShadow: isHovered
              ? `0 25px 50px rgba(0,0,0,0.5),
                 0 10px 25px rgba(0,0,0,0.3),
                 0 4px 12px rgba(0,0,0,0.2),
                 0 0 40px ${accentColor}25,
                 0 0 80px ${accentColor}10,
                 inset 0 1px 0 rgba(255,255,255,0.1),
                 inset 0 -1px 0 rgba(0,0,0,0.15)`
              : `0 6px 20px rgba(0,0,0,0.25),
                 0 2px 6px rgba(0,0,0,0.15),
                 0 0 15px ${accentColor}05,
                 inset 0 1px 0 rgba(255,255,255,0.04),
                 inset 0 -1px 0 rgba(0,0,0,0.04)`,
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
                ? `conic-gradient(from ${borderAngle}deg at 50% 50%, ${accentColor}dd, ${accentColor}40, transparent 25%, transparent 50%, ${accentColor}40, ${accentColor}dd)`
                : `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.08))`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              transition: isHovered ? 'none' : 'background 0.5s ease',
              pointerEvents: 'none' as const,
            }}
          />

          {/* Card inner background */}
          <div className="relative rounded-2xl bg-zinc-900/80 backdrop-blur-md">
            {/* Business line color accent - top border bar with pulse */}
            <div
              className="h-[3px] w-full rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, transparent 5%, ${accentColor} 30%, ${accentColor}cc 50%, ${accentColor} 70%, transparent 95%)`,
                boxShadow: isHovered
                  ? `0 0 16px ${accentColor}60, 0 0 32px ${accentColor}20`
                  : `0 0 12px ${accentColor}30, 0 0 24px ${accentColor}10`,
                transition: 'box-shadow 0.4s ease',
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
                    transparent 30%,
                    ${accentColor}08 38%,
                    rgba(255,255,255,0.08) 43%,
                    rgba(255,255,255,0.14) 50%,
                    rgba(255,255,255,0.08) 57%,
                    ${accentColor}08 62%,
                    transparent 70%
                  )`,
                  animation: isHovered ? 'shimmer 1.8s ease-in-out infinite' : 'none',
                  transform: 'translateX(-100%)',
                }}
              />
            </div>

            {/* Gloss overlay follows cursor — wider, softer */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse at ${glossPosition.x}% ${glossPosition.y}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 30%, transparent 60%)`,
              }}
            />

            {/* Subtle dot grid pattern on card background */}
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] rounded-2xl"
              style={{
                backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Top gradient block (project icon area) */}
            <div
              className="relative h-32 flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}06, ${accentColor}12)`,
                transition: 'background 0.4s ease',
              }}
            >
              {/* Hovered icon area gets a richer gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-400"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}35, ${accentColor}0a, ${accentColor}1a)`,
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              />
              <span
                className="text-4xl relative z-10 transition-transform duration-300"
                style={{
                  transform: isHovered ? 'translateZ(30px) scale(1.15)' : 'translateZ(30px) scale(1)',
                  transition: 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
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
                  background: `linear-gradient(180deg, ${accentColor}ee, ${accentColor}60, ${accentColor}20)`,
                  boxShadow: `2px 0 12px ${accentColor}30`,
                }}
              />

              {/* Corner glow — enlarges on hover */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full transition-all duration-500"
                style={{
                  background: `radial-gradient(circle, ${accentColor}80, transparent 70%)`,
                  opacity: isHovered ? 0.3 : 0.2,
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              {/* Secondary corner glow bottom-left */}
              <div
                className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full transition-all duration-500"
                style={{
                  background: `radial-gradient(circle, ${accentColor}50, transparent 70%)`,
                  opacity: isHovered ? 0.2 : 0,
                  transform: isHovered ? 'scale(1.2)' : 'scale(0.8)',
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3 p-5">
              {/* Title with enhanced hover glow */}
              <h3
                className="text-lg font-semibold text-white leading-snug transition-all duration-300"
                style={{
                  textShadow: isHovered ? `0 0 20px ${accentColor}15` : 'none',
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
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-sm whitespace-nowrap transition-all duration-300"
                    style={{
                      background: isHovered ? `${accentColor}18` : `${accentColor}10`,
                      border: `1px solid ${accentColor}28`,
                      color: `${accentColor}dd`,
                      boxShadow: isHovered ? `0 0 10px ${accentColor}18` : `0 0 6px ${accentColor}08`,
                    }}
                  >
                    +{extraCount}
                  </span>
                )}
              </div>

              {/* Bottom: business line + arrow */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.06] group-hover:border-white/[0.1] transition-colors duration-300">
                <span
                  className="text-xs font-medium transition-all duration-300"
                  style={{
                    color: `${accentColor}cc`,
                    textShadow: isHovered ? `0 0 8px ${accentColor}30` : 'none',
                  }}
                >
                  {lineInfo.emoji} {lineInfo.name}
                </span>
                <motion.span
                  className="text-zinc-500 group-hover:text-white transition-colors duration-300"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 6px ${accentColor}60)` : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                  animate={isHovered ? { x: [0, 4, 0] } : { x: 0 }}
                  transition={isHovered ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
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

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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Convert to rotation values (max ~12 degrees)
      const rotateY = (mouseX / (rect.width / 2)) * 12;
      const rotateX = -(mouseY / (rect.height / 2)) * 12;

      setTilt({ x: rotateX, y: rotateY });

      // Gloss position follows mouse
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
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      layout
      style={{ perspective: '800px' }}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-2xl border border-white/[0.06]
            bg-zinc-900/60 backdrop-blur-md cursor-pointer
            transition-shadow duration-300"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -8 : 0}px)`,
            transformStyle: 'preserve-3d',
            transition: isHovered
              ? 'box-shadow 0.3s ease'
              : 'transform 0.5s ease, box-shadow 0.3s ease',
            boxShadow: isHovered
              ? '0 20px 60px rgba(139, 92, 246, 0.15), 0 0 40px rgba(139, 92, 246, 0.05)'
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gloss overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at ${glossPosition.x}% ${glossPosition.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            }}
          />

          {/* Top gradient block (project icon area) */}
          <div
            className="relative h-32 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${lineInfo.color}33, ${lineInfo.color}11)`,
            }}
          >
            <span className="text-4xl" style={{ transform: 'translateZ(30px)' }}>
              {lineInfo.emoji}
            </span>
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_70%)]" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 p-5">
            {/* Title */}
            <h3 className="text-lg font-semibold text-white leading-snug">
              {project.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
              {project.tagline}
            </p>

            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {visibleTechs.map((tech) => (
                <TechBadge key={tech} name={tech} />
              ))}
              {extraCount > 0 && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/5 border border-white/10 text-zinc-500">
                  +{extraCount}
                </span>
              )}
            </div>

            {/* Bottom: business line + arrow */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.06]">
              <span className="text-xs font-medium text-zinc-500">
                {lineInfo.emoji} {lineInfo.name}
              </span>
              <motion.span
                className="text-zinc-500 group-hover:text-violet-400 transition-colors duration-300"
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
      </Link>
    </motion.div>
  );
}

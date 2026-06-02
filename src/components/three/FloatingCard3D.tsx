'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';

interface FloatingCard3DProps {
  project: Project;
  index: number;
}

const statusLabels: Record<Project['status'], string> = {
  completed: '已完成',
  active: '进行中',
  planning: '规划中',
};

function EvidencePanel({
  project,
  accentColor,
}: {
  project: Project;
  accentColor: string;
}) {
  const rows = project.techStack.slice(0, 5);

  return (
    <div className="relative h-32 overflow-hidden border-b border-white/[0.06] bg-[#07111f]/80">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,242,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(232,242,255,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-25 blur-3xl"
        style={{ background: accentColor }}
      />
      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: accentColor, boxShadow: `0 0 12px ${accentColor}80` }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
              Evidence
            </span>
          </div>
          <span className="rounded-md border border-[#f2c166]/25 bg-[#f2c166]/10 px-2 py-0.5 font-mono text-[10px] text-[#f2c166]/80">
            {project.year}
          </span>
        </div>

        <div className="space-y-2">
          {rows.slice(0, 4).map((row, rowIndex) => (
            <div key={row} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3">
              <span className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-white/28">
                {row}
              </span>
              <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${86 - rowIndex * 11}%`,
                    background:
                      rowIndex % 2 === 0
                        ? `linear-gradient(90deg, ${accentColor}, transparent)`
                        : 'linear-gradient(90deg, #f2c166, transparent)',
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FloatingCard3D({ project, index }: FloatingCard3DProps) {
  const lineInfo = businessLineLabels[project.businessLine];
  const accentColor = lineInfo.color === '#8b5cf6' ? '#65d8ff' : lineInfo.color;
  const visibleTechs = project.techStack.slice(0, 4);
  const extraCount = project.techStack.length - visibleTechs.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        duration: 0.45,
        delay: index * 0.035,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block h-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#080d15]/88 shadow-[0_12px_34px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-[#0b111b]"
      >
        <EvidencePanel project={project} accentColor={accentColor} />

        <div className="flex min-h-[220px] flex-col gap-3.5 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-md border px-2.5 py-1 text-xs font-medium"
              style={{
                borderColor: `${accentColor}45`,
                background: `${accentColor}12`,
                color: accentColor,
              }}
            >
              {lineInfo.name}
            </span>
            <span className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-xs text-white/50">
              {project.year} · {statusLabels[project.status]}
            </span>
          </div>

          <div className="space-y-2">
            <h3
              className="font-semibold text-[#e8f2ff] transition-colors group-hover:text-white"
              style={{ fontSize: '1.375rem', lineHeight: 1.18, letterSpacing: 0 }}
            >
              {project.name}
            </h3>
            <p className="mb-0 line-clamp-2 text-sm leading-6 text-white/48">
              {project.tagline}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            {visibleTechs.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-xs text-white/48"
              >
                {tech}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-xs text-white/36">
                +{extraCount}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/32">
              Case Study
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] bg-white/[0.03] text-white/55 transition group-hover:border-[#65d8ff]/35 group-hover:text-[#65d8ff]">
              <svg
                aria-hidden="true"
                width="15"
                height="15"
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
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

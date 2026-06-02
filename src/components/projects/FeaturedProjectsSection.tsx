import Link from 'next/link';
import type { BusinessLine, Project } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';

const BUSINESS_LINE_ORDER: BusinessLine[] = [
  'health',
  'ai',
  'web',
  'creative',
  'research',
];

const FEATURED_PRIORITY = [
  'campus-health',
  'medical-ocr',
  'three-databases',
  'my-agent',
  'starry-music-box',
];

const statusLabels: Record<Project['status'], string> = {
  completed: '已完成',
  active: '迭代中',
  planning: '规划中',
};

function selectFeaturedProjects(projects: Project[]) {
  const selected: Project[] = [];
  const seen = new Set<string>();

  for (const slug of FEATURED_PRIORITY) {
    const project = projects.find((item) => item.slug === slug);
    if (project && !seen.has(project.slug)) {
      selected.push(project);
      seen.add(project.slug);
    }
  }

  for (const line of BUSINESS_LINE_ORDER) {
    if (selected.length >= 5) break;
    const project = projects.find((item) => item.businessLine === line);
    if (project && !seen.has(project.slug)) {
      selected.push(project);
      seen.add(project.slug);
    }
  }

  for (const project of projects) {
    if (selected.length >= 5) break;
    if (!seen.has(project.slug)) {
      selected.push(project);
      seen.add(project.slug);
    }
  }

  return selected;
}

function compact(text: string, maxLength: number) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1)}…`;
}

function ProjectEvidenceVisual({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const lineInfo = businessLineLabels[project.businessLine];
  const bars = project.techStack.slice(0, featured ? 5 : 4);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-cyan-100/10 bg-[#030812] ${
        featured ? 'min-h-40 sm:min-h-48' : 'min-h-32'
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(101,216,255,0.12),transparent_32%),radial-gradient(circle_at_72%_18%,rgba(242,193,102,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent)]" />
      <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 grid gap-2">
        {bars.map((tech, index) => (
          <div
            key={`${project.slug}-visual-${tech}`}
            className="grid grid-cols-[80px_minmax(0,1fr)] items-center gap-3"
          >
            <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-50/42">
              {tech}
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${Math.max(34, 88 - index * 11)}%`,
                  background:
                    index % 3 === 1
                      ? 'linear-gradient(90deg, rgba(242,193,102,0.9), rgba(242,193,102,0.04))'
                      : 'linear-gradient(90deg, rgba(101,216,255,0.95), rgba(101,216,255,0.04))',
                  boxShadow:
                    index % 3 === 1
                      ? '0 0 12px rgba(242,193,102,0.20)'
                      : '0 0 12px rgba(101,216,255,0.22)',
                }}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: lineInfo.color,
            boxShadow: `0 0 14px ${lineInfo.color}66`,
          }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-50/50">
          Evidence Panel
        </span>
      </div>
      <div className="absolute right-4 top-4 rounded-full border border-amber-200/15 bg-amber-200/[0.055] px-2.5 py-1 font-mono text-[10px] text-amber-50/62">
        {project.year}
      </div>
    </div>
  );
}

function FeaturedProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const lineInfo = businessLineLabels[project.businessLine];
  const techs = project.techStack.slice(0, 3);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex min-h-[182px] flex-col overflow-hidden rounded-lg border border-cyan-100/10 bg-[#06101d]/78 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-100/24 hover:bg-[#071522]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/28 to-transparent" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/[0.055] blur-3xl transition-opacity duration-300 group-hover:opacity-90" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-50/42">
            Case {String(index + 1).padStart(2, '0')}
          </p>
          <p className="mt-2 text-base font-semibold leading-snug text-[#e8f2ff]">
            {project.name}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium"
          style={{
            color: lineInfo.color,
            borderColor: `${lineInfo.color}32`,
            background: `${lineInfo.color}12`,
          }}
        >
          {lineInfo.name}
        </span>
      </div>

      <p className="relative mt-3 line-clamp-2 text-sm leading-6 text-cyan-50/58">
        {compact(project.thoughtChain.outcome || project.tagline, 88)}
      </p>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {techs.map((tech) => (
          <span
            key={`${project.slug}-${tech}`}
            className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[11px] text-cyan-50/62"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/36">
          {project.year} · {statusLabels[project.status]}
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-50 transition group-hover:text-cyan-200">
          查看案例
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function FeaturedLeadCard({ project }: { project: Project }) {
  const lineInfo = businessLineLabels[project.businessLine];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative grid min-h-[390px] overflow-hidden rounded-lg border border-cyan-100/12 bg-[#050b14]/88 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-100/26 hover:bg-[#07121f] md:grid-rows-[minmax(0,1fr)_auto]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(101,216,255,0.12),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(242,193,102,0.10),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/40 to-transparent" />

      <ProjectEvidenceVisual project={project} featured />

      <div className="relative pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              color: lineInfo.color,
              borderColor: `${lineInfo.color}34`,
              background: `${lineInfo.color}13`,
            }}
          >
            {lineInfo.name}
          </span>
          <span className="rounded-full border border-amber-200/16 bg-amber-200/[0.055] px-3 py-1 text-xs text-amber-50/70">
            {project.year} · {statusLabels[project.status]}
          </span>
        </div>

        <p className="mt-4 text-2xl font-semibold leading-tight text-[#e8f2ff] sm:text-3xl">
          {project.name}
        </p>
        <p className="mt-3 text-sm leading-7 text-cyan-50/62 sm:text-[15px]">
          {compact(project.thoughtChain.outcome || project.description, 150)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={`${project.slug}-lead-${tech}`}
              className="rounded-full border border-cyan-100/10 bg-cyan-100/[0.045] px-3 py-1.5 text-xs text-cyan-50/70"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-100/20 bg-cyan-100/[0.06] px-5 text-sm font-semibold text-cyan-50 transition group-hover:border-cyan-100/36 group-hover:bg-cyan-100/[0.10]">
          查看案例
          <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProjectsSection({
  projects,
}: {
  projects: Project[];
}) {
  const featured = selectFeaturedProjects(projects);
  const [leadProject, ...supportProjects] = featured.slice(0, 5);

  if (!leadProject) {
    return null;
  }

  return (
    <section
      id="featured-projects"
      className="relative overflow-hidden bg-[#02030a] px-4 py-12 text-[#e8f2ff] sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(101,216,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(101,216,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/28 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[min(760px,90vw)] -translate-x-1/2 rounded-full bg-cyan-300/[0.045] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-5 md:grid-cols-[0.78fr_1.22fr] md:items-end">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/54">
              Selected Missions
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              精选项目
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-cyan-50/62 sm:text-base">
            不是项目清单的复制，而是把最能证明能力的交付样本放到首页：真实问题、技术路径、结果证据和可继续查看的案例入口。
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-[1.02fr_1.38fr] md:items-start">
          <FeaturedLeadCard project={leadProject} />
          <div className="grid gap-4 sm:grid-cols-2 md:items-start">
            {supportProjects.map((project, index) => (
              <FeaturedProjectCard
                key={project.slug}
                project={project}
                index={index + 1}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-cyan-100/10 pt-6">
          <p className="max-w-xl text-sm leading-6 text-cyan-50/48">
            首页只展示经过筛选的关键案例，完整项目宇宙保留分类筛选、更多业务线和创意实验。
          </p>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-200/18 bg-amber-200/[0.055] px-5 text-sm font-semibold text-amber-50/82 transition hover:border-amber-200/32 hover:bg-amber-200/[0.09]"
          >
            查看全部项目
            <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

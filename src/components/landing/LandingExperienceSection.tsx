import Image from 'next/image';
import Link from 'next/link';
import type { BusinessLine, Project } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';
import { MissionControlBackdrop } from '@/components/threeui/backdrops';
import HudFrame from '@/components/threeui/HudFrame';

const businessLineOrder: BusinessLine[] = [
  'health',
  'ai',
  'web',
  'creative',
  'research',
];

const capabilityCards: Array<{
  title: string;
  label: string;
  image: string;
  alt: string;
  copy: string;
  lines: BusinessLine[];
}> = [
  {
    title: 'AI 应用与自动化',
    label: 'Agent Systems',
    image: '/landing/capability-orbit-studio.jpg',
    alt: 'AI、Web、三维与研究模块组成的星盘工作台',
    copy: '把模型能力、浏览器自动化、数据处理和可视化界面串成能落地的工作流。',
    lines: ['ai', 'web', 'research'],
  },
  {
    title: '大健康业务系统',
    label: 'Health Intelligence',
    image: '/landing/ai-health-observatory.jpg',
    alt: '医疗数据、AI 网络和仪表盘连接成的深色智能观测台',
    copy: '从校园健康、医学 OCR 到报告解析，把复杂资料整理成可查询、可复核的系统。',
    lines: ['health', 'ai'],
  },
  {
    title: '创意工程表达',
    label: 'Creative Engineering',
    image: '/landing/cosmic-command-atlas.jpg',
    alt: '深色宇宙星盘与精密轨道组成的项目地图',
    copy: '用 3D、动画、交互和生成式视觉，把作品从功能清单提升为可感知的体验。',
    lines: ['creative', 'web'],
  },
];

const workflowSteps = [
  '需求拆解',
  '系统建模',
  '界面成型',
  '自动化验证',
  '交付复盘',
];

function countByLine(projects: Project[]) {
  return businessLineOrder.map((line) => ({
    line,
    count: projects.filter((project) => project.businessLine === line).length,
    ...businessLineLabels[line],
  }));
}

export default function LandingExperienceSection({
  projects,
}: {
  projects: Project[];
}) {
  const lineCounts = countByLine(projects);
  const completedCount = projects.filter(
    (project) => project.status === 'completed',
  ).length;
  const activeCount = projects.filter((project) => project.status === 'active')
    .length;

  const stats = [
    { value: String(projects.length), label: '项目档案' },
    { value: String(lineCounts.length), label: '业务航线' },
    { value: String(completedCount), label: '已完成交付' },
    { value: String(activeCount), label: '迭代任务' },
  ];

  return (
    <section
      className="relative overflow-hidden bg-[#02030a] px-4 py-14 text-[#e8f2ff] sm:px-6 sm:py-16 lg:px-8"
      aria-labelledby="landing-experience-title"
    >
      <MissionControlBackdrop />
      <HudFrame label="Mission Control" meta="Live Telemetry Feed" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(101,216,255,0.105),transparent_28%),radial-gradient(circle_at_84%_26%,rgba(242,193,102,0.085),transparent_26%),linear-gradient(180deg,rgba(2,3,10,0)_0%,rgba(7,17,31,0.52)_48%,rgba(2,3,10,0)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(101,216,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(101,216,255,0.022)_1px,transparent_1px)] bg-[size:88px_88px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/30 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-0 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/56">
              Mission Control Layer
            </p>
            <h2
              id="landing-experience-title"
              className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              把项目宇宙变成可导航的交付地图
            </h2>
          </div>
          <p className="mb-0 max-w-2xl text-sm leading-7 text-cyan-50/64 sm:text-base">
            业务线、工程路径和案例入口被整理成同一个观测层：既保留星盘调性，也让能力范围和交付证据更容易被读懂。
          </p>
        </div>

        <div className="mt-9 overflow-hidden rounded-lg border border-cyan-100/10 bg-[#050b14]/88">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(101,216,255,0.10),transparent_34%)]" />
              <div className="relative">
                <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100/58">
                  Portfolio Telemetry
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="min-h-[94px] rounded-lg border border-white/[0.07] bg-white/[0.035] p-4"
                    >
                      <p className="mb-1 font-mono text-3xl font-semibold leading-none text-white sm:text-4xl">
                        {stat.value}
                      </p>
                      <p className="mb-0 text-xs leading-5 text-cyan-50/54">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 space-y-3">
                  {lineCounts.map((item) => (
                    <div
                      key={item.line}
                      className="grid grid-cols-[96px_minmax(0,1fr)_32px] items-center gap-3"
                    >
                      <span className="truncate text-xs text-cyan-50/58">
                        {item.name}
                      </span>
                      <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${Math.max(18, item.count * 5)}%`,
                            background: `linear-gradient(90deg, ${item.color}, transparent)`,
                            boxShadow: `0 0 16px ${item.color}44`,
                          }}
                        />
                      </span>
                      <span className="font-mono text-xs text-cyan-50/50">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden border-t border-cyan-100/10 lg:border-l lg:border-t-0">
              <Image
                src="/landing/cosmic-command-atlas.jpg"
                alt="深色宇宙星盘与精密轨道组成的项目地图"
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,20,0.72),rgba(5,11,20,0.12)_42%,rgba(5,11,20,0.22)),linear-gradient(180deg,transparent,rgba(2,3,10,0.72))]" />
              <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-lg border border-cyan-100/14 bg-[#02030a]/68 p-3 backdrop-blur-md"
                  >
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100/40">
                      Phase {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mb-0 text-sm font-semibold text-cyan-50">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {capabilityCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-lg border border-cyan-100/10 bg-[#06101d]/78 transition duration-300 hover:-translate-y-1 hover:border-cyan-100/24 hover:bg-[#071522]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#030812]">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.02),rgba(2,3,10,0.78))]" />
                <p className="absolute bottom-3 left-4 mb-0 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/62">
                  {card.label}
                </p>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold leading-snug text-white">
                  {card.title}
                </h3>
                <p className="mt-3 mb-0 text-sm leading-6 text-cyan-50/58">
                  {card.copy}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.lines.map((line) => (
                    <span
                      key={`${card.title}-${line}`}
                      className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                      style={{
                        color: businessLineLabels[line].color,
                        borderColor: `${businessLineLabels[line].color}34`,
                        background: `${businessLineLabels[line].color}12`,
                      }}
                    >
                      {businessLineLabels[line].name}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-cyan-100/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mb-0 max-w-2xl text-sm leading-6 text-cyan-50/48">
            完整案例页保留更多分类筛选、技术细节和交付过程；首页负责把最核心的能力坐标先亮出来。
          </p>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan-100/20 bg-cyan-100/[0.06] px-5 text-sm font-semibold text-cyan-50 transition hover:border-cyan-100/36 hover:bg-cyan-100/[0.10]"
          >
            进入项目地图
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

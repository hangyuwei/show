'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/projects';
import { businessLineLabels } from '@/data/projects';

export type ProjectDetailScreenshot = {
  src: string;
  exists: boolean;
};

const ProjectSceneContainer = dynamic(
  () => import('@/components/three/ProjectSceneContainer'),
  { ssr: false }
);

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SECTION_IDS = [
  { id: 'overview', label: '项目概述' },
  { id: 'requirements', label: '需求分析' },
  { id: 'design', label: '方案设计' },
  { id: 'development', label: '开发过程' },
  { id: 'challenges', label: '难点与解决' },
  { id: 'outcome', label: '项目成果' },
] as const;

const SECTION_SCROLL_OFFSET = 88;

const TECH_COLORS: Record<string, string> = {
  react: '#61dafb',
  'react.js': '#61dafb',
  nextjs: '#ffffff',
  'next.js': '#ffffff',
  typescript: '#3178c6',
  javascript: '#f7df1e',
  python: '#3776ab',
  node: '#339933',
  'node.js': '#339933',
  tailwind: '#06b6d4',
  'tailwindcss': '#06b6d4',
  'tailwind css': '#06b6d4',
  three: '#ffffff',
  threejs: '#ffffff',
  'three.js': '#ffffff',
  framer: '#0055ff',
  'framer motion': '#0055ff',
  prisma: '#2d3748',
  postgresql: '#336791',
  mongodb: '#47a248',
  redis: '#dc382d',
  docker: '#2496ed',
  kubernetes: '#326ce5',
  aws: '#ff9900',
  graphql: '#e10098',
  rust: '#ce422b',
  golang: '#00add8',
  go: '#00add8',
  vue: '#4fc08d',
  'vue.js': '#4fc08d',
  angular: '#dd0031',
  svelte: '#ff3e00',
  firebase: '#ffca28',
  supabase: '#3ecf8e',
  vercel: '#ffffff',
  git: '#f05032',
  github: '#ffffff',
};

type ArchitectureLayer = {
  title: string;
  role: string;
  description: string;
  signal: string;
  technologies: string[];
};

type DomainFlowStep = {
  title: string;
  description: string;
  signal: string;
};

type UnderstandingGraph = {
  domainFlow: DomainFlowStep[];
  layers: ArchitectureLayer[];
  tour: DomainFlowStep[];
  qualityBoundary: {
    title: string;
    description: string;
  };
};

type DevelopmentStage = {
  title: string;
  signal: string;
  description: string;
  highlights: string[];
  tone: 'indigo' | 'cyan' | 'emerald';
};

const ARCHITECTURE_CONTEXT: Record<
  Project['businessLine'],
  { input: string; interface: string; output: string }
> = {
  health: {
    input: '业务表单 / 文档 / 运营数据',
    interface: '移动端、桌面端或管理后台完成采集与校验',
    output: '预警、报表、结构化台账与决策看板',
  },
  ai: {
    input: '用户指令 / Prompt / 多模态素材',
    interface: '交互入口将需求转换为模型可执行任务',
    output: 'Agent 响应、生成内容、分析结果或自动化流程',
  },
  web: {
    input: '用户行为 / 内容数据 / 业务操作',
    interface: 'Web 界面承载浏览、提交、管理与反馈',
    output: '在线应用、业务页面、订单或内容交付',
  },
  creative: {
    input: '创意脚本 / 视觉素材 / 交互参数',
    interface: '创作界面或动画时间线组织素材与动作',
    output: '互动体验、三维场景、视频或视觉资产',
  },
  research: {
    input: '论文线索 / 网页资源 / 检索任务',
    interface: '自动化入口收集条件并调度采集流程',
    output: '文献包、引用数据、技能材料或研究报告',
  },
};

const DOMAIN_FLOW_PRESETS: Record<Project['businessLine'], DomainFlowStep[]> = {
  health: [
    {
      title: '业务采集',
      description: '表单、报告、运营资料或行业数据进入系统。',
      signal: 'Input',
    },
    {
      title: '校验整理',
      description: '把分散资料转换为可查询、可导出的结构化记录。',
      signal: 'Normalize',
    },
    {
      title: '分析复核',
      description: '通过规则、统计或 AI 辅助识别重点信息，保留人工确认。',
      signal: 'Review',
    },
    {
      title: '台账交付',
      description: '输出报表、文档、看板、内容素材或内部资料。',
      signal: 'Deliver',
    },
  ],
  ai: [
    {
      title: '意图输入',
      description: '用户指令、Prompt、素材或任务配置进入 Agent 流程。',
      signal: 'Prompt',
    },
    {
      title: '任务编排',
      description: '拆解任务并调度模型、工具、检索和批处理步骤。',
      signal: 'Orchestrate',
    },
    {
      title: '模型处理',
      description: '由模型、视觉算法、向量检索或规则模块生成候选结果。',
      signal: 'Infer',
    },
    {
      title: '结果输出',
      description: '交付回答、草稿、素材匹配、接口响应或部署记录。',
      signal: 'Output',
    },
  ],
  web: [
    {
      title: '访问入口',
      description: '用户从 Web 页面、小程序或桌面壳进入业务流程。',
      signal: 'Entry',
    },
    {
      title: '交互任务',
      description: '浏览、提交、筛选、搜索、发布或管理动作被转换为请求。',
      signal: 'Action',
    },
    {
      title: '业务处理',
      description: '服务层处理权限、内容、状态、搜索和数据组织。',
      signal: 'Service',
    },
    {
      title: '体验交付',
      description: '以页面、列表、详情、通知或本地知识库形态交付结果。',
      signal: 'UI',
    },
  ],
  creative: [
    {
      title: '创意输入',
      description: '脚本、音乐、模型、视觉素材或交互参数进入创作流程。',
      signal: 'Asset',
    },
    {
      title: '场景组织',
      description: '通过时间线、三维场景、材质和动画组织视觉结构。',
      signal: 'Scene',
    },
    {
      title: '互动渲染',
      description: '渲染循环、音频事件和用户操作驱动画面反馈。',
      signal: 'Render',
    },
    {
      title: '体验发布',
      description: '输出可浏览、可互动或可复用的创意作品。',
      signal: 'Publish',
    },
  ],
  research: [
    {
      title: '研究任务',
      description: '关键词、论文线索、简历条件或研究问题进入工具链。',
      signal: 'Query',
    },
    {
      title: '自动化采集',
      description: '浏览器自动化、技能命令或脚本辅助完成重复性收集。',
      signal: 'Collect',
    },
    {
      title: '结构化整理',
      description: '提取摘要、引用、候选条目、匹配字段或综述矩阵。',
      signal: 'Structure',
    },
    {
      title: '人工判断',
      description: '保留来源核验、权限处理和最终筛选判断。',
      signal: 'Verify',
    },
  ],
};

const ARCHITECTURE_KEYWORDS = {
  interface: [
    'next',
    'react',
    'vue',
    'vant',
    'streamlit',
    'gradio',
    'html',
    'css',
    'tailwind',
    'web',
    'desktop',
  ],
  service: [
    'spring',
    'fastapi',
    'node',
    'python',
    'langchain',
    'playwright',
    'edge',
    'claude skills',
  ],
  intelligence: [
    'openai',
    'anthropic',
    'deepseek',
    '智谱',
    'glm',
    'qwen',
    'huggingface',
    'pytorch',
    'opencv',
    'faiss',
    'ocr',
    'ai image',
    'stable',
    'comfy',
    'markitdown',
    'pandas',
    'plotly',
  ],
  delivery: [
    'mysql',
    'redis',
    'postgres',
    'mongodb',
    'excel',
    'pdf',
    'openpyxl',
    'docx',
    'markdown',
    'docker',
    'pyinstaller',
    'video',
    'design tools',
    'content management',
  ],
};

function compactText(text: string, maxLength = 96): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  const sentenceEnd = normalized.search(/[。！？.!?]/);
  if (sentenceEnd > 24 && sentenceEnd <= maxLength) {
    return normalized.slice(0, sentenceEnd + 1);
  }

  return `${normalized.slice(0, maxLength - 1)}…`;
}

function splitCompactClauses(text: string, maxItems = 3): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const clauses = normalized
    .split(/[，,。；;、/]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 4);

  return (clauses.length > 0 ? clauses : [normalized])
    .slice(0, maxItems)
    .map((item) => compactText(item, 24));
}

function getTechColor(tech: string): string {
  const lower = tech.toLowerCase();
  for (const [key, color] of Object.entries(TECH_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#8b5cf6';
}

function selectTechs(techStack: string[], keywords: string[]): string[] {
  return techStack.filter((tech) => {
    const normalized = tech.toLowerCase();
    return keywords.some((keyword) => normalized.includes(keyword));
  });
}

function fillTechs(
  selected: string[],
  techStack: string[],
  usedTechs: Set<string>,
): string[] {
  const result = selected.filter((tech) => !usedTechs.has(tech));

  if (result.length === 0) {
    const fallback = techStack.find((tech) => !usedTechs.has(tech));
    if (fallback) result.push(fallback);
  }

  result.slice(0, 4).forEach((tech) => usedTechs.add(tech));
  return result.slice(0, 4);
}

function buildArchitectureLayers(project: Project): ArchitectureLayer[] {
  const context = ARCHITECTURE_CONTEXT[project.businessLine];
  const usedTechs = new Set<string>();
  const intelligenceMatches = selectTechs(
    project.techStack,
    ARCHITECTURE_KEYWORDS.intelligence,
  );
  const interfaceTechs = fillTechs(
    selectTechs(project.techStack, ARCHITECTURE_KEYWORDS.interface),
    project.techStack,
    usedTechs,
  );
  const serviceTechs = fillTechs(
    selectTechs(project.techStack, ARCHITECTURE_KEYWORDS.service),
    project.techStack,
    usedTechs,
  );
  const intelligenceTechs = fillTechs(
    intelligenceMatches,
    project.techStack,
    usedTechs,
  );
  const deliveryTechs = fillTechs(
    selectTechs(project.techStack, ARCHITECTURE_KEYWORDS.delivery),
    project.techStack,
    usedTechs,
  );

  return [
    {
      title: '业务输入层',
      role: context.input,
      description: `接收「${project.name}」的原始需求、业务记录或素材，形成后续流程的任务入口。`,
      signal: '需求 / 文件 / 记录',
      technologies: [],
    },
    {
      title: '交互采集层',
      role: context.interface,
      description: '负责表单、上传、筛选、参数配置和结果预览，把用户行为转换为标准化请求。',
      signal: '表单 / 上传 / Prompt',
      technologies: interfaceTechs,
    },
    {
      title: '服务编排层',
      role: '权限、流程、接口与任务调度',
      description: '承接前端请求，组织业务规则、批处理任务、外部 API 调用和异常处理。',
      signal: 'API / Job / Workflow',
      technologies: serviceTechs,
    },
    {
      title: intelligenceMatches.length > 0 ? '智能处理层' : '规则处理层',
      role: intelligenceMatches.length > 0 ? 'AI、ETL 与分析推理' : '业务规则与数据转换',
      description: '对输入数据进行解析、清洗、统计、模型推理或规则计算，产出可展示的结构化结果。',
      signal: '指标 / 字段 / 洞察',
      technologies: intelligenceTechs,
    },
    {
      title: '存储交付层',
      role: context.output,
      description: '沉淀核心数据和中间结果，并交付为页面、报表、文件、内容资产或可部署服务。',
      signal: '看板 / 文件 / 服务',
      technologies: deliveryTechs,
    },
  ];
}

function buildUnderstandingGraph(project: Project): UnderstandingGraph {
  const domainFlow = DOMAIN_FLOW_PRESETS[project.businessLine].map((step, index) => {
    if (index === 0) {
      return {
        ...step,
        description: compactText(project.thoughtChain.problem, 88),
      };
    }

    if (index === 1) {
      return {
        ...step,
        description: compactText(project.thoughtChain.analysis, 88),
      };
    }

    if (index === 2 && project.thoughtChain.challenges[0]) {
      return {
        ...step,
        description: compactText(project.thoughtChain.challenges[0].solution, 88),
      };
    }

    if (index === 3) {
      return {
        ...step,
        description: compactText(project.thoughtChain.outcome, 88),
      };
    }

    return step;
  });

  const layers = buildArchitectureLayers(project);
  const primaryChallenge = project.thoughtChain.challenges[0];
  const secondaryChallenge = project.thoughtChain.challenges[1];

  return {
    domainFlow,
    layers,
    tour: [
      {
        title: '为什么做',
        description: compactText(project.thoughtChain.problem, 56),
        signal: 'Problem',
      },
      {
        title: '怎么拆',
        description: compactText(project.thoughtChain.analysis, 56),
        signal: 'Domain',
      },
      {
        title: '怎么实现',
        description: compactText(project.thoughtChain.development, 56),
        signal: 'Build',
      },
      {
        title: '交付什么',
        description: compactText(project.thoughtChain.outcome, 56),
        signal: 'Result',
      },
    ],
    qualityBoundary: {
      title: primaryChallenge?.title ?? '项目边界',
      description: compactText(
        [primaryChallenge?.solution, secondaryChallenge?.solution]
          .filter(Boolean)
          .join(' / ') || project.thoughtChain.design,
        150,
      ),
    },
  };
}

function buildDevelopmentStages(project: Project): DevelopmentStage[] {
  const primaryChallenge = project.thoughtChain.challenges[0];
  const coreTechs = project.techStack.slice(0, 4);
  const qualitySignals = [
    primaryChallenge?.title,
    project.status === 'active' ? '持续迭代' : '交付闭环',
    '结果复核',
  ].filter(Boolean) as string[];

  return [
    {
      title: '需求拆解',
      signal: 'Scope',
      description: `先把问题拆成可落地的任务边界：${project.thoughtChain.analysis}`,
      highlights: ['任务边界', '核心指标', businessLineLabels[project.businessLine].name],
      tone: 'indigo',
    },
    {
      title: '核心构建',
      signal: 'Build',
      description: project.thoughtChain.development,
      highlights: coreTechs.length > 0 ? coreTechs : ['模块实现', '流程编排', '数据处理'],
      tone: 'cyan',
    },
    {
      title: '验证交付',
      signal: 'Verify',
      description: [primaryChallenge?.solution, project.thoughtChain.outcome]
        .filter(Boolean)
        .join(' '),
      highlights: qualitySignals.slice(0, 4),
      tone: 'emerald',
    },
  ];
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getPrimaryDeliverable(project: Project): string {
  const map: Record<Project['businessLine'], string> = {
    health: '业务台账 / 数据报表',
    ai: 'Agent 流程 / 智能处理',
    web: 'Web 应用 / 内容服务',
    creative: '交互体验 / 视觉资产',
    research: '研究材料 / 引用结果',
  };

  return map[project.businessLine];
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionTitle({
  children,
  step,
  id,
}: {
  children: React.ReactNode;
  step?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      data-section-anchor
      className="mb-7 flex items-center gap-4 sm:mb-10 sm:gap-5"
    >
      {step && (
        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/24 via-cyan-300/12 to-amber-300/10 text-base font-bold text-cyan-50 sm:h-12 sm:w-12 sm:text-lg"
          style={{
            boxShadow: '0 4px 24px rgba(101,216,255,0.18), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.12)',
            border: '1px solid rgba(101,216,255,0.22)',
          }}
        >
          {step}
          {/* Inner glow halo — stronger bloom */}
          <span className="absolute inset-0 rounded-xl bg-cyan-300/[0.10] blur-md" />
          {/* Mid-range ambient glow */}
          <span className="absolute inset-[-6px] rounded-2xl bg-cyan-300/[0.06] blur-xl" />
          {/* Far-range atmospheric glow */}
          <span className="absolute inset-[-12px] rounded-3xl bg-amber-300/[0.035] blur-2xl" />
          {/* Animated pulse ring */}
          <span className="absolute inset-[-4px] rounded-2xl border border-cyan-300/10 animate-pulse" />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl heading-section">
          {children}
        </h2>
        <div className="mt-4 flex h-[3px] w-36 items-center gap-0.5">
          {/* Primary gradient bar */}
          <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-200 via-cyan-300/80 to-amber-200/42" />
          {/* Soft bloom duplicate for depth */}
          <div className="absolute h-[3px] w-36 rounded-full bg-gradient-to-r from-cyan-200/50 via-cyan-300/26 to-transparent blur-sm" />
          {/* Trailing glow dot at the end */}
          <div className="absolute left-32 h-1.5 w-1.5 rounded-full bg-amber-200/44" style={{ boxShadow: '0 0 8px rgba(242,193,102,0.28)' }} />
        </div>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-zinc-600/20 via-zinc-700/10 to-transparent" />
    </div>
  );
}

function FadeInSection({
  children,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return <div>{children}</div>;
}

function ScrollDownArrow() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        className="h-8 w-8 text-white/60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30',
    active: 'bg-amber-500/20 text-amber-400 ring-amber-500/30',
    planning: 'bg-blue-500/20 text-blue-400 ring-blue-500/30',
  };
  const labelMap: Record<string, string> = {
    completed: '已完成',
    active: '开发中',
    planning: '规划中',
  };
  const classes = colorMap[status] ?? 'bg-zinc-500/20 text-zinc-400 ring-zinc-500/30';
  const label = labelMap[status] ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${classes}`}
    >
      {label}
    </span>
  );
}

function ProjectBriefPanel({ project }: { project: Project }) {
  const lineInfo = businessLineLabels[project.businessLine];
  const proofItems = [
    { label: '领域', value: lineInfo.name },
    { label: '交付', value: getPrimaryDeliverable(project) },
    { label: '年份', value: project.year },
    { label: '状态', value: project.status === 'active' ? '迭代中' : project.status === 'planning' ? '规划中' : '已完成' },
  ];

  return (
    <div className="relative overflow-hidden rounded-lg border border-cyan-100/12 bg-[#040b14]/78 p-4 backdrop-blur-xl ring-1 ring-white/[0.025] sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(101,216,255,0.10),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(242,193,102,0.10),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/36 to-transparent" />

      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
        {proofItems.map((item) => (
          <div key={item.label} className="rounded-md border border-white/[0.06] bg-white/[0.035] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-50/38">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug text-zinc-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {project.techStack.slice(0, 5).map((tech) => (
          <span
            key={`${project.slug}-brief-${tech}`}
            className="rounded-full border border-cyan-100/10 bg-cyan-100/[0.045] px-3 py-1 text-xs text-cyan-50/70"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function handleSectionLinkClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  id: string,
) {
  event.preventDefault();
  const section = document.getElementById(id);
  const target = section?.querySelector<HTMLElement>('[data-section-anchor]') ?? section;
  if (!target) return;

  history.replaceState(null, '', `#${id}`);
  const top = target.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function CompactSectionNav({ activeId }: { activeId: string }) {
  return (
    <nav className="xl:hidden" aria-label="Section navigation">
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-cyan-100/10 bg-[#040b14]/70 p-2 backdrop-blur-xl">
        {SECTION_IDS.map((section, index) => {
          const isActive = activeId === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => handleSectionLinkClick(event, section.id)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-xs transition ${
                isActive
                  ? 'bg-cyan-100/[0.10] text-cyan-50 ring-1 ring-cyan-100/18'
                  : 'text-zinc-400 hover:bg-white/[0.045] hover:text-zinc-200'
              }`}
            >
              <span className="font-mono text-[10px] text-cyan-100/50">
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function TechPill({ tech }: { tech: string }) {
  const color = getTechColor(tech);
  return (
    <span
      className="group relative inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md transition-all duration-500 hover:scale-105 hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}0a)`,
        border: `1px solid ${color}28`,
        color: `${color}ee`,
        boxShadow: `0 1px 4px rgba(0,0,0,0.18), 0 0 20px ${color}0c, inset 0 1px 0 ${color}0c`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${color}55`;
        el.style.boxShadow = `0 6px 20px rgba(0,0,0,0.25), 0 0 28px ${color}1c, 0 0 14px ${color}0e, inset 0 1px 0 ${color}18`;
        el.style.background = `linear-gradient(135deg, ${color}30, ${color}12)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${color}28`;
        el.style.boxShadow = `0 1px 4px rgba(0,0,0,0.18), 0 0 20px ${color}0c, inset 0 1px 0 ${color}0c`;
        el.style.background = `linear-gradient(135deg, ${color}20, ${color}0a)`;
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5"
        style={{ background: color, boxShadow: `0 0 10px ${color}70` }}
      />
      {tech}
      {/* Ambient far-glow on hover */}
      <span className="pointer-events-none absolute inset-[-10px] rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: `${color}12` }} />
    </span>
  );
}

function DevelopmentStageCard({
  stage,
  index,
}: {
  stage: DevelopmentStage;
  index: number;
}) {
  const toneStyles: Record<
    DevelopmentStage['tone'],
    { border: string; bg: string; text: string; glow: string; dot: string }
  > = {
    indigo: {
      border: 'border-indigo-300/15 hover:border-indigo-300/25',
      bg: 'from-indigo-500/[0.10] via-indigo-500/[0.045] to-transparent',
      text: 'text-indigo-200/75',
      glow: 'bg-indigo-500/[0.08]',
      dot: 'bg-indigo-300/80',
    },
    cyan: {
      border: 'border-cyan-200/14 hover:border-cyan-200/24',
      bg: 'from-cyan-400/[0.09] via-cyan-400/[0.035] to-transparent',
      text: 'text-cyan-100/72',
      glow: 'bg-cyan-400/[0.07]',
      dot: 'bg-cyan-200/80',
    },
    emerald: {
      border: 'border-emerald-300/14 hover:border-emerald-300/24',
      bg: 'from-emerald-400/[0.08] via-emerald-400/[0.032] to-transparent',
      text: 'text-emerald-100/72',
      glow: 'bg-emerald-400/[0.065]',
      dot: 'bg-emerald-200/80',
    },
  };
  const tone = toneStyles[stage.tone];

  return (
    <article
      className={`group relative min-h-[300px] overflow-hidden rounded-2xl border ${tone.border} bg-zinc-950/42 p-5 ring-1 ring-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/46 sm:p-6`}
    >
      <div className={`pointer-events-none absolute right-0 top-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full ${tone.glow} blur-3xl transition-opacity duration-300 group-hover:opacity-90`} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-70`} />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.bg}`} />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className={`font-mono text-[10px] uppercase tracking-[0.24em] ${tone.text}`}>
              {stage.signal}
            </span>
            <h4 className="mt-3 text-xl font-semibold tracking-tight text-zinc-100">
              {stage.title}
            </h4>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] font-mono text-xs text-zinc-300">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <p className="mt-5 text-sm leading-[1.8] text-zinc-300/82">
          {stage.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {stage.highlights.map((highlight) => (
            <span
              key={highlight}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-xs text-zinc-300/78"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                style={{ boxShadow: '0 0 8px currentColor' }}
              />
              <span className="min-w-0 truncate">{highlight}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ArchitectureFlow({ project }: { project: Project }) {
  const graph = buildUnderstandingGraph(project);
  const lineInfo = businessLineLabels[project.businessLine];

  return (
    <div className="relative mt-5 rounded-2xl border border-cyan-100/[0.06] bg-black/14 p-3 sm:p-4">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.075),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(251,191,36,0.045),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div
        className="pointer-events-none absolute inset-x-6 top-[146px] hidden h-px lg:block"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(103,232,249,0.34), rgba(251,191,36,0.22), transparent)',
        }}
      />

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/42">
            Understanding Graph
          </p>
          <h4 className="mt-1 text-base font-semibold leading-6 text-zinc-100">
            {project.name} 的业务-架构理解图
          </h4>
        </div>
        <span
          className="rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            color: lineInfo.color,
            background: `${lineInfo.color}12`,
            borderColor: `${lineInfo.color}28`,
          }}
        >
          {lineInfo.name}
        </span>
      </div>

      <div className="relative mt-3 rounded-xl border border-white/[0.045] bg-white/[0.018] p-3">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-200">业务域流程</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Domain View
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {graph.domainFlow.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="relative rounded-lg border border-white/[0.055] bg-zinc-950/42 p-2 sm:p-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-cyan-200/15 bg-cyan-200/[0.06] font-mono text-[9px] text-cyan-100/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="mb-0 truncate text-sm font-semibold leading-5 text-zinc-100">
                    {step.title}
                  </p>
                  <p className="mb-0 font-mono text-[9px] uppercase leading-4 tracking-[0.14em] text-zinc-500">
                    {step.signal}
                  </p>
                </div>
              </div>
              <p className="mb-0 mt-2 hidden text-[12px] leading-5 text-zinc-400 sm:block">
                {compactText(step.description, 42)}
              </p>
              {index < graph.domainFlow.length - 1 && (
                <div className="pointer-events-none absolute right-[-9px] top-1/2 hidden h-px w-4 bg-cyan-100/16 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-3">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-200">架构层与模块关系</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Layer View
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {graph.layers.map((layer, index) => (
            <div
              key={layer.title}
              className="group relative min-h-[86px] rounded-lg border border-white/[0.065] bg-zinc-950/44 p-2 backdrop-blur-md transition-all duration-300 hover:border-cyan-200/20 hover:bg-zinc-900/55 sm:min-h-[112px] sm:p-2.5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] text-cyan-100/52">
                  L{index + 1}
                </span>
                <span className="truncate rounded-full border border-amber-200/15 bg-amber-200/[0.055] px-1.5 py-0.5 font-mono text-[8px] uppercase leading-3 tracking-[0.12em] text-amber-100/60">
                  {layer.signal}
                </span>
              </div>
              <p className="mb-0 text-sm font-semibold leading-5 text-zinc-100">
                {layer.title}
              </p>
              <p className="mb-0 mt-1 text-[11px] leading-4 text-cyan-100/55 sm:text-[12px] sm:leading-5">
                {compactText(layer.role, 30)}
              </p>
              {layer.technologies.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2">
                  {layer.technologies.slice(0, 1).map((tech) => {
                    const color = getTechColor(tech);
                    return (
                      <span
                        key={`${layer.title}-${tech}`}
                        className="inline-flex max-w-full items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                        style={{
                          color,
                          background: `${color}13`,
                          border: `1px solid ${color}24`,
                        }}
                      >
                        <span
                          className="h-1 w-1 shrink-0 rounded-full"
                          style={{
                            background: color,
                            boxShadow: `0 0 6px ${color}55`,
                          }}
                        />
                        <span className="truncate">{tech}</span>
                      </span>
                    );
                  })}
                </div>
              )}
              {index < graph.layers.length - 1 && (
                <div className="pointer-events-none absolute right-[-8px] top-1/2 hidden h-px w-3 bg-cyan-100/16 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(210px,0.52fr)]">
        <div className="rounded-xl border border-cyan-100/[0.055] bg-cyan-100/[0.022] p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100/42">
            Guided Tour
          </p>
          <div className="flex flex-wrap gap-2">
            {graph.tour.map((step, index) => (
              <span
                key={step.title}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-100/[0.07] bg-cyan-100/[0.026] px-2.5 py-1 text-xs text-zinc-300/82"
              >
                <span className="font-mono text-[9px] text-cyan-100/50">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-amber-200/10 bg-amber-200/[0.035] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/50">
            Boundary
          </p>
          <p className="mb-0 mt-1 text-sm font-semibold leading-5 text-amber-50/85">
            {graph.qualityBoundary.title}
          </p>
          <p className="mb-0 mt-1 text-[12px] leading-5 text-amber-50/58">
            {compactText(graph.qualityBoundary.description, 58)}
          </p>
        </div>
      </div>

      <div className="relative mt-3 rounded-xl border border-cyan-200/8 bg-cyan-200/[0.028] px-3 py-2.5 text-[12px] leading-5 text-cyan-50/58 sm:px-3.5">
        读法：先看业务流，再顺着 L1-L5 的职责链理解输入、交互、编排、处理与交付边界。
      </div>
    </div>
  );
}

function ScreenshotFallback({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const lineInfo = businessLineLabels[project.businessLine];
  const outcomePoints = splitCompactClauses(project.thoughtChain.outcome, 3);
  const evidencePoints = [
    getPrimaryDeliverable(project),
    project.thoughtChain.challenges[0]?.title,
    project.status === 'active' ? '持续迭代' : '已完成交付',
  ].filter(Boolean);

  return (
    <div className="relative grid min-h-[300px] overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(101,216,255,0.13),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(242,193,102,0.09),transparent_30%),linear-gradient(135deg,rgba(2,3,10,0.98),rgba(7,17,31,0.95))] p-4 sm:min-h-[290px] sm:p-5 lg:min-h-[310px] lg:grid-cols-[minmax(0,1.12fr)_minmax(260px,0.88fr)] lg:gap-5">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/24 to-transparent" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-cyan-100/10" />
      <div className="pointer-events-none absolute right-0 top-20 hidden h-px w-44 rotate-[-18deg] bg-amber-100/15 sm:block" />

      <div className="relative flex min-w-0 flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{
                color: lineInfo.color,
                background: `${lineInfo.color}14`,
                border: `1px solid ${lineInfo.color}26`,
              }}
            >
              {lineInfo.name}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              成果证据面板 {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="mt-5 max-w-2xl sm:mt-6">
            <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-100/46">
              交付摘要
            </p>
            <p className="mb-0 mt-2 text-lg font-semibold leading-7 text-zinc-50 sm:text-2xl sm:leading-9">
              {compactText(project.thoughtChain.outcome, 78)}
            </p>
            <p className="mb-0 mt-3 text-sm leading-6 text-zinc-400">
              {project.tagline}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
          {evidencePoints.map((point) => (
            <span
              key={`${project.slug}-evidence-${point}`}
              className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1 text-xs leading-5 text-zinc-300/78"
            >
              {point}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-5 min-w-0 rounded-2xl border border-cyan-100/[0.08] bg-black/18 p-3.5 sm:mt-5 sm:p-4 lg:mt-0">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(101,216,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(101,216,255,0.026)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative">
          <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/48">
            Result Signals
          </p>
          <div className="mt-3 grid gap-2">
            {outcomePoints.map((point) => (
              <div
                key={`${project.slug}-signal-${point}`}
                className="flex items-start gap-2.5 rounded-xl border border-white/[0.055] bg-white/[0.026] px-3 py-2"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200/70 shadow-[0_0_10px_rgba(101,216,255,0.32)]" />
                <span className="min-w-0 text-[13px] leading-5 text-zinc-300/84">
                  {point}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => {
            const color = getTechColor(tech);
            return (
              <span
                key={`${project.slug}-fallback-${tech}`}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium"
                style={{
                  color,
                  background: `${color}12`,
                  border: `1px solid ${color}24`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}55` }}
                />
                {tech}
              </span>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getOutcomeScreenshotLabel(index: number): string {
  const labels = ['主界面截图', '交付流程图', '交付包截图'];
  return labels[index] ?? `成果截图 ${index + 1}`;
}

function getOutcomeScreenshotDescription(project: Project, index: number): string {
  if (index === 0) {
    return compactText(project.thoughtChain.outcome, 64);
  }

  if (index === 1) {
    return compactText(project.thoughtChain.analysis, 64);
  }

  return compactText(project.thoughtChain.development, 64);
}

function OutcomeScreenshotCard({
  project,
  screenshot,
  index,
  total,
  featured = false,
}: {
  project: Project;
  screenshot: ProjectDetailScreenshot;
  index: number;
  total: number;
  featured?: boolean;
}) {
  const hasScreenshot = screenshot.exists;
  const label = getOutcomeScreenshotLabel(index);
  const description = getOutcomeScreenshotDescription(project, index);

  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border border-cyan-100/12 bg-zinc-950/78 text-sm text-zinc-500 shadow-2xl shadow-black/22 ring-1 ring-white/[0.03] transition-all duration-500 hover:border-cyan-100/28 hover:shadow-cyan-500/[0.08] hover:ring-white/[0.07] ${
        hasScreenshot
          ? featured
            ? 'hover:-translate-y-1'
            : 'hover:-translate-y-0.5'
          : 'min-h-[330px] sm:min-h-[320px]'
      }`}
    >
      {hasScreenshot && (
        <div className="relative bg-slate-100 p-1.5 sm:p-2">
          <div className="mb-1.5 flex items-center justify-between gap-3 rounded-t-xl border border-slate-200 bg-white px-3 py-2 text-slate-500 sm:mb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:inline">
              delivery evidence
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <div className={`relative overflow-hidden rounded-b-xl bg-white ${
            featured ? 'aspect-[16/10]' : 'aspect-[16/10]'
          }`}>
            <Image
              src={screenshot.src}
              alt={`${project.name} ${label}`}
              fill
              sizes={featured ? '(max-width: 1024px) 100vw, 1040px' : '(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 360px'}
              className="object-contain transition duration-700 group-hover:scale-[1.012]"
              priority={featured}
            />
          </div>
        </div>
      )}

      {!hasScreenshot && (
        <ScreenshotFallback project={project} index={index} />
      )}

      {hasScreenshot && (
        <figcaption className={`border-t border-cyan-100/10 bg-zinc-950/88 ${
          featured ? 'px-4 py-4 sm:px-5' : 'px-3.5 py-3.5'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-zinc-50">
                  {label}
                </span>
                <span className="rounded-full border border-cyan-100/14 bg-cyan-100/[0.045] px-2 py-0.5 font-mono text-[10px] text-cyan-100/70">
                  {index + 1}/{total}
                </span>
              </div>
              <p className="mb-0 mt-2 text-xs leading-5 text-zinc-400 sm:text-[13px]">
                {description}
              </p>
            </div>
            <a
              href={screenshot.src}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-cyan-200/30 hover:bg-cyan-100/[0.08] hover:text-white"
            >
              查看大图
            </a>
          </div>
        </figcaption>
      )}
    </figure>
  );
}

function OutcomeShowcase({
  project,
  screenshots,
}: {
  project: Project;
  screenshots: ProjectDetailScreenshot[];
}) {
  const items = screenshots.length > 0
    ? screenshots
    : [{ src: `${project.slug}-evidence`, exists: false }];
  const [primary, ...secondary] = items;
  const lineInfo = businessLineLabels[project.businessLine];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-4 top-10 h-32 w-32 rounded-full bg-cyan-400/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -right-4 bottom-12 h-40 w-40 rounded-full bg-amber-300/[0.045] blur-3xl" />

      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-cyan-100/[0.035] px-4 py-3 ring-1 ring-white/[0.02] sm:mb-5 sm:px-5">
        <div>
          <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/52">
            Delivery Gallery
          </p>
          <p className="mb-0 mt-1 text-sm text-zinc-300/82">
            主界面、流程与交付包三类证据图，直接展示项目产出。
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            color: lineInfo.color,
            background: `${lineInfo.color}12`,
            border: `1px solid ${lineInfo.color}26`,
          }}
        >
          {items.filter((item) => item.exists).length} 张成果图
        </span>
      </div>

      <div className="relative grid gap-4">
        {project.demoVideo && (
          <figure className="group relative overflow-hidden rounded-2xl border border-cyan-100/12 bg-zinc-950/78 shadow-2xl shadow-black/22 ring-1 ring-white/[0.03] transition-all duration-500 hover:border-cyan-100/28 hover:shadow-cyan-500/[0.08] hover:ring-white/[0.07] hover:-translate-y-1">
            <div className="relative bg-slate-100 p-1.5 sm:p-2">
              <div className="mb-1.5 flex items-center justify-between gap-3 rounded-t-xl border border-slate-200 bg-white px-3 py-2 text-slate-500 sm:mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:inline">
                  demo video
                </span>
                <span className="font-mono text-[10px] text-slate-400">▶</span>
              </div>
              <div className="relative overflow-hidden rounded-b-xl bg-black aspect-[16/9]">
                <video
                  src={project.demoVideo}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <figcaption className="border-t border-cyan-100/10 bg-zinc-950/88 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-50">
                      演示视频
                    </span>
                    <span className="rounded-full border border-red-500/30 bg-red-500/[0.08] px-2 py-0.5 font-mono text-[10px] text-red-300/80">
                      DEMO
                    </span>
                  </div>
                  <p className="mb-0 mt-2 text-xs leading-5 text-zinc-400 sm:text-[13px]">
                    {project.name} 交互演示，展示 3D 场景实时渲染效果。
                  </p>
                </div>
              </div>
            </figcaption>
          </figure>
        )}
        <OutcomeScreenshotCard
          key={primary.src}
          project={project}
          screenshot={primary}
          index={0}
          total={items.length}
          featured
        />
        {secondary.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {secondary.map((screenshot, index) => (
              <OutcomeScreenshotCard
                key={screenshot.src}
                project={project}
                screenshot={screenshot}
                index={index + 1}
                total={items.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectActionRail({ project }: { project: Project }) {
  const actionButtonBase =
    'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium transition hover:border-white/[0.16] hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/30';
  const secondaryButton =
    'border border-white/[0.09] bg-[#0f1011]/72 text-zinc-300 ring-1 ring-white/[0.018] hover:text-white';
  const primaryButton =
    'border border-cyan-100/18 bg-cyan-100/[0.09] text-cyan-50 ring-1 ring-cyan-100/[0.04] hover:border-cyan-100/28 hover:bg-cyan-100/[0.13]';

  return (
    <section
      className="project-detail-section relative mt-2 [background:transparent] [--detail-section-pb:2rem] [--detail-section-pt:2rem] sm:[--detail-section-pb:2.5rem] sm:[--detail-section-pt:2.5rem]"
    >
      <div className="pointer-events-none absolute -left-[100vw] -right-[100vw] inset-y-0 bg-[linear-gradient(180deg,rgba(2,3,10,0)_0%,rgba(2,3,10,0.42)_46%,rgba(2,3,10,0.78)_100%)]" />
      <div className="pointer-events-none absolute -left-[100vw] -right-[100vw] top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/14 to-transparent" />

      <FadeInSection>
        <div className="relative overflow-hidden rounded-xl border border-white/[0.065] bg-white/[0.026] p-3 ring-1 ring-white/[0.018] backdrop-blur-sm sm:p-4">
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/18 to-transparent" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/45">
                Project Handoff
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h3 className="text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">
                  继续查看这个项目
                </h3>
                <span className="rounded-full border border-amber-200/12 bg-amber-200/[0.04] px-2.5 py-1 font-mono text-[10px] text-amber-100/58">
                  {project.year} · {businessLineLabels[project.businessLine].name}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                源码、在线演示与完整项目列表入口收束在这里。
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:min-w-[360px]">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${actionButtonBase} ${secondaryButton}`}
                >
                  <svg
                    className="h-4 w-4 text-zinc-200/82"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${actionButtonBase} ${primaryButton}`}
                >
                  <svg
                    className="h-4 w-4 text-cyan-50/86"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  在线 Demo
                </a>
              )}
              <Link
                href="/projects"
                className={`${actionButtonBase} ${secondaryButton} ${project.githubUrl && project.demoUrl ? 'sm:col-span-2' : ''}`}
              >
                <svg
                  className="h-4 w-4 text-zinc-300/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                返回项目列表
              </Link>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}

function Breadcrumb({ project }: { project: Project }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Breadcrumb"
      className="glass relative inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm"
    >
      {/* Top-edge shimmer with wider spread */}
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent" />
      {/* Bottom-edge subtle glow */}
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/10 to-transparent" />
      {/* Ambient corner glow */}
      <div className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 rounded-full bg-indigo-500/[0.04] blur-xl" />
      <Link
        href="/"
        className="relative flex items-center gap-1 text-zinc-500 transition-all duration-300 hover:text-indigo-300 hover:drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </Link>
      {/* Chevron separator */}
      <svg className="h-3 w-3 text-zinc-600/70 select-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <Link
        href="/projects"
        className="relative text-zinc-400 transition-all duration-300 hover:text-indigo-300 hover:drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]"
      >
        项目
      </Link>
      {/* Chevron separator */}
      <svg className="h-3 w-3 text-zinc-600/70 select-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <span className="relative max-w-[200px] truncate font-medium text-zinc-100 text-shadow-sm">{project.name}</span>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky Table of Contents sidebar (desktop only)                    */
/* ------------------------------------------------------------------ */

function TableOfContents({ activeId }: { activeId: string }) {
  const activeIndex = SECTION_IDS.findIndex((s) => s.id === activeId);
  const progress = SECTION_IDS.length > 0 ? ((activeIndex + 1) / SECTION_IDS.length) * 100 : 0;

  return (
    <nav className="hidden xl:block" aria-label="Table of contents">
      <div className="sticky top-24">
        <div className="glass relative overflow-hidden rounded-2xl p-5">
          {/* Top edge accent with stronger shimmer */}
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
          {/* Bottom edge subtle glow */}
          <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/12 to-transparent" />
          {/* Ambient corner glow -- top right */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-500/[0.07] blur-2xl" />
          {/* Ambient corner glow -- bottom left */}
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-violet-500/[0.04] blur-2xl" />

          <div className="relative mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              目录
            </p>
            <span className="text-[10px] font-medium text-zinc-600">
              {activeIndex + 1}/{SECTION_IDS.length}
            </span>
          </div>
          {/* Progress bar with glow trail */}
          <div className="relative mb-5 h-[3px] w-full overflow-hidden rounded-full bg-zinc-800/70">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400"
              style={{ boxShadow: '0 0 14px rgba(99,102,241,0.4), 0 0 6px rgba(99,102,241,0.25)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <ul className="relative space-y-0.5">
            {SECTION_IDS.map((section, index) => {
              const isActive = activeId === section.id;
              const isPast = index < activeIndex;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => handleSectionLinkClick(event, section.id)}
                    className={`group relative flex items-center gap-3 rounded-lg py-2 pl-3 pr-4 text-[13px] transition-all duration-300 ${
                      isActive
                        ? 'text-indigo-200 bg-indigo-500/[0.14]'
                        : isPast
                          ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                          : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]'
                    }`}
                    style={isActive ? { boxShadow: 'inset 0 1px 0 rgba(99,102,241,0.1), 0 2px 4px rgba(0,0,0,0.18)' } : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="toc-active-bar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-r-full bg-gradient-to-b from-indigo-400 via-violet-400 to-purple-400"
                        style={{ boxShadow: '0 0 16px rgba(99,102,241,0.5), 0 0 8px rgba(99,102,241,0.3)' }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {isPast && !isActive ? (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400/80 transition-all duration-300">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    ) : (
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-indigo-500/30 text-indigo-100'
                          : 'bg-zinc-800/40 text-zinc-600'
                      }`} style={isActive ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 10px rgba(99,102,241,0.2)' } : undefined}>
                        {index + 1}
                      </span>
                    )}
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline connector line between thought-chain steps                */
/* ------------------------------------------------------------------ */

function TimelineConnector() {
  return (
    <div className="absolute left-[22px] top-0 bottom-0 w-px sm:left-[23px]">
      {/* Core line with gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/55 via-violet-500/30 via-50% to-indigo-500/[0.04]" />
      {/* Inner glow layer -- tighter bloom */}
      <div className="absolute inset-0 w-2 -translate-x-[3px] bg-gradient-to-b from-indigo-400/20 via-violet-400/10 via-50% to-transparent blur-[2px]" />
      {/* Mid-range ambient glow */}
      <div className="absolute inset-0 w-6 -translate-x-[9px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 via-50% to-transparent blur-[6px]" />
      {/* Outer atmospheric glow */}
      <div className="absolute inset-0 w-12 -translate-x-[18px] bg-gradient-to-b from-indigo-500/5 via-violet-500/[0.03] via-50% to-transparent blur-xl" />
      {/* Pulsing dot at origin -- triple-layer glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400" style={{ boxShadow: '0 0 10px rgba(99,102,241,0.6), 0 0 24px rgba(99,102,241,0.25), 0 0 6px rgba(99,102,241,0.8)' }} />
      {/* Origin halo */}
      <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-indigo-500/15 blur-md" />
      {/* Animated traveling pulse along the line */}
      <div className="absolute left-1/2 -translate-x-1/2 h-12 w-1 rounded-full bg-gradient-to-b from-indigo-400/40 via-violet-400/20 to-transparent blur-sm animate-pulse" style={{ animationDuration: '3s' }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Back-to-top floating button                                        */
/* ------------------------------------------------------------------ */

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="glass fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full text-zinc-400 transition-all duration-300 hover:text-indigo-300 hover:-translate-y-1"
          style={{ '--hover-shadow': '0 0 24px rgba(99,102,241,0.25), 0 0 8px rgba(99,102,241,0.15)' } as React.CSSProperties}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = '0 0 24px rgba(99,102,241,0.25), 0 0 8px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = '';
          }}
        >
          <svg className="h-5 w-5 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface ProjectDetailClientProps {
  project: Project;
  screenshots: ProjectDetailScreenshot[];
}

export default function ProjectDetailClient({
  project,
  screenshots,
}: ProjectDetailClientProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const lineInfo = businessLineLabels[project.businessLine];
  const developmentStages = buildDevelopmentStages(project);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '');
      if (!id || !SECTION_IDS.some((section) => section.id === id)) return;

      const alignTarget = () => {
        const section = document.getElementById(id);
        const target = section?.querySelector<HTMLElement>('[data-section-anchor]') ?? section;
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
      };

      window.requestAnimationFrame(alignTarget);
      const timers = [120, 320, 720].map((delay) => window.setTimeout(alignTarget, delay));
      return () => timers.forEach((timer) => window.clearTimeout(timer));
    };

    let clearPending = scrollToHash();
    const handleHashChange = () => {
      clearPending?.();
      clearPending = scrollToHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      clearPending?.();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  /* Track which section is in view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    SECTION_IDS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* a) 3D Entry Scene */}
      <section className="relative min-h-[calc(100svh-4.5rem)] w-full overflow-hidden bg-[#02030a]">
        <Suspense
          fallback={
            <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-[#02030a]">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
            </div>
          }
        >
          <ProjectSceneContainer sceneType={project.scene3d} />
        </Suspense>

        {/* Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,3,10,0.92)_0%,rgba(2,3,10,0.62)_42%,rgba(2,3,10,0.20)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(101,216,255,0.10),transparent_34%),linear-gradient(180deg,rgba(2,3,10,0.16),rgba(2,3,10,0.72))]" />
        <div className="absolute inset-0 flex items-center px-4 py-10 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.58fr)] lg:items-center"
          >
            <div className="max-w-3xl">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-white/82 backdrop-blur-md"
                style={{
                  borderColor: `${lineInfo.color}30`,
                  background: `${lineInfo.color}12`,
                  boxShadow: `0 0 22px ${lineInfo.color}14, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: lineInfo.color,
                    boxShadow: `0 0 12px ${lineInfo.color}66`,
                  }}
                />
                {lineInfo.name}
              </span>
              <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {project.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-cyan-50/70 sm:text-lg">
                {project.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#overview"
                  onClick={(event) => handleSectionLinkClick(event, 'overview')}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-100/20 bg-cyan-100/[0.06] px-5 text-sm font-semibold text-cyan-50 transition hover:border-cyan-100/36 hover:bg-cyan-100/[0.10]"
                >
                  查看项目证据
                </a>
                <Link
                  href="/projects"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.035] px-5 text-sm font-medium text-zinc-300 transition hover:border-white/[0.18] hover:text-white"
                >
                  返回项目宇宙
                </Link>
              </div>
            </div>
            <ProjectBriefPanel project={project} />
          </motion.div>
        </div>

        {/* 1. Gradient mask at the bottom of 3D scene for smooth text transition */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="hidden sm:block">
          <ScrollDownArrow />
        </div>
      </section>

      {/* Main content area with optional sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-12">
          {/* Sticky TOC sidebar */}
          <aside className="hidden xl:block w-52 shrink-0">
            <TableOfContents activeId={activeSection} />
          </aside>

          {/* Main content column */}
          <div className="project-detail-content min-w-0 max-w-4xl flex-1">
            {/* 6. Breadcrumb navigation */}
            <div className="space-y-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
              <Breadcrumb project={project} />
              <CompactSectionNav activeId={activeSection} />
            </div>

            {/* b) Project Overview */}
            <section
              id="overview"
              className="project-detail-section scroll-mt-24 [--detail-section-pb:3.5rem] [--detail-section-pt:2.5rem] sm:[--detail-section-pb:4.5rem] sm:[--detail-section-pt:4.5rem]"
            >
              <SectionTitle>项目概述</SectionTitle>
              <FadeInSection>
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="rounded-2xl border border-cyan-100/10 bg-[#050b14]/68 p-5 ring-1 ring-white/[0.025] sm:p-6">
                    <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {project.name}
                    </h3>
                    <div className="mt-5 space-y-4">
                      {splitParagraphs(project.description).map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-base leading-8 text-zinc-300/82"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-xl border border-cyan-100/10 bg-cyan-100/[0.04] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100/45">
                        Problem
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300/78">
                        {compactText(project.thoughtChain.problem, 86)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-amber-200/12 bg-amber-200/[0.04] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-100/48">
                        Deliverable
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-amber-50/78">
                        {getPrimaryDeliverable(project)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        Status
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <StatusBadge status={project.status} />
                        <span className="text-sm text-zinc-400">{project.year}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Tech stack with colored pills */}
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {project.techStack.map((tech) => (
                    <TechPill key={tech} tech={tech} />
                  ))}
                </div>
              </FadeInSection>
              {/* Premium divider after overview */}
              <div className="mt-20 flex items-center gap-3 sm:mt-24">
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-300/24 via-cyan-200/10 to-transparent" />
                <div className="flex items-center gap-2">
                  <div className="h-[2px] w-[2px] rounded-full bg-cyan-200/42" style={{ boxShadow: '0 0 6px rgba(101,216,255,0.26)' }} />
                  <div className="h-1 w-1 rounded-full bg-cyan-200/52" style={{ boxShadow: '0 0 8px rgba(101,216,255,0.30)' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-200/42" style={{ boxShadow: '0 0 8px rgba(242,193,102,0.22)' }} />
                  <div className="h-2 w-2 rounded-full bg-gradient-to-br from-cyan-200/56 to-amber-200/48" style={{ boxShadow: '0 0 12px rgba(101,216,255,0.24), 0 0 22px rgba(242,193,102,0.10)' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-200/42" style={{ boxShadow: '0 0 8px rgba(242,193,102,0.22)' }} />
                  <div className="h-1 w-1 rounded-full bg-cyan-200/52" style={{ boxShadow: '0 0 8px rgba(101,216,255,0.30)' }} />
                  <div className="h-[2px] w-[2px] rounded-full bg-cyan-200/42" style={{ boxShadow: '0 0 6px rgba(101,216,255,0.26)' }} />
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-cyan-300/24 via-cyan-200/10 to-transparent" />
              </div>
            </section>

            {/* 4. Timeline-style thought-chain sections with connector line */}
            <div className="relative">
              <TimelineConnector />

              {/* c) Step 1: Requirements Analysis */}
              <section
                id="requirements"
                className="project-detail-section relative scroll-mt-24 [--detail-section-pb:3.5rem] [--detail-section-pt:3.5rem] sm:[--detail-section-pb:5rem] sm:[--detail-section-pt:5rem]"
              >
                <SectionTitle step="①">需求分析</SectionTitle>
                <FadeInSection>
                  <div className="relative ml-5 border-l border-indigo-500/12 pl-8 sm:ml-6">
                    {/* Decorative dot at top of border -- triple-layer glow */}
                    <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border-2 border-indigo-400/60 bg-gradient-to-br from-indigo-400 to-violet-400" style={{ boxShadow: '0 0 14px rgba(99,102,241,0.50), 0 0 6px rgba(99,102,241,0.7), inset 0 0 2px rgba(129,140,248,0.4)' }} />
                    {/* Ambient glow behind dot */}
                    <div className="absolute -left-[10px] top-[-4px] h-5 w-5 rounded-full bg-indigo-500/20 blur-md" />
                    {/* Subtle pulse ring around dot */}
                    <div className="absolute -left-[8px] top-[-2px] h-4 w-4 rounded-full border border-indigo-400/15 animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="mb-10">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-400/90">
                        <span className="inline-block h-px w-5 bg-gradient-to-r from-indigo-400/50 to-transparent" />
                        问题
                      </h4>
                      <p className="text-lg leading-[1.8] text-zinc-300/90">
                        {project.thoughtChain.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-400/90">
                        <span className="inline-block h-px w-5 bg-gradient-to-r from-cyan-400/50 to-transparent" />
                        分析
                      </h4>
                      <p className="text-lg leading-[1.8] text-zinc-300/90">
                        {project.thoughtChain.analysis}
                      </p>
                    </div>
                  </div>
                </FadeInSection>
              </section>

              {/* d) Step 2: Solution Design */}
              <section
                id="design"
                className="project-detail-section relative scroll-mt-24 [--detail-section-pb:3rem] [--detail-section-pt:3rem] sm:[--detail-section-pb:4rem] sm:[--detail-section-pt:4rem]"
              >
                <SectionTitle step="②">方案设计</SectionTitle>
                <FadeInSection>
                  <p className="mb-6 text-base leading-[1.8] text-zinc-300/90 sm:text-lg">
                    {project.thoughtChain.design}
                  </p>
                  <div className="relative overflow-hidden rounded-2xl border border-cyan-100/[0.09] bg-gradient-to-br from-cyan-400/[0.065] via-cyan-400/[0.026] to-amber-300/[0.018] p-4 ring-1 ring-white/[0.025] sm:p-6" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.16), 0 1px 4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                    {/* Top-edge shimmer */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/28 to-transparent" />
                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 h-36 w-36 bg-gradient-to-bl from-cyan-300/10 via-cyan-300/4 to-transparent" />
                    <div className="absolute bottom-0 left-0 h-28 w-28 bg-gradient-to-tr from-amber-300/[0.05] to-transparent" />
                    <div className="relative flex items-center gap-2.5 text-sm text-zinc-400">
                      <svg
                        className="h-5 w-5 text-cyan-200/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                        />
                      </svg>
                      <span className="font-semibold tracking-wide">技术架构图</span>
                    </div>
                    <ArchitectureFlow project={project} />
                  </div>
                </FadeInSection>
              </section>

              {/* e) Step 3: Development Process */}
              <section
                id="development"
                className="project-detail-section relative scroll-mt-24 [--detail-section-pb:3.5rem] [--detail-section-pt:3.5rem] sm:[--detail-section-pb:5rem] sm:[--detail-section-pt:5rem]"
              >
                <SectionTitle step="③">开发过程</SectionTitle>
                <FadeInSection>
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-950/35 p-4 ring-1 ring-white/[0.025] sm:p-5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(34,211,238,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent)]" />
                    <div className="relative mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-indigo-200/45">
                          Development Review
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-zinc-100">
                          从任务拆解到交付复核
                        </h3>
                      </div>
                      <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1 text-xs text-zinc-400">
                        {project.year} · {businessLineLabels[project.businessLine].name}
                      </span>
                    </div>
                    <div className="relative grid gap-4 lg:grid-cols-3">
                      {developmentStages.map((stage, index) => (
                        <DevelopmentStageCard
                          key={stage.title}
                          stage={stage}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </FadeInSection>
              </section>

              {/* f) Step 4: Challenges */}
              <section
                id="challenges"
                className="project-detail-section relative scroll-mt-24 [--detail-section-pb:3.5rem] [--detail-section-pt:3.5rem] sm:[--detail-section-pb:5rem] sm:[--detail-section-pt:5rem]"
              >
                <SectionTitle step="④">难点与解决方案</SectionTitle>
                <div className="space-y-6">
                  {project.thoughtChain.challenges.map((challenge, i) => (
                    <FadeInSection key={i} delay={i * 0.1}>
                      <div className="group relative rounded-2xl border border-zinc-700/30 bg-zinc-900/40 p-7 backdrop-blur-sm transition-all duration-500 hover:border-zinc-600/35 hover:shadow-lg hover:shadow-black/8 ring-1 ring-white/[0.02] hover:ring-white/[0.05]">
                        {/* Top accent — always subtly visible, stronger on hover */}
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent transition-opacity duration-500 group-hover:via-indigo-500/30" />
                        {/* Corner glow on hover — top right */}
                        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/[0.05] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                        {/* Corner glow on hover — bottom left */}
                        <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-violet-500/[0.03] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                        <h4 className="mb-3 text-lg font-semibold text-zinc-100">
                          {challenge.title}
                        </h4>
                        <p className="mb-6 leading-[1.8] text-zinc-400">
                          {challenge.description}
                        </p>
                        <div className="relative rounded-xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.08] to-emerald-500/[0.02] p-5 pl-6 ring-1 ring-emerald-500/[0.06]" style={{ boxShadow: 'inset 0 1px 0 rgba(16,185,129,0.05), 0 0 16px rgba(16,185,129,0.04)' }}>
                          {/* Left accent bar */}
                          <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-gradient-to-b from-emerald-400/60 to-emerald-500/20" style={{ boxShadow: '0 0 8px rgba(16,185,129,0.25)' }} />
                          <div className="mb-2.5 flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/12" style={{ boxShadow: '0 0 10px rgba(16,185,129,0.2), 0 0 4px rgba(16,185,129,0.3)' }}>
                              <svg
                                className="h-3 w-3 text-emerald-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-emerald-400">
                              解决方案
                            </span>
                          </div>
                          <p className="text-sm leading-[1.75] text-zinc-300/90">
                            {challenge.solution}
                          </p>
                        </div>
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </section>

              {/* g) Step 5: Outcome */}
              <section
                id="outcome"
                className="project-detail-section relative scroll-mt-20 [--detail-section-pb:1.25rem] [--detail-section-pt:1.25rem] sm:scroll-mt-24 sm:[--detail-section-pb:1.5rem] sm:[--detail-section-pt:3rem]"
              >
                <SectionTitle step="⑤">项目成果</SectionTitle>
                <FadeInSection>
                  <p className="mb-6 max-w-4xl text-lg leading-[1.8] text-zinc-300/90 sm:mb-8">
                    {project.thoughtChain.outcome}
                  </p>
                  <OutcomeShowcase project={project} screenshots={screenshots} />
                </FadeInSection>
              </section>
            </div>

            {/* h) External Links */}
            <ProjectActionRail project={project} />
          </div>
        </div>
      </div>

      {/* 8. Back-to-top floating button */}
      <BackToTop />
    </div>
  );
}

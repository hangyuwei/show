'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const SkillRadar3D = dynamic(() => import('@/components/three/SkillRadar3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className="text-white/50 text-sm">Loading 3D Radar...</div>
    </div>
  ),
});

const TechSphere = dynamic(() => import('@/components/three/TechSphere'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className="text-white/50 text-sm">Loading Tech Sphere...</div>
    </div>
  ),
});

interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineItem[] = [
  {
    period: '2020 - 2022',
    title: '全栈开发工程师',
    description:
      '负责多个 Web 应用的架构设计与开发，掌握前后端技术栈，完成从需求分析到上线交付的全流程。',
  },
  {
    period: '2022 - 2023',
    title: '大健康行业技术专家',
    description:
      '深耕大健康领域，将数据分析与行业知识结合，为健康科技产品提供技术解决方案。',
  },
  {
    period: '2023 - 2024',
    title: 'AI 应用开发',
    description:
      '深入研究大语言模型应用，使用 LangChain、PyTorch 等框架构建智能问答、数据分析等 AI 产品。',
  },
  {
    period: '2024 - 至今',
    title: '技术顾问 / 独立开发者',
    description:
      '为多个项目提供技术咨询，同时探索 3D 可视化、创意编程等前沿方向，持续输出技术内容。',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

export default function AboutContent() {
  return (
    <>
      {/* 3D Skill Radar Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="w-full h-[50vh] sm:h-[60vh] flex flex-col items-center justify-center mb-16 sm:mb-24"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
          能力雷达
        </h2>
        <p className="text-sm text-white/50 mb-6 text-center">
          跨领域复合能力全景
        </p>
        <div className="w-full max-w-xl h-[400px] sm:h-[500px]">
          <SkillRadar3D />
        </div>
      </motion.section>

      {/* Personal Introduction */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="max-w-3xl mx-auto mb-16 sm:mb-24"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          关于我
        </h2>
        <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-300 mb-1">
                Hang
              </h3>
              <p className="text-sm text-white/60 mb-4">
                全栈开发工程师 / 大健康行业技术专家
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-white/70 mb-4">
                拥有多年全栈开发经验，专注于将技术与行业深度结合。在大健康领域深耕多年，
                擅长将数据分析、AI 技术与医疗健康场景融合，打造有价值的数字产品。
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-white/70 mb-4">
                技术视野覆盖前端工程、后端服务、数据智能与创意可视化。相信技术的价值在于解决真实问题，
                追求工程卓越与用户体验的平衡。
              </p>
              <a
                href="https://github.com/hangyuwei"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                github.com/hangyuwei
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tech Stack Sphere */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="w-full mb-16 sm:mb-24"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
          技术栈
        </h2>
        <p className="text-sm text-white/50 mb-6 text-center">
          拖拽旋转查看更多
        </p>
        <div className="w-full max-w-xl mx-auto h-[400px] sm:h-[500px]">
          <TechSphere />
        </div>
      </motion.section>

      {/* Career Timeline */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
          职业经历
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-blue-400/30 to-transparent" />

          <div className="space-y-8 sm:space-y-10">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.period}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={timelineItemVariants}
                className="relative pl-12 sm:pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-300 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />

                <div className="rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 sm:p-6 hover:bg-white/8 transition-colors">
                  <span className="text-xs font-mono text-blue-400/80 mb-1 block">
                    {item.period}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}

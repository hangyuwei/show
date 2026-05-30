// =============================================================================
// Portfolio Projects Data — 32 Projects
// =============================================================================

export type BusinessLine = 'health' | 'ai' | 'web' | 'creative' | 'research';

export interface ThoughtChain {
  problem: string;
  analysis: string;
  design: string;
  development: string;
  challenges: Array<{
    title: string;
    description: string;
    solution: string;
  }>;
  outcome: string;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  businessLine: BusinessLine;
  tagline: string;
  description: string;
  techStack: string[];
  scene3d: string;
  thoughtChain: ThoughtChain;
  screenshots: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  year: string;
  status: 'completed' | 'active' | 'planning';
}

// =============================================================================
// Helper Labels
// =============================================================================

export const businessLineLabels: Record<
  BusinessLine,
  { name: string; nameEn: string; emoji: string; color: string }
> = {
  health: {
    name: '大健康行业',
    nameEn: 'Health Industry',
    emoji: '🏥',
    color: '#06b6d4',
  },
  ai: {
    name: 'AI/大模型',
    nameEn: 'AI & LLM',
    emoji: '🤖',
    color: '#8b5cf6',
  },
  web: {
    name: 'Web开发',
    nameEn: 'Web Dev',
    emoji: '💻',
    color: '#f97316',
  },
  creative: {
    name: '创意/3D',
    nameEn: 'Creative',
    emoji: '🎨',
    color: '#eab308',
  },
  research: {
    name: '学术研究',
    nameEn: 'Research',
    emoji: '📚',
    color: '#14b8a6',
  },
};

// =============================================================================
// Projects — Health (17)
// =============================================================================

const healthProjects: Project[] = [
  {
    id: 1,
    slug: 'campus-health',
    name: '校园健康上报与疫情防控系统',
    nameEn: 'Campus Health Reporting & Epidemic Control System',
    businessLine: 'health',
    tagline: '服务校园疫情防控的全流程数字化上报管理平台',
    description:
      '面向高校场景的健康上报与疫情防控系统，支持学生每日健康打卡、异常预警、数据统计分析和可视化展示。系统覆盖信息采集、审批流转、数据汇总、报表导出等完整业务链路，为校园疫情防控提供数据驱动的决策支撑。\n\n前端采用 Vue3 + Vant 组件库实现移动端优先的响应式界面，后端使用 Spring Boot 构建 RESTful API，MySQL 持久化存储，Redis 缓存热点数据提升查询性能。Docker 容器化部署保证了开发与生产环境的一致性。',
    techStack: ['Spring Boot', 'Vue3', 'Vant', 'MySQL', 'Redis', 'Docker'],
    scene3d: 'building',
    thoughtChain: {
      problem: '高校疫情防控期间，传统纸质或微信群上报方式效率低下，数据分散难以统计汇总，无法实现实时监控和预警。',
      analysis:
        '需要一套覆盖全校师生的数字化上报系统：支持每日健康信息采集、异常自动标记、多级审批流转、数据可视化看板，同时要适配移动端方便学生随时随地填报。',
      design:
        '后端选择 Spring Boot 因为其成熟的生态和企业级稳定性，MyBatis-Plus 简化 CRUD 开发。前端 Vue3 + Vant 提供流畅的移动端体验。Redis 缓存频繁访问的统计数据，MySQL 保证事务一致性。Docker 容器化简化部署运维。',
      development:
        '采用前后端分离架构，定义标准 RESTful API。权限系统基于 RBAC 模型区分管理员、辅导员、学生角色。数据导出使用 Apache POI 生成 Excel 报表。定时任务自动汇总当日填报数据并推送未填报提醒。',
      challenges: [
        {
          title: '高并发填报场景',
          description: '每日集中时段（早8点）大量学生同时填报，数据库写入压力大。',
          solution:
            '引入 Redis 缓存层，先写入 Redis 再异步批量同步到 MySQL；前端增加请求节流和本地缓存避免重复提交。',
        },
        {
          title: '数据权限隔离',
          description: '不同院系辅导员只能看到本院系学生数据，校级管理员可看全局。',
          solution:
            '基于 RBAC 模型设计多级权限体系，SQL 层面通过数据范围过滤实现行级权限控制。',
        },
      ],
      outcome:
        '系统成功上线运行，覆盖全校数千名师生日常健康上报，数据准确率达到99%以上，大幅降低了辅导员手动统计的工作量，为学校疫情防控决策提供了实时数据支撑。',
    },
    screenshots: ['/projects/campus-health/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/campus-health',
    featured: true,
    year: '2022',
    status: 'completed',
  },
  {
    id: 2,
    slug: 'kefu-stats',
    name: '400热线客服数据统计仪表板',
    nameEn: '400 Hotline Customer Service Dashboard',
    businessLine: 'health',
    tagline: '可视化分析400热线客服通话数据的交互式仪表板',
    description:
      '针对企业400热线客服系统的数据统计分析工具，将原始通话记录转化为直观的可视化报表。支持按时间段、客服人员、通话类型等多维度分析，帮助管理层洞察服务质量瓶颈和客户需求趋势。\n\n使用 Python 技术栈构建，Streamlit 提供快速原型和交互式界面，Pandas 处理数据清洗和聚合，Plotly 生成交互式图表。整个应用轻量级部署，无需前端开发经验即可维护。',
    techStack: ['Python', 'Streamlit', 'Pandas', 'Plotly'],
    scene3d: 'chart',
    thoughtChain: {
      problem: '400热线客服积累了大量通话数据，但缺乏有效的分析工具，管理层无法快速了解客服效率、客户满意度和服务趋势。',
      analysis:
        '需要从原始通话日志中提取关键指标：接通率、平均通话时长、客户满意度评分、高峰时段分布等，并以可视化方式呈现，支持筛选和下钻分析。',
      design:
        '选择 Streamlit 因为它能用最少的代码快速构建交互式数据仪表板，适合数据分析场景。Pandas 是 Python 数据处理的标准选择，Plotly 提供丰富的交互式图表类型。',
      development:
        '数据层使用 Pandas 进行 ETL 处理，包括数据清洗（去重、缺失值处理）、特征工程（提取通话时段、计算等待时长）。展示层按 KPI 总览、趋势分析、人员排名、异常检测四个模块组织。支持 CSV 和 Excel 数据源导入。',
      challenges: [
        {
          title: '数据格式不统一',
          description: '不同时期的通话记录格式有差异，字段名称和编码方式不一致。',
          solution:
            '设计自适应数据解析器，通过字段名模糊匹配和编码自动检测（chardet）兼容多种格式，统一映射到标准数据模型。',
        },
        {
          title: '大文件渲染性能',
          description: '年度数据量达到数十万条时，图表渲染和交互出现明显延迟。',
          solution:
            '引入数据分页和懒加载机制，图表使用服务端聚合而非前端计算，Streamlit 缓存装饰器避免重复数据处理。',
        },
      ],
      outcome:
        '仪表板成功将海量客服数据转化为直观的业务洞察，帮助管理层发现服务高峰时段规律和客服绩效差异，优化了排班策略和服务流程。',
    },
    screenshots: ['/projects/kefu-stats/screenshot1.webp'],
    featured: true,
    year: '2023',
    status: 'completed',
  },
  {
    id: 3,
    slug: 'feasibility-report',
    name: '可研报告解析桌面软件',
    nameEn: 'Feasibility Report Parser',
    businessLine: 'health',
    tagline: '批量解析可研报告Word文档并提取结构化数据的桌面工具',
    description:
      '面向投资分析场景的桌面应用，自动解析 Word 格式的可研报告，提取关键财务指标、项目信息、风险因素等结构化数据。支持批量处理多个文件，结果导出为 Excel 表格。\n\n基于 Python 开发，使用 MarkItDown 库实现 Word 文档的高质量解析，结合正则表达式和 NLP 技术提取结构化信息。PyInstaller 打包为独立可执行文件，无需安装 Python 环境即可运行。',
    techStack: ['Python', 'MarkItDown', 'PyInstaller'],
    scene3d: 'document',
    thoughtChain: {
      problem: '投资分析人员需要阅读大量可研报告Word文档，手动提取关键信息耗时耗力，且容易遗漏重要数据点。',
      analysis:
        '可研报告格式相对固定，包含项目概况、财务预测、风险评估等标准章节。需要自动化提取：项目名称、投资金额、IRR、NPV、回收期等关键指标，以及风险条款摘要。',
      design:
        '选择 MarkItDown 因为它对 Word 文档的解析质量优于 python-docx，能更好地处理表格和格式化内容。PyInstaller 打包确保非技术用户也能直接使用。',
      development:
        '核心解析流程：文档读取 → Markdown 转换 → 章节分割 → 指标提取 → 数据校验 → 结果汇总。使用正则匹配+关键词定位提取财务指标，表格数据通过结构化解析提取。支持批量处理和增量更新。',
      challenges: [
        {
          title: '非标准格式报告处理',
          description: '不同来源的可研报告格式差异大，章节标题和表格结构不统一。',
          solution:
            '设计灵活的章节识别算法，支持模糊匹配和多种标题格式。对表格提取增加容错逻辑，通过列名语义匹配而非精确匹配。',
        },
      ],
      outcome:
        '将原本需要数小时的人工阅读提取工作缩短到几分钟自动完成，数据提取准确率达到90%以上，显著提升了投资分析团队的工作效率。',
    },
    screenshots: ['/projects/feasibility-report/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/feasibility-report',
    featured: true,
    year: '2024',
    status: 'completed',
  },
  {
    id: 4,
    slug: 'product-poster',
    name: '保健品产品海报制作',
    nameEn: 'Health Product Poster Generator',
    businessLine: 'health',
    tagline: '利用AI图像生成技术快速制作保健品营销海报',
    description:
      '面向保健品营销场景的海报自动生成工具，结合产品信息和 AI 图像生成技术，批量产出高质量的营销海报。支持模板定制、文案生成、图片风格选择，大幅降低设计制作成本。\n\n使用 Python 脚本驱动，HTML 模板引擎渲染布局，集成 AI 图像生成 API 实现智能配图。输出高分辨率图片文件，适配线上线下多渠道使用。',
    techStack: ['Python', 'HTML', 'AI Image Generation'],
    scene3d: 'palette',
    thoughtChain: {
      problem: '保健品产品线众多，每次新品上市或促销活动都需要大量营销海报，传统设计流程周期长、成本高。',
      analysis:
        '保健品海报有较强的模板化特征：产品图 + 功效文案 + 品牌元素 + 合规信息。关键是保持品牌一致性的同时实现个性化变体，以满足不同渠道和场景的需求。',
      design:
        'Python 作为胶水语言连接各个组件：HTML/CSS 模板定义布局规范，AI 图像生成提供创意配图，Pillow 处理最终合成和导出。模板化设计确保非设计人员也能操作。',
      development:
        '建立海报模板库，按产品类别和营销场景分类。产品信息存储在 YAML 配置文件中，文案部分接入大语言模型生成营销语。AI 配图使用风格控制确保品牌一致性，最终通过无头浏览器渲染为高分辨率图片。',
      challenges: [
        {
          title: '品牌风格一致性',
          description: 'AI 生成的图像风格难以完全统一，与品牌视觉规范有偏差。',
          solution:
            '使用参考图引导（image-to-image）+ 固定种子值控制风格一致性，关键品牌元素（Logo、色块）通过模板叠加而非AI生成。',
        },
      ],
      outcome:
        '将单张海报制作时间从数小时缩短到分钟级别，支持批量生成多规格变体，显著降低了营销物料的制作成本和交付周期。',
    },
    screenshots: ['/projects/product-poster/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 5,
    slug: 'medical-ocr',
    name: '医学检验报告OCR分析',
    nameEn: 'Medical Lab Report OCR Analysis',
    businessLine: 'health',
    tagline: '自动识别体检报告和化验单并提取结构化健康数据',
    description:
      '医学检验报告智能识别与数据分析工具，支持从体检报告、血液化验单、影像报告等多种医学文档中自动提取检验指标、参考范围和异常标记。结果汇总为结构化 Excel 表格，方便后续健康趋势分析。\n\n调用智谱 AI API 进行高精度 OCR 识别和结构化信息提取，OpenPyXL 生成格式化的 Excel 输出。整个流程高度自动化，从图片输入到数据输出无需人工干预。',
    techStack: ['Python', '智谱API', 'OpenPyXL'],
    scene3d: 'microscope',
    thoughtChain: {
      problem: '个人和家庭每年产生大量体检报告和化验单，纸质文档难以长期保存和对比分析，手动录入数据既耗时又容易出错。',
      analysis:
        '医学报告的OCR识别需要处理复杂排版（多列表格、上下标、特殊符号），且不同医院的报告格式差异大。提取后需要进行单位标准化、异常值标记和趋势对比。',
      design:
        '选择智谱 API 因为其对中文文档的识别精度高，且支持结构化输出指令。OpenPyXL 生成带格式的 Excel 方便数据后续分析。Python 生态有丰富的数据处理工具支持。',
      development:
        '流程设计为：图片预处理（去噪、矫正）→ OCR 识别 → 结构化解析 → 数据标准化 → 异常标记 → Excel 输出。每一步都有错误处理和人工校验入口。支持批量处理多份报告。',
      challenges: [
        {
          title: '多格式报告兼容',
          description: '不同医院的报告排版差异大，表格结构、指标名称、单位标注方式各不相同。',
          solution:
            '结合 OCR 文本识别和大语言模型的理解能力，用 prompt engineering 指导模型将非结构化文本转换为统一的 JSON 结构，再映射到标准数据模型。',
        },
        {
          title: '数据精度保障',
          description: '医学指标对精度要求高，OCR 识别的数字错误可能导致健康判断偏差。',
          solution:
            '引入数值合理性校验（参考范围检查、历史值对比），异常数据自动标记待人工复核，关键指标双重确认机制。',
        },
      ],
      outcome:
        '实现了医学报告从纸质到结构化数据的自动化转换，识别准确率达到95%以上，为长期健康追踪和趋势分析奠定了数据基础。',
    },
    screenshots: ['/projects/medical-ocr/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/medical-ocr',
    featured: true,
    year: '2024',
    status: 'completed',
  },
  {
    id: 6,
    slug: 'competitor-intel',
    name: '保健品竞品情报系统',
    nameEn: 'Health Supplement Competitive Intelligence',
    businessLine: 'health',
    tagline: '基于DeepSeek大模型的保健品竞品自动分析与情报汇总',
    description:
      '保健品行业竞品情报收集与分析系统，利用 DeepSeek 大模型从公开数据源自动提取竞品信息，包括产品配方、价格策略、营销渠道和用户评价。生成结构化的竞品分析报告，辅助产品决策。\n\n核心能力在于将分散的竞品信息自动化聚合，通过 AI 模型进行语义理解和对比分析，输出可操作的商业洞察。',
    techStack: ['DeepSeek API'],
    scene3d: 'radar',
    thoughtChain: {
      problem: '保健品市场竞争激烈，产品迭代快速，手动追踪竞品信息耗时且信息不全面，缺乏系统化的竞品分析工具。',
      analysis:
        '竞品情报需要覆盖多个维度：产品成分与功效对比、定价策略、渠道分布、用户口碑、新品动态。信息来源分散在电商平台、社交媒体、行业报告中。',
      design:
        '选择 DeepSeek API 因为其在中文理解和分析方面表现优秀，且成本效益高。以 prompt 工程为核心，设计结构化的分析模板确保输出一致性。',
      development:
        '构建标准化的竞品信息采集模板，通过精心设计的 prompt 链让 DeepSeek 逐步完成：信息提取 → 分类整理 → 多维度对比 → 洞察总结。输出格式化为 Markdown 报告，支持定期自动更新。',
      challenges: [
        {
          title: '信息时效性和准确性',
          description: '竞品信息更新频繁，AI 模型的训练数据存在时效性限制。',
          solution:
            '结合实时数据源（搜索API、RSS）提供最新信息上下文，让模型基于最新数据进行分析而非依赖训练知识。',
        },
      ],
      outcome:
        '建立了系统化的竞品情报收集流程，将原本需要数天的竞品调研缩短到小时级别，为产品规划和市场策略提供了数据支撑。',
    },
    screenshots: ['/projects/competitor-intel/screenshot1.webp'],
    featured: true,
    year: '2024',
    status: 'completed',
  },
  {
    id: 7,
    slug: 'cognitive-guide',
    name: '认知障碍医学指南解读',
    nameEn: 'Cognitive Impairment Medical Guide Interpretation',
    businessLine: 'health',
    tagline: '利用AI将专业医学指南转化为易懂的科普解读材料',
    description:
      '将认知障碍相关的专业医学指南（如《中国痴呆与认知障碍诊治指南》）转化为面向大众和基层医生的易读解读材料。通过 DeepSeek 大模型辅助内容理解和重写，Markdown 格式输出便于多渠道分发。\n\n项目核心价值在于弥合专业医学文献与普通读者之间的认知鸿沟，让重要的医学知识更广泛地传播。',
    techStack: ['Markdown', 'DeepSeek'],
    scene3d: 'brain',
    thoughtChain: {
      problem: '认知障碍医学指南专业术语密集、表述学术化，基层医生和普通大众难以直接阅读理解，影响了指南的推广和落地。',
      analysis:
        '需要在保持医学准确性的前提下，将专业内容重新组织为通俗语言。关键挑战是术语解释的准确性和通俗化程度之间的平衡。',
      design:
        '使用 DeepSeek 大模型辅助内容转化，Markdown 格式方便版本管理和多平台发布。采用人机协作模式：AI 初步转化 + 医学专业审核。',
      development:
        '建立术语对照表确保翻译一致性，使用分层解读策略：核心结论 → 详细解释 → 案例说明。每章节由 AI 生成初稿，人工审核修订后定稿。',
      challenges: [
        {
          title: '医学术语准确性',
          description: '通俗化过程中可能出现术语翻译偏差或过度简化导致信息失真。',
          solution:
            '建立术语审核清单，关键医学术语保留原文并附注释，每篇解读经医学专业人员审核确认。',
        },
      ],
      outcome:
        '完成多份认知障碍医学指南的通俗化解读，内容在专业准确性和可读性之间取得了良好平衡，为认知障碍科普教育提供了高质量素材。',
    },
    screenshots: ['/projects/cognitive-guide/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 8,
    slug: 'tcm-assessment',
    name: '中医体质分类与判定',
    nameEn: 'TCM Constitution Assessment',
    businessLine: 'health',
    tagline: '基于中医九种体质理论的在线自测与个性化养生建议',
    description:
      '基于《中医体质分类与判定》标准的在线测评工具，用户通过回答标准化量表问题，系统自动判定体质类型并给出个性化养生建议。纯前端实现，响应式设计适配移动端。\n\n使用原生 HTML/CSS 构建，无需后端服务，轻量级部署。测评算法严格按照国家标准评分规则实现。',
    techStack: ['HTML', 'CSS'],
    scene3d: 'yin-yang',
    thoughtChain: {
      problem: '中医体质辨识需要专业中医师面诊，普通人群难以便捷地了解自身体质类型和对应的养生方案。',
      analysis:
        '中医体质分类有国家标准（GB/T 30233-2013），包含9种基本体质类型和标准化判定量表。需要将纸质量表数字化，实现自动评分和体质判定。',
      design:
        '纯前端实现确保隐私保护（数据不上传），HTML/CSS 无需构建工具部署简单。响应式设计适配手机使用场景。',
      development:
        '严格按照国家标准量表实现题目和评分规则，使用转化分公式计算各体质维度得分，按权重判定主要体质类型和兼夹体质。结果页展示雷达图和个性化建议。',
      challenges: [
        {
          title: '评分算法准确性',
          description: '中医体质判定涉及多个维度的加权评分和转化分计算，规则复杂。',
          solution:
            '严格对照国家标准文档实现评分算法，逐一验证每种体质的判定阈值和转化公式，设置边界测试用例确保计算正确。',
        },
      ],
      outcome:
        '提供了便捷的中医体质自测工具，帮助用户了解自身体质特征并获取对应的饮食、运动、起居养生建议。',
    },
    screenshots: ['/projects/tcm-assessment/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 9,
    slug: 'industry-standards',
    name: '统计团标',
    nameEn: 'Statistical Group Standards Compilation',
    businessLine: 'health',
    tagline: '行业统计团体标准的整理编纂与规范化管理',
    description:
      '面向大健康行业的统计团体标准整理编纂项目，将散落的行业数据进行规范化整理，形成结构化的标准文档。涉及数据收集、统计方法验证、标准格式编排和PDF文档生成。\n\n使用 Excel 进行数据整理和统计分析，最终输出规范的 PDF 格式标准文档。',
    techStack: ['Excel', 'PDF'],
    scene3d: 'clipboard',
    thoughtChain: {
      problem: '行业内缺乏统一的统计标准和规范，各企业数据口径不一致，影响行业数据对比和分析的可靠性。',
      analysis:
        '需要梳理行业常用的统计指标和计算方法，参照国标和行标框架，制定适合团体应用的统计标准。',
      design:
        'Excel 作为数据整理和统计验证的核心工具，PDF 作为标准文档的最终发布格式。流程简洁、工具通用，确保标准制定过程的可追溯性。',
      development:
        '分阶段推进：数据收集与清洗 → 统计方法文献调研 → 方法验证与对比 → 标准草案编写 → 专家评审修订 → 定稿发布。Excel 记录每个统计指标的计算公式、适用范围和验证结果。',
      challenges: [
        {
          title: '统计方法适用性验证',
          description: '不同统计方法在不同数据分布下的适用性不同，需要充分验证。',
          solution:
            '使用实际行业数据进行多方法对比验证，选择鲁棒性最好的统计方法作为推荐标准。',
        },
      ],
      outcome:
        '完成了行业统计团体标准的整理编纂，为行业数据统计提供了统一规范，提升了行业数据质量和可比性。',
    },
    screenshots: ['/projects/industry-standards/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 10,
    slug: 'order-planning',
    name: '智能订货计划管理平台',
    nameEn: 'Smart Order Planning Platform',
    businessLine: 'health',
    tagline: '基于销售预测的保健品智能订货计划管理系统',
    description:
      '面向保健品零售企业的智能订货计划管理平台，结合历史销售数据、季节性因素和促销计划，辅助生成优化的订货建议。支持多仓库、多SKU 的计划编制和审批流程。\n\n使用 HTML + Tailwind CSS 构建现代化界面，前端计算和交互逻辑完善，支持数据导入导出。',
    techStack: ['HTML', 'Tailwind'],
    scene3d: 'warehouse',
    thoughtChain: {
      problem: '保健品订货依赖采购员经验判断，容易出现库存积压或断货，缺乏数据驱动的订货决策支持。',
      analysis:
        '订货计划需要综合考虑：历史销量趋势、季节性波动、促销影响、安全库存水位、供应商最小起订量和交货周期。需要将复杂的库存管理逻辑简化为可操作的订货建议。',
      design:
        'HTML + Tailwind 快速构建轻量级前端应用，无需后端即可处理中小规模数据。本地存储方案降低部署复杂度。',
      development:
        '核心功能模块：销售数据分析看板、智能订货建议引擎、计划编制工作台、审批流转。订货算法基于移动平均+季节性指数的预测模型，结合安全库存公式计算建议订货量。',
      challenges: [
        {
          title: '预测模型准确性',
          description: '保健品销售受促销活动影响大，单纯基于历史数据的预测偏差大。',
          solution:
            '引入促销日历作为外部因子调整预测结果，支持手动调整预测参数，系统记录预测偏差用于持续优化模型。',
        },
      ],
      outcome:
        '为采购团队提供了数据驱动的订货决策工具，减少了主观判断的随意性，库存周转率得到优化。',
    },
    screenshots: ['/projects/order-planning/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 11,
    slug: 'handover-archive',
    name: '工作交接归档系统',
    nameEn: 'Work Handover & Archive System',
    businessLine: 'health',
    tagline: '标准化工作交接文档自动生成与归档管理工具',
    description:
      '面向企业岗位交接场景的文档自动化工具，将散落的工作文档、项目资料、联系人信息等结构化整理，自动生成标准化的交接文档。支持 Word 格式输出和批量归档。\n\n基于 Node.js 开发，使用 docx 库程序化生成 Word 文档，确保格式规范统一。',
    techStack: ['Node.js', 'docx'],
    scene3d: 'folder',
    thoughtChain: {
      problem: '岗位交接时信息散落在邮件、聊天记录、本地文件中，缺乏系统化整理，容易遗漏关键信息导致工作断档。',
      analysis:
        '交接文档需要覆盖：岗位职责说明、进行中的项目清单、重要联系人、待办事项、文件资料索引、系统账号权限等。需要一个标准化模板引导信息收集。',
      design:
        'Node.js + docx 库可以精确控制 Word 文档的排版和样式，适合生成格式固定的标准化文档。命令行工具形式简单高效。',
      development:
        '设计交接文档标准模板，包含多个必填章节。用户通过 YAML/JSON 配置文件填写交接内容，脚本自动填充模板生成 Word 文档。支持附件索引和超链接。',
      challenges: [
        {
          title: '文档格式一致性',
          description: '不同人员手动编写的交接文档格式五花八门，难以统一管理和归档。',
          solution:
            '通过程序化文档生成强制统一格式，模板定义样式规范，用户只需填写内容数据。',
        },
      ],
      outcome:
        '标准化了工作交接流程，交接文档质量和完整性显著提升，缩短了新岗位人员的上手适应期。',
    },
    screenshots: ['/projects/handover-archive/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 12,
    slug: 'medical-case',
    name: '医疗病例多专家分析',
    nameEn: 'Medical Case Multi-Expert Analysis',
    businessLine: 'health',
    tagline: '整合多位专家视角的医疗病例综合分析工具',
    description:
      '面向临床教学和病例讨论的综合分析工具，整合多位专家对同一病例的不同视角分析，包括影像诊断、病理分析、治疗方案建议等。支持 OCR 识别病历文档和 Markdown 格式分析报告撰写。\n\n结合 OCR 技术数字化病历资料，Markdown 格式管理专家分析内容，便于版本对比和知识沉淀。',
    techStack: ['Markdown', 'OCR'],
    scene3d: 'stethoscope',
    thoughtChain: {
      problem: '临床病例讨论中，多位专家的意见分散在不同渠道，缺乏统一的整理和对比分析平台，影响教学效果和知识传承。',
      analysis:
        '需要一个工具能够：数字化原始病历资料、组织多专家分析内容、支持不同观点的对比展示、形成结构化的病例讨论记录。',
      design:
        'Markdown 作为内容格式，兼顾可读性和结构化。OCR 技术将纸质病历数字化。轻量级工具链确保医学专业人员低门槛使用。',
      development:
        '病例资料通过 OCR 数字化后存入结构化目录，每位专家的分析作为独立 Markdown 文件，通过统一模板确保分析维度一致。最终汇总为综合分析报告。',
      challenges: [
        {
          title: '医学影像OCR质量',
          description: '病历中的手写内容和影像报告格式多样，OCR 识别质量参差不齐。',
          solution:
            '选择高精度 OCR 服务，对手写内容增加人工校验环节，关键指标提取后与原文对照确认。',
        },
      ],
      outcome:
        '为临床病例讨论提供了系统化的记录和分析框架，多专家观点的结构化呈现提升了病例讨论的教学价值。',
    },
    screenshots: ['/projects/medical-case/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 13,
    slug: 'health-handbook',
    name: '健康科普手册制作',
    nameEn: 'Health Education Handbook',
    businessLine: 'health',
    tagline: '面向大众的健康科普知识手册策划与制作',
    description:
      '健康科普手册的内容策划、撰写和设计制作项目。涵盖常见疾病预防、健康生活方式、合理用药指导等主题，以通俗易懂的语言和精美的排版设计传播健康知识。\n\n使用 Markdown 进行内容撰写和版本管理，配合设计工具完成最终排版输出。',
    techStack: ['Markdown', 'Design Tools'],
    scene3d: 'book',
    thoughtChain: {
      problem: '公众健康素养普遍偏低，专业医学知识晦涩难懂，缺乏系统化、通俗化的健康科普材料。',
      analysis:
        '健康科普手册需要兼顾科学性、可读性和实用性。内容选题应聚焦高频健康问题，语言要接地气，排版要吸引人阅读。',
      design:
        'Markdown 管理内容确保版本可控，设计工具处理最终排版。内容生产流程：选题调研 → 专家审核大纲 → 内容撰写 → 医学审核 → 设计排版。',
      development:
        '按主题分章节组织内容，每章包含：问题引入、知识讲解、实用建议、常见误区。图文并茂，信息密度适中。',
      challenges: [
        {
          title: '科学性与通俗性平衡',
          description: '过于专业影响可读性，过于简化可能导致信息不准确。',
          solution:
            '采用"核心结论+详细解释+生活案例"三层结构，核心结论确保准确性，案例帮助通俗理解，医学专家全程审核。',
        },
      ],
      outcome:
        '完成了涵盖多个健康主题的科普手册制作，内容质量和设计水平获得好评，有效传播了健康知识。',
    },
    screenshots: ['/projects/health-handbook/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 14,
    slug: 'science-animation',
    name: '科普动画视频制作',
    nameEn: 'Science Animation Video Production',
    businessLine: 'health',
    tagline: '将医学知识转化为生动有趣的动画科普视频',
    description:
      '健康科普动画视频制作项目，将复杂的医学知识和健康概念通过动画形式呈现，让大众轻松理解。涵盖疾病原理、人体机制、健康常识等主题。\n\n结合设计工具和视频制作软件，从脚本撰写、分镜设计到动画制作和后期剪辑的全流程。',
    techStack: ['Design Tools', 'Video'],
    scene3d: 'film',
    thoughtChain: {
      problem: '静态文字和图片难以直观展示人体内部的生理过程和疾病机制，公众对抽象医学概念理解困难。',
      analysis:
        '动画视频通过视觉化手段将微观的、抽象的医学概念具象化，是健康科普的高效载体。需要平衡科学准确性和视觉吸引力。',
      design:
        '专业设计工具确保视觉质量，视频制作软件处理动画和剪辑。先确定科学脚本，再进行视觉创作，确保内容准确。',
      development:
        '制作流程：科学脚本编写（医学专家审核）→ 分镜设计 → 角色和场景设计 → 动画制作 → 配音配乐 → 后期合成。每个环节都有质量审核。',
      challenges: [
        {
          title: '医学动画的准确性',
          description: '动画需要在视觉简化和医学准确性之间找到平衡，不能为了好看而失真。',
          solution:
            '医学专家参与分镜审核，关键结构（如细胞、器官）的比例和形态参考医学教材，动画风格选择示意性而非写实性。',
        },
      ],
      outcome:
        '产出了多个高质量的科普动画视频，以生动直观的方式传播了健康知识，受众反馈积极。',
    },
    screenshots: ['/projects/science-animation/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 15,
    slug: 'diabetes-illustration',
    name: '糖尿病健康教育插图',
    nameEn: 'Diabetes Education Illustrations',
    businessLine: 'health',
    tagline: '利用AI生成糖尿病健康教育配套插图',
    description:
      '面向糖尿病健康教育场景的插图自动生成项目，利用 AI 图像生成技术为糖尿病科普材料创建配套插图。涵盖血糖监测、饮食管理、运动指导、并发症预防等主题。\n\nPython 脚本驱动 AI 图像生成 API，批量产出风格统一的医学教育插图。',
    techStack: ['Python', 'AI Image Generation'],
    scene3d: 'syringe',
    thoughtChain: {
      problem: '糖尿病教育材料缺乏高质量的配套插图，传统手绘或设计制作周期长、成本高。',
      analysis:
        '糖尿病教育插图需要涵盖：血糖监测操作、食物分类与份量、运动方式、胰岛素注射、并发症示意等。风格需要温馨友好，避免引起恐惧心理。',
      design:
        'AI 图像生成技术可以快速产出大量风格一致的插图，Python 脚本实现批量生成和筛选流程。Prompt 工程确保输出质量和风格统一。',
      development:
        '为每个教育主题设计 prompt 模板，包含风格描述、色彩基调和内容要求。生成后人工筛选最佳结果，必要时进行微调。建立插图库按主题分类管理。',
      challenges: [
        {
          title: 'AI 生成插图的医学准确性',
          description: 'AI 生成图像可能出现医学细节错误（如注射器形态、血糖仪显示等）。',
          solution:
            '对医学关键细节使用参考图引导生成，生成后由医学专业人员逐张审核，不符合要求的重新生成或手动修正。',
        },
      ],
      outcome:
        '高效产出了覆盖糖尿病教育核心主题的系列插图，为科普材料提供了丰富的视觉素材。',
    },
    screenshots: ['/projects/diabetes-illustration/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 16,
    slug: 'health-assessment',
    name: '健康评估系统',
    nameEn: 'Health Assessment System',
    businessLine: 'health',
    tagline: '综合健康风险评估与个性化健康建议生成系统',
    description:
      '基于多维健康数据的综合评估系统，整合生活习惯、家族病史、体检指标等信息，生成个人健康风险评估报告和改善建议。Web 应用形式，支持多终端访问。\n\n前端 Web 界面设计简洁友好，评估算法基于公开的流行病学风险评估模型。',
    techStack: ['Web'],
    scene3d: 'heartbeat',
    thoughtChain: {
      problem: '个人健康管理缺乏系统化的评估工具，体检报告中的各项指标难以综合解读，普通人不知道自己的健康风险等级。',
      analysis:
        '健康评估需要整合多个维度：生理指标（BMI、血压、血糖）、生活习惯（运动、饮食、睡眠）、家族病史、心理状态。评估结果需要通俗可操作。',
      design:
        'Web 应用确保跨平台访问，无需安装。评估模型参考权威健康风险评估框架，确保科学性。',
      development:
        '评估流程：个人信息采集 → 多维度评分 → 风险等级判定 → 个性化建议生成。每个评估维度独立打分，加权汇总得出综合健康评分。',
      challenges: [
        {
          title: '评估模型设计',
          description: '综合健康评估涉及多个维度的权重分配和阈值设定，需要科学依据。',
          solution:
            '参考 WHO 和国家卫健委发布的健康评价指标体系，结合临床指南确定各维度权重和阈值。',
        },
      ],
      outcome:
        '提供了便捷的个人健康评估工具，帮助用户全面了解自身健康状况并获取针对性的改善建议。',
    },
    screenshots: ['/projects/health-assessment/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 17,
    slug: 'dongfanghong',
    name: '东方红品牌内容沉淀',
    nameEn: 'Dongfanghong Brand Content Archive',
    businessLine: 'health',
    tagline: '东方红品牌历史内容系统化整理与知识管理',
    description:
      '面向东方红品牌的内容资产管理和知识沉淀项目，系统化整理品牌历史资料、产品文案、营销素材和企业文化内容。建立分类索引和检索体系，方便团队高效复用历史内容资产。\n\n以内容管理体系为核心，建立标准化的内容分类、标签和检索规范。',
    techStack: ['Content Management'],
    scene3d: 'archive',
    thoughtChain: {
      problem: '品牌积累了大量历史内容资产（产品文案、营销案例、媒体报道），但缺乏系统化整理，查找复用效率低下。',
      analysis:
        '需要建立统一的内容管理体系：内容分类规范、标签体系、检索方式、版本管理。涵盖文案、图片、视频等多种内容类型。',
      design:
        '轻量级内容管理方案，重点在于分类体系和标签规范的设计而非技术工具。确保团队所有成员都能方便地上传和检索内容。',
      development:
        '设计内容分类框架（按产品线、营销场景、内容类型三级分类），建立标签体系和搜索规范。逐批整理历史内容，补充标签和描述信息。',
      challenges: [
        {
          title: '历史内容标准化',
          description: '早期内容缺乏统一格式和元信息，分类标准不一致。',
          solution:
            '制定内容标注规范，对历史内容进行回溯标注，优先处理高频使用的内容资产。',
        },
      ],
      outcome:
        '建立了品牌内容管理的标准化体系，历史内容资产得到系统化整理，团队内容复用效率显著提升。',
    },
    screenshots: ['/projects/dongfanghong/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
];

// =============================================================================
// Projects — AI (7)
// =============================================================================

const aiProjects: Project[] = [
  {
    id: 18,
    slug: 'my-agent',
    name: 'GLM Agent',
    nameEn: 'GLM Agent',
    businessLine: 'ai',
    tagline: '基于智谱GLM大模型的多功能AI Agent应用',
    description:
      '基于智谱 GLM 大模型构建的 AI Agent 应用，集成工具调用、知识检索和多轮对话能力。使用 LangChain 框架编排 Agent 工作流，FastAPI 提供高性能 API 服务。\n\n项目探索了大模型 Agent 的核心能力：意图理解、工具选择与调用、上下文管理和多步推理。为后续更复杂的 Agent 应用奠定了技术基础。',
    techStack: ['Python', 'LangChain', 'FastAPI', '智谱GLM'],
    scene3d: 'robot',
    thoughtChain: {
      problem: '大模型本身只是文本生成器，无法主动获取实时信息或执行操作，需要 Agent 框架将其能力与外部工具结合。',
      analysis:
        '一个实用的 Agent 需要：1）自然语言理解用户意图；2）根据意图选择合适的工具；3）正确调用工具并解析返回结果；4）基于结果继续推理或返回最终答案。LangChain 提供了这些能力的编排框架。',
      design:
        '智谱 GLM 作为基础模型，中文能力强且成本适中。LangChain 管理 Prompt 模板、工具定义和 Agent 执行循环。FastAPI 提供标准化的 HTTP 接口，支持流式输出。',
      development:
        '核心架构：用户请求 → FastAPI 接口 → LangChain Agent → 工具选择与调用 → 结果汇总 → 响应。定义了多个工具：网页搜索、代码执行、文件读写、数据库查询。Agent 使用 ReAct 模式交替进行推理和行动。',
      challenges: [
        {
          title: '工具调用可靠性',
          description: '大模型有时会生成格式错误的工具调用指令，导致执行失败。',
          solution:
            '增加工具调用的格式校验和自动重试机制，设计更清晰的工具描述和 few-shot 示例引导模型正确输出。',
        },
        {
          title: '长对话上下文管理',
          description: '多轮对话中上下文不断增长，超出模型窗口限制且影响响应质量。',
          solution:
            '实现对话历史的滑动窗口和摘要压缩机制，保留关键信息的同时控制上下文长度。',
        },
      ],
      outcome:
        '成功构建了可扩展的 AI Agent 框架，验证了工具调用和多步推理的技术方案，为更复杂的 Agent 应用积累了宝贵经验。',
    },
    screenshots: ['/projects/my-agent/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/my-agent',
    featured: true,
    year: '2024',
    status: 'completed',
  },
  {
    id: 19,
    slug: 'hermes-agent',
    name: 'AI Agent框架',
    nameEn: 'Hermes Agent Framework',
    businessLine: 'ai',
    tagline: '支持多模型切换的通用AI Agent开发框架',
    description:
      '通用 AI Agent 开发框架，支持 OpenAI 和 Anthropic 等多个大模型提供商的无缝切换。基于 FastAPI 构建可扩展的 Agent 服务架构，内置工具注册、对话管理和错误处理机制。\n\n框架设计注重模块化和可扩展性，开发者可以轻松添加新的工具、模型后端和 Agent 策略。',
    techStack: ['Python', 'OpenAI', 'Anthropic', 'FastAPI'],
    scene3d: 'network',
    thoughtChain: {
      problem: '不同大模型提供商的 API 接口和调用方式各不相同，切换模型需要大量代码修改，缺乏统一的 Agent 开发抽象层。',
      analysis:
        '需要一个统一的 Agent 开发框架，屏蔽底层模型差异，提供标准化的工具注册、对话管理、错误处理等通用能力，让开发者专注于业务逻辑。',
      design:
        '采用 Provider 模式抽象不同模型 API，统一接口定义。FastAPI 提供 RESTful 服务层。工具注册采用装饰器模式，Agent 策略通过插件机制扩展。',
      development:
        '核心模块：ModelProvider（模型适配层）、ToolRegistry（工具注册中心）、ConversationManager（对话管理）、AgentRunner（执行引擎）。每个模块独立可测试，通过接口松耦合。',
      challenges: [
        {
          title: '多模型API兼容性',
          description: 'OpenAI、Anthropic 等不同模型的工具调用格式和响应结构差异大。',
          solution:
            '设计统一的中间表示层（IR），各模型 Provider 负责将模型原生格式转换为 IR，上层逻辑只处理 IR。',
        },
      ],
      outcome:
        '构建了灵活的 Agent 开发框架，支持多模型快速切换和工具热插拔，降低了 Agent 应用的开发门槛。',
    },
    screenshots: ['/projects/hermes-agent/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/hermes-agent',
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 20,
    slug: 'vimax',
    name: 'ViMax AI视频生成',
    nameEn: 'ViMax AI Video Generation',
    businessLine: 'ai',
    tagline: '基于AI的智能视频内容生成与编辑平台',
    description:
      'AI 视频生成与编辑平台，集成大语言模型进行脚本生成、计算机视觉技术进行视频分析、向量数据库管理素材检索。支持从文本描述到成品视频的自动化生产流程。\n\n技术栈涵盖 LangChain 编排 AI 工作流、OpenCV 处理视频帧、PyTorch 驱动视觉模型、FAISS 实现高效的素材向量检索。',
    techStack: ['Python', 'LangChain', 'OpenCV', 'PyTorch', 'FAISS'],
    scene3d: 'video',
    thoughtChain: {
      problem: '视频制作门槛高、周期长，传统流程需要编剧、拍摄、剪辑等多个环节，中小企业和个人创作者难以承担。',
      analysis:
        'AI 视频生成需要解决：脚本自动编写、素材智能匹配、视频片段自动剪辑、转场效果生成、字幕配音同步等多个子问题。每个环节都可以用 AI 技术辅助或自动化。',
      design:
        'LangChain 编排多步骤的视频生成工作流，OpenCV 处理视频帧级别的操作，PyTorch 运行视觉理解模型，FAISS 管理大规模素材库的向量索引实现快速检索。',
      development:
        '核心管线：文本输入 → 脚本生成（LLM）→ 分镜拆解 → 素材检索（FAISS）→ 片段剪辑（OpenCV）→ 效果合成 → 字幕配音 → 成品输出。每个环节独立可替换。',
      challenges: [
        {
          title: '素材检索精度',
          description: '从大量素材库中检索与脚本内容语义匹配的视频片段，准确率要求高。',
          solution:
            '使用 CLIP 模型将视频帧和文本脚本映射到同一向量空间，FAISS 进行高效近似最近邻搜索，多模态匹配提升检索精度。',
        },
        {
          title: '视频片段连贯性',
          description: '自动拼接的视频片段在风格、色调和节奏上缺乏连贯性。',
          solution:
            '引入风格一致性评分和色彩迁移算法，自动调整片段间的视觉过渡，添加智能转场效果平滑衔接。',
        },
      ],
      outcome:
        '验证了 AI 视频生成的完整技术链路，实现了从文本到视频的自动化生产流程，为视频内容创作提供了新范式。',
    },
    screenshots: ['/projects/vimax/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/vimax',
    featured: true,
    year: '2024',
    status: 'active',
  },
  {
    id: 21,
    slug: 'stable-diffusion',
    name: 'Stable Diffusion WebUI',
    nameEn: 'Stable Diffusion WebUI',
    businessLine: 'ai',
    tagline: '基于Gradio的Stable Diffusion图像生成Web界面',
    description:
      '基于 Stable Diffusion 模型的图像生成 Web 应用，提供友好的 Gradio 界面进行文生图、图生图、局部重绘等操作。集成了模型管理、Prompt 辅助、批量生成等实用功能。\n\n使用 PyTorch 驱动 Stable Diffusion 模型推理，Gradio 快速构建交互式 Web 界面。',
    techStack: ['Python', 'Gradio', 'PyTorch'],
    scene3d: 'image',
    thoughtChain: {
      problem: 'Stable Diffusion 模型功能强大但使用门槛高，命令行操作不直观，普通用户难以快速上手。',
      analysis:
        '需要一个直观的 Web 界面封装 SD 模型的核心功能：文生图、图生图、inpainting、模型切换、参数调节。同时需要管理生成的图片和历史记录。',
      design:
        'Gradio 是构建 ML 模型演示界面的最佳选择，几行代码即可创建交互式组件。PyTorch 作为 SD 模型的运行时框架。',
      development:
        '基于 Gradio Blocks 构建多 Tab 界面：文生图（prompt + 参数调节）、图生图（上传参考图）、历史记录浏览。集成 LoRA 模型加载、采样器选择、种子控制等高级功能。',
      challenges: [
        {
          title: 'GPU显存管理',
          description: '高分辨率图像生成占用大量显存，容易触发 OOM。',
          solution:
            '实现显存优化策略：xformers 注意力优化、梯度检查点、分块生成（tiling），支持低显存模式自动降级。',
        },
      ],
      outcome:
        '提供了易于使用的 SD 图像生成界面，降低了 AI 绘图的使用门槛，为创意工作提供了高效的工具支持。',
    },
    screenshots: ['/projects/stable-diffusion/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 22,
    slug: 'comfyui',
    name: 'ComfyUI工作流',
    nameEn: 'ComfyUI Workflows',
    businessLine: 'ai',
    tagline: 'ComfyUI节点式AI图像生成工作流设计与优化',
    description:
      '基于 ComfyUI 平台的 AI 图像生成工作流设计和优化项目，通过可视化节点编辑器构建复杂的图像生成管线。探索了多种高级工作流，包括多模型级联、ControlNet 引导、IP-Adapter 风格迁移等。\n\n项目积累了丰富的 ComfyUI 工作流设计经验，形成了可复用的工作流模板库。',
    techStack: ['Python'],
    scene3d: 'nodes',
    thoughtChain: {
      problem: '复杂的 AI 图像生成任务（如风格一致性角色设计、多条件引导生成）需要组合多个模型和处理步骤，传统单一模型难以满足需求。',
      analysis:
        'ComfyUI 的节点式工作流天然适合组合多个处理步骤。需要掌握核心节点类型、模型兼容性和工作流优化技巧。',
      design:
        '以 ComfyUI 可视化编辑器为核心，通过节点组合实现复杂生成逻辑。Python 编写自定义节点扩展功能。',
      development:
        '设计并优化了多种工作流：基础文生图、ControlNet 条件引导、IP-Adapter 风格迁移、高清修复（HiRes Fix）、批量变体生成。每个工作流保存为 JSON 模板可复用。',
      challenges: [
        {
          title: '工作流调试复杂',
          description: '节点式工作流中某个节点配置错误可能导致整个流程失败，错误信息不直观。',
          solution:
            '建立从简单到复杂的工作流构建方法论，逐步添加节点并验证中间结果，利用 ComfyUI 的预览功能检查每个节点的输出。',
        },
      ],
      outcome:
        '建立了完善的 ComfyUI 工作流体系，覆盖了从基础到高级的多种图像生成场景，形成了可复用的工作流模板库。',
    },
    screenshots: ['/projects/comfyui/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'active',
  },
  {
    id: 23,
    slug: 'deeptutor',
    name: 'DeepTutor深度学习教学',
    nameEn: 'DeepTutor Deep Learning Teaching',
    businessLine: 'ai',
    tagline: '交互式深度学习教学平台与实验环境',
    description:
      '深度学习教学平台，提供从基础概念到前沿模型的系统化学习路径。集成了 Jupyter Notebook 实验环境、Docker 容器化部署和自动评分系统。\n\n课程内容覆盖神经网络基础、CNN、RNN、Transformer 等核心架构，每个模块配有动手实验和练习题。',
    techStack: ['Python', 'Docker'],
    scene3d: 'graduation',
    thoughtChain: {
      problem: '深度学习理论抽象难懂，纯理论学习缺乏实践体验，而独立搭建实验环境对初学者门槛高。',
      analysis:
        '有效的深度学习教学需要：理论讲解 + 代码演示 + 动手实验三管齐下。实验环境需要预装依赖、提供 GPU 支持，降低环境配置门槛。',
      design:
        'Python 作为教学和实验的核心语言，Docker 容器化确保实验环境的一致性和可复现性。Jupyter Notebook 格式适合交互式教学。',
      development:
        '按学习路径组织课程模块，每个模块包含：概念讲解（Markdown）→ 代码演示（Notebook）→ 练习题 → 项目实战。Docker 镜像预装 PyTorch 和常用库，一键启动实验环境。',
      challenges: [
        {
          title: 'GPU资源分配',
          description: '多用户同时进行实验时 GPU 资源有限，需要合理调度。',
          solution:
            '实现 GPU 资源池管理和任务队列，支持实验排队和超时自动释放。轻量级实验使用 CPU 模式降低 GPU 压力。',
        },
      ],
      outcome:
        '为深度学习入门者提供了系统化的学习平台和即开即用的实验环境，降低了深度学习的入门门槛。',
    },
    screenshots: ['/projects/deeptutor/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 24,
    slug: 'qwen-deploy',
    name: 'Qwen本地大模型部署',
    nameEn: 'Qwen Local LLM Deployment',
    businessLine: 'ai',
    tagline: '通义千问大模型本地部署与推理优化实践',
    description:
      '通义千问（Qwen）大语言模型的本地部署实践项目，探索了从模型下载、量化压缩到推理服务的完整部署链路。基于 HuggingFace Transformers 框架，针对本地硬件进行推理性能优化。\n\n项目记录了不同量化方案（GPTQ、AWQ、GGUF）的效果对比，以及 vLLM、llama.cpp 等推理框架的性能测试结果。',
    techStack: ['Qwen', 'HuggingFace'],
    scene3d: 'server',
    thoughtChain: {
      problem: '云端大模型 API 调用有成本和数据隐私顾虑，部分场景需要本地部署大模型实现数据不出域。',
      analysis:
        '本地部署需要解决：模型选择（参数量与硬件的平衡）、量化方案（精度与速度权衡）、推理优化（KV Cache、连续批处理）、服务化接口（兼容 OpenAI API 格式）。',
      design:
        'Qwen 模型中文能力优秀且开源生态完善。HuggingFace Transformers 提供标准化的模型加载和推理接口。通过量化技术在消费级 GPU 上运行大模型。',
      development:
        '部署流程：模型选择与下载 → 量化转换 → 推理框架配置 → API 服务启动 → 性能测试。对比了全精度、4bit、8bit 量化的效果差异，测试了不同推理框架的吞吐量。',
      challenges: [
        {
          title: '显存与模型大小权衡',
          description: '消费级 GPU 显存有限，大参数模型需要量化才能运行，但量化会影响输出质量。',
          solution:
            '根据应用场景选择合适的模型参数量和量化方案：简单任务用 7B+4bit 量化，复杂任务用 14B+8bit 量化。AWQ 量化在精度保持上优于 GPTQ。',
        },
      ],
      outcome:
        '完成了 Qwen 大模型的本地部署并形成了一套可复用的部署方案，在消费级硬件上实现了可用的推理性能。',
    },
    screenshots: ['/projects/qwen-deploy/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
];

// =============================================================================
// Projects — Web (4)
// =============================================================================

const webProjects: Project[] = [
  {
    id: 25,
    slug: 'wehot',
    name: '微信热门文章平台',
    nameEn: 'WeHot - WeChat Trending Articles',
    businessLine: 'web',
    tagline: '聚合微信热门文章的内容发现与推荐平台',
    description:
      '微信热门文章聚合平台，自动抓取和分类微信公众平台的优质文章，提供个性化推荐和全文搜索功能。用户可以按兴趣领域浏览热门内容，发现优质公众号。\n\nWeb 平台形式，注重内容发现体验和阅读体验的优化设计。',
    techStack: ['Web'],
    scene3d: 'articles',
    thoughtChain: {
      problem: '微信生态内的优质文章分散在不同公众号中，缺乏统一的内容发现和聚合渠道，用户容易错过好内容。',
      analysis:
        '需要构建一个内容聚合平台：自动抓取公众号文章 → 内容分类和标签 → 热度计算和排序 → 个性化推荐。关键在于内容获取的合法性和推荐算法的准确性。',
      design:
        'Web 平台确保跨设备访问，前后端分离架构。内容抓取层独立部署，推荐服务可插拔。前端注重阅读体验。',
      development:
        '核心模块：内容采集（定时抓取+解析）、内容处理（分类+标签+NLP摘要）、热度算法（综合阅读量、点赞、时间衰减）、推荐引擎（基于兴趣标签的协同过滤）、全文搜索。',
      challenges: [
        {
          title: '内容获取与版权',
          description: '微信公众号文章的自动获取有技术和合规挑战。',
          solution:
            '采用合法的内容合作和授权方式获取文章数据，尊重原创者权益，提供原文链接引导用户关注原作者。',
        },
      ],
      outcome:
        '构建了微信优质内容的聚合发现平台，帮助用户高效发现感兴趣的热门文章，提升了内容消费效率。',
    },
    screenshots: ['/projects/wehot/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 26,
    slug: 'miniprogram',
    name: '小程序',
    nameEn: 'Mini Program',
    businessLine: 'web',
    tagline: '面向业务场景的微信小程序应用开发',
    description:
      '面向具体业务场景的微信小程序开发项目，覆盖用户端的核心功能需求。充分利用微信小程序的社交能力和原生体验优势，实现轻量级的业务服务入口。\n\n遵循微信小程序开发规范，注重性能优化和用户体验设计。',
    techStack: ['Web'],
    scene3d: 'phone',
    thoughtChain: {
      problem: '企业需要触达微信生态内的用户群体，但独立App开发成本高、获客难，小程序是最优的轻量级解决方案。',
      analysis:
        '小程序需要利用微信生态能力（登录、支付、分享、消息推送），同时保持良好的原生体验。核心功能要精简聚焦，符合"用完即走"的产品理念。',
      design:
        '遵循微信小程序开发框架和设计规范，使用组件化开发模式。注重首屏加载速度和交互流畅性。',
      development:
        '采用组件化架构，页面和逻辑分离。接入微信登录和支付能力，实现消息模板推送。使用分包加载优化首屏性能，图片懒加载和CDN加速确保体验流畅。',
      challenges: [
        {
          title: '小程序包大小限制',
          description: '微信小程序有严格的包大小限制（主包2MB），功能丰富的应用容易超限。',
          solution:
            '采用分包加载策略，将非核心功能模块拆分为独立分包。图片资源使用CDN，核心代码压缩优化。',
        },
      ],
      outcome:
        '交付了功能完善、体验流畅的微信小程序应用，成功接入微信生态为企业提供了高效的移动端服务入口。',
    },
    screenshots: ['/projects/miniprogram/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 27,
    slug: 'luntan',
    name: '论坛',
    nameEn: 'Forum Platform',
    businessLine: 'web',
    tagline: '基于Web的社区论坛交流平台',
    description:
      'Web 社区论坛平台，支持话题发布、评论回复、用户互动等核心社区功能。包含用户系统、内容管理、权限控制等完整后台功能。\n\n全栈 Web 开发实践，注重社区运营功能和内容质量控制机制的设计。',
    techStack: ['Web'],
    scene3d: 'comments',
    thoughtChain: {
      problem: '企业或社区需要一个专属的在线交流平台，第三方社交平台缺乏定制性和数据自主权。',
      analysis:
        '论坛的核心功能：用户注册与认证、话题发布与分类、评论与回复、内容搜索、用户权限管理、内容审核。需要平衡开放性和内容质量。',
      design:
        'Web 全栈开发，前后端分离。响应式设计适配桌面和移动端。数据库设计注重内容关系和查询效率。',
      development:
        '核心功能模块：用户系统（注册/登录/权限）、内容模块（发帖/评论/标签）、搜索功能、通知系统、管理后台（内容审核/用户管理）。采用RESTful API设计。',
      challenges: [
        {
          title: '内容质量控制',
          description: '开放论坛容易出现垃圾内容和违规信息，需要有效的内容审核机制。',
          solution:
            '实现多层内容质量控制：敏感词过滤（前置）、用户举报机制（后置）、AI辅助审核（自动化）、管理员审核（人工兜底）。',
        },
      ],
      outcome:
        '构建了功能完善的社区论坛平台，提供了良好的在线交流体验和内容管理能力。',
    },
    screenshots: ['/projects/luntan/screenshot1.webp'],
    featured: false,
    year: '2023',
    status: 'completed',
  },
  {
    id: 28,
    slug: 'llm-wiki',
    name: 'LLM知识库桌面应用',
    nameEn: 'LLM Wiki Desktop App',
    businessLine: 'web',
    tagline: '本地优先的大模型知识管理桌面应用',
    description:
      '面向 AI 从业者的知识库桌面应用，整合大模型（LLM）相关的技术文档、论文笔记、学习资源。支持本地 Markdown 笔记管理、全文搜索和知识图谱可视化。\n\n桌面应用形态确保数据隐私和离线可用性，现代化的界面设计提升知识管理体验。',
    techStack: ['Web'],
    scene3d: 'knowledge',
    thoughtChain: {
      problem: 'LLM 领域知识碎片化严重，技术博客、论文、文档散落在不同平台，缺乏统一的知识管理工具。',
      analysis:
        'AI 从业者需要一个聚合性的知识管理工具：整合多方来源的学习资料、支持笔记标注和关联、提供快速检索和知识图谱浏览。数据本地存储确保隐私。',
      design:
        '桌面应用确保数据本地化和离线使用。Web 技术栈降低开发成本。Markdown 格式兼容性好、版本可控。',
      development:
        '核心功能：Markdown 编辑器（所见即所得）、文件树管理、全文搜索（倒排索引）、标签系统、知识图谱（双向链接）、导入导出。界面参考 Notion/Obsidian 的优秀实践。',
      challenges: [
        {
          title: '全文搜索性能',
          description: '大量 Markdown 文件的全文搜索需要在毫秒级响应。',
          solution:
            '构建增量更新的倒排索引，搜索时使用 TF-IDF 排序。文件变更时实时更新索引而非全量重建。',
        },
      ],
      outcome:
        '为 LLM 学习和研究提供了高效的知识管理工具，帮助系统化整理 AI 领域的碎片化知识。',
    },
    screenshots: ['/projects/llm-wiki/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
];

// =============================================================================
// Projects — Creative (1)
// =============================================================================

const creativeProjects: Project[] = [
  {
    id: 29,
    slug: 'starry-music-box',
    name: '星轨八音盒',
    nameEn: 'Starry Music Box',
    businessLine: 'creative',
    tagline: '融合星轨动画与音乐互动的沉浸式3D八音盒体验',
    description:
      '一个融合星轨动画与音乐交互的沉浸式 3D Web 体验。用户可以旋转、缩放一个精致的3D八音盒，观察星轨环绕的粒子效果，同时播放八音盒旋律。项目展示了 Three.js 3D渲染、GSAP 动画编排和交互设计的综合能力。\n\n使用 Three.js 构建核心3D场景和粒子系统，GSAP 编排复杂的动画序列，TypeScript 确保代码质量。整体设计追求视觉震撼与交互优雅的统一。',
    techStack: ['Three.js', 'GSAP', 'TypeScript'],
    scene3d: 'music-box',
    thoughtChain: {
      problem: '传统八音盒体验受限于物理形态，数字化的八音盒可以突破物理限制，创造更丰富的视听体验，但需要高质量的3D渲染和动画技术支撑。',
      analysis:
        '项目需要三大核心能力：1）精细的3D模型渲染（八音盒造型、材质、光影）；2）流畅的粒子动画系统（星轨效果、光粒子）；3）音乐与视觉的同步交互。性能优化是确保流畅体验的关键。',
      design:
        'Three.js 是 Web 3D 渲染的标准选择，生态完善、性能优秀。GSAP 是动画编排的最佳工具，Timeline 功能完美适配复杂的动画序列。TypeScript 保证代码的可靠性和可维护性。',
      development:
        '3D场景：程序化建模八音盒几何体，PBR 材质实现金属和木质质感，多光源营造氛围。粒子系统：自定义 ShaderMaterial 实现 GPU 驱动的高性能粒子，贝塞尔曲线路径模拟星轨。动画：GSAP Timeline 编排多阶段动画，ScrollTrigger 实现滚动驱动叙事。音乐：Web Audio API 控制音频播放和可视化。',
      challenges: [
        {
          title: '大规模粒子系统性能',
          description: '星轨效果需要同时渲染数万粒子，在移动设备上容易卡顿。',
          solution:
            '使用 GPU 实例化渲染（InstancedMesh）和自定义 Shader 替代逐粒子 JavaScript 计算，将粒子更新逻辑转移到 GPU。根据设备性能自动调整粒子数量。',
        },
        {
          title: '音频视觉同步',
          description: '八音盒旋律节拍需要与3D动画精确同步，延迟或不一致会破坏沉浸感。',
          solution:
            '使用 Web Audio API 的精确时间调度替代 setTimeout，音频分析器实时提取节拍信息驱动视觉反馈。GSAP Timeline 与音频时间轴对齐。',
        },
      ],
      outcome:
        '创造了一个视觉惊艳、交互流畅的3D八音盒体验，展示了 Web 3D 技术和创意设计的深度融合。项目作为 portfolio 的标志性作品获得了广泛关注。',
    },
    screenshots: ['/projects/starry-music-box/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/starry-music-box',
    featured: true,
    year: '2025',
    status: 'completed',
  },
];

// =============================================================================
// Projects — Research (3)
// =============================================================================

const researchProjects: Project[] = [
  {
    id: 30,
    slug: 'academic-skills',
    name: 'academic-research-skills',
    nameEn: 'Academic Research Skills',
    businessLine: 'research',
    tagline: '基于Claude Skills的学术研究效率工具集',
    description:
      '面向学术研究场景的 Claude Code Skills 工具集，自动化文献管理、论文分析、引用格式化等重复性工作。通过自定义 Skill 定义，将 AI 能力深度集成到学术研究工作流中。\n\n基于 Python 和 Claude Skills 框架构建，每个 Skill 聚焦一个具体的学术研究痛点。',
    techStack: ['Python', 'Claude Skills'],
    scene3d: 'research',
    thoughtChain: {
      problem: '学术研究中大量时间消耗在文献检索、格式排版、引用管理等重复性工作上，挤占了核心的思考和创新时间。',
      analysis:
        '学术研究效率工具需要覆盖：文献检索与筛选、PDF阅读与摘要、引用管理和格式化、论文结构化分析、实验数据整理。每个环节都有明确的自动化空间。',
      design:
        'Claude Skills 框架可以将每个学术工作流封装为可复用的 Skill，通过自然语言指令触发。Python 生态有丰富的学术工具库（scholarly、pyzotero、pandas）。',
      development:
        '开发了多个 Skill：文献搜索（关键词→相关论文列表）、论文摘要（PDF→结构化摘要）、引用格式化（多种引用风格转换）、文献综述辅助（多篇论文→对比矩阵）。每个 Skill 独立可用，也可组合编排。',
      challenges: [
        {
          title: '学术内容准确性',
          description: 'AI 生成的学术摘要和分析必须准确，不能编造信息。',
          solution:
            'Skill 设计遵循"提取而非创造"原则，所有输出都基于原文内容，关键主张标注来源。引用信息通过 Crossref API 交叉验证。',
        },
      ],
      outcome:
        '构建了一套实用的学术研究效率工具，将文献管理和论文分析的效率提升了数倍，为研究者节省了大量重复劳动时间。',
    },
    screenshots: ['/projects/academic-skills/screenshot1.webp'],
    featured: false,
    year: '2025',
    status: 'active',
  },
  {
    id: 31,
    slug: 'paper-downloader',
    name: '文献下载工具',
    nameEn: 'Academic Paper Downloader',
    businessLine: 'research',
    tagline: '自动化批量下载学术论文的浏览器自动化工具',
    description:
      '基于浏览器自动化的学术论文批量下载工具，支持从多个学术数据库（arXiv、PubMed、Google Scholar 等）自动检索和下载论文 PDF。支持关键词搜索、作者过滤、时间范围筛选。\n\n使用 Playwright 进行浏览器自动化，Python 编写下载调度逻辑，支持断点续传和并发下载。',
    techStack: ['Playwright', 'Python'],
    scene3d: 'download',
    thoughtChain: {
      problem: '研究者经常需要批量下载特定主题的论文，手动逐篇下载效率极低，不同数据库的下载方式各异。',
      analysis:
        '论文下载工具需要处理：多个学术数据库的搜索接口差异、验证码和反爬机制、PDF 链接提取、下载队列管理、去重和命名规范。',
      design:
        'Playwright 是最强大的浏览器自动化工具，能处理动态渲染和复杂交互。Python 编排下载流程，支持异步并发提升效率。',
      development:
        '核心模块：搜索器（各数据库适配）、链接提取器（从搜索结果中提取 PDF URL）、下载管理器（队列、并发、断点续传）、命名器（按规范重命名 PDF）。支持通过配置文件定义批量下载任务。',
      challenges: [
        {
          title: '反爬机制应对',
          description: '学术数据库普遍有反爬措施，频繁请求会触发验证码或封禁。',
          solution:
            '实现智能请求节流和 User-Agent 轮换，检测到验证码时暂停并通知人工处理。下载间隔随机化模拟人类行为。',
        },
        {
          title: 'PDF链接提取',
          description: '不同网站的 PDF 链接位置和加载方式各不相同，动态加载的页面需要等待渲染。',
          solution:
            '针对主流数据库编写专门的链接提取器，使用 Playwright 等待网络空闲确保动态内容加载完成。通用提取器使用启发式规则匹配 PDF URL。',
        },
      ],
      outcome:
        '实现了高效的论文批量下载工具，将数小时的手动下载工作缩短到几分钟自动完成，显著提升了文献收集效率。',
    },
    screenshots: ['/projects/paper-downloader/screenshot1.webp'],
    githubUrl: 'https://github.com/hangyuwei/paper-downloader',
    featured: false,
    year: '2024',
    status: 'completed',
  },
  {
    id: 32,
    slug: 'resume-screener',
    name: 'AI简历筛选助手',
    nameEn: 'AI Resume Screener',
    businessLine: 'research',
    tagline: '利用Edge自动化和AI实现简历智能筛选',
    description:
      'AI 驱动的简历筛选助手，结合 Edge 浏览器自动化和 AI 语义分析，自动从招聘平台提取简历信息，按照预设的岗位要求进行智能匹配和评分。辅助 HR 快速筛选大量简历，聚焦最匹配的候选人。\n\n使用 Edge 浏览器自动化技术访问招聘平台，AI 模型解析简历内容并进行岗位匹配度评分。',
    techStack: ['Edge Automation'],
    scene3d: 'resume',
    thoughtChain: {
      problem: 'HR 面对海量简历时筛选工作量大，人工阅读效率低且标准不统一，容易遗漏优秀候选人。',
      analysis:
        '简历筛选需要：自动获取简历（平台自动化）→ 结构化信息提取（教育、经验、技能）→ 与岗位要求匹配度计算 → 综合评分排序。关键是理解简历的语义信息而非简单关键词匹配。',
      design:
        'Edge 自动化处理招聘平台的页面交互和简历获取，AI 模型进行语义理解和匹配度评估。工具链简洁高效。',
      development:
        '流程设计：登录招聘平台 → 搜索候选人 → 批量获取简历 → AI 解析提取关键信息 → 与岗位 JD 匹配评分 → 结果排序输出。匹配算法结合关键词权重和语义相似度。',
      challenges: [
        {
          title: '简历格式多样性',
          description: '不同候选人的简历格式、表述方式差异大，标准化提取困难。',
          solution:
            '使用大语言模型的语义理解能力而非正则匹配提取信息，通过 prompt 引导模型按统一结构输出。关键信息（学历、工作年限）增加规则校验。',
        },
      ],
      outcome:
        '为 HR 团队提供了高效的简历筛选辅助工具，将初步筛选效率提升了数倍，帮助快速聚焦最匹配的候选人。',
    },
    screenshots: ['/projects/resume-screener/screenshot1.webp'],
    featured: false,
    year: '2024',
    status: 'completed',
  },
];

// =============================================================================
// All Projects
// =============================================================================

export const allProjects: Project[] = [
  ...healthProjects,
  ...aiProjects,
  ...webProjects,
  ...creativeProjects,
  ...researchProjects,
];

// =============================================================================
// Helper Functions
// =============================================================================

export function getProjectsByBusinessLine(line: BusinessLine): Project[] {
  return allProjects.filter((p) => p.businessLine === line);
}

export function getFeaturedProjects(): Project[] {
  return allProjects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return allProjects.map((p) => p.slug);
}

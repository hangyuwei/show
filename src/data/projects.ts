// =============================================================================
// Portfolio Projects Data — 33 Projects
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
    tagline: '面向校园健康填报与统计的管理系统',
    description:
      '面向高校场景的健康填报系统，支持学生端每日上报、异常状态标记、按院系统计和报表导出。项目重点是把分散的健康信息收集流程整理成可查询、可汇总的数字化台账。\n\n前端采用 Vue3 + Vant 实现移动端界面，后端使用 Spring Boot 构建 RESTful API，MySQL 存储业务数据，Redis 用于缓存部分统计结果，Docker 用于统一本地开发和部署环境。',
    techStack: ['Spring Boot', 'Vue3', 'Vant', 'MySQL', 'Redis', 'Docker'],
    scene3d: 'building',
    thoughtChain: {
      problem: '高校疫情防控期间，传统纸质或微信群上报方式效率低下，数据分散难以统计汇总，无法实现实时监控和预警。',
      analysis:
        '需要把学生填报、辅导员查看、异常记录和数据导出串成一个清晰流程，同时适配移动端，让日常填报和后续统计都更容易维护。',
      design:
        '后端选择 Spring Boot 与 MyBatis-Plus 处理常规业务接口和数据访问，前端 Vue3 + Vant 负责移动端表单与列表体验。Redis 缓存部分高频统计数据，Docker 统一运行环境。',
      development:
        '采用前后端分离架构，定义 RESTful API。权限系统区分管理员、辅导员、学生角色。数据导出使用 Apache POI 生成 Excel 报表，定时任务用于汇总当日填报状态和提醒列表。',
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
        '实现了校园健康填报、异常标记、统计汇总和 Excel 导出等核心模块，适合作为校园健康管理场景的系统化实践。',
    },
    screenshots: ['/projects/campus-health/screenshot1.png', '/projects/campus-health/screenshot2.png', '/projects/campus-health/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/campus-health',
    featured: true,
    year: '2026',
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
      '针对 400 热线客服记录的数据分析工具，将通话明细整理成可筛选、可对比的可视化报表。支持按时间段、客服人员、通话类型等维度查看接通、时长和趋势数据。\n\n使用 Python 技术栈构建，Streamlit 提供交互式界面，Pandas 处理数据清洗和聚合，Plotly 生成图表。整体以轻量部署和内部分析使用为主。',
    techStack: ['Python', 'Streamlit', 'Pandas', 'Plotly'],
    scene3d: 'chart',
    thoughtChain: {
      problem: '400热线客服积累了大量通话数据，但缺乏有效的分析工具，管理层无法快速了解客服效率、客户满意度和服务趋势。',
      analysis:
        '需要从原始通话日志中提取关键指标：接通率、平均通话时长、客户满意度评分、高峰时段分布等，并以可视化方式呈现，支持筛选和下钻分析。',
      design:
        '选择 Streamlit 是因为它适合用 Python 直接搭建交互式数据仪表板。Pandas 负责数据清洗和聚合，Plotly 提供折线图、柱状图和分布图等展示方式。',
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
        '将客服通话记录整理为可视化看板，便于查看高峰时段、人员工作量和通话类型分布，为后续排班和服务复盘提供参考。',
    },
    screenshots: ['/projects/kefu-stats/screenshot1.png', '/projects/kefu-stats/screenshot2.png', '/projects/kefu-stats/screenshot3.png'],
    featured: true,
    year: '2026',
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
      '面向可研报告整理场景的桌面工具，用于解析 Word 文档并提取项目名称、投资金额、财务指标和风险段落等结构化信息。支持批量处理多个文件，结果导出为 Excel，便于人工复核和二次分析。\n\n基于 Python 开发，使用 MarkItDown 转换 Word 文档，结合规则匹配和文本处理提取结构化字段。PyInstaller 打包为独立可执行文件，降低非技术用户的运行门槛。',
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
        '形成了可研报告批量解析和 Excel 汇总流程，减少重复阅读和手工录入工作；关键指标仍保留人工复核入口。',
    },
    screenshots: ['/projects/feasibility-report/screenshot1.png', '/projects/feasibility-report/screenshot2.png', '/projects/feasibility-report/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/feasibility-report',
    featured: true,
    year: '2026',
    status: 'completed',
  },
  {
    id: 4,
    slug: 'product-poster',
    name: '保健品产品海报制作',
    nameEn: 'Health Product Poster Generator',
    businessLine: 'health',
    tagline: '基于模板和 AI 配图的保健品海报生成工具',
    description:
      '面向保健品营销物料制作的辅助工具，通过产品信息、版式模板和 AI 配图生成海报初稿。支持模板参数、文案字段和图片风格配置，适合批量产出可继续编辑的设计素材。\n\n使用 Python 脚本驱动，HTML 模板渲染布局，集成 AI 图像生成 API 辅助配图。最终输出图片文件，便于设计人员继续校对和调整。',
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
        '实现了基于模板的海报初稿生成流程，适合批量探索不同产品和渠道的视觉方案，最终成稿仍需要品牌和合规检查。',
    },
    screenshots: ['/projects/product-poster/screenshot1.png', '/projects/product-poster/screenshot2.png', '/projects/product-poster/screenshot3.png'],
    featured: false,
    year: '2026',
    status: 'completed',
  },
  {
    id: 5,
    slug: 'medical-ocr',
    name: '医学检验报告OCR分析',
    nameEn: 'Medical Lab Report OCR Analysis',
    businessLine: 'health',
    tagline: '辅助整理体检报告和化验单的结构化工具',
    description:
      '医学检验报告识别与整理工具，支持从体检报告、血液化验单等文档中提取检验指标、参考范围和异常标记。结果汇总为结构化 Excel 表格，便于长期留档和人工对照。\n\n调用智谱 AI API 进行 OCR 和结构化信息提取，OpenPyXL 生成格式化 Excel 输出。项目定位是辅助整理工具，关键医学数据仍需要人工复核。',
    techStack: ['Python', '智谱API', 'OpenPyXL'],
    scene3d: 'microscope',
    thoughtChain: {
      problem: '个人和家庭每年产生大量体检报告和化验单，纸质文档难以长期保存和对比分析，手动录入数据既耗时又容易出错。',
      analysis:
        '医学报告的OCR识别需要处理复杂排版（多列表格、上下标、特殊符号），且不同医院的报告格式差异大。提取后需要进行单位标准化、异常值标记和趋势对比。',
      design:
        '选择智谱 API 处理中文文档识别和结构化输出，OpenPyXL 生成带格式的 Excel 方便后续整理。Python 生态便于补充清洗、校验和导出逻辑。',
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
        '实现了医学报告图片到结构化表格的辅助整理流程，能够集中保存常见检验指标，并通过校验和复核入口降低误识别风险。',
    },
    screenshots: ['/projects/medical-ocr/screenshot1.png', '/projects/medical-ocr/screenshot2.png', '/projects/medical-ocr/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/medical-ocr',
    featured: true,
    year: '2026',
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
      '保健品行业竞品情报整理工具，利用 DeepSeek 大模型辅助归纳公开资料中的产品配方、价格策略、营销渠道和用户评价。输出结构化竞品分析草稿，供产品和市场讨论时参考。\n\n核心能力在于把分散信息整理成统一报告格式，AI 负责初步提取和对比，事实信息仍需要来源核验。',
    techStack: ['DeepSeek API'],
    scene3d: 'radar',
    thoughtChain: {
      problem: '保健品市场竞争激烈，产品迭代快速，手动追踪竞品信息耗时且信息不全面，缺乏系统化的竞品分析工具。',
      analysis:
        '竞品情报需要覆盖多个维度：产品成分与功效对比、定价策略、渠道分布、用户口碑、新品动态。信息来源分散在电商平台、社交媒体、行业报告中。',
      design:
        '选择 DeepSeek API 处理中文资料归纳和对比分析。以 prompt 工程为核心，设计结构化的分析模板，尽量让输出字段和报告格式保持一致。',
      development:
        '构建标准化的竞品信息采集模板，通过 prompt 链让 DeepSeek 逐步完成：信息提取 → 分类整理 → 多维度对比 → 摘要总结。输出格式化为 Markdown 报告，便于人工补充来源和结论。',
      challenges: [
        {
          title: '信息时效性和准确性',
          description: '竞品信息更新频繁，AI 模型的训练数据存在时效性限制。',
          solution:
            '结合实时数据源（搜索API、RSS）提供最新信息上下文，让模型基于最新数据进行分析而非依赖训练知识。',
        },
      ],
      outcome:
        '建立了竞品资料收集、分类和报告生成流程，适合快速形成调研初稿，并为后续人工核验和产品讨论提供结构化素材。',
    },
    screenshots: ['/projects/competitor-intel/screenshot1.png', '/projects/competitor-intel/screenshot2.png', '/projects/competitor-intel/screenshot3.png'],
    featured: true,
    year: '2026',
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
      '将认知障碍相关专业医学指南转化为更易阅读的解读材料。通过 DeepSeek 大模型辅助提炼章节要点、解释术语和生成初稿，Markdown 格式便于修订和多渠道整理。\n\n项目定位是医学科普内容整理实践，重点在于保留专业边界、降低阅读门槛，并把 AI 输出纳入人工审核流程。',
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
        '形成了认知障碍医学指南的解读模板和内容整理流程，输出材料可作为科普文章、培训讲义或内部资料的初稿基础。',
    },
    screenshots: ['/projects/cognitive-guide/screenshot1.png', '/projects/cognitive-guide/screenshot2.png', '/projects/cognitive-guide/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '基于《中医体质分类与判定》标准的在线测评工具，用户通过回答量表问题获得体质倾向和养生建议。纯前端实现，响应式设计适配移动端。\n\n使用原生 HTML/CSS 构建，无需后端服务，轻量部署。评分逻辑按公开量表规则实现，结果用于自测参考，不替代专业诊断。',
    techStack: ['HTML', 'CSS'],
    scene3d: 'yin-yang',
    thoughtChain: {
      problem: '中医体质辨识需要专业中医师面诊，普通人群难以便捷地了解自身体质类型和对应的养生方案。',
      analysis:
        '中医体质分类有公开标准和量表，包含 9 种基本体质类型。项目需要将纸质量表数字化，实现自动评分、结果展示和建议说明。',
      design:
        '纯前端实现确保隐私保护（数据不上传），HTML/CSS 无需构建工具部署简单。响应式设计适配手机使用场景。',
      development:
        '按照量表实现题目和评分规则，使用转化分公式计算各体质维度得分，展示主要体质倾向和兼夹体质参考。结果页包含雷达图和生活方式建议。',
      challenges: [
        {
          title: '评分算法准确性',
          description: '中医体质判定涉及多个维度的加权评分和转化分计算，规则复杂。',
          solution:
            '严格对照国家标准文档实现评分算法，逐一验证每种体质的判定阈值和转化公式，设置边界测试用例确保计算正确。',
        },
      ],
      outcome:
        '提供了便捷的中医体质自测页面，帮助用户了解量表维度和体质倾向，并获得基础饮食、运动、起居建议。',
    },
    screenshots: ['/projects/tcm-assessment/screenshot1.png', '/projects/tcm-assessment/screenshot2.png', '/projects/tcm-assessment/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '面向大健康行业统计资料的整理编纂项目，将分散数据、指标口径和计算方法归纳为结构化标准文档。工作内容包括数据收集、统计方法对照、文档编排和 PDF 输出。\n\n使用 Excel 进行数据整理和统计分析，最终输出便于评审和归档的 PDF 文档。',
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
        '完成了统计指标、计算口径和文档格式的整理，为后续团体标准讨论、评审和修订提供了可追溯底稿。',
    },
    screenshots: ['/projects/industry-standards/screenshot1.png', '/projects/industry-standards/screenshot2.png', '/projects/industry-standards/screenshot3.png'],
    featured: false,
    year: '2026',
    status: 'completed',
  },
  {
    id: 10,
    slug: 'order-planning',
    name: '智能订货计划管理平台',
    nameEn: 'Smart Order Planning Platform',
    businessLine: 'health',
    tagline: '基于销售数据的保健品订货计划辅助工具',
    description:
      '面向保健品零售场景的订货计划辅助工具，结合历史销售数据、季节性因素和促销计划生成建议订货量。支持多仓库、多 SKU 的计划录入、调整和导出。\n\n使用 HTML + Tailwind CSS 构建界面，前端处理主要计算和交互逻辑，支持数据导入导出，适合做订货测算和流程原型。',
    techStack: ['HTML', 'Tailwind'],
    scene3d: 'warehouse',
    thoughtChain: {
      problem: '保健品订货依赖采购员经验判断，容易出现库存积压或断货，缺乏数据驱动的订货决策支持。',
      analysis:
        '订货计划需要综合考虑：历史销量趋势、季节性波动、促销影响、安全库存水位、供应商最小起订量和交货周期。需要将复杂的库存管理逻辑简化为可操作的订货建议。',
      design:
        'HTML + Tailwind 用于构建轻量级前端应用，无需后端即可处理中小规模数据。本地存储方案降低部署复杂度。',
      development:
        '核心功能模块包括销售数据看板、订货建议计算、计划编制工作台和审批记录。订货算法基于移动平均、季节性指数和安全库存公式计算建议订货量。',
      challenges: [
        {
          title: '预测模型准确性',
          description: '保健品销售受促销活动影响大，单纯基于历史数据的预测偏差大。',
          solution:
            '引入促销日历作为外部因子调整预测结果，支持手动调整预测参数，系统记录预测偏差用于持续优化模型。',
        },
      ],
      outcome:
        '实现了订货计划录入、建议计算和导出流程，让采购人员可以在同一页面对销售数据、库存水位和手动调整结果进行对照。',
    },
    screenshots: ['/projects/order-planning/screenshot1.png', '/projects/order-planning/screenshot2.png', '/projects/order-planning/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '面向企业岗位交接场景的文档生成工具，将工作事项、项目资料、联系人信息和待办清单按模板整理为交接文档。支持 Word 格式输出和附件索引。\n\n基于 Node.js 开发，使用 docx 库程序化生成 Word 文档，减少手工排版和格式不一致问题。',
    techStack: ['Node.js', 'docx'],
    scene3d: 'folder',
    thoughtChain: {
      problem: '岗位交接时信息散落在邮件、聊天记录、本地文件中，缺乏系统化整理，容易遗漏关键信息导致工作断档。',
      analysis:
        '交接文档需要覆盖：岗位职责说明、进行中的项目清单、重要联系人、待办事项、文件资料索引、系统账号权限等。需要一个标准化模板引导信息收集。',
      design:
        'Node.js + docx 库用于控制 Word 文档的段落、表格和样式，适合生成格式固定的标准化文档。命令行形式便于批量处理。',
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
        '沉淀了工作交接文档模板和自动生成脚本，便于把分散资料整理成结构一致、可归档的交接文件。',
    },
    screenshots: ['/projects/handover-archive/screenshot1.png', '/projects/handover-archive/screenshot2.png', '/projects/handover-archive/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '面向临床教学和病例讨论的资料整理工具，用于汇总同一病例下不同专家的分析视角，包括影像、病理、治疗方案建议等内容。支持 OCR 识别病历文档和 Markdown 格式分析报告撰写。\n\n结合 OCR 技术数字化病历资料，Markdown 管理专家分析内容，便于版本对比和讨论记录沉淀。',
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
        '选择中文文档 OCR 服务，对手写内容增加人工校验环节，关键指标提取后与原文对照确认。',
        },
      ],
      outcome:
        '提供了病例资料、专家观点和综合分析报告的整理框架，便于病例讨论内容留档和后续复盘。',
    },
    screenshots: ['/projects/medical-case/screenshot1.png', '/projects/medical-case/screenshot2.png', '/projects/medical-case/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '健康科普手册的内容策划、撰写和设计制作项目。涵盖常见疾病预防、健康生活方式、合理用药指导等主题，以通俗语言整理专业信息。\n\n使用 Markdown 进行内容撰写和版本管理，配合设计工具完成排版输出，适合制作宣传册、讲义和线上图文素材。',
    techStack: ['Markdown', 'Design Tools'],
    scene3d: 'book',
    thoughtChain: {
      problem: '公众健康素养普遍偏低，专业医学知识晦涩难懂，缺乏系统化、通俗化的健康科普材料。',
      analysis:
        '健康科普手册需要兼顾科学性、可读性和实用性。内容选题应聚焦高频健康问题，语言要接地气，排版要吸引人阅读。',
      design:
        'Markdown 管理内容版本，设计工具处理最终排版。内容流程为：选题调研 → 专家审核大纲 → 内容撰写 → 医学审核 → 设计排版。',
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
        '完成了多主题健康科普手册的内容整理和版式输出，形成了可复用的科普文章结构和审核流程。',
    },
    screenshots: ['/projects/health-handbook/screenshot1.png', '/projects/health-handbook/screenshot2.png', '/projects/health-handbook/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '健康科普动画视频制作项目，将医学知识和健康概念拆解成脚本、分镜和动画画面。涵盖疾病原理、人体机制、健康常识等主题。\n\n结合设计工具和视频制作软件，完成脚本撰写、分镜设计、动画制作和后期剪辑等流程。',
    techStack: ['Design Tools', 'Video'],
    scene3d: 'film',
    thoughtChain: {
      problem: '静态文字和图片难以直观展示人体内部的生理过程和疾病机制，公众对抽象医学概念理解困难。',
      analysis:
        '动画视频可以把微观或抽象的医学概念具象化，适合用于科普讲解。需要在科学准确性、画面可读性和制作成本之间取得平衡。',
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
        '形成了从医学脚本到动画成片的制作流程，产出的视频素材可用于健康科普课程、短视频和宣教场景。',
    },
    screenshots: ['/projects/science-animation/screenshot1.png', '/projects/science-animation/screenshot2.png', '/projects/science-animation/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '面向糖尿病健康教育场景的插图生成项目，利用 AI 图像生成技术为科普材料创建配套插图。涵盖血糖监测、饮食管理、运动指导、并发症预防等主题。\n\nPython 脚本驱动 AI 图像生成 API，批量生成候选图，再通过人工筛选和修正保证医学细节更可靠。',
    techStack: ['Python', 'AI Image Generation'],
    scene3d: 'syringe',
    thoughtChain: {
      problem: '糖尿病教育材料需要配套插图辅助理解，传统手绘或设计制作周期长、成本高。',
      analysis:
        '糖尿病教育插图需要涵盖：血糖监测操作、食物分类与份量、运动方式、胰岛素注射、并发症示意等。风格需要温馨友好，避免引起恐惧心理。',
      design:
        'AI 图像生成技术适合探索插图方向，Python 脚本实现批量生成和筛选流程。Prompt 工程用于约束主题、构图和基础风格。',
      development:
        '为每个教育主题设计 prompt 模板，包含风格描述、色彩基调和内容要求。生成后人工筛选可用结果，必要时进行微调。建立插图库按主题分类管理。',
      challenges: [
        {
          title: 'AI 生成插图的医学准确性',
          description: 'AI 生成图像可能出现医学细节错误（如注射器形态、血糖仪显示等）。',
          solution:
            '对医学关键细节使用参考图引导生成，生成后由医学专业人员逐张审核，不符合要求的重新生成或手动修正。',
        },
      ],
      outcome:
        '整理出一组糖尿病教育插图候选素材和提示词模板，为科普材料制作提供可继续筛选、修正和复用的视觉资源。',
    },
    screenshots: ['/projects/diabetes-illustration/screenshot1.png', '/projects/diabetes-illustration/screenshot2.png', '/projects/diabetes-illustration/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '基于多维健康数据的综合评估系统，整合生活习惯、家族病史、体检指标等信息，生成个人健康风险提示和改善建议。Web 应用形式，支持多终端访问。\n\n前端 Web 界面设计简洁，评估规则参考公开健康风险评估框架，结果用于健康管理参考，不替代临床诊断。',
    techStack: ['Web'],
    scene3d: 'heartbeat',
    thoughtChain: {
      problem: '个人健康管理缺乏系统化的评估工具，体检报告中的各项指标难以综合解读，普通人不知道自己的健康风险等级。',
      analysis:
        '健康评估需要整合多个维度：生理指标（BMI、血压、血糖）、生活习惯（运动、饮食、睡眠）、家族病史、心理状态。评估结果需要通俗可操作。',
      design:
        'Web 应用确保跨平台访问，无需安装。评估模型参考权威健康风险评估框架，确保科学性。',
      development:
        '评估流程：个人信息采集 → 多维度评分 → 风险等级提示 → 改善建议生成。每个评估维度独立打分，加权汇总得出综合健康评分。',
      challenges: [
        {
          title: '评估模型设计',
          description: '综合健康评估涉及多个维度的权重分配和阈值设定，需要科学依据。',
          solution:
            '参考 WHO 和国家卫健委发布的健康评价指标体系，结合临床指南确定各维度权重和阈值。',
        },
      ],
      outcome:
        '实现了个人健康信息采集、维度评分和建议生成流程，帮助用户整理健康风险线索，并提示需要进一步关注的指标。',
    },
    screenshots: ['/projects/health-assessment/screenshot1.png', '/projects/health-assessment/screenshot2.png', '/projects/health-assessment/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '面向东方红品牌的内容资产整理项目，系统化归档品牌历史资料、产品文案、营销素材和企业文化内容。建立分类索引和检索规则，方便团队查找和复用历史内容。\n\n项目重点是内容治理方法：分类体系、标签规范、版本信息和素材描述，而不是复杂技术平台。',
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
        '建立了品牌内容分类、标签和检索规则，完成一批历史内容的回溯整理，为后续内容复用和资料沉淀打下基础。',
    },
    screenshots: ['/projects/dongfanghong/screenshot1.png', '/projects/dongfanghong/screenshot2.png', '/projects/dongfanghong/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '基于智谱 GLM 大模型构建的 AI Agent 应用，集成工具调用、知识检索和多轮对话能力。使用 LangChain 编排 Agent 工作流，FastAPI 提供 API 服务。\n\n项目主要探索大模型 Agent 的基础能力：意图理解、工具选择与调用、上下文管理和多步推理，为后续 Agent 应用积累实现经验。',
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
        '完成了 GLM Agent 的基础框架，验证了工具调用、多轮上下文和接口封装等关键模块，为后续扩展更多工具提供了基础。',
    },
    screenshots: ['/projects/my-agent/screenshot1.png', '/projects/my-agent/screenshot2.png', '/projects/my-agent/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/my-agent',
    featured: true,
    year: '2026',
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
      '通用 AI Agent 开发框架，封装 OpenAI、Anthropic 等不同模型提供商的调用差异。基于 FastAPI 构建 Agent 服务骨架，内置工具注册、对话管理和错误处理机制。\n\n框架设计偏模块化，便于继续添加工具、模型后端和不同 Agent 策略。',
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
        '构建了 Agent 开发框架的核心模块，统一了模型适配、工具注册和对话管理接口，降低后续接入新模型或工具时的改动范围。',
    },
    screenshots: ['/projects/hermes-agent/screenshot1.png', '/projects/hermes-agent/screenshot2.png', '/projects/hermes-agent/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/hermes-agent',
    featured: false,
    year: '2026',
    status: 'completed',
  },
  {
    id: 20,
    slug: 'vimax',
    name: 'ViMax AI视频生成',
    nameEn: 'ViMax AI Video Generation',
    businessLine: 'ai',
    tagline: 'AI 视频生成与素材匹配流程原型',
    description:
      'AI 视频生成与编辑流程原型，集成大语言模型进行脚本生成，结合计算机视觉技术进行视频分析，并用向量检索管理素材匹配。项目重点是验证从文本到分镜、素材检索、片段组合的技术链路。\n\n技术栈涵盖 LangChain 编排 AI 工作流、OpenCV 处理视频帧、PyTorch 驱动视觉模型、FAISS 实现素材向量检索。',
    techStack: ['Python', 'LangChain', 'OpenCV', 'PyTorch', 'FAISS'],
    scene3d: 'video',
    thoughtChain: {
      problem: '视频制作门槛高、周期长，传统流程需要编剧、拍摄、剪辑等多个环节，中小企业和个人创作者难以承担。',
      analysis:
        'AI 视频生成需要拆解为脚本辅助生成、素材匹配、片段剪辑、转场、字幕和配音等子问题。项目先聚焦可验证的管线，把每个环节做成可替换模块。',
      design:
        'LangChain 编排多步骤的视频生成工作流，OpenCV 处理视频帧级别的操作，PyTorch 运行视觉理解模型，FAISS 管理素材库的向量索引和相似度检索。',
      development:
        '核心管线：文本输入 → 脚本生成（LLM）→ 分镜拆解 → 素材检索（FAISS）→ 片段剪辑（OpenCV）→ 效果合成 → 字幕配音 → 输出草稿。每个环节独立可替换。',
      challenges: [
        {
          title: '素材检索精度',
          description: '从素材库中检索与脚本内容语义接近的视频片段，容易出现语义相关但画面不合适的问题。',
          solution:
            '使用 CLIP 模型将视频帧和文本脚本映射到同一向量空间，FAISS 进行近似最近邻搜索，再增加人工预览和二次筛选环节。',
        },
        {
          title: '视频片段连贯性',
          description: '自动拼接的视频片段在风格、色调和节奏上缺乏连贯性。',
          solution:
            '引入风格一致性评分和色彩迁移算法，自动调整片段间的视觉过渡，添加智能转场效果平滑衔接。',
        },
      ],
      outcome:
        '验证了文本脚本、素材检索、片段剪辑和字幕输出的基础链路，形成了可继续打磨的视频生成流程原型。',
    },
    screenshots: ['/projects/vimax/screenshot1.png', '/projects/vimax/screenshot2.png', '/projects/vimax/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/vimax',
    featured: true,
    year: '2026',
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
      '基于 Stable Diffusion 模型的图像生成 Web 应用，提供 Gradio 界面进行文生图、图生图、局部重绘等操作。集成模型管理、Prompt 辅助、批量生成等常用功能。\n\n使用 PyTorch 驱动 Stable Diffusion 模型推理，Gradio 构建交互式 Web 界面。',
    techStack: ['Python', 'Gradio', 'PyTorch'],
    scene3d: 'image',
    thoughtChain: {
      problem: 'Stable Diffusion 模型参数多、命令行操作不直观，普通用户难以上手和复现实验配置。',
      analysis:
        '需要一个直观的 Web 界面封装 SD 模型的核心功能：文生图、图生图、inpainting、模型切换、参数调节。同时需要管理生成的图片和历史记录。',
      design:
        'Gradio 用于构建 ML 模型演示界面，可以直接暴露参数组件和图片预览。PyTorch 作为 SD 模型的运行时框架。',
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
        '实现了一个封装 Stable Diffusion 常用能力的 Web 界面，方便管理模型参数、生成记录和批量实验。',
    },
    screenshots: ['/projects/stable-diffusion/screenshot1.png', '/projects/stable-diffusion/screenshot2.png', '/projects/stable-diffusion/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '基于 ComfyUI 平台的 AI 图像生成工作流设计项目，通过可视化节点编辑器构建图像生成管线。探索了多模型级联、ControlNet 引导、IP-Adapter 风格迁移等工作流。\n\n项目沉淀了一组可复用的 ComfyUI 工作流模板和调参记录，便于后续按场景继续迭代。',
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
        '整理出一组 ComfyUI 工作流模板，覆盖基础文生图、条件控制、风格迁移和高清修复等常用场景。',
    },
    screenshots: ['/projects/comfyui/screenshot1.png', '/projects/comfyui/screenshot2.png', '/projects/comfyui/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '深度学习教学平台原型，围绕基础概念、经典模型和实验练习组织学习路径。集成 Jupyter Notebook 实验环境、Docker 容器化部署和练习题管理。\n\n课程内容覆盖神经网络基础、CNN、RNN、Transformer 等核心架构，每个模块配有代码演示和练习题。',
    techStack: ['Python', 'Docker'],
    scene3d: 'graduation',
    thoughtChain: {
      problem: '深度学习理论抽象难懂，纯理论学习缺乏实践体验，而独立搭建实验环境对初学者门槛高。',
      analysis:
        '有效的深度学习教学需要理论讲解、代码演示和动手实验结合。实验环境需要预装依赖，并尽量降低环境配置门槛。',
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
        '完成了深度学习课程内容、实验环境和练习管理的基础原型，便于按模块继续扩展教学内容。',
    },
    screenshots: ['/projects/deeptutor/screenshot1.png', '/projects/deeptutor/screenshot2.png', '/projects/deeptutor/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '通义千问（Qwen）大语言模型的本地部署实践项目，探索从模型下载、量化压缩到推理服务启动的部署链路。基于 HuggingFace Transformers 框架，记录本地硬件下的推理配置和资源占用。\n\n项目对比了不同量化方案和推理框架的使用体验，包括 GPTQ、AWQ、GGUF、vLLM 和 llama.cpp 等方向。',
    techStack: ['Qwen', 'HuggingFace'],
    scene3d: 'server',
    thoughtChain: {
      problem: '云端大模型 API 调用有成本和数据隐私顾虑，部分场景需要本地部署大模型实现数据不出域。',
      analysis:
        '本地部署需要解决：模型选择（参数量与硬件的平衡）、量化方案（精度与速度权衡）、推理优化（KV Cache、连续批处理）、服务化接口（兼容 OpenAI API 格式）。',
      design:
        'Qwen 模型中文生态资料较多，HuggingFace Transformers 提供标准化的模型加载和推理接口。通过量化技术降低本地运行的显存压力。',
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
        '完成了 Qwen 本地部署流程记录，沉淀了模型选择、量化转换、推理框架配置和基础性能测试的实践笔记。',
    },
    screenshots: ['/projects/qwen-deploy/screenshot1.png', '/projects/qwen-deploy/screenshot2.png', '/projects/qwen-deploy/screenshot3.png'],
    featured: false,
    year: '2026',
    status: 'completed',
  },
];

// =============================================================================
// Projects — Web (5)
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
      '微信热门文章聚合平台原型，用于整理公众号文章链接、分类标签和阅读入口。支持按领域浏览、关键词搜索和热度排序等内容发现功能。\n\nWeb 平台形式，重点在内容列表、筛选、搜索和阅读跳转体验。',
    techStack: ['Web'],
    scene3d: 'articles',
    thoughtChain: {
      problem: '微信生态内的文章分散在不同公众号中，缺乏统一的内容发现和聚合渠道，用户容易错过感兴趣的内容。',
      analysis:
        '需要构建一个内容聚合平台：文章链接整理 → 内容分类和标签 → 热度计算和排序 → 搜索筛选。关键在于内容来源合规、数据结构清晰和阅读体验稳定。',
      design:
        'Web 平台确保跨设备访问，前后端分离架构。内容采集和内容展示分层处理，前端注重列表筛选和阅读跳转体验。',
      development:
        '核心模块包括内容录入与采集、分类标签、热度排序、搜索筛选和文章详情跳转。平台保留原文链接，避免替代原创内容分发。',
      challenges: [
        {
          title: '内容获取与版权',
          description: '微信公众号文章的自动获取有技术和合规挑战。',
          solution:
            '采用合法的内容合作和授权方式获取文章数据，尊重原创者权益，提供原文链接引导用户关注原作者。',
        },
      ],
      outcome:
        '完成了微信文章聚合与分类浏览原型，能够把分散文章整理为可搜索、可筛选的内容列表。',
    },
    screenshots: ['/projects/wehot/screenshot1.png', '/projects/wehot/screenshot2.png', '/projects/wehot/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '面向具体业务场景的微信小程序开发项目，覆盖用户端常见功能需求，如登录、信息展示、表单提交和消息触达。利用小程序作为轻量级业务入口。\n\n遵循微信小程序开发规范，关注首屏加载、分包组织和移动端交互体验。',
    techStack: ['Web'],
    scene3d: 'phone',
    thoughtChain: {
      problem: '企业需要在微信生态内提供轻量服务入口，独立 App 的开发和分发成本较高，小程序适合作为低门槛试点方案。',
      analysis:
        '小程序需要结合微信登录、分享、消息触达等能力，同时控制功能范围，保持移动端流程短、入口清晰。',
      design:
        '遵循微信小程序开发框架和设计规范，使用组件化开发模式。注重首屏加载速度和交互流畅性。',
      development:
        '采用组件化架构，页面和逻辑分离。接入微信登录、分享和表单提交等基础能力。使用分包加载、图片懒加载等方式优化首屏体验。',
      challenges: [
        {
          title: '小程序包大小限制',
          description: '微信小程序有严格的包大小限制（主包2MB），功能丰富的应用容易超限。',
          solution:
            '采用分包加载策略，将非核心功能模块拆分为独立分包。图片资源使用CDN，核心代码压缩优化。',
        },
      ],
      outcome:
        '完成了微信小程序的基础业务入口，覆盖登录、页面展示、表单交互和基础性能优化等常见模块。',
    },
    screenshots: ['/projects/miniprogram/screenshot1.png', '/projects/miniprogram/screenshot2.png', '/projects/miniprogram/screenshot3.png'],
    featured: false,
    year: '2025',
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
      'Web 社区论坛平台，支持话题发布、评论回复、用户互动等核心社区功能。包含用户系统、内容管理、权限控制等后台模块。\n\n全栈 Web 开发实践，重点在社区内容结构、基础互动流程和管理端能力。',
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
        '实现了论坛的基础交流流程和管理后台，包括用户、帖子、评论、搜索和内容审核等模块。',
    },
    screenshots: ['/projects/luntan/screenshot1.png', '/projects/luntan/screenshot2.png', '/projects/luntan/screenshot3.png'],
    featured: false,
    year: '2026',
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
      '面向 AI 学习和研究场景的知识库桌面应用，用于整理大模型相关技术文档、论文笔记和学习资源。支持本地 Markdown 笔记管理、全文搜索和关系浏览。\n\n桌面应用形态强调本地存储和离线使用，界面参考常见笔记软件的文件树、编辑器和标签体验。',
    techStack: ['Web'],
    scene3d: 'knowledge',
    thoughtChain: {
      problem: 'LLM 领域知识碎片化严重，技术博客、论文、文档散落在不同平台，缺乏统一的知识管理工具。',
      analysis:
        'AI 学习资料分散在论文、博客、文档和课程中，需要一个本地工具支持笔记整理、标签关联、快速检索和资料导入导出。',
      design:
        '桌面应用确保数据本地化和离线使用。Web 技术栈降低开发成本。Markdown 格式兼容性好、版本可控。',
      development:
        '核心功能包括 Markdown 编辑器、文件树管理、全文搜索、标签系统、双向链接和导入导出。界面参考 Notion/Obsidian 的信息组织方式。',
      challenges: [
        {
          title: '全文搜索性能',
          description: '大量 Markdown 文件的全文搜索需要在毫秒级响应。',
          solution:
            '构建增量更新的倒排索引，搜索时使用 TF-IDF 排序。文件变更时实时更新索引而非全量重建。',
        },
      ],
      outcome:
        '实现了本地 Markdown 知识库、搜索和标签管理原型，适合整理 LLM 学习笔记、论文摘要和技术链接。',
    },
    screenshots: ['/projects/llm-wiki/screenshot1.png', '/projects/llm-wiki/screenshot2.png', '/projects/llm-wiki/screenshot3.png'],
    featured: false,
    year: '2026',
    status: 'completed',
  },
  {
    id: 33,
    slug: 'three-databases',
    name: '三库系统',
    nameEn: 'Three Databases Knowledge Platform',
    businessLine: 'web',
    tagline: '法规库、科普文章库、产品资料库的一体化知识管理平台',
    description:
      '三库系统是围绕法规库、科普文章库和产品资料库建设的知识管理平台，用于把法规文件、科普内容和产品资料统一整理成可浏览、可检索、可复核的业务资料库。\n\n当前活跃运行侧包含两个重点入口：`/audit/` 健康食品 / 食品内容合规审核界面，以及 `/threeRepo2/` 静态法规、文章、产品站点。项目采用 Fastify 服务端、Python 合规审核服务、静态前端页面和数据转换脚本协作，保留 legacy 管理端代码但默认运行路径只聚焦活跃站点。',
    techStack: ['Fastify', 'Prisma', 'PostgreSQL', 'Python', 'Static HTML', 'Playwright', 'Puppeteer', 'xlsx'],
    scene3d: 'articles',
    thoughtChain: {
      problem:
        '法规文件、科普文章和产品资料分散在不同文件、页面和人工记录中，内容审核时很难快速追溯依据，也不利于持续沉淀可复用的业务知识。',
      analysis:
        '需要把“三类资料库”拆成清晰的运行入口：法规/文章/产品用于日常查询和详情阅读，合规审核用于对健康食品、食品宣传内容做结构化复核，同时把 legacy 管理端和当前活跃站点明确分离。',
      design:
        '默认运行路径聚焦 `/audit/` 与 `/threeRepo2/`。Fastify 负责静态资源与必要 API，Python 服务承接合规审核能力，静态站点负责法规、文章和产品资料浏览；旧版 admin/API 模块通过 `ENABLE_LEGACY_ADMIN` 开关隔离。',
      development:
        '建设了静态法规/文章/产品站点、合规审核页面、数据转换脚本、Fastify 活跃路由和 Python 审核服务。配套 Playwright/Puppeteer 截图验收、分页状态测试和合规审核单元测试，保证默认活跃运行路径可维护。',
      challenges: [
        {
          title: '活跃站点与 legacy 代码边界',
          description:
            '仓库里同时存在 client、web、旧管理端和新静态站点，直接维护容易混淆当前真实运行入口。',
          solution:
            '用 ACTIVE_SITES 明确 `/audit/` 与 `/threeRepo2/` 是当前生产关注点，并通过 `ENABLE_LEGACY_ADMIN=false` 让默认 Fastify 运行模式只加载活跃路径。',
        },
        {
          title: '合规审核结果需要可复核',
          description:
            '食品和健康食品内容审核不能只给泛化结论，需要把风险点、依据和报告预览组织成可人工确认的交付物。',
          solution:
            '将合规审核拆成 Python 服务、报告生成、预览页面和测试样例，保留人工复核入口，并用专门测试覆盖审核 API 与典型内容样本。',
        },
      ],
      outcome:
        '完成了 `/audit/` 合规审核界面和 `/threeRepo2/` 法规/文章/产品资料站点两个活跃入口，形成从资料沉淀、内容检索到合规复核的三库工作台。',
    },
    screenshots: ['/projects/three-databases/screenshot1.png', '/projects/three-databases/screenshot2.png', '/projects/three-databases/screenshot3.png'],
    featured: true,
    year: '2026',
    status: 'active',
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
      '一个融合星轨动画与音乐交互的 3D Web 体验。用户可以旋转、缩放 3D 八音盒，观察星轨环绕效果，同时播放八音盒旋律。项目展示了 Three.js 渲染、GSAP 动画编排和交互设计的综合实践。\n\n使用 Three.js 构建核心 3D 场景和粒子系统，GSAP 编排动画序列，TypeScript 约束代码结构。整体设计追求明确的视觉焦点和顺滑的互动反馈。',
    techStack: ['Three.js', 'GSAP', 'TypeScript'],
    scene3d: 'music-box',
    thoughtChain: {
      problem: '传统八音盒体验受限于物理形态，数字化八音盒可以加入星轨、镜头和互动效果，但需要稳定的 3D 渲染和动画技术支撑。',
      analysis:
        '项目需要三大核心能力：1）3D 模型渲染（八音盒造型、材质、光影）；2）粒子动画系统（星轨效果、光粒子）；3）音乐与视觉的同步交互。性能优化是确保体验稳定的关键。',
      design:
        'Three.js 负责 Web 3D 渲染，GSAP Timeline 管理动画节奏，TypeScript 帮助约束组件和状态结构。',
      development:
        '3D 场景通过程序化几何体搭建八音盒造型，材质和光源用于区分金属、木质和星轨层次。粒子系统使用 ShaderMaterial 和路径动画模拟星轨。音乐交互由 Web Audio API 控制播放和基础可视化。',
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
        '完成了 3D 八音盒 Web 体验，覆盖模型、粒子、动画和音乐交互四个模块，适合作为 Web 3D 创意作品展示。',
    },
    screenshots: ['/projects/starry-music-box/screenshot1.png', '/projects/starry-music-box/screenshot2.png', '/projects/starry-music-box/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/starry-music-box',
    featured: true,
    year: '2026',
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
      '面向学术研究场景的 Claude Code Skills 工具集，用于辅助文献管理、论文分析、引用格式化等重复性工作。通过自定义 Skill 定义，把常见研究动作封装成可复用命令。\n\n基于 Python 和 Claude Skills 框架构建，每个 Skill 聚焦一个具体的研究流程节点。',
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
        '整理出一组学术研究辅助 Skill，覆盖文献搜索、摘要提取、引用整理和综述矩阵等流程，输出内容保留来源核验要求。',
    },
    screenshots: ['/projects/academic-skills/screenshot1.png', '/projects/academic-skills/screenshot2.png', '/projects/academic-skills/screenshot3.png'],
    featured: false,
    year: '2026',
    status: 'active',
  },
  {
    id: 31,
    slug: 'paper-downloader',
    name: '文献下载工具',
    nameEn: 'Academic Paper Downloader',
    businessLine: 'research',
    tagline: '辅助批量检索和下载论文的浏览器自动化工具',
    description:
      '基于浏览器自动化的学术论文检索和下载辅助工具，支持从 arXiv、PubMed、Google Scholar 等来源按关键词、作者和时间范围整理候选论文。\n\n使用 Playwright 进行浏览器自动化，Python 编写下载调度逻辑，支持去重、命名和断点续传。遇到验证码、权限或版权限制时保留人工处理。',
    techStack: ['Playwright', 'Python'],
    scene3d: 'download',
    thoughtChain: {
      problem: '研究者经常需要批量下载特定主题的论文，手动逐篇下载效率极低，不同数据库的下载方式各异。',
      analysis:
        '论文下载工具需要处理：多个学术数据库的搜索接口差异、验证码和反爬机制、PDF 链接提取、下载队列管理、去重和命名规范。',
      design:
        'Playwright 适合处理动态渲染和复杂交互，Python 编排搜索、链接提取、队列和文件命名流程。',
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
        '实现了论文检索、候选链接提取、去重命名和下载队列管理流程，减少重复点击和手工整理；受限资源仍需人工确认。',
    },
    screenshots: ['/projects/paper-downloader/screenshot1.png', '/projects/paper-downloader/screenshot2.png', '/projects/paper-downloader/screenshot3.png'],
    githubUrl: 'https://github.com/hangyuwei/paper-downloader',
    featured: false,
    year: '2026',
    status: 'completed',
  },
  {
    id: 32,
    slug: 'resume-screener',
    name: 'AI简历筛选助手',
    nameEn: 'AI Resume Screener',
    businessLine: 'research',
    tagline: '利用 Edge 自动化和 AI 辅助简历初筛',
    description:
      'AI 驱动的简历筛选助手，结合 Edge 浏览器自动化和 AI 语义分析，从招聘平台整理简历信息，并按照预设岗位要求生成匹配度参考。定位是辅助 HR 初筛和信息整理。\n\n使用 Edge 浏览器自动化技术访问招聘平台，AI 模型解析简历内容并输出结构化字段和排序建议，最终判断仍由人工完成。',
    techStack: ['Edge Automation'],
    scene3d: 'resume',
    thoughtChain: {
      problem: 'HR 面对较多简历时筛选工作量大，人工阅读标准不统一，也容易遗漏需要进一步沟通的候选人。',
      analysis:
        '简历筛选需要：自动获取简历（平台自动化）→ 结构化信息提取（教育、经验、技能）→ 与岗位要求匹配度计算 → 综合评分排序。关键是理解简历的语义信息而非简单关键词匹配。',
      design:
        'Edge 自动化处理招聘平台的页面交互和简历获取，AI 模型进行语义理解和匹配度参考评估。工具链保持轻量，便于按招聘平台调整流程。',
      development:
        '流程设计：登录招聘平台 → 搜索候选人 → 批量获取简历 → AI 解析提取关键信息 → 与岗位 JD 生成匹配参考 → 结果排序输出。匹配算法结合关键词权重和语义相似度。',
      challenges: [
        {
          title: '简历格式多样性',
          description: '不同候选人的简历格式、表述方式差异大，标准化提取困难。',
          solution:
            '使用大语言模型的语义理解能力而非正则匹配提取信息，通过 prompt 引导模型按统一结构输出。关键信息（学历、工作年限）增加规则校验。',
        },
      ],
      outcome:
        '完成了简历抓取、结构化整理和岗位匹配参考流程，可用于辅助初筛和候选人信息对比。',
    },
    screenshots: ['/projects/resume-screener/screenshot1.png', '/projects/resume-screener/screenshot2.png', '/projects/resume-screener/screenshot3.png'],
    featured: false,
    year: '2026',
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

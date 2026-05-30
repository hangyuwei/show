# PRD: 个人作品集 Portfolio 网站

## 产品概述

### 产品名称
Hang's Portfolio — 个人项目作品集网站

### 产品愿景
打造一个以 **3D 宇宙沉浸体验**为核心的个人作品集网站，以太阳系星盘为导航隐喻，展示用户横跨**大健康行业**和**AI/全栈开发**两大领域的 32+ 个项目成果，体现"全栈开发工程师 + 大健康行业技术复合人才"的双重身份。

### 目标用户
| 用户类型 | 需求 |
|---------|------|
| 潜在雇主/HR | 快速了解技术能力和项目经验 |
| 技术同行 | 查看具体项目的技术实现和思路 |
| 行业合作伙伴 | 了解大健康行业的业务能力 |
| 用户自身 | 集中展示和管理项目成果 |

### 核心价值主张
- **不只是作品集，更是技术叙事** — 每个项目展示从问题发现到最终成果的完整思路链
- **3D 沉浸式体验** — 全站基于 Three.js 构建，宇宙/星系主题贯穿始终
- **跨领域整合** — 一站式展示大健康行业 + AI/技术开发的双重能力

---

## 技术架构

### 技术栈
| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 16 + React 19 | SSG/SSR, App Router |
| 语言 | TypeScript 5 | 类型安全 |
| 样式 | Tailwind CSS 4 | 暗色主题, 响应式 |
| 3D渲染 | Three.js + @react-three/fiber + @react-three/drei | 全站3D场景 |
| 后处理 | @react-three/postprocessing (Bloom, Vignette) | 3D场景视觉增强 |
| 动画 | Framer Motion + GSAP | 页面过渡, 交互动画 |
| 内容 | @next/mdx + @mdx-js/loader | 项目思路链长文本内容 |
| 部署 | Vercel | CI/CD, 子域名 show.vercel.app |

### 架构模式
```
┌──────────────────────────────────────────────────┐
│                    Vercel CDN                     │
├──────────────────────────────────────────────────┤
│  Next.js App Router (SSG)                        │
│  ┌─────────┬──────────┬──────────┬────────────┐  │
│  │  首页    │ 项目列表  │ 项目详情  │ 关于我     │  │
│  │ (太阳系) │ (矩阵网格)│ (专属3D) │ (能力雷达) │  │
│  └────┬────┴────┬─────┴────┬────┴──────┬─────┘  │
│       │         │          │           │         │
│  ┌────▼─────────▼──────────▼───────────▼──────┐  │
│  │          Three.js 渲染层 (R3F)              │  │
│  │  StarField | SolarSystem | WarpTransition  │  │
│  │  TechSphere | SkillRadar | ProjectScenes   │  │
│  │  ParticleBackground | DataFlowGrid         │  │
│  │  FloatingCard3D | ProjectPlanet            │  │
│  ├────────────────────────────────────────────┤  │
│  │     Postprocessing (Bloom + Vignette)       │  │
│  └────────────────┬───────────────────────────┘  │
│                   │                               │
│  ┌────────────────▼───────────────────────────┐  │
│  │           UI 组件层                          │  │
│  │  Navbar | Footer | Card | CodeBlock | ...   │  │
│  │  SkeletonLoader | ImageGallery | ...        │  │
│  │  ArchitectureDiagram | SectionTitle | ...   │  │
│  └────────────────┬───────────────────────────┘  │
│                   │                               │
│  ┌────────────────▼───────────────────────────┐  │
│  │      数据层（混合方案）                       │  │
│  │  projects.ts — 项目元数据（类型安全）         │  │
│  │  src/content/projects/{slug}.mdx — 思路链    │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**[审查反馈修复 C2: 3D 技术规格详细参数]**

### 3D 场景技术规格

#### 太阳系场景参数
- **相机**: PerspectiveCamera, FOV 50°, near 0.1, far 250, 初始位置 `[0, 10, 18]`
- **太阳核心**: 使用 Simplex Noise 生成动态表面纹理，warm amber/orange 色调（`#ff8c00` ~ `#ff6600`）
- **太阳日冕 (Corona)**: BackSide MeshBasicMaterial + AdditiveBlending，产生外围光晕效果
- **行星轨道**: EllipseCurve 绘制轨道线，半透明白色 (opacity 0.1)
- **行星大气层**: BackSide MeshBasicMaterial + AdditiveBlending, opacity 0.08，模拟大气散射

#### 粒子系统参数
- **星空背景**: 3000 粒子，使用 BufferGeometry + PointsMaterial
- **材质配置**: AdditiveBlending, transparent, depthWrite false
- **粒子大小**: 随机分布 0.01 ~ 0.05，产生远近层次感
- **颜色范围**: 暖白 `#ffffff` ~ 淡蓝 `#aaccff`，模拟真实星空色温

#### 后处理参数
- **Bloom**: EffectComposer + BloomPass, intensity 0.6, luminanceThreshold 0.2, luminanceSmoothing 0.9
- **Vignette**: offset 0.3, darkness 0.6，增加太空深邃感
- **后处理链**: `Bloom → Vignette`，通过 @react-three/postprocessing 的 EffectComposer 组合

**[审查反馈修复 C3: 移动端 3D 降级策略]**

#### 移动端 3D 降级策略

| 设备类型 | 断点 | 后处理 | 粒子数 | 太阳系 | DPR |
|---------|------|--------|--------|--------|-----|
| 移动端 | < 768px | 关闭 Bloom 和 Vignette | 1500 | 简化为 2D 图示 + 标签 | [1, 1.5] |
| 平板 | 768-1024px | 保留 Bloom, intensity 降至 0.3 | 2000 | 完整 3D，降低精度 | [1, 1.5] |
| 桌面 | > 1024px | 完整 Bloom + Vignette | 3000 | 完整 3D 体验 | [1, 2] |

**3D 场景懒加载策略**:
- 所有 3D Canvas 使用 `next/dynamic` + `{ ssr: false }` 按需加载
- Three.js chunk 通过 dynamic import 独立分包，不影响首屏渲染
- 项目详情页的专属 3D 场景仅在进入视口时加载

**低端设备检测**:
- 检测 `navigator.hardwareConcurrency < 4` 时自动降级到移动端配置
- 检测 WebGL 支持失败时回退到 CSS 动画背景
- 使用 `useMemo` 缓存降级判断结果，避免重复计算

---

## 功能需求

### F1: 首页 — 3D 太阳系星盘导航

**优先级**: P0 | **复杂度**: 高

**功能描述**:
- 全屏 Three.js 太阳系场景
- 中心为用户 Logo/头像（发光脉冲效果）
- 5颗主行星代表5条业务线（大健康/AI/Web/创意/学术），沿轨道环绕
- 每颗行星周围有小型卫星代表具体项目
- 鼠标悬停星球显示项目名称 tooltip
- 点击星球/卫星飞入对应详情页（带 warp 过渡动画）
- 3000 星空粒子背景（桌面端），移动端降至 1500
- 鼠标视差效果
- 相机自动缓慢旋转，支持鼠标拖拽控制

**交互设计**:
- 初始状态：相机从远处缓慢推近太阳系
- Hover 星球：星球放大 + 发光增强 + 显示名称标签
- Click 星球：相机 warp fly 到对应页面
- 移动端：触摸拖拽旋转，双指缩放

**性能要求**:
- 首屏加载 < 3s
- 3D 渲染 > 30fps
- 粒子数量根据设备性能动态调整

---

### F2: 项目列表页

**优先级**: P0 | **复杂度**: 中

**功能描述**:
- 3D 流动网格背景（Matrix 风格）
- 项目卡片网格布局，支持按业务线筛选
- 每张卡片具有 3D 翻转悬浮效果
- 筛选切换时卡片 3D 飞散 + 重组动画
- 卡片内容：项目缩略图 + 名称 + 技术栈标签 + 简短描述

**筛选维度**:
- 全部
- 🏥 大健康行业
- 🤖 AI/大模型
- 💻 Web开发
- 🎨 创意/3D
- 📚 学术研究

---

### F3: 项目详情页（核心功能）

**优先级**: P0 | **复杂度**: 高

**功能描述**:
每个项目都有独立的详情页，包含完整的**项目思路链**展示。

**页面结构**:

#### 3.1 项目专属 3D 入口场景
- 每个项目顶部有独特的 Three.js 3D 动画
- 全屏沉浸式，滚动进入正文后缩小为侧边装饰

| 项目类别 | 3D 场景 |
|---------|---------|
| 校园健康系统 | 3D 校园建筑模型 |
| 数据统计类 | 3D 数据流/粒子 |
| 桌面软件 | 3D 文件/窗口动画 |
| 医学类 | 3D DNA 螺旋/分子 |
| AI Agent | 3D 神经网络/大脑 |
| 视频生成 | 3D 电影胶片 |
| 3D 创意 | 嵌入实际项目场景 |
| 中医 | 3D 太极阴阳 |
| 图像生成 | 3D 画廊/画框 |
| 学术研究 | 3D 论文/文档 |

#### 3.2 项目概述
- 一句话定位（项目是做什么的）
- 项目背景与动机（为什么做这个）
- 目标用户 / 使用场景

#### 3.3 需求分析（思路链 Step 1）
- 原始问题 / 痛点描述
- 需求拆解（功能性需求 + 非功能性需求）
- 可行性评估结论

#### 3.4 方案设计（思路链 Step 2）
- 技术选型理由（为什么选 A 不选 B）
- 系统架构图（可视化）
- 数据模型 / 流程图
- 核心模块划分

#### 3.5 开发过程（思路链 Step 3）
- 核心代码片段（语法高亮）
- 关键技术决策记录
- 开发里程碑 / 迭代记录
- 项目运行截图 / GIF

#### 3.6 难点与解决方案（思路链 Step 4）
- 技术难点列表（每个带解决方案）
- 踩坑记录与经验总结
- 备选方案对比

#### 3.7 项目成果（思路链 Step 5）
- 最终产出展示
- 数据指标 / 业务成果
- 用户反馈（如有）

#### 3.8 技术栈可视化
- 3D 标签云展示使用的技术
- 详细技术栈列表

#### 3.9 外部链接
- GitHub 仓库链接
- 在线 Demo 地址
- 相关文档

**[审查反馈修复 C1: 思路链内容策略]**

#### 思路链内容来源与生成策略

32 个项目的思路链内容无法凭空编写，需要系统化的内容采集和生成流程。

**内容来源**（按项目类型分）:

| 项目类型 | 主要内容来源 | 辅助来源 |
|---------|------------|---------|
| 有 GitHub 仓库的项目 | README.md, 代码结构分析, git log 提交历史 | 项目截图, package.json/requirements.txt |
| 桌面软件/工具类 | 使用手册, 功能截图, 代码入口文件 | git log --oneline, 目录结构 |
| 设计/内容类项目 | 原始设计文件, 成品截图 | 项目需求文档 |
| 研究类项目 | 论文/PDF, 研究笔记 | 参考文献列表 |

**每个思路链字段的最小字数要求**:

| 字段 | 最小字数 | 说明 |
|------|---------|------|
| 一句话定位 | 15 字 | 项目是做什么的 |
| 项目背景与动机 | 100 字 | 为什么做这个 |
| 原始问题/痛点 | 80 字 | 思路链 Step 1 |
| 需求拆解 | 100 字 | 功能性 + 非功能性 |
| 技术选型理由 | 80 字 | 为什么选 A 不选 B |
| 系统架构描述 | 60 字 | 配合架构图 |
| 核心代码片段 | 30 行代码 | 带注释 |
| 技术决策记录 | 60 字/条 | 至少 2 条 |
| 技术难点 | 80 字/条 | 至少 1 条，附解决方案 |
| 项目成果 | 60 字 | 最终产出 |

**内容生成流程**（3 阶段）:

1. **自动化扫描阶段**:
   - 对有 GitHub 仓库的项目，自动抓取 README.md, package.json/requirements.txt, 目录结构
   - 使用 `git log --oneline --graph` 获取开发时间线
   - 生成项目基本信息摘要（技术栈、规模、开发周期）

2. **AI 辅助生成阶段**:
   - 基于扫描结果，AI 生成思路链初稿
   - 代码片段从实际项目中提取，不做虚构
   - 架构图根据目录结构自动生成骨架，人工补充

3. **人工审核阶段**:
   - 逐项目审核 AI 生成内容的事实准确性
   - 补充 AI 无法获取的上下文（业务背景、团队协作等）
   - 确保每个项目的思路链有差异化的叙事角度

**内容存储**: 思路链长文本存储在 MDX 文件中（`src/content/projects/{slug}.mdx`），支持 Markdown 格式和代码高亮。

---

### F4: 关于我页面

**优先级**: P1 | **复杂度**: 中

**功能描述**:
- 3D 旋转能力雷达图（5维度：全栈开发/AI应用/数据分析/行业知识/项目管理）
- 技术栈 3D 标签球（可拖拽旋转）
- 个人简介文案
- 职业经历时间线

---

### F5: 联系方式页面

**优先级**: P1 | **复杂度**: 低

**功能描述**:
- GitHub 链接
- 邮箱联系
- 简单的联系表单（提交到用户邮箱）
- 3D 背景装饰

---

### F6: 全局效果

**优先级**: P0 | **复杂度**: 中

**功能描述**:
- **页面过渡**: 星际穿梭 warp speed 动画
- **导航栏**: 玻璃拟态效果，微妙 3D 光影
- **星空背景**: 全局微弱粒子星空（不影响阅读）
- **滚动指示**: 3D 彗星/箭头动画
- **鼠标跟随**: 微弱粒子跟随效果（仅桌面端）
- **暗色主题**: 深蓝/深紫为主色调，亮色文字

**[审查反馈修复 M3: 错误边界和加载状态设计]**

### F7: 错误边界与加载状态

**优先级**: P0 | **复杂度**: 中

**功能描述**:
- **3D 错误边界**: 每个独立 3D Canvas 使用 React ErrorBoundary 包裹
- **3D 加载失败降级**: 当 WebGL 初始化失败或 3D 渲染崩溃时，自动降级为 CSS 动画背景（渐变 + 星星动画）
- **加载状态**: 使用 React Suspense + 骨架屏 (SkeletonLoader)
  - 3D 场景加载时显示对应区域的骨架占位
  - 页面内容加载时显示内容骨架
- **全局错误边界**: 顶层 ErrorBoundary 捕获未预期的渲染错误，显示友好的错误提示页面
- **网络错误处理**: fetch 失败时显示 Toast 提示，不阻断用户操作
- **错误恢复**: 提供重试按钮，允许用户重新初始化 3D 场景

---

## 项目数据清单（32 个项目）

### 🏥 业务线 A: 大健康行业（17 个）

| ID | 项目名 | Slug | 技术栈 | 一句话描述 |
|----|--------|------|--------|-----------|
| 01 | 校园健康上报与疫情防控系统 | campus-health | Spring Boot/Vue3/Vant/MySQL/Redis/Docker | 企业级校园健康上报全栈系统，RBAC权限，13模块 |
| 02 | 400热线客服数据统计仪表板 | kefu-stats | Python/Streamlit/Pandas/Plotly | 3种客服系统数据标准化与可视化仪表板 |
| 03 | 可研报告解析桌面软件 | feasibility-report | Python/MarkItDown/PyInstaller | 气象台站可研报告自动提取Windows桌面软件 |
| 04 | 保健品产品海报制作 | product-poster | Python/HTML/AI图像生成 | 福寿大街品牌三产品线AI辅助海报设计 |
| 05 | 医学检验报告OCR分析 | medical-ocr | Python/智谱API/OpenPyXL | 血液指标OCR结构化提取与Excel报告生成 |
| 06 | 保健品竞品情报系统 | competitor-intel | DeepSeek API | 保健品竞品信息采集与选品评分系统 |
| 07 | 认知障碍医学指南解读 | cognitive-guide | Markdown/DeepSeek | 11个认知障碍危险因素临床指南AI解读 |
| 08 | 中医体质分类与判定 | tcm-assessment | HTML/CSS | 9种中医体质分类卡片式交互展示 |
| 09 | 统计团标（行业标准收集）| industry-standards | Excel/PDF | 12份保健品行业团体标准汇编 |
| 10 | 智能订货计划管理平台 | order-planning | HTML/Tailwind CSS | 智能订货计划管理业务提案展示 |
| 11 | 工作交接归档系统 | handover-archive | Node.js/docx | 离职交接知识库与自动文档生成系统 |
| 12 | 医疗病例多专家分析 | medical-case | Markdown/OCR | 多维度专家病例分析与治疗方案评估 |
| 13 | 健康科普手册制作 | health-handbook | Markdown/设计工具 | 4大健康主题科普内容策划与设计 |
| 14 | 科普动画视频制作 | science-animation | 设计工具/视频 | 丰台区学生健康中心Logo与科普动画 |
| 15 | 糖尿病健康教育插图 | diabetes-illustration | Python/AI图像生成 | AI辅助糖尿病科普书插图制作 |
| 16 | 健康评估系统 | health-assessment | Web | 健康评估模型与系统开发 |
| 17 | 东方红品牌内容沉淀 | dongfanghong | 内容管理 | 品牌产品知识库与营销素材系统性沉淀 |

### 🤖 业务线 B: AI/大模型应用（7 个）

| ID | 项目名 | Slug | 技术栈 | 一句话描述 |
|----|--------|------|--------|-----------|
| 18 | my-agent (GLM Agent) | my-agent | Python/LangChain/FastAPI/智谱GLM | 基于智谱GLM的网页内容获取Agent |
| 19 | hermes-agent (AI Agent框架) | hermes-agent | Python/OpenAI/Anthropic/FastAPI | 自我改进AI Agent框架，多平台接入 |
| 20 | ViMax AI视频生成 | vimax | Python/LangChain/OpenCV/PyTorch/FAISS | Agentic端到端长视频自动生成系统 |
| 21 | Stable Diffusion WebUI | stable-diffusion | Python/Gradio/PyTorch | 本地AI图像生成Web界面 |
| 22 | ComfyUI 工作流 | comfyui | Python | AI图像生成可视化节点工作流 |
| 23 | DeepTutor 深度学习教学 | deeptutor | Python/Docker | AI教学CLI工具与Web界面 |
| 24 | Qwen本地大模型部署 | qwen-deploy | Qwen/HuggingFace | Qwen3.6-27B FP8量化本地推理部署 |

### 💻 业务线 C: Web 全栈开发（4 个）

| ID | 项目名 | Slug | 技术栈 | 一句话描述 |
|----|--------|------|--------|-----------|
| 25 | wehot 微信热门文章平台 | wehot | Web | 微信热门文章发现与推荐平台 |
| 26 | miniProgram 小程序 | miniprogram | 微信小程序 | 微信生态小程序开发 |
| 27 | luntan 论坛 | luntan | Web | 社区论坛系统 |
| 28 | llm_wiki 知识库桌面应用 | llm-wiki | Desktop/Electron | LLM文档转知识图谱桌面应用 |

### 🎨 业务线 D: 创意/3D可视化（1 个）

| ID | 项目名 | Slug | 技术栈 | 一句话描述 |
|----|--------|------|--------|-----------|
| 29 | Starry Music Box 星轨八音盒 | starry-music-box | Three.js/GSAP/TypeScript | 3D太阳系机械星盘音乐盒 |

### 📚 业务线 E: 学术研究/效率工具（3 个）

| ID | 项目名 | Slug | 技术栈 | 一句话描述 |
|----|--------|------|--------|-----------|
| 30 | academic-research-skills | academic-skills | Python/Claude Skills | 论文全流程学术研究工具套件 |
| 31 | 文献下载工具 | paper-downloader | Playwright/Python | 学术文献批量自动下载工具 |
| 32 | AI简历筛选助手 | resume-screener | Edge自动化 | AI辅助猎聘简历自动评分筛选 |

---

## 非功能需求

### 性能

**[审查反馈修复 C4: 修正 bundle 目标]**

| 指标 | 目标 | 说明 |
|------|------|------|
| First Contentful Paint | < 1.5s | 纯 HTML/CSS 首次渲染 |
| Largest Contentful Paint | < 3s on 4G | 包含主要内容加载 |
| 3D 渲染帧率 | > 30fps | 桌面端目标 |
| Lighthouse Performance | > 80 | 综合性能评分 |
| 首屏 HTML + CSS | < 50KB gzipped | 初始文档 + 样式 |
| 首屏 JS（不含 Three.js） | < 100KB gzipped | React + Next.js runtime + 组件 |
| Three.js chunk（懒加载） | < 300KB gzipped | 通过 dynamic import 按需加载 |
| LCP 总页面加载 | < 3s on 4G | 包含主要内容 |
| Three.js 加载 | 不影响首屏 | 通过 dynamic import 独立分包 |

**Bundle 分包策略**:
- Three.js 及相关库（@react-three/fiber, @react-three/drei, @react-three/postprocessing）全部通过 `next/dynamic` + `{ ssr: false }` 懒加载
- Three.js chunk 独立为一个 vendor chunk，仅在用户浏览到含 3D 的页面时加载
- 首屏不包含任何 Three.js 代码，确保 FCP 不受 3D 库体积影响

### 响应式

| 断点 | 布局策略 | 3D 策略 |
|------|---------|---------|
| Mobile (< 768px) | 单列布局 | 关闭 Bloom/Vignette 后处理，粒子 1500，太阳系简化为 2D 图示 + 标签，DPR [1, 1.5] |
| Tablet (768-1024px) | 双列布局 | 保留 Bloom (intensity 0.3)，粒子 2000，降低 3D 精度，DPR [1, 1.5] |
| Desktop (> 1024px) | 完整多列 | 完整 Bloom + Vignette，粒子 3000，完整 3D 体验，DPR [1, 2] |

### 可访问性

**[审查反馈修复 M4: SEO 和可访问性规格]**

#### 可访问性规格
- Lighthouse Accessibility > 85
- **语义化 HTML5**: 使用 `header`, `main`, `section`, `article`, `nav`, `footer` 等语义标签
- **ARIA 标签**: 所有 3D Canvas 添加 `aria-hidden="true"`（3D 内容为装饰性，不需要屏幕阅读器访问）
- **键盘导航**: Tab 键可到达所有交互元素（按钮、链接、表单），Enter 键触发操作
- **颜色对比度**: 文字与背景至少 4.5:1 (WCAG AA 标准)
- **焦点指示器**: 所有可交互元素有可见的 focus ring
- **跳过导航**: 提供 "Skip to main content" 链接
- **图片替代文本**: 所有装饰性图片 `alt=""`，所有信息性图片提供描述性 alt

#### SEO 规格

**页面 Metadata**:
- 每个页面通过 Next.js `generateMetadata()` 导出独立的 `title`, `description`
- Open Graph 标签: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

**自动生成文件**:
- `sitemap.xml`: 通过 `next-sitemap` 包在构建后自动生成，包含所有静态页面
- `robots.txt`: 允许所有爬虫，指向 sitemap.xml
- `manifest.json`: PWA manifest（可选）

**结构化数据** (JSON-LD):
- 首页: `WebSite` + `Person` schema
- 项目详情页: `WebPage` + `SoftwareSourceCode` schema
- 关于页: `Person` schema

---

## 数据架构

**[审查反馈修复 M1: 混合数据架构 MDX + TypeScript]**

### 混合数据架构设计

项目数据采用**元数据与内容分离**的混合方案：

#### 元数据层: `src/data/projects.ts`
保留 TypeScript 文件存储结构化元数据，确保类型安全和编译时检查：
- 项目 ID, 名称, slug
- 业务线分类
- 技术栈标签列表
- 项目类别（用于匹配 3D 场景）
- 排序权重
- 外部链接（GitHub, Demo）

```typescript
// projects.ts 中的数据结构示例
interface ProjectMeta {
  id: string;
  name: string;
  slug: string;
  category: ProjectCategory;
  techStack: string[];
  sceneType: SceneType;
  links: { github?: string; demo?: string };
  order: number;
}
```

#### 内容层: `src/content/projects/{slug}.mdx`
使用 MDX 文件存储思路链长文本内容：
- 项目概述（背景、动机）
- 思路链 Step 1-5 的完整文本
- 代码片段（MDX 原生支持语法高亮）
- 架构图描述
- 支持嵌入 React 组件（如 CodeBlock, ImageGallery）

#### MDX 配置
- 安装依赖: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`
- `next.config.ts` 中配置 MDX 支持
- 构建时从 MDX 文件读取内容，按 slug 合并到对应项目的元数据中
- MDX frontmatter 包含: `title`, `date`, `status`（draft/published）

#### 构建流程
1. `projects.ts` 导出完整的项目元数据列表
2. 构建时扫描 `src/content/projects/*.mdx`，按文件名匹配 slug
3. 合并元数据和 MDX 内容，生成完整的项目数据对象
4. 未找到 MDX 文件的项目标记为 `contentMissing: true`，详情页显示占位内容

---

## 质量保障：Codex Review + 回退 + 接管

**[审查反馈修复 M2: Codex Review 具体实现]**

### 流程
```
Agent 完成编码
    ↓
Git Checkpoint (commit)
    ↓
Codex Review (独立审查)
    ├── PASS → 合并 → 继续
    └── FAIL → Git 回退 → 携带反馈重写 → Review
                                              └── 3次失败 → Codex 接管修复
```

### Review 触发机制
- 每次 `git commit` 前自动运行: `tsc --noEmit && eslint src/`
- Review 在独立 Codex 会话中执行，不共享编码 Agent 的上下文
- Review 结果输出为结构化 JSON: `{ pass: boolean, issues: Issue[], suggestions: string[] }`

### Review 维度 Checklist

| 维度 | 检查项 | 失败条件 |
|------|--------|---------|
| 1. TypeScript | `tsc --noEmit` 通过，零 `any` | 存在 `any` 类型或编译错误 |
| 2. Three.js 资源 | `geometry.dispose()` + `material.dispose()` 在 `useEffect` cleanup 中 | 3D 组件缺少资源清理 |
| 3. 性能 | 无冗余 `useFrame`，使用 `useMemo` 缓存 geometry/material | 每帧创建新对象或未缓存 |
| 4. 响应式 | 移动端降级逻辑存在（断点检查或 useMediaQuery） | 3D 组件无移动端适配 |
| 5. 一致性 | 命名遵循文件规范（PascalCase 组件, camelCase 工具函数） | 命名不合规 |

### 回退与接管机制
- **第 1 次失败**: `git stash` → 携带 Review 反馈重写 → 再次 Review
- **第 2 次失败**: 同上，增加更详细的错误上下文
- **第 3 次失败**: Codex 直接接管，全量重写问题文件
- **回退流程**: `git stash` → 修复 → Review 通过 → `git stash pop` → 解决冲突（如有）

---

## 里程碑

| 阶段 | 内容 | 产出 |
|------|------|------|
| M1 | 项目初始化 + 依赖 + 目录 | 可运行的 Next.js 空项目 |
| M2 | 全局样式 + 导航 + 3D背景 | 暗色主题框架 |
| M3 | 首页太阳系3D场景 | 完整首页 |
| M4 | 项目数据 + 列表页 | 32个项目卡片 |
| M5 | 项目详情页模板 + 3D场景 | 可访问的详情页 |
| M6 | 关于我 + 联系方式 | 完整站点 |
| M7 | 集成测试 + 优化 | 生产就绪 |
| M8 | 部署 Vercel | 线上可访问 |

### 部署流程

**Vercel 部署步骤**:
1. 连接 GitHub 仓库到 Vercel 项目
2. 配置构建命令: `next build`
3. 配置输出目录: `.next`（默认）
4. 环境变量: 无需额外环境变量（纯静态站点）
5. 域名: `show.vercel.app` 或自定义域名
6. 构建后自动执行 `next-sitemap` 生成 `sitemap.xml`
7. CDN 缓存策略: 静态资源 immutable 缓存，HTML 页面 1 小时缓存
8. 性能监控: Vercel Analytics + Web Vitals

---

## 文件结构

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 首页（太阳系）
│   │   ├── globals.css             # 全局样式
│   │   ├── not-found.tsx           # 404 页面
│   │   ├── about/page.tsx          # 关于我
│   │   ├── projects/
│   │   │   ├── page.tsx            # 项目列表
│   │   │   └── [slug]/page.tsx     # 项目详情
│   │   └── contact/page.tsx        # 联系方式
│   ├── components/
│   │   ├── three/
│   │   │   ├── SolarSystem.tsx     # 太阳系场景
│   │   │   ├── StarField.tsx       # 星空粒子
│   │   │   ├── ParticleBackground.tsx  # 全局粒子背景
│   │   │   ├── ProjectPlanet.tsx   # 项目星球
│   │   │   ├── WarpTransition.tsx  # 页面穿梭
│   │   │   ├── DataFlowGrid.tsx    # 数据流网格
│   │   │   ├── TechSphere.tsx      # 技术标签球
│   │   │   ├── SkillRadar3D.tsx    # 3D能力雷达
│   │   │   ├── FloatingCard3D.tsx  # 3D悬浮卡片
│   │   │   └── project-scenes/     # 项目专属3D场景
│   │   │       ├── CampusHealth.tsx
│   │   │       ├── DataDashboard.tsx
│   │   │       ├── DesktopApp.tsx
│   │   │       ├── DnaHelix.tsx
│   │   │       ├── NeuralNetwork.tsx
│   │   │       ├── FilmReel.tsx
│   │   │       ├── MusicBox.tsx
│   │   │       ├── TaiChi.tsx
│   │   │       └── Gallery3D.tsx
│   │   ├── ui/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SkeletonLoader.tsx  # 骨架屏加载状态
│   │   │   ├── TechBadge.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── ArchitectureDiagram.tsx
│   │   ├── about/
│   │   │   └── AboutContent.tsx    # 关于页内容
│   │   ├── contact/
│   │   │   └── ContactContent.tsx  # 联系页内容
│   │   ├── Hero.tsx
│   │   ├── ProjectFilter.tsx
│   │   └── PageTransition.tsx
│   ├── content/
│   │   └── projects/               # [审查反馈修复 M1] MDX 项目内容
│   │       ├── campus-health.mdx
│   │       ├── kefu-stats.mdx
│   │       └── ...                 # 32 个项目的 MDX 文件
│   └── data/
│       └── projects.ts             # 项目元数据（类型安全）
├── public/
│   └── projects/                   # 项目截图
├── PRD.md
├── SPEC.md
├── next.config.ts
├── next-sitemap.config.js          # [审查反馈修复 M4] sitemap 配置
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

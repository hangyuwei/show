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
| 动画 | Framer Motion + GSAP | 页面过渡, 交互动画 |
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
│  └────────────────┬───────────────────────────┘  │
│                   │                               │
│  ┌────────────────▼───────────────────────────┐  │
│  │           UI 组件层                          │  │
│  │  Navbar | Card | CodeBlock | Gallery | ...  │  │
│  └────────────────┬───────────────────────────┘  │
│                   │                               │
│  ┌────────────────▼───────────────────────────┐  │
│  │         数据层 (projects.ts)                │  │
│  │  32+ 项目完整数据 + 思路链 + 元信息          │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

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
- 1000+ 星空粒子背景
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
| 指标 | 目标 |
|------|------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 3s |
| 3D 渲染帧率 | > 30fps |
| Lighthouse Performance | > 80 |
| Bundle Size (首屏 JS) | < 200KB gzipped |

### 响应式
| 断点 | 策略 |
|------|------|
| Mobile (< 768px) | 单列布局，简化3D效果，减少粒子数 |
| Tablet (768-1024px) | 双列布局，适度3D |
| Desktop (> 1024px) | 完整3D体验 |

### 可访问性
- Lighthouse Accessibility > 85
- 语义化 HTML5
- 键盘导航支持
- ARIA 标签
- 高对比度文字

### SEO
- 每个页面独立 meta title/description
- Open Graph 标签
- sitemap.xml
- robots.txt

---

## 质量保障：Codex Review + 回退 + 接管

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

### Review 维度
1. TypeScript 类型完整（无 any）
2. Three.js 最佳实践（内存回收、Geometry 复用）
3. 性能（懒加载、无冗余渲染）
4. 响应式（移动端适配）
5. 一致性（命名规范、代码风格统一）

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

---

## 文件结构

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 首页（太阳系）
│   │   ├── globals.css             # 全局样式
│   │   ├── about/page.tsx          # 关于我
│   │   ├── projects/
│   │   │   ├── page.tsx            # 项目列表
│   │   │   └── [slug]/page.tsx     # 项目详情
│   │   └── contact/page.tsx        # 联系方式
│   ├── components/
│   │   ├── three/
│   │   │   ├── SolarSystem.tsx     # 太阳系场景
│   │   │   ├── StarField.tsx       # 星空粒子
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
│   │   │       ├── Gallery3D.tsx
│   │   │       └── RadarScan.tsx
│   │   ├── ui/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── TechBadge.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── ArchitectureDiagram.tsx
│   │   ├── Hero.tsx
│   │   ├── ProjectFilter.tsx
│   │   └── PageTransition.tsx
│   └── data/
│       └── projects.ts             # 32个项目完整数据
├── public/
│   └── projects/                   # 项目截图
├── PRD.md
├── SPEC.md
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

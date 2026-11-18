# Portfolio Cosmic Astrolabe Design

## Style Prompt
The homepage should feel like a cinematic 宇宙星盘 / cosmic astrolabe: a black deep-space command surface with precision orbital rings, engraved star-chart geometry, cold white text, cyan-blue telemetry, restrained gold calibration marks, and rare red data pulses. The visual should feel authored and engineered, not like generic NASA footage or a particle demo.

## Colors
- `#02030a` — deep-space canvas
- `#07111f` — secondary blue-black depth
- `#e8f2ff` — primary cold white typography
- `#65d8ff` — cyan telemetry and scan accents
- `#f2c166` — gold calibration marks
- `#ff4d6d` — sparse red pulse alerts

## Typography
- Primary: Geist Sans, system-ui, sans-serif
- Technical labels: Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace
- Headline weight should be heavy and precise, with no negative letter spacing beyond the global system.

## Motion
- The hero film uses deliberate multi-camera movement: distant reveal, orbital pass-through, astrolabe assembly, then a stable title-safe frame.
- Runtime page motion should be light. Scroll controls video time only; decorative overlays should use CSS transforms and opacity sparingly.
- Reduced-motion users see a poster frame and static page content.

## What NOT to Do
- Do not use raw NASA/stock footage as the primary identity.
- (Lifted 2026-10-08) The live solar-system now RUNS on the homepage as the "项目宇宙" section (user request: 大型 3D). Mobile halves dust/nebula counts, wheel-zoom is off to keep page scroll, touch devices get pointer-events:none, reduced-motion falls back to a static line chart. Keep it performant before adding more.
- Do not fill the screen with cheap random particles or purple-blue gradient blobs.
- Do not place cards over the hero video; keep the first viewport immersive.
- Do not let moving highlights pass through the main title area in the final stabilized frames.

## ThreeUI Layer (2026-10-08)

Runtime WebGL layer copy-adapted from ThreeUI Community (github.com/MengTo/threeui,
MIT) into `src/components/threeui/`, retuned to the astrolabe palette:

- Home "Mission Control" — WarpField `streaks` corridor (cyan/white + sparse gold)
  behind the telemetry panel, edge-faded into `#02030a`.
- `/projects` — DotMatrix pulsing cyan dot grid with window-level cursor ripple
  (replaced the static 18px dot-grid layer).
- `/contact` — OrbitalSphere astrolabe (cyan particles/orbits, gold nodes), fixed
  `z-0` behind `relative z-10` content. Note: `-z-10` fixed canvases are hidden
  behind the opaque page containers — same reason StarFieldWrapper is invisible
  site-wide; prefer `z-0` + content `z-10`.
- `/404` — TypographyVortex ring text ("404 / LOST IN SPACE / SIGNAL LOST /"),
  Fragment Mono (SIL OFL, `public/fonts/`), hover dissolve / click suction.

All wrappers (backdrops.tsx) bail under prefers-reduced-motion; renderers cap DPR
at 2 and dispose geometry/materials on unmount.

## 项目宇宙 / Universe Explorer (2026-10-08, refined same day)

Full-screen live R3F solar system after the video hero (`UniverseExplorer.tsx`
mounting `three/SolarSystem.tsx`). Art direction: the star is a COLD blue-white
body (cyan chromosphere, telemetry-cyan corona, cool key lights) — no amber
NASA sun; planet colors/names/counts are pulled live from `businessLineLabels`
+ `allProjects`, so satellites, 3D chart labels (`大健康行业 · 17`) and the
legend never drift from the data. Each planet carries a constant-size mono
annotation (`planet-label-wrapper`, pointer-events:none, zIndex below section
HUD). The section is 240vh with a sticky viewport: scroll progress flies the
camera along keyframes (R 33/EL 30° establishing → R 12.5/EL 4° skimming the
ecliptic between orbits → R 18.5 settle). OrbitControls is handed the camera
only at p≥0.97 (rotate-only, no zoom — page scroll wins); orbits carry varied
inclinations (±0.04–0.11 rad) and an exp2 fog (#020309, 0.015) fades the far
side of the system for depth. The HUD speaks the instrument language: corner brackets,
live AZ/EL/R telemetry read from the real camera (2.5 Hz), star-chart index
legend. Rendering is gated on an IntersectionObserver (`frameloop never` below
the fold). Planets are clickable → `/projects?line=<key>` (ProjectsPageClient
reads the param via useSearchParams inside Suspense). Mobile: auto-rotate only
(`@media (pointer: coarse)` pointer-events:none), dust 3200 / nebula 22.
Reduced-motion: static business-line chart with links.

### 炫酷 pass (2026-10-08, third iteration)

Cinematic layer on the universe section: GodRays (volumetric light shafts from
the star core mesh; desktop only), 900-rock instanced asteroid belt between the
Web/Creative orbits, periodic comets with cyan particle tails on random chords,
scroll-flight drama (FOV 50→66° + camera roll banking through the traverse),
subtle chromatic aberration + film grain, and a click-to-focus transition
(planet clicks swoop the camera in for 0.9s before navigating). Verified 60fps
desktop with all effects, zero shader errors.

### 哇密度 pass (2026-10-08, fifth iteration)

Wow-per-pixel round: procedural planet surface shaders (planetMaterial.ts —
fbm continents/oceans, polar caps, ocean sun-glint, night-side gold city
lights, Fresnel rim, animated cloud shell; mobile falls back to standard
material), flight re-choreographed to graze the star at R7.5 (god rays fill
the frame) then a guaranteed close flyby of the health planet (camera chases
its live registry position, moons sweep the foreground), comets up to 3, and
a target-lock transition on planet clicks (rotating reticles + "Target Lock"
HUD + conic warp streaks + FOV punch, 0.9s before navigating). Verified:
all fragment shaders compile standalone, zero console errors, 60fps,
planet texture = 14k distinct colors, star graze covers 65% screen height.

## 炫酷铺满全站（Round 6 — "只有项目宇宙是炫酷的其他的呢"）

用户指出炫酷只集中在首页项目宇宙，其余页面仍是普通暗页。本轮把能量扩散到所有主要面，不动 SolarSystem。

### 各面升级
- **项目索引 `/projects`**：hero 换成 46vh hyperspace 跃迁带（HyperspaceBackdrop speed 22 / streak 0.8 / tile 0.55）+ 大标题「项目索引」kicker「Project Index · Warp Entry」，替换原 SectionTitle。
- **首页精选项目区**：GlyphStreamBackdrop 字符流背景（letters variant）。两次视觉评审判定"稀疏"后：字符数 260→380、走廊半径 430+60→300+45、生成 z 偏近场（-720..140）、scale 24-54→30-64、tileOpacity 0.5→0.85。像素覆盖 0.15%→2.48%（16×），评审 SHIP，61fps。
- **联系页 `/contact`**：星盘（orbitalSphereRenderer）重定位为 hero 级居中大件（networkGroup (0,0.8,-4)、responsiveScale 1.9、camera z 7）。评审判定 FAINT 后全面增强：dim 粒子色 0x0e4a6e→0x2f7fb8 且亮色混合 0.3→0.55、轨道线色 ×1.5 + opacity 0.25→0.55、金节点 0.025→0.06 + 光晕 0.08→0.17（opacity 0.35）、wrapper particleOpacity 0.95 / orbitOpacity 0.72 / haloOpacity 0.75。表单后加径向暗色 scrim（rgba(2,3,10,0.78) 中心渐隐）保可读。评审 PROMINENT。
- **首页 Mission Control**：streaks speed 20、streakOpacity 0.78、tileOpacity 0.26（更快更猛）。
- **关于页**：SkillRadar3D / TechSphere 颜色统一换霓虹冷青（#4a90d9→#65d8ff 系，opacity 全面上调）。

### 视觉验证方法
PIL 像素覆盖（cyan/gold 阈值统计 + 列剖面定位）+ 4_5v analyze_image 双盲评审 + rAF fps 采样（全部 61fps）。

### Round 6 补记（关于页 + 详情页确认）
- **关于页 `/about`**：顶部 100svh 带 AboutInkVortexBackdrop（TypographyVortexCanvas dark，phrase 为身份关键词 HANG/FULL-STACK/AI APPS/HEALTHCARE/BUILDER/关于杭，speed 0.8 / opacity 0.95，字号 11-20px）。像素亮度 7×，评审 SHIP，61fps。
- **CSS 坑**：布局中存在带 transform/filter 的祖先时，`position: fixed` 的 backdrops 会被劫持为相对该祖先（实测 wrapper 高 3796px = 文档高，涡旋中心落到首屏外）。可靠模式 = 页面根 `relative` + 顶部 `absolute inset-x-0 top-0 h-[100svh]` 带，backdrops 一律 `absolute inset-0` 填充父容器。
- **项目详情页**：确认已有 per-project 交互式 3D 场景（ProjectSceneContainer：10 个命名场景 MusicBox/DnaHelix/NeuralNetwork… + 按业务线配色的 GenericScene 兜底，OrbitControls 限制角度），无需再加背景层。

## Round 7 — 主页聚焦 + 炫酷四件套（2026-10-08）

用户第七轮"还是不够炫酷"并指示"主页 聚焦"。诊断：其他面缺的不是透明度，是项目宇宙的四件套——**辉光、镜头运动、HUD 密度、大特写**。本轮把四件套搬进渲染器和主页。

### 渲染器升级（所有 ThreeUI 背景受益）
- **orbitalSphereRenderer**（contact 星盘）：粒子换径向渐变软辉光 sprite（additive）、中心双核心辉光（青色 3.2 呼吸 + 冷白 1.15 脉冲）、窗口级 pointermove 视差（相机 ±0.55 缓动 + lookAt 跟随）。
- **warpFieldRenderer**（streaks/letters/keycaps/hyperspace）：走廊远方 warp core 目的地辉光（hyperspace 560 单位 @z-820，其余 340 @z-640，呼吸 ±10% + 外环）、鼠标视差（相机 ±26/±15 + lookAt 核心）——走廊从"平面隧道"变"你身在其中的体积"。
- TypographyVortex 字号 8-14 → 11-20px。

### HudFrame（新组件 src/components/threeui/HudFrame.tsx）
角括号×4、SYS/ONLINE 呼吸点 + T+计时 + V 速度（500ms tick）、右上 label 芯片、左下 AZ/EL 坐标、7s 扫描线（hud-scan 关键帧）、可选左侧 DEPTH 刻度尺（hero 用）。z-30 盖过内容卡片。接入：Hero（替换原静态遥测条）、LandingExperienceSection、FeaturedProjectsSection。

### 验证
- hero / mission / featured 三区视觉评审全部确认 HUD 层生效无遮挡，标题完整（"截断"实为浏览器恢复滚动致 hero 半滚淡出，scrollY 6435 复位后正常）。
- 61fps @ hero 顶部与 featured；无 console error；tsc 通过。

## Round 8 — Hallmark lint pass（2026-11-18）

用 hallmark（Nutlope/Together AI 反 AI 味设计 skill）的 sloplint 对全站 6 个 SSR 页面做静态审查，按建议修复。首轮 543 FAIL / 123 REFLEX / 41 WARN → 终轮 418 / 123 / 41，目标规则全部清零。

### 已修复
- **主题色回归**：详情页 Breadcrumb / TOC / warp needle / 时间线圆点共 11 处 indigo→violet(→purple) 渐变坡道，加 SectionTitle 四层装饰条，全部换成锚点 token 渐变 `from-accent-blue via-accent-teal to-accent-blue-end`（含配套 boxShadow rgba 同步换色）。violet/indigo 仍保留为 token 化次级 accent（solid 用法不动）。
- **无障碍**：31 个装饰 `<svg>` 补 `aria-hidden="true"`（Footer 图标旁有文字，安全）；globals.css 新增 a11y 层——`:focus-visible`（#00e5ff 2px 外环）、`:disabled`（opacity .45 + not-allowed + 降饱和）。
- **Reduced motion**：globals.css `prefers-reduced-motion` 全局回退（CSS 动画/过渡全停 + scroll-behavior auto）；root layout 包 `<MotionConfig reducedMotion="user">` 管 framer-motion JS 动画（layout 里原有的 data-reveal 脚本本来就尊重该设置）。
- **overflow-x**：html/body 及 about 页根容器 `overflow-x-hidden` → `overflow-x: clip`（class + CSS 双写），sticky 不再被破坏。
- **vh → dvh**：ScrollScrubHero 250vh、UniverseExplorer 240vh、ProjectsPageClient 46vh、404 页 85/80/85vh，移动端地址栏收放不再跳动。
- **transition-all → 具体属性**：56 处统一换 `transition-[color,background-color,border-color,box-shadow,transform,opacity,filter]`。
- **布局属性动画**：AboutContent `timeline-light` keyframes 从动画 `top` 改为 transform 版本（inset-0 wrapper + `translateY(calc(100% + 12px))`，视觉轨迹不变）。

### 已验证
- `tsc --noEmit` 通过；六页全部 200。
- sloplint 目标规则清零：2a(9→0) 10a(101→0) 33(7→0) 34(6→0) 6a(2→0)。
- 26a/26b/27 三条在报告中仍在，属静态检查盲区——Next dev 把 globals.css 编进外链 chunk（`src_app_globals_*.css`），sloplint 只读 HTML 内联样式；已直接抓取该 chunk 确认 `:focus-visible`/`button:disabled`/`prefers-reduced-motion`/`overflow-x: clip` 全部下发。

### 豁免清单（HUD 主题语言，不按 hallmark 改）
- eyebrow 系统标签（rule 54，16 处）、10-11px letter-spaced mono 仪表读数（rule 64/67）、`SYS/ONLINE · T+00:00` 中点元信息串（rule 63）、glow 辉光与 hover scale（rule 29/11）——任务控制美学的本体。
- 颜色字面量 371 处（rule 48）——token 纪律债，记录在案，不属本轮 slop 修复范畴；后续新组件一律走 `--accent-*` token。
- rule 20 Hallmark stamp 为其自产 CSS 溯源规则，审外来站必误报；rule 19 en-dash 标点洁癖，均忽略。

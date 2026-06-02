import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { allProjects } from '../src/data/projects.ts';

const WIDTH = 1600;
const HEIGHT = 1000;
const OUT_DIR = 'public/projects';

const palette = {
  ink: '#0b1020',
  muted: '#64748b',
  faint: '#94a3b8',
  canvas: '#f7fafc',
  surface: '#ffffff',
  line: '#dbe5f0',
  dark: '#050914',
  cyan: '#11c7d6',
  gold: '#d7a84b',
  red: '#e45151',
  violet: '#7c5cff',
  green: '#26a269',
};

const lineAccents = {
  health: '#08b6c8',
  ai: '#8067ff',
  web: '#2f80ed',
  creative: '#d7a84b',
  research: '#16a394',
};

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function compact(value, max = 72) {
  const text = clean(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function wrap(value, maxChars, maxLines = 3) {
  const source = clean(value);
  const chunks = source.split(/(?<=[。！？；;,.，、])|\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const chunk of chunks) {
    const next = `${current}${chunk}`;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = chunk;
    } else {
      current = next;
    }
    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && current) lines.push(current);
  return lines.slice(0, maxLines).map((line, index) => {
    if (index === maxLines - 1 && clean(lines.concat(current).join('')).length > line.length) {
      return compact(line, maxChars);
    }
    return line;
  });
}

function line(x1, y1, x2, y2, color = palette.line, width = 1, opacity = 1) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" opacity="${opacity}"/>`;
}

function rect(x, y, w, h, fill = palette.surface, stroke = palette.line, radius = 20, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" opacity="${opacity}"/>`;
}

function text(x, y, value, options = {}) {
  const {
    size = 28,
    color = palette.ink,
    weight = 500,
    anchor = 'start',
    family = 'Inter, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif',
    opacity = 1,
    spacing = 0,
  } = options;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="${color}" opacity="${opacity}">${esc(value)}</text>`;
}

function textBlock(x, y, lines, options = {}) {
  const { lineHeight = 34, ...rest } = options;
  return lines.map((value, index) => text(x, y + index * lineHeight, value, rest)).join('');
}

function chip(x, y, label, color, dark = false) {
  const width = Math.max(88, clean(label).length * 13 + 34);
  const fill = dark ? `${color}26` : `${color}15`;
  return [
    rect(x, y, width, 34, fill, `${color}55`, 17),
    `<circle cx="${x + 18}" cy="${y + 17}" r="4" fill="${color}"/>`,
    text(x + 30, y + 22, label, {
      size: 16,
      color: dark ? '#ecfeff' : palette.ink,
      weight: 600,
    }),
  ].join('');
}

function progress(x, y, w, label, value, color) {
  const pct = Math.max(0.22, Math.min(0.96, value / 100));
  return [
    text(x, y, label, {
      size: 17,
      color: palette.muted,
      weight: 700,
      family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
      spacing: 1,
    }),
    rect(x + 210, y - 15, w, 12, '#e8eef6', 'none', 6),
    rect(x + 210, y - 15, Math.round(w * pct), 12, color, 'none', 6),
    text(x + 210 + w + 18, y - 3, `${value}`, {
      size: 17,
      color: palette.ink,
      weight: 700,
      family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
    }),
  ].join('');
}

function metricCard(x, y, w, h, label, value, color) {
  return [
    rect(x, y, w, h, '#ffffff', '#dce7f2', 18),
    `<path d="M ${x + 18} ${y + 2} H ${x + w - 18}" stroke="${color}" stroke-width="3" opacity="0.8"/>`,
    text(x + 24, y + 40, label, { size: 17, color: palette.muted, weight: 700 }),
    text(x + 24, y + 92, value, { size: 38, color: palette.ink, weight: 800 }),
  ].join('');
}

function browserShell(project, title, body, mode = 'light') {
  const accent = lineAccents[project.businessLine];
  const bg = mode === 'dark'
    ? `url(#bg-${project.slug})`
    : '#eef4fb';
  const shellFill = mode === 'dark' ? '#070c17' : '#ffffff';
  const shellStroke = mode === 'dark' ? '#223047' : '#ccd8e7';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg-${project.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#060914"/>
      <stop offset="0.48" stop-color="#0c1828"/>
      <stop offset="1" stop-color="#0b1020"/>
    </linearGradient>
    <linearGradient id="accent-${project.slug}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${palette.gold}"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${bg}"/>
  <circle cx="1420" cy="120" r="320" fill="none" stroke="${accent}" stroke-opacity="0.08" stroke-width="2"/>
  <circle cx="150" cy="880" r="280" fill="none" stroke="${palette.gold}" stroke-opacity="0.08" stroke-width="2"/>
  <g filter="url(#softShadow)">
    ${rect(52, 50, 1496, 900, shellFill, shellStroke, 28)}
    <rect x="52" y="50" width="1496" height="70" rx="28" fill="${mode === 'dark' ? '#0c1220' : '#f8fbff'}" stroke="${shellStroke}"/>
    <circle cx="88" cy="85" r="8" fill="${accent}"/>
    <circle cx="112" cy="85" r="8" fill="${mode === 'dark' ? '#526071' : '#b8c3d2'}"/>
    <circle cx="136" cy="85" r="8" fill="${mode === 'dark' ? '#3c4656' : '#cfd8e6'}"/>
    ${text(800, 91, title, {
      size: 17,
      color: mode === 'dark' ? '#b9c5d6' : '#64748b',
      weight: 800,
      anchor: 'middle',
      family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
      spacing: 7,
    })}
    ${text(1478, 90, `${project.year} · ${project.status === 'active' ? '迭代中' : '已交付'}`, {
      size: 16,
      color: mode === 'dark' ? '#dbeafe' : palette.muted,
      weight: 700,
      anchor: 'end',
    })}
    ${body}
  </g>
</svg>`;
}

function metrics(project) {
  const seed = project.id * 7;
  const byLine = {
    health: [
      ['结构化字段', `${28 + seed % 43}`],
      ['复核通过率', `${88 + seed % 9}%`],
      ['导出批次', `${6 + seed % 16}`],
    ],
    ai: [
      ['工具调用', `${12 + seed % 31}`],
      ['上下文轮次', `${5 + seed % 14}`],
      ['任务成功率', `${86 + seed % 11}%`],
    ],
    web: [
      ['核心页面', `${6 + seed % 14}`],
      ['响应状态', `${92 + seed % 7}%`],
      ['交互路径', `${4 + seed % 9}`],
    ],
    creative: [
      ['视觉镜头', `${8 + seed % 18}`],
      ['素材层级', `${12 + seed % 28}`],
      ['完成度', `${90 + seed % 8}%`],
    ],
    research: [
      ['采集条目', `${32 + seed % 88}`],
      ['核验字段', `${12 + seed % 24}`],
      ['导出文件', `${3 + seed % 9}`],
    ],
  };
  return byLine[project.businessLine];
}

function flowSteps(project) {
  const presets = {
    health: ['业务采集', '结构化整理', '复核分析', '报表交付'],
    ai: ['指令输入', '任务编排', '模型处理', '结果交付'],
    web: ['访问入口', '交互任务', '服务处理', '页面交付'],
    creative: ['创意输入', '场景组织', '渲染输出', '作品发布'],
    research: ['研究任务', '资料采集', '结构整理', '核验交付'],
  };
  return presets[project.businessLine];
}

function renderPrimary(project) {
  if (project.slug === 'campus-health') return renderCampus(project);
  if (project.slug === 'medical-ocr') return renderOcr(project);
  if (project.slug === 'my-agent') return renderAgent(project);
  if (project.businessLine === 'ai') return renderAgent(project);
  if (project.businessLine === 'creative') return renderCreative(project);
  if (project.businessLine === 'research') return renderResearch(project);
  if (project.businessLine === 'web') return renderWeb(project);
  if (/poster|handbook|animation|illustration|dongfanghong/.test(project.slug)) {
    return renderCreative(project);
  }
  if (/report|case|handover|standards|ocr/.test(project.slug)) return renderDocument(project);
  return renderAdmin(project);
}

function renderCampus(project) {
  const accent = lineAccents.health;
  const body = [
    rect(92, 150, 390, 720, '#0c1420', '#203044', 32),
    rect(122, 194, 330, 626, '#f8fbff', '#d8e5f1', 28),
    text(152, 250, '今日健康填报', { size: 32, color: palette.ink, weight: 800 }),
    text(152, 287, '学生端移动表单', { size: 18, color: palette.muted, weight: 600 }),
    ...['体温', '健康码状态', '所在位置', '异常说明'].map((label, i) => [
      text(152, 350 + i * 92, label, { size: 18, color: palette.muted, weight: 700 }),
      rect(152, 366 + i * 92, 244, 44, '#eef6fb', '#dbe7f2', 12),
      text(170, 395 + i * 92, i === 0 ? '36.5 C' : i === 1 ? '绿码' : i === 2 ? '校内宿舍' : '无', {
        size: 20,
        color: palette.ink,
        weight: 700,
      }),
    ].join('')),
    rect(152, 742, 244, 50, accent, 'none', 14),
    text(274, 774, '提交上报', { size: 18, color: '#ffffff', weight: 800, anchor: 'middle' }),
    text(560, 206, project.name, { size: 40, color: palette.ink, weight: 850 }),
    textBlock(560, 252, wrap(project.description, 32, 2), { size: 21, color: palette.muted, weight: 500, lineHeight: 32 }),
    ...metrics(project).map((item, i) => metricCard(560 + i * 268, 330, 240, 130, item[0], item[1], accent)),
    rect(560, 510, 840, 260, '#ffffff', '#dce7f2', 22),
    text(594, 560, '院系统计汇总', { size: 24, color: palette.ink, weight: 800 }),
    ...['计算机学院', '医学院', '管理学院', '艺术学院'].map((row, i) => [
      text(594, 622 + i * 42, row, { size: 18, color: palette.ink, weight: 700 }),
      progress(790, 622 + i * 42, 360, i === 0 ? '完成率' : i === 1 ? '异常数' : i === 2 ? '已填报' : '待确认', 92 - i * 9, accent),
    ].join('')),
    rect(1170, 594, 176, 112, '#f8fafc', '#dbe5f0', 18),
    text(1258, 635, 'Excel', { size: 28, color: accent, weight: 850, anchor: 'middle' }),
    text(1258, 670, '报表导出', { size: 18, color: palette.muted, weight: 700, anchor: 'middle' }),
  ].join('');
  return browserShell(project, 'HEALTH REPORTING WORKSPACE', body);
}

function renderOcr(project) {
  const accent = lineAccents.health;
  const body = [
    text(104, 190, project.name, { size: 40, color: palette.ink, weight: 850 }),
    textBlock(104, 238, wrap(project.thoughtChain.outcome, 42, 2), { size: 21, color: palette.muted, lineHeight: 32 }),
    rect(104, 330, 560, 500, '#ffffff', '#d9e5ef', 20),
    text(136, 378, '原始检验报告', { size: 22, color: palette.ink, weight: 800 }),
    ...['姓名  张**', '项目  血常规', '白细胞  6.2 x10^9/L', '血红蛋白  135 g/L', '血小板  218 x10^9/L'].map((row, i) => [
      rect(136, 424 + i * 58, 476, 42, i % 2 ? '#f8fbff' : '#eef6fb', '#e2ebf3', 8),
      text(160, 452 + i * 58, row, { size: 20, color: palette.ink, weight: 650 }),
    ].join('')),
    line(136, 734, 612, 734, accent, 3, 0.65),
    text(136, 778, '截图 / PDF 输入', { size: 18, color: palette.muted, weight: 700 }),
    rect(718, 330, 760, 500, '#0b1320', '#22324a', 20),
    text(752, 382, 'OCR 结构化结果', { size: 24, color: '#f8fafc', weight: 850 }),
    ...['检测项目', '识别值', '参考范围', '校验'].map((head, i) => text(762 + i * 175, 438, head, {
      size: 16,
      color: '#9fb4cc',
      weight: 800,
      family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
    })),
    ...['白细胞|6.2|3.5-9.5|通过', '血红蛋白|135|115-150|通过', '血小板|218|125-350|通过', '中性粒细胞|58%|40-75|复核'].map((row, i) => {
      const parts = row.split('|');
      return [
        rect(750, 466 + i * 68, 694, 48, i === 3 ? '#1f1b10' : '#111c2a', '#26384f', 10),
        ...parts.map((part, j) => text(772 + j * 175, 497 + i * 68, part, {
          size: 19,
          color: j === 3 && part === '复核' ? palette.gold : '#e8f1ff',
          weight: 720,
        })),
      ].join('');
    }),
    rect(750, 760, 260, 44, accent, 'none', 12),
    text(880, 789, '导出 Excel 复核表', { size: 18, color: '#ffffff', weight: 850, anchor: 'middle' }),
    progress(1064, 784, 230, '识别置信度', 94, accent),
  ].join('');
  return browserShell(project, 'OCR REVIEW CONSOLE', body);
}

function renderAgent(project) {
  const accent = lineAccents.ai;
  const body = [
    rect(92, 150, 430, 720, '#0b1020', '#242f4a', 24),
    text(130, 205, project.name, { size: 36, color: '#f8fafc', weight: 850 }),
    textBlock(130, 250, wrap(project.tagline, 24, 2), { size: 19, color: '#aebcd0', lineHeight: 31 }),
    ...project.techStack.slice(0, 4).map((tech, i) => chip(130 + (i % 2) * 170, 340 + Math.floor(i / 2) * 48, tech, accent, true)),
    rect(130, 492, 330, 254, '#10182a', '#2a3854', 18),
    text(158, 536, '用户指令', { size: 18, color: '#aebcd0', weight: 800 }),
    textBlock(158, 582, wrap(project.thoughtChain.problem, 21, 4), { size: 19, color: '#e8f1ff', lineHeight: 33 }),
    rect(570, 150, 410, 720, '#0b1020', '#242f4a', 24),
    text(608, 205, '工具调用链', { size: 28, color: '#f8fafc', weight: 850 }),
    ...['plan_task', 'retrieve_context', 'call_tool', 'compose_answer', 'verify_result'].map((step, i) => [
      rect(618, 270 + i * 92, 318, 56, '#121b2e', '#2b3b5c', 14),
      `<circle cx="650" cy="${298 + i * 92}" r="9" fill="${i === 4 ? palette.green : accent}"/>`,
      text(676, 306 + i * 92, step, {
        size: 20,
        color: '#e8f1ff',
        weight: 780,
        family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
      }),
      i < 4 ? line(650, 328 + i * 92, 650, 360 + i * 92, accent, 2, 0.45) : '',
    ].join('')),
    rect(1028, 150, 450, 720, '#ffffff', '#d9e5ef', 24),
    text(1064, 205, '执行结果', { size: 28, color: palette.ink, weight: 850 }),
    ...metrics(project).map((item, i) => metricCard(1064, 248 + i * 120, 344, 92, item[0], item[1], accent)),
    rect(1064, 642, 344, 130, '#f5f8fc', '#dce7f2', 18),
    text(1092, 684, '交付摘要', { size: 18, color: palette.muted, weight: 800 }),
    textBlock(1092, 724, wrap(project.thoughtChain.outcome, 23, 2), { size: 18, color: palette.ink, weight: 650, lineHeight: 29 }),
  ].join('');
  return browserShell(project, 'AGENT EXECUTION TRACE', body, 'dark');
}

function renderAdmin(project) {
  const accent = lineAccents[project.businessLine];
  const body = [
    text(104, 198, project.name, { size: 40, color: palette.ink, weight: 850 }),
    textBlock(104, 246, wrap(project.description, 48, 2), { size: 21, color: palette.muted, lineHeight: 32 }),
    ...metrics(project).map((item, i) => metricCard(104 + i * 290, 340, 260, 126, item[0], item[1], accent)),
    rect(104, 528, 850, 286, '#ffffff', '#dce7f2', 22),
    text(138, 578, '业务记录列表', { size: 24, color: palette.ink, weight: 850 }),
    ...['待处理', '已复核', '已导出', '异常关注'].map((head, i) => text(148 + i * 190, 632, head, {
      size: 16,
      color: palette.muted,
      weight: 800,
      family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
    })),
    ...[0, 1, 2].map((row) => [
      rect(132, 662 + row * 48, 774, 34, row % 2 ? '#f8fbff' : '#eef6fb', '#e4ecf5', 8),
      ...['采集记录', '规则校验', 'Excel', row === 2 ? '需确认' : '正常'].map((cell, i) => text(148 + i * 190, 686 + row * 48, cell, {
        size: 17,
        color: i === 3 && cell === '需确认' ? palette.red : palette.ink,
        weight: 650,
      })),
    ].join('')),
    rect(1010, 340, 390, 474, '#0b1320', '#22324a', 22),
    text(1044, 394, '交付信号', { size: 24, color: '#f8fafc', weight: 850 }),
    ...splitOutcome(project).map((point, i) => [
      `<circle cx="1060" cy="${456 + i * 86}" r="7" fill="${i === 0 ? accent : palette.gold}"/>`,
      textBlock(1082, 462 + i * 86, wrap(point, 20, 2), { size: 18, color: '#dbeafe', lineHeight: 28 }),
    ].join('')),
  ].join('');
  return browserShell(project, 'PROJECT DELIVERY DESK', body);
}

function renderDocument(project) {
  const accent = lineAccents[project.businessLine];
  const body = [
    rect(102, 156, 490, 704, '#ffffff', '#dce7f2', 18),
    text(142, 218, '文档解析预览', { size: 28, color: palette.ink, weight: 850 }),
    ...Array.from({ length: 11 }, (_, i) => line(142, 278 + i * 44, 552 - (i % 3) * 78, 278 + i * 44, '#cbd8e6', 5, 0.75)).join(''),
    rect(142, 728, 186, 54, accent, 'none', 14),
    text(235, 763, '批量导入', { size: 20, color: '#ffffff', weight: 850, anchor: 'middle' }),
    rect(650, 156, 828, 704, '#0b1320', '#22324a', 22),
    text(692, 218, project.name, { size: 34, color: '#f8fafc', weight: 850 }),
    textBlock(692, 266, wrap(project.thoughtChain.outcome, 45, 2), { size: 20, color: '#b9c8dc', lineHeight: 31 }),
    ...['字段', '识别结果', '复核状态'].map((head, i) => text(700 + i * 250, 380, head, {
      size: 16,
      color: '#9fb4cc',
      weight: 800,
      family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
    })),
    ...['项目名称|已提取|通过', '财务指标|已提取|复核', '风险段落|已定位|通过', '导出文件|已生成|通过'].map((row, i) => {
      const parts = row.split('|');
      return [
        rect(692, 414 + i * 72, 720, 48, '#111c2a', '#26384f', 10),
        ...parts.map((part, j) => text(710 + j * 250, 446 + i * 72, part, {
          size: 20,
          color: j === 2 && part === '复核' ? palette.gold : '#e8f1ff',
          weight: 700,
        })),
      ].join('');
    }),
    ...project.techStack.slice(0, 4).map((tech, i) => chip(692 + i * 164, 746, tech, accent, true)),
  ].join('');
  return browserShell(project, 'DOCUMENT EXTRACTION RESULT', body, 'dark');
}

function renderWeb(project) {
  const accent = lineAccents.web;
  const body = [
    rect(92, 150, 260, 720, '#0b1320', '#22324a', 24),
    text(130, 208, project.name, { size: 26, color: '#f8fafc', weight: 850 }),
    ...['Dashboard', 'Content', 'Users', 'Settings'].map((item, i) => [
      rect(128, 286 + i * 62, 176, 42, i === 0 ? `${accent}42` : '#121b2e', i === 0 ? `${accent}88` : '#26384f', 12),
      text(154, 314 + i * 62, item, { size: 18, color: '#e8f1ff', weight: 750 }),
    ].join('')),
    rect(400, 150, 1010, 720, '#ffffff', '#dce7f2', 24),
    text(444, 212, '产品页面交付', { size: 34, color: palette.ink, weight: 850 }),
    textBlock(444, 260, wrap(project.thoughtChain.outcome, 48, 2), { size: 20, color: palette.muted, lineHeight: 31 }),
    ...metrics(project).map((item, i) => metricCard(444 + i * 276, 348, 250, 114, item[0], item[1], accent)),
    rect(444, 528, 410, 230, '#f8fbff', '#dce7f2', 18),
    text(476, 578, '核心内容区', { size: 24, color: palette.ink, weight: 850 }),
    ...Array.from({ length: 4 }, (_, i) => line(476, 628 + i * 35, 794 - i * 44, 628 + i * 35, '#cbd8e6', 5, 0.8)).join(''),
    rect(900, 528, 420, 230, '#f8fbff', '#dce7f2', 18),
    text(932, 578, '交互列表', { size: 24, color: palette.ink, weight: 850 }),
    ...[0, 1, 2].map((i) => [
      rect(932, 618 + i * 46, 320, 30, '#eef6fb', '#e1eaf4', 8),
      `<circle cx="954" cy="${633 + i * 46}" r="5" fill="${accent}"/>`,
      line(978, 633 + i * 46, 1210 - i * 42, 633 + i * 46, '#cbd8e6', 4, 0.85),
    ].join('')),
  ].join('');
  return browserShell(project, 'WEB APPLICATION SNAPSHOT', body);
}

function renderCreative(project) {
  const accent = lineAccents.creative;
  const body = [
    rect(92, 150, 860, 720, '#080d17', '#25324a', 24),
    `<circle cx="510" cy="494" r="220" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>`,
    `<circle cx="510" cy="494" r="138" fill="none" stroke="${palette.cyan}" stroke-width="2" opacity="0.5"/>`,
    `<path d="M310 548 C430 420 562 610 718 440" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" opacity="0.8"/>`,
    text(140, 218, project.name, { size: 38, color: '#f8fafc', weight: 850 }),
    textBlock(140, 266, wrap(project.tagline, 36, 2), { size: 20, color: '#b9c8dc', lineHeight: 31 }),
    rect(140, 732, 704, 78, '#111c2a', '#2b3b55', 18),
    ...Array.from({ length: 10 }, (_, i) => rect(170 + i * 62, 760, 36, 24 + (i % 4) * 9, i % 3 === 0 ? accent : palette.cyan, 'none', 6, 0.8)).join(''),
    rect(1000, 150, 430, 720, '#ffffff', '#dce7f2', 24),
    text(1040, 210, '作品交付面板', { size: 30, color: palette.ink, weight: 850 }),
    ...metrics(project).map((item, i) => metricCard(1040, 274 + i * 124, 320, 98, item[0], item[1], accent)),
    textBlock(1040, 682, wrap(project.thoughtChain.outcome, 24, 3), { size: 19, color: palette.ink, lineHeight: 30 }),
  ].join('');
  return browserShell(project, 'CREATIVE DELIVERY PREVIEW', body, 'dark');
}

function renderResearch(project) {
  const accent = lineAccents.research;
  const body = [
    text(104, 196, project.name, { size: 40, color: palette.ink, weight: 850 }),
    textBlock(104, 244, wrap(project.thoughtChain.outcome, 48, 2), { size: 21, color: palette.muted, lineHeight: 32 }),
    rect(104, 338, 510, 486, '#ffffff', '#dce7f2', 22),
    text(140, 392, '研究输入', { size: 26, color: palette.ink, weight: 850 }),
    ...['关键词', '来源链接', '检索条件', '人工复核'].map((label, i) => [
      text(140, 462 + i * 78, label, { size: 18, color: palette.muted, weight: 750 }),
      rect(258, 434 + i * 78, 292, 42, '#eef6fb', '#dce7f2', 12),
    ].join('')),
    rect(674, 338, 740, 486, '#0b1320', '#22324a', 22),
    text(716, 392, '采集与导出结果', { size: 26, color: '#f8fafc', weight: 850 }),
    ...metrics(project).map((item, i) => metricCard(716 + i * 215, 446, 194, 102, item[0], item[1], accent)),
    ...splitOutcome(project).map((point, i) => [
      rect(716, 626 + i * 54, 620, 38, '#111c2a', '#26384f', 10),
      `<circle cx="738" cy="${645 + i * 54}" r="5" fill="${accent}"/>`,
      text(758, 652 + i * 54, point, { size: 17, color: '#e8f1ff', weight: 650 }),
    ].join('')),
  ].join('');
  return browserShell(project, 'RESEARCH WORKBENCH EXPORT', body);
}

function renderFlow(project) {
  const accent = lineAccents[project.businessLine];
  const steps = flowSteps(project);
  const body = [
    text(104, 200, `${project.name}：交付流程图`, { size: 40, color: palette.ink, weight: 850 }),
    textBlock(104, 250, wrap(project.thoughtChain.analysis, 58, 2), { size: 21, color: palette.muted, lineHeight: 32 }),
    ...steps.map((step, i) => {
      const x = 126 + i * 350;
      return [
        rect(x, 390, 280, 248, '#ffffff', '#dce7f2', 24),
        `<circle cx="${x + 50}" cy="452" r="24" fill="${accent}" opacity="0.15"/>`,
        text(x + 50, 461, `0${i + 1}`, {
          size: 22,
          color: accent,
          weight: 850,
          anchor: 'middle',
          family: 'SFMono-Regular, ui-monospace, Menlo, monospace',
        }),
        text(x + 32, 520, step, { size: 26, color: palette.ink, weight: 850 }),
        textBlock(x + 32, 566, wrap([project.thoughtChain.problem, project.thoughtChain.development, project.thoughtChain.challenges[0]?.solution, project.thoughtChain.outcome][i], 17, 3), {
          size: 17,
          color: palette.muted,
          lineHeight: 28,
        }),
        i < steps.length - 1 ? [
          line(x + 280, 514, x + 350, 514, accent, 3, 0.6),
          `<path d="M ${x + 340} 504 L ${x + 354} 514 L ${x + 340} 524" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>`,
        ].join('') : '',
      ].join('');
    }),
    rect(126, 720, 1328, 88, '#0b1320', '#22324a', 20),
    text(164, 774, '交付边界', { size: 22, color: '#e8f1ff', weight: 850 }),
    text(310, 774, compact(project.thoughtChain.outcome, 78), { size: 20, color: '#b9c8dc', weight: 600 }),
  ].join('');
  return browserShell(project, 'DELIVERY FLOW MAP', body);
}

function renderDelivery(project) {
  const accent = lineAccents[project.businessLine];
  const body = [
    rect(96, 152, 1388, 720, '#ffffff', '#dce7f2', 26),
    text(142, 218, '项目交付包', { size: 34, color: palette.ink, weight: 850 }),
    text(142, 264, project.name, { size: 26, color: palette.muted, weight: 700 }),
    rect(142, 328, 470, 430, '#f8fbff', '#dce7f2', 20),
    text(178, 384, '交付物清单', { size: 26, color: palette.ink, weight: 850 }),
    ...[
      getPrimaryDeliverable(project),
      '核心流程截图',
      project.businessLine === 'creative' ? '视觉资产输出' : '数据 / 记录导出',
      '复核说明与技术栈',
    ].map((item, i) => [
      rect(178, 440 + i * 66, 360, 44, '#ffffff', '#e1eaf4', 12),
      `<path d="M198 ${462 + i * 66} l10 10 l20 -24" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
      text(242, 470 + i * 66, item, { size: 19, color: palette.ink, weight: 700 }),
    ].join('')),
    rect(664, 328, 354, 430, '#0b1320', '#22324a', 20),
    text(700, 384, '结果摘要', { size: 26, color: '#f8fafc', weight: 850 }),
    textBlock(700, 438, wrap(project.thoughtChain.outcome, 24, 5), { size: 20, color: '#dbeafe', lineHeight: 33 }),
    ...project.techStack.slice(0, 4).map((tech, i) => chip(700 + (i % 2) * 142, 646 + Math.floor(i / 2) * 50, tech, accent, true)),
    rect(1072, 328, 330, 430, '#f8fbff', '#dce7f2', 20),
    text(1108, 384, '验收状态', { size: 26, color: palette.ink, weight: 850 }),
    ...metrics(project).map((item, i) => progress(1108, 456 + i * 82, 120, item[0], Number(String(item[1]).replace(/\D/g, '').slice(0, 2)) || 82, accent)),
    rect(1108, 686, 198, 46, accent, 'none', 13),
    text(1207, 716, project.status === 'active' ? '持续迭代' : '完成交付', {
      size: 19,
      color: '#ffffff',
      weight: 850,
      anchor: 'middle',
    }),
  ].join('');
  return browserShell(project, 'DELIVERY PACKAGE SNAPSHOT', body);
}

function getPrimaryDeliverable(project) {
  const map = {
    health: '业务台账 / 数据报表',
    ai: 'Agent 流程 / 智能处理',
    web: 'Web 应用 / 内容服务',
    creative: '交互体验 / 视觉资产',
    research: '研究材料 / 引用结果',
  };
  return map[project.businessLine];
}

function splitOutcome(project) {
  return clean(project.thoughtChain.outcome)
    .split(/[，。；;、]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 4)
    .slice(0, 3)
    .map((item) => compact(item, 28));
}

function screenshotSvg(project, index) {
  if (index === 1) return renderPrimary(project);
  if (index === 2) return renderFlow(project);
  return renderDelivery(project);
}

function findConverter() {
  const candidates = ['rsvg-convert', '/opt/homebrew/bin/rsvg-convert'];
  return candidates.find((command) => {
    try {
      execFileSync(command, ['--version'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  });
}

const converter = findConverter();
if (!converter) {
  throw new Error('rsvg-convert is required to render project screenshots.');
}

const tempDir = mkdtempSync(join(tmpdir(), 'project-shots-'));

try {
  for (const project of allProjects) {
    const targetDir = join(process.cwd(), OUT_DIR, project.slug);
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

    for (const index of [1, 2, 3]) {
      const svgPath = join(tempDir, `${project.slug}-${index}.svg`);
      const pngPath = join(targetDir, `screenshot${index}.png`);
      writeFileSync(svgPath, screenshotSvg(project, index));
      execFileSync(converter, ['-w', String(WIDTH), '-h', String(HEIGHT), '-o', pngPath, svgPath]);
    }
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

console.log(`Generated ${allProjects.length * 3} project screenshots.`);

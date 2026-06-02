import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { allProjects } from '../src/data/projects.ts';

const baseUrl = 'http://localhost:3001';

const pages = [
  '/',
  '/projects',
  '/projects/campus-health',
  '/projects/medical-ocr',
  '/projects/three-databases',
  '/projects/my-agent',
];

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  return response.text();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const home = await fetchText('/');
assert(home.includes('精选项目'), 'home should include featured section heading');
assert(home.includes('Selected Missions'), 'home should include featured section label');
assert(home.includes('查看全部项目'), 'home should link to all projects');
assert(home.includes('/projects/campus-health'), 'home should link to featured project details');
assert(home.includes('/projects/three-databases'), 'home should link to the three databases project');
assert(!home.includes('项目展示区域即将上线'), 'home should not include placeholder copy');

for (const path of pages) {
  const html = path === '/' ? home : await fetchText(path);
  assert(!html.includes('截图资源待补充'), `${path} should not expose missing screenshot copy`);
  assert(!html.includes('项目展示区域即将上线'), `${path} should not expose featured placeholder copy`);
}

for (const path of ['/projects/campus-health', '/projects/medical-ocr', '/projects/three-databases', '/projects/my-agent']) {
  const html = await fetchText(path);
  for (const id of ['overview', 'requirements', 'design', 'development', 'challenges', 'outcome']) {
    assert(html.includes(`id="${id}"`), `${path} should render #${id}`);
  }
  assert(html.includes('min-h-[calc(100svh-4.5rem)]'), `${path} should avoid a full h-screen hero trap`);
}

for (const project of allProjects) {
  assert(project.screenshots.length >= 3, `${project.slug} should expose a delivery screenshot gallery`);
  for (const screenshot of project.screenshots) {
    assert(!screenshot.includes('/projects//'), `${project.slug} should not contain an empty screenshot slug`);
    assert(
      existsSync(join(process.cwd(), 'public', screenshot)),
      `${project.slug} should have a real screenshot asset at ${screenshot}`,
    );
  }
}

console.log('Project visual smoke passed.');

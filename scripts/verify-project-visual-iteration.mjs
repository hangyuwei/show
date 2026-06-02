import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

const checks = [
  {
    name: 'homepage renders the real featured projects section',
    pass() {
      const page = read('src/app/page.tsx');
      return (
        page.includes('getFeaturedProjects') &&
        page.includes('FeaturedProjectsSection') &&
        !page.includes('项目展示区域即将上线')
      );
    },
  },
  {
    name: 'featured projects component exists with case-study links',
    pass() {
      const path = 'src/components/projects/FeaturedProjectsSection.tsx';
      if (!existsSync(join(root, path))) return false;
      const source = read(path);
      return (
        source.includes('featured.slice(0, 5)') &&
        source.includes('href={`/projects/${project.slug}`}') &&
        source.includes('查看案例') &&
        source.includes('查看全部项目')
      );
    },
  },
  {
    name: 'project detail hero is not a full h-screen trap',
    pass() {
      const source = read('src/app/projects/[slug]/ProjectDetailClient.tsx');
      return (
        !source.includes('<section className="relative h-screen w-full overflow-hidden">') &&
        source.includes('min-h-[calc(100svh-4.5rem)]') &&
        source.includes('ProjectBriefPanel')
      );
    },
  },
  {
    name: 'outcome fallbacks read as intentional evidence panels',
    pass() {
      const source = read('src/app/projects/[slug]/ProjectDetailClient.tsx');
      return (
        !source.includes('截图资源待补充') &&
        source.includes('成果证据面板') &&
        source.includes('交付摘要')
      );
    },
  },
];

const failures = checks.filter((check) => !check.pass());

if (failures.length > 0) {
  console.error('Project visual iteration verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`Project visual iteration verification passed (${checks.length} checks).`);

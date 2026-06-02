import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

const read = (path) => readFileSync(join(root, path), 'utf8');
const exists = (path) => existsSync(join(root, path));

function requireFile(path) {
  if (!exists(path)) {
    failures.push(`Missing required file: ${path}`);
    return '';
  }
  return read(path);
}

function requireIncludes(path, needles) {
  const content = requireFile(path);
  if (!content) return;
  for (const needle of needles) {
    if (!content.includes(needle)) {
      failures.push(`${path} must include: ${needle}`);
    }
  }
}

function requireNotIncludes(path, needles) {
  const content = requireFile(path);
  if (!content) return;
  for (const needle of needles) {
    if (content.includes(needle)) {
      failures.push(`${path} must not include: ${needle}`);
    }
  }
}

function requireAsset(path, minBytes) {
  if (!exists(path)) {
    failures.push(`Missing required asset: ${path}`);
    return;
  }
  const size = statSync(join(root, path)).size;
  if (size < minBytes) {
    failures.push(`${path} is too small (${size} bytes, expected at least ${minBytes})`);
  }
}

requireIncludes('DESIGN.md', [
  '宇宙星盘',
  '#02030a',
  '#f2c166',
  'What NOT to Do',
]);

requireIncludes('media/hyperframes/hero-astrolabe/index.html', [
  'data-composition-id="hero-astrolabe"',
  'window.__timelines["hero-astrolabe"]',
  'mulberry32',
  'THREE.PerspectiveCamera',
]);

requireIncludes('src/components/ScrollScrubHero.tsx', [
  'mp4Src',
  'webmSrc',
  'posterSrc',
  'duration',
  'usePrefersReducedMotion',
  'currentTime',
]);

requireIncludes('src/components/usePrefersReducedMotion.ts', [
  'prefers-reduced-motion',
  'useSyncExternalStore',
]);

requireIncludes('src/components/Hero.tsx', [
  '<ScrollScrubHero',
  '/hero/astrolabe-scroll.mp4',
  '/hero/astrolabe-scroll.webm',
  '/hero/astrolabe-poster.webp',
]);

requireNotIncludes('src/components/Hero.tsx', [
  "import dynamic from 'next/dynamic'",
  "import('./three/SolarSystem')",
  '<SolarSystem',
]);

requireAsset('public/hero/astrolabe-scroll.mp4', 200_000);
requireAsset('public/hero/astrolabe-scroll.webm', 100_000);
requireAsset('public/hero/astrolabe-poster.webp', 10_000);

if (failures.length > 0) {
  console.error('Hero videoization verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Hero videoization verification passed.');

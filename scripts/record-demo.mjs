import { chromium } from 'playwright';

const PROJECT_URL = 'http://localhost:3001/projects/starry-music-box';
const OUTPUT = 'public/projects/starry-music-box/demo-video.webm';
const DURATION = 25; // seconds

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function smoothScroll(page, distance, duration) {
  const steps = 30;
  const step = distance / steps;
  const interval = duration / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step);
    await sleep(interval);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: 'public/projects/starry-music-box', size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();

  console.log('🎬 Navigating to project page...');
  await page.goto(PROJECT_URL, { waitUntil: 'networkidle' });
  await sleep(3000); // Wait for 3D scene to fully load

  // === Shot 1: Opening — top of page with title + 3D scene (3s) ===
  console.log('📹 Shot 1: Opening (0-3s)');
  await sleep(3000);

  // === Shot 2: Scroll to 3D scene area, let it shine (5s) ===
  console.log('📹 Shot 2: Scroll to 3D scene (3-8s)');
  await smoothScroll(page, 300, 3000);
  await sleep(2000);

  // === Shot 3: Mouse interaction over the 3D canvas (6s) ===
  console.log('📹 Shot 3: Mouse interaction on 3D (8-14s)');
  const canvas = await page.locator('canvas').first();
  if (await canvas.isVisible()) {
    const box = await canvas.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      // Circular mouse movement over the canvas
      for (let i = 0; i < 3; i++) {
        await page.mouse.move(cx + 100, cy - 50);
        await sleep(500);
        await page.mouse.move(cx - 100, cy + 50);
        await sleep(500);
        await page.mouse.move(cx, cy);
        await sleep(500);
      }
    }
  }

  // === Shot 4: Scroll down to show project content (8s) ===
  console.log('📹 Shot 4: Project content (14-22s)');
  await smoothScroll(page, 600, 3000);
  await sleep(2000);
  await smoothScroll(page, 400, 2000);
  await sleep(1000);

  // === Shot 5: Scroll back to top, end on 3D scene (3s) ===
  console.log('📹 Shot 5: Return to top (22-25s)');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(3000);

  // Save video
  const video = page.video();
  if (video) {
    const videoPath = await video.path();
    console.log(`🎬 Video saved to: ${videoPath}`);
  }

  await context.close();
  await browser.close();
  console.log('✅ Recording complete!');
})();

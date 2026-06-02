import { chromium } from 'playwright';

const PROJECT_URL = 'http://localhost:3002';
const OUTPUT_DIR = 'public/projects/starry-music-box';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function smoothMouseMove(page, startX, startY, endX, endY, duration) {
  const steps = 30;
  const dx = (endX - startX) / steps;
  const dy = (endY - startY) / steps;
  const interval = duration / steps;
  for (let i = 0; i <= steps; i++) {
    await page.mouse.move(startX + dx * i, startY + dy * i);
    await sleep(interval);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUTPUT_DIR, size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();

  console.log('🎬 Navigating to starry music box...');
  await page.goto(PROJECT_URL, { waitUntil: 'networkidle' });
  await sleep(2000);

  // Click the launch button
  console.log('📹 Clicking 启动音乐盒 button...');
  const launchBtn = page.getByRole('button', { name: /启动音乐盒/i });
  if (await launchBtn.isVisible()) {
    await launchBtn.click();
    console.log('✅ Button clicked, waiting for 3D scene...');
    await sleep(5000); // Wait for 3D scene + audio to fully load
  } else {
    console.log('⚠️ Launch button not found, continuing anyway...');
    await sleep(3000);
  }

  // === Shot 1: Full scene, let it breathe (4s) ===
  console.log('📹 Shot 1: Full scene opening (0-4s)');
  await sleep(4000);

  // === Shot 2: Slow pan — mouse drift right-up (4s) ===
  console.log('📹 Shot 2: Slow pan (4-8s)');
  await smoothMouseMove(page, 720, 450, 950, 300, 4000);
  await sleep(500);

  // === Shot 3: Zoom in — scroll wheel (4s) ===
  console.log('📹 Shot 3: Zoom in (8-12s)');
  await page.mouse.wheel(0, -400);
  await sleep(2000);
  await page.mouse.wheel(0, -300);
  await sleep(2000);

  // === Shot 4: Orbit — circular mouse path (5s) ===
  console.log('📹 Shot 4: Orbit around (12-17s)');
  const cx = 720, cy = 450, r = 220;
  for (let i = 0; i <= 50; i++) {
    const angle = (i / 50) * Math.PI * 1.8;
    await page.mouse.move(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    await sleep(100);
  }

  // === Shot 5: Pull back out (3s) ===
  console.log('📹 Shot 5: Pull back (17-20s)');
  await page.mouse.wheel(0, 500);
  await sleep(1500);
  await page.mouse.wheel(0, 400);
  await sleep(1500);

  // === Shot 6: Final gentle drift (3s) ===
  console.log('📹 Shot 6: Final drift (20-23s)');
  await smoothMouseMove(page, 500, 500, 850, 380, 3000);
  await sleep(2000);

  console.log('🎬 Stopping recording...');
  const video = page.video();
  if (video) {
    const rawPath = await video.path();
    console.log(`🎬 Raw video: ${rawPath}`);
  }

  await context.close();
  await browser.close();
  console.log('✅ Recording complete!');
})();

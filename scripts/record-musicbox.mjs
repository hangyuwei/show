import { chromium } from 'playwright';

const PROJECT_URL = 'http://localhost:3002';
const OUTPUT_DIR = 'public/projects/starry-music-box';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUTPUT_DIR, size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();

  console.log('🎬 Loading...');
  await page.goto(PROJECT_URL, { waitUntil: 'networkidle' });
  await sleep(1500);

  // Click launch button immediately
  const launchBtn = page.getByRole('button', { name: /启动音乐盒/i });
  if (await launchBtn.isVisible()) {
    await launchBtn.click();
    console.log('✅ Launched, waiting for 3D...');
    await sleep(3000); // minimal wait for scene
  }

  // === Shot 1: Opening still — 2s ===
  console.log('📹 Shot 1: Opening (0-2s)');
  await sleep(2000);

  // === Shot 2: Slow orbit right — 3s ===
  console.log('📹 Shot 2: Orbit right (2-5s)');
  const cx = 720, cy = 450;
  for (let i = 0; i <= 20; i++) {
    const angle = (i / 20) * Math.PI * 0.8;
    await page.mouse.move(cx + Math.cos(angle) * 250, cy + Math.sin(angle) * 150);
    await sleep(150);
  }

  // === Shot 3: Zoom in — 2s ===
  console.log('📹 Shot 3: Zoom in (5-7s)');
  await page.mouse.wheel(0, -500);
  await sleep(1000);
  await page.mouse.wheel(0, -300);
  await sleep(1000);

  // === Shot 4: Quick orbit left — 3s ===
  console.log('📹 Shot 4: Orbit left (7-10s)');
  for (let i = 0; i <= 20; i++) {
    const angle = Math.PI * 0.8 - (i / 20) * Math.PI * 1.2;
    await page.mouse.move(cx + Math.cos(angle) * 200, cy + Math.sin(angle) * 180);
    await sleep(140);
  }

  // === Shot 5: Pull back + drift — 3s ===
  console.log('📹 Shot 5: Pull back (10-13s)');
  await page.mouse.wheel(0, 600);
  await sleep(1500);
  // gentle final drift
  for (let i = 0; i <= 15; i++) {
    await page.mouse.move(600 + i * 18, 400 - i * 8);
    await sleep(100);
  }
  await sleep(1500);

  console.log('🎬 Done!');
  const video = page.video();
  if (video) console.log(`📦 Raw: ${await video.path()}`);

  await context.close();
  await browser.close();
  console.log('✅ Complete!');
})();

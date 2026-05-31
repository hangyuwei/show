export const meta = {
  name: 'visual-iterations-v3',
  description: '每轮10个agent并行优化所有方面，共5轮+最终构建部署',
  phases: [
    { title: 'Round-1', detail: '10 agents: foundation pass' },
    { title: 'Round-2', detail: '10 agents: refinement pass' },
    { title: 'Round-3', detail: '10 agents: polish pass' },
    { title: 'Round-4', detail: '10 agents: premium pass' },
    { title: 'Round-5', detail: '10 agents: final pass' },
    { title: 'Build-Deploy', detail: 'Build, verify, deploy to Vercel' },
  ],
}

var DIR = '/Users/hang/Documents/projects2/portfolio'
var RS = {
  type: 'object',
  properties: { success: { type: 'boolean' }, changes: { type: 'string' } },
  required: ['success'],
}

// 10 specialist agents — each reads the full site for context but ONLY edits their assigned files
var SPECIALISTS = [
  {
    id: 'globals-css',
    files: 'ONLY EDIT: src/app/globals.css',
    task: 'Improve global CSS: richer gradients, better CSS variables, improve --glass-bg/--glass-border, add new utility classes for glow effects, refine color palette for more premium feel. Read the whole site first for context.',
  },
  {
    id: 'typography',
    files: 'ONLY EDIT: src/app/globals.css (typography section only), src/components/ui/SectionTitle.tsx',
    task: 'Improve typography: refine heading sizes, add text-shadow utilities, improve font weights, letter-spacing, line-heights. Make SectionTitle component more visually striking. Read other components for context.',
  },
  {
    id: 'navbar',
    files: 'ONLY EDIT: src/components/ui/Navbar.tsx',
    task: 'Improve Navbar: enhance glass morphism, add gradient border animation, improve logo effect, refine mobile menu transitions, add scroll-based background opacity change, improve active route indicator.',
  },
  {
    id: 'hero',
    files: 'ONLY EDIT: src/components/Hero.tsx',
    task: 'Improve Hero section: make title more impactful with gradient text or glow, improve CTA button design, enhance typewriter animation, add subtle background elements, improve scroll indicator, make overall feel more premium.',
  },
  {
    id: '3d-solar',
    files: 'ONLY EDIT: src/components/three/SolarSystem.tsx',
    task: 'Improve 3D Solar System: enhance sun glow and corona, improve planet materials and colors, refine cosmic dust particles, enhance nebula clouds, optimize bloom effect, add subtle camera movement or better orbit dynamics.',
  },
  {
    id: 'cards-grid',
    files: 'ONLY EDIT: src/components/three/FloatingCard3D.tsx, src/components/ProjectFilter.tsx, src/app/projects/page.tsx, src/components/ui/TechBadge.tsx',
    task: 'Improve project cards and grid: enhance card hover effects, improve gradient borders, add better stagger animations, refine filter buttons with glow states, improve TechBadge styling, enhance grid background patterns.',
  },
  {
    id: 'detail-page',
    files: 'ONLY EDIT: src/app/projects/[slug]/ProjectDetailClient.tsx',
    task: 'Improve project detail page: enhance thought chain timeline, improve section headers, refine tech pill colors, enhance breadcrumb navigation, improve TOC sidebar, make content sections feel more premium with better dividers and spacing.',
  },
  {
    id: 'about-page',
    files: 'ONLY EDIT: src/components/about/AboutContent.tsx',
    task: 'Improve About page: enhance bio card design, improve career timeline with better dots and connecting lines, add gradient decorations, improve section transitions, make skill radar and tech sphere sections feel more integrated.',
  },
  {
    id: 'contact-footer',
    files: 'ONLY EDIT: src/components/contact/ContactContent.tsx, src/components/ui/Footer.tsx',
    task: 'Improve Contact page and Footer: enhance form input glass effects, improve submit button gradient, add input focus animations, refine social links, improve Footer with better gradient border and layout, add subtle animations.',
  },
  {
    id: 'animations-responsive',
    files: 'ONLY EDIT: src/components/PageTransition.tsx, src/components/ui/SkeletonLoader.tsx, src/app/layout.tsx (only responsive/transition related), src/app/not-found.tsx',
    task: 'Improve animations and responsive design: enhance page transitions, add loading skeleton animations, improve 404 page design, fix any responsive issues in layout, add smooth scroll-triggered reveal utilities. Read all pages to understand responsive needs.',
  },
]

// Round priority guidance — each round the agents get more specific direction
var ROUND_FOCUS = [
  'This is Round 1/5 — FOUNDATION. Focus on the biggest visual impact changes. Fix obvious issues, add missing polish. Be bold with improvements.',
  'This is Round 2/5 — REFINEMENT. The foundation is set. Now refine: improve shadows, add subtle gradients, enhance hover states, fix spacing inconsistencies, add micro-interactions.',
  'This is Round 3/5 — POLISH. Focus on premium feel: multi-layer shadows, glass morphism refinement, smooth transitions, consistent spacing rhythm, polished typography details.',
  'This is Round 4/5 — PREMIUM. Push for maximum visual quality: add glow effects, refine color harmonies, improve animation timing, ensure every element feels intentional and cohesive.',
  'This is Round 5/5 — FINAL. Final pass: ensure consistency across all components, fix any remaining visual issues, verify color harmony, make sure dark theme is cohesive, add final sparkle.',
]

for (var round = 1; round <= 5; round++) {
  phase('Round-' + round)
  log('Starting Round ' + round + '/5 — launching 10 specialist agents in parallel')

  await parallel(SPECIALISTS.map(function(sp) {
    return function() {
      return agent(
        'You are a senior UI/UX designer working in ' + DIR + '. ' +
        ROUND_FOCUS[round - 1] + ' ' +
        'Your specialty: ' + sp.id + '. ' +
        sp.task + ' ' +
        sp.files + '. ' +
        'IMPORTANT: Read all relevant files first, make targeted improvements, then run: cd ' + DIR + ' && npx tsc --noEmit to verify 0 errors. ' +
        'Return JSON: {success: boolean, changes: "description of changes made"}',
        { label: 'r' + round + '-' + sp.id, phase: 'Round-' + round, schema: RS }
      )
    }
  }))

  log('Round ' + round + ' agents complete — committing')
  await agent(
    'In ' + DIR + ' run: git add -A && git diff --cached --stat && git commit -m "feat: visual round ' + round + '/5 — all 10 specialists". Return JSON: {success: true, changes: "committed"}',
    { label: 'r' + round + '-commit', phase: 'Round-' + round, schema: RS }
  )
  log('Round ' + round + '/5 committed')
}

// Final build + deploy
phase('Build-Deploy')
log('Starting final build and deploy')
await agent(
  'In ' + DIR + ' do final build and deploy. Steps: (1) npx tsc --noEmit verify 0 errors (2) npm run build (3) git add -A && git commit -m "feat: 5-round visual iteration complete" (4) npx vercel --prod --yes to deploy. Return JSON with success and deployment URL.',
  { label: 'build-deploy', phase: 'Build-Deploy', schema: RS }
)
log('Build and deploy complete!')

return { completed: true, totalAgents: 56, rounds: 5 }

export const meta = {
  name: 'visual-iterations-v2',
  description: '10轮全站视觉迭代，每轮覆盖所有页面和组件',
  phases: [
    { title: 'Round-1', detail: 'Holistic visual pass 1' },
    { title: 'Round-2', detail: 'Holistic visual pass 2' },
    { title: 'Round-3', detail: 'Holistic visual pass 3' },
    { title: 'Round-4', detail: 'Holistic visual pass 4' },
    { title: 'Round-5', detail: 'Holistic visual pass 5' },
    { title: 'Round-6', detail: 'Holistic visual pass 6' },
    { title: 'Round-7', detail: 'Holistic visual pass 7' },
    { title: 'Round-8', detail: 'Holistic visual pass 8' },
    { title: 'Round-9', detail: 'Holistic visual pass 9' },
    { title: 'Round-10', detail: 'Final build and deploy' },
  ],
}

var DIR = '/Users/hang/Documents/projects2/portfolio'
var RS = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
  },
  required: ['success'],
}

var ALL_FILES = 'globals.css, Hero.tsx, Navbar.tsx, Footer.tsx, FloatingCard3D.tsx, ProjectFilter.tsx, ProjectDetailClient.tsx, AboutContent.tsx, ContactContent.tsx, SectionTitle.tsx, SkeletonLoader.tsx, TechBadge.tsx, SolarSystem.tsx, StarField.tsx, SkillRadar3D.tsx, TechSphere.tsx, PageTransition.tsx, DataFlowGrid.tsx, layout.tsx, projects/page.tsx, about/page.tsx, contact/page.tsx, page.tsx, not-found.tsx'

var BASE_PROMPT = 'You are a senior UI/UX designer and frontend engineer. In ' + DIR + ' do a FULL-SITE visual iteration. Read ALL these files: ' + ALL_FILES + '. Then identify the TOP 5 most impactful visual improvements across the ENTIRE site and implement them ALL. Consider: colors, gradients, shadows, spacing, typography, borders, hover effects, animations, contrast, visual hierarchy, polish. Make changes that create the BIGGEST visual impact. After changes run: cd ' + DIR + ' && npx tsc --noEmit to verify 0 errors. '

// Round 1-3: Each focuses on a different priority level
phase('Round-1')
await agent(
  BASE_PROMPT + 'This is iteration 1/10. Focus on: foundational visual improvements. Fix the biggest eyesores. Make colors richer, add gradients where flat colors exist, improve contrast, fix ugly spacing. Think about what a visitor would notice first.',
  { label: 'round-1', phase: 'Round-1', schema: RS }
)
log('Round 1 done')

phase('Round-2')
await agent(
  BASE_PROMPT + 'This is iteration 2/10. The foundation is set. Now focus on: polish and refinement. Add glass-morphism effects, improve shadows (multi-layer), add subtle animations/transitions, improve button styles, add hover state improvements across ALL interactive elements.',
  { label: 'round-2', phase: 'Round-2', schema: RS }
)
log('Round 2 done')

phase('Round-3')
await agent(
  BASE_PROMPT + 'This is iteration 3/10. Focus on: spacing system consistency. Ensure all sections use consistent padding/margins. Fix any cramped or too-loose layouts. Improve visual rhythm across pages. Ensure the spacing feels premium and intentional.',
  { label: 'round-3', phase: 'Round-3', schema: RS }
)
log('Round 3 done')

phase('Round-4')
await agent(
  BASE_PROMPT + 'This is iteration 4/10. Focus on: typography refinement. Ensure headings are bold and impactful, body text is readable, labels are crisp. Add text-shadow where needed over 3D backgrounds. Improve font sizes for mobile. Make text hierarchy crystal clear.',
  { label: 'round-4', phase: 'Round-4', schema: RS }
)
log('Round 4 done')

phase('Round-5')
await agent(
  BASE_PROMPT + 'This is iteration 5/10. Focus on: card and grid aesthetics. Improve FloatingCard3D with better borders, shadows, hover effects. Improve project grid layout on projects page. Make filter buttons look premium. Add staggered animations.',
  { label: 'round-5', phase: 'Round-5', schema: RS }
)
log('Round 5 done')

phase('Round-6')
await agent(
  BASE_PROMPT + 'This is iteration 6/10. Focus on: detail page and thought chain visual design. Improve ProjectDetailClient with better section dividers, timeline styling, code block styling, tech tag pills. Make the thought chain flow feel like a premium story.',
  { label: 'round-6', phase: 'Round-6', schema: RS }
)
log('Round 6 done')

phase('Round-7')
await agent(
  BASE_PROMPT + 'This is iteration 7/10. Focus on: about and contact pages. Improve AboutContent with better layout, timeline design, skill section presentation. Improve ContactContent with glass-morphism form inputs, gradient buttons. Make both pages feel cohesive with the rest of the site.',
  { label: 'round-7', phase: 'Round-7', schema: RS }
)
log('Round 7 done')

phase('Round-8')
await agent(
  BASE_PROMPT + 'This is iteration 8/10. Focus on: micro-interactions and animations. Add page entrance animations, scroll-triggered reveals, hover micro-feedback, loading states, skeleton animations. Make the site feel alive and responsive to user interaction.',
  { label: 'round-8', phase: 'Round-8', schema: RS }
)
log('Round 8 done')

phase('Round-9')
await agent(
  BASE_PROMPT + 'This is iteration 9/10. Focus on: responsive design and consistency. Check ALL components on mobile breakpoints (sm/md). Fix any layout issues. Ensure consistent styling across all pages. Fix any visual regressions. Make mobile experience feel just as polished as desktop.',
  { label: 'round-9', phase: 'Round-9', schema: RS }
)
log('Round 9 done')

// Round 10: Build + Deploy
phase('Round-10')
await agent(
  'In ' + DIR + ' do the final build and deploy. Steps: (1) cd ' + DIR + ' && npx tsc --noEmit verify 0 errors (2) npm run build verify success (3) git add -A && git commit with message "feat: 10-round visual iteration complete" (4) npx vercel --prod --yes to deploy. Return JSON with success and the deployment URL.',
  { label: 'round-10-deploy', phase: 'Round-10', schema: RS }
)
log('Round 10 done - deployed!')

return { completed: true }

export const meta = {
  name: 'visual-iterations',
  description: '10轮视觉迭代优化，每轮聚焦一个方面，自动部署验证',
  phases: [
    { title: 'Audit', detail: 'Analyze current visual issues' },
    { title: 'Iter-1', detail: 'Global color scheme and gradients' },
    { title: 'Iter-2', detail: 'Typography and spacing system' },
    { title: 'Iter-3', detail: 'Navbar and navigation polish' },
    { title: 'Iter-4', detail: 'Hero section visual impact' },
    { title: 'Iter-5', detail: '3D solar system aesthetics' },
    { title: 'Iter-6', detail: 'Project cards and grid' },
    { title: 'Iter-7', detail: 'Project detail page layout' },
    { title: 'Iter-8', detail: 'About page layout' },
    { title: 'Iter-9', detail: 'Contact page and footer' },
    { title: 'Iter-10', detail: 'Final polish and responsive' },
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

// Phase 0: Visual audit
phase('Audit')
await agent(
  'In ' + DIR + ' do a visual audit. Read globals.css, Hero.tsx, Navbar.tsx, FloatingCard3D.tsx, ProjectDetailClient.tsx, AboutContent.tsx, ContactContent.tsx, Footer.tsx, SectionTitle.tsx, layout.tsx, page.tsx. List the top 10 visual problems you see: colors, spacing, typography, contrast, layout issues, missing polish. Focus on what would make the biggest visual impact. Write findings to /tmp/visual-audit.md. Return JSON: {success:true, message:"audit done"}',
  { label: 'visual-audit', phase: 'Audit', schema: RS }
)
log('Visual audit complete')

// Phase 1: Global color scheme
phase('Iter-1')
await agent(
  'In ' + DIR + ' improve the GLOBAL COLOR SCHEME. Read globals.css first. Then:\n1. Replace flat colors with rich gradients (deep navy to midnight blue, with purple/teal accents)\n2. Add glass-morphism variables (--glass-bg, --glass-border)\n3. Improve accent color from basic blue to a more vibrant gradient (electric blue to cyan)\n4. Add subtle background gradients to body and sections\n5. Ensure high contrast text on dark backgrounds\n6. Add CSS transitions for smooth color changes\nEdit globals.css to apply changes. Run tsc --noEmit to verify. Return JSON: {success:true, message:"color scheme updated"}',
  { label: 'iter1-colors', phase: 'Iter-1', schema: RS }
)
log('Iter-1: Colors done')

// Phase 2: Typography and spacing
phase('Iter-2')
await agent(
  'In ' + DIR + ' improve TYPOGRAPHY AND SPACING. Read globals.css, then:\n1. Add a proper font stack with system fonts that look great on all platforms (use Inter or system-ui)\n2. Define a clear type scale: text-xs through text-6xl with good line-heights\n3. Add letter-spacing for headings (tracking-wide for titles)\n4. Improve paragraph spacing with proper margin/padding\n5. Add text-shadow for hero text to improve readability over 3D backgrounds\n6. Add smooth scroll-behavior: smooth to html\nEdit globals.css. Return JSON: {success:true, message:"typography done"}',
  { label: 'iter2-typography', phase: 'Iter-2', schema: RS }
)
log('Iter-2: Typography done')

// Phase 3: Navbar polish
phase('Iter-3')
await agent(
  'In ' + DIR + ' improve the NAVBAR. Read src/components/ui/Navbar.tsx. Then:\n1. Add backdrop-blur-xl and stronger glass morphism effect\n2. Add a subtle bottom border with gradient (blue to purple to transparent)\n3. Make logo text have a gradient color effect\n4. Improve nav link hover effects: underline animation from center outward\n5. Add active route indicator with glowing dot\n6. Improve mobile hamburger menu with smoother transitions\n7. Add subtle shadow on scroll\nEdit Navbar.tsx. Run tsc --noEmit. Return JSON: {success:true, message:"navbar polished"}',
  { label: 'iter3-navbar', phase: 'Iter-3', schema: RS }
)
log('Iter-3: Navbar done')

// Phase 4: Hero section
phase('Iter-4')
await agent(
  'In ' + DIR + ' improve the HERO SECTION. Read Hero.tsx, then:\n1. Make the title more impactful: larger font, add text-shadow with blue glow\n2. Add a subtle animated gradient background behind the text (not blocking 3D)\n3. Improve the subtitle with a gradient text effect\n4. Make the CTA button more eye-catching: gradient border, glow on hover, scale animation\n5. Add a pulsing ring effect around the scroll indicator\n6. Add a subtle animated line/divider between title and subtitle\n7. Improve the loading state with a skeleton animation\nEdit Hero.tsx. Run tsc --noEmit. Return JSON: {success:true, message:"hero improved"}',
  { label: 'iter4-hero', phase: 'Iter-4', schema: RS }
)
log('Iter-4: Hero done')

// Phase 5: 3D solar system
phase('Iter-5')
await agent(
  'In ' + DIR + ' improve the 3D SOLAR SYSTEM aesthetics. Read SolarSystem.tsx, then:\n1. Make the sun glow more dramatic: increase bloom intensity, add inner pulsing animation\n2. Improve planet materials: use MeshStandardMaterial with emissive colors instead of basic materials\n3. Add more varied planet sizes and orbit speeds\n4. Add a subtle orbit trail effect (particles along orbit paths)\n5. Make the cosmic dust more colorful (add some blue/purple particles)\n6. Improve nebula clouds with more varied colors (blue/purple/teal instead of just grey)\n7. Add subtle camera auto-dolly (slow zoom in/out)\nEdit SolarSystem.tsx. Run tsc --noEmit. Return JSON: {success:true, message:"3D improved"}',
  { label: 'iter5-3d', phase: 'Iter-5', schema: RS }
)
log('Iter-5: 3D Solar done')

// Phase 6: Project cards
phase('Iter-6')
await agent(
  'In ' + DIR + ' improve PROJECT CARDS AND GRID. Read FloatingCard3D.tsx and projects/page.tsx, then:\n1. Add gradient border effect on cards (border-image or pseudo-element)\n2. Add a subtle shimmer/shine animation on hover\n3. Improve card shadows: multi-layered box-shadow for depth\n4. Add business line color coding (each card has a colored top border or side accent)\n5. Improve tech badges with pill shape and better colors\n6. Add staggered entrance animation (cards appear one by one)\n7. Improve the filter buttons with active state glow\n8. Add a subtle grid pattern or dots pattern background\nEdit FloatingCard3D.tsx, projects/page.tsx, ProjectFilter.tsx. Run tsc --noEmit. Return JSON: {success:true, message:"cards improved"}',
  { label: 'iter6-cards', phase: 'Iter-6', schema: RS }
)
log('Iter-6: Cards done')

// Phase 7: Project detail page
phase('Iter-7')
await agent(
  'In ' + DIR + ' improve the PROJECT DETAIL PAGE. Read ProjectDetailClient.tsx and page.tsx in [slug] dir, then:\n1. Add a gradient overlay at the top of the 3D scene section for better text transition\n2. Improve section headers with accent line decoration\n3. Add a sticky table of contents sidebar for desktop\n4. Improve thought chain sections with numbered steps and connecting lines\n5. Add better visual hierarchy: larger section titles, improved spacing\n6. Add a breadcrumb navigation at the top\n7. Improve the tech stack tags with icons or colored pills\n8. Add a back-to-top floating button\nEdit ProjectDetailClient.tsx. Run tsc --noEmit. Return JSON: {success:true, message:"detail page improved"}',
  { label: 'iter7-detail', phase: 'Iter-7', schema: RS }
)
log('Iter-7: Detail page done')

// Phase 8: About page
phase('Iter-8')
await agent(
  'In ' + DIR + ' improve the ABOUT PAGE. Read about/page.tsx and AboutContent.tsx, then:\n1. Add a gradient header section with title animation\n2. Improve the bio section with a card layout and accent border\n3. Add visual timeline with animated dots and connecting lines for career history\n4. Improve SkillRadar3D and TechSphere sections with better titles and descriptions\n5. Add subtle background decorations (gradient orbs)\n6. Improve overall spacing and visual hierarchy\nEdit AboutContent.tsx. Run tsc --noEmit. Return JSON: {success:true, message:"about improved"}',
  { label: 'iter8-about', phase: 'Iter-8', schema: RS }
)
log('Iter-8: About done')

// Phase 9: Contact and footer
phase('Iter-9')
await agent(
  'In ' + DIR + ' improve CONTACT PAGE and FOOTER. Read contact/page.tsx, ContactContent.tsx, Footer.tsx, then:\n1. Contact: improve form styling with glass-morphism inputs, animated focus states\n2. Contact: add gradient submit button with hover glow\n3. Contact: improve social links with icon styling and hover animations\n4. Footer: add a gradient top border\n5. Footer: improve link styling and spacing\n6. Footer: add subtle background pattern\n7. Both: ensure consistent dark theme\nEdit ContactContent.tsx and Footer.tsx. Run tsc --noEmit. Return JSON: {success:true, message:"contact+footer done"}',
  { label: 'iter9-contact', phase: 'Iter-9', schema: RS }
)
log('Iter-9: Contact+Footer done')

// Phase 10: Final polish
phase('Iter-10')
await agent(
  'In ' + DIR + ' do FINAL POLISH. Read globals.css, then ALL page files and component files briefly. Do:\n1. Ensure consistent spacing everywhere (use Tailwind spacing scale: p-4/p-6/p-8/p-12)\n2. Add smooth page transitions with Framer Motion\n3. Improve mobile responsive: check all components have proper sm/md/lg breakpoints\n4. Add loading skeleton animations to SkeletonLoader.tsx\n5. Ensure all buttons have consistent hover/focus/active states\n6. Add subtle animations to SectionTitle component\n7. Fix any remaining visual inconsistencies\n8. Run npm run build to verify everything works\nReturn JSON: {success:true, message:"final polish done"}',
  { label: 'iter10-polish', phase: 'Iter-10', schema: RS }
)
log('Iter-10: Final polish done')

return { completed: true, iterations: 10 }

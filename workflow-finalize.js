export const meta = {
  name: 'portfolio-finalize-deploy',
  description: 'SPEC + Review + Build + Deploy + Verify',
  phases: [
    { title: 'SPEC', detail: 'Generate SPEC.md from PRD' },
    { title: 'Review', detail: 'Final code review and fixes' },
    { title: 'Build', detail: 'Production build verification' },
    { title: 'Deploy', detail: 'Git push and Vercel deploy' },
    { title: 'Verify', detail: 'Live site verification' },
  ],
}

var RS = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
  },
  required: ['success'],
}

phase('SPEC')
await agent(
  'Read /Users/hang/Documents/projects2/portfolio/PRD.md and generate /Users/hang/Documents/projects2/portfolio/SPEC.md. Include: tech stack versions, directory structure, route table, data models (Project/ThoughtChain/BusinessLine TypeScript types), component API specs (props/exports for every component), 3D scene specs (camera FOV/material/shader/postprocessing params from PRD), style tokens (CSS vars/Tailwind/dark theme), performance targets (bundle/Lighthouse/FPS), responsive breakpoints, SEO/accessibility spec, Vercel deploy config for show.vercel.app. Write the file.',
  { label: 'spec-gen', phase: 'SPEC' }
)
log('SPEC.md generated')

phase('Review')
var reviewR = await agent(
  'In /Users/hang/Documents/projects2/portfolio/ run final code review. Steps: (1) cd /Users/hang/Documents/projects2/portfolio && npx tsc --noEmit must be 0 errors (2) verify src/data/projects.ts has 32 projects each with thoughtChain (3) verify all 3D components have geometry/material dispose (4) verify all dynamic imports use ssr:false (5) verify layout.tsx uses StarFieldWrapper (6) verify no conflicting CSS vars in globals.css (7) verify all page imports are correct. Fix any issues found. Re-run tsc after fixes. Return JSON with success:boolean and message:string.',
  { label: 'final-review', phase: 'Review', schema: RS }
)
log('Review: ' + (reviewR ? reviewR.message : 'done'))

phase('Build')
var buildR = await agent(
  'In /Users/hang/Documents/projects2/portfolio/ run npm run build. If it fails, analyze errors, fix them, and retry. Ensure all 32 project slug pages are generated as static HTML. Return JSON with success:boolean and message:string.',
  { label: 'build', phase: 'Build', schema: RS }
)
log('Build: ' + (buildR ? buildR.message : 'done'))

phase('Deploy')
var deployR = await agent(
  'In /Users/hang/Documents/projects2/portfolio/ deploy to Vercel as show.vercel.app. Steps: (1) check git remote, if none: gh repo create show --public and git remote add origin (2) git add -A and git commit any uncommitted changes (3) git push -u origin main (4) run vercel --prod to deploy. If vercel CLI not linked, run vercel link --yes first. Return JSON with success:boolean and message:string.',
  { label: 'deploy', phase: 'Deploy', schema: RS }
)
log('Deploy: ' + (deployR ? deployR.message : 'done'))

phase('Verify')
if (deployR && deployR.success) {
  await agent(
    'Verify https://show.vercel.app is live. Use curl to check: (1) homepage returns 200 (2) /projects returns 200 (3) /projects/campus-health returns 200 (4) /about returns 200. Return JSON with success:boolean and message:string.',
    { label: 'verify', phase: 'Verify', schema: RS }
  )
}

return { done: true }

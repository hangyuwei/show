import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';
import { AboutInkVortexBackdrop } from '@/components/threeui/backdrops';

export const metadata: Metadata = {
  title: '关于杭',
  description:
    '我是杭，一名把全栈工程、AI 应用和大健康行业经验连接起来的独立开发者。',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: '关于杭',
    description:
      '我是杭，一名把全栈工程、AI 应用和大健康行业经验连接起来的独立开发者。',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] overflow-hidden">
        <AboutInkVortexBackdrop />
      </div>
      <div className="relative z-10 pt-14 pb-14 px-4 sm:pt-16 sm:pb-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <AboutContent />
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: '关于 - Hang 的作品集',
  description: '全栈开发工程师 / 大健康行业技术专家。跨领域复合能力，专注技术与行业深度结合。',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <AboutContent />
      </div>
    </div>
  );
}

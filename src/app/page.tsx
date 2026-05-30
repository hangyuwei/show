import type { Metadata } from 'next';
import Hero from '@/components/Hero';

export const metadata: Metadata = {
  title: "Hang's Portfolio - 全栈开发 · AI应用 · 大健康",
  description:
    '探索Hang的项目宇宙：涵盖大健康、AI应用、Web开发、创意设计与学术研究五大业务线。',
};

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />

      {/* Featured Projects placeholder */}
      <section
        id="featured-projects"
        className="flex min-h-screen flex-col items-center justify-center px-6 py-24"
      >
        <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          精选项目
        </h2>
        <p className="max-w-md text-center text-muted">
          项目展示区域即将上线，敬请期待。
        </p>
      </section>
    </main>
  );
}

import ScrollScrubHero from './ScrollScrubHero';

const heroAssets = {
  mp4Src: '/hero/astrolabe-scroll.mp4',
  webmSrc: '/hero/astrolabe-scroll.webm',
  posterSrc: '/hero/astrolabe-poster.webp',
  duration: 12,
};

export default function Hero() {
  return (
    <ScrollScrubHero {...heroAssets}>
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-100/70 sm:text-xs">
          Cosmic Project Atlas
        </p>

        <h1 className="hero-text max-w-5xl text-balance text-5xl font-black leading-none text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.25rem]">
          Hang&apos;s Portfolio
        </h1>

        <div className="my-7 h-px w-56 bg-gradient-to-r from-transparent via-cyan-200/55 to-transparent sm:w-80" />

        <p className="max-w-2xl text-balance text-base font-medium leading-8 text-cyan-50/78 sm:text-lg md:text-xl">
          全栈开发 · AI应用 · 大健康行业
          <span className="mx-3 text-cyan-200/28">/</span>
          用代码构建未来，以智能系统连接创意与现实。
        </p>

        <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#featured-projects"
            className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full border border-cyan-100/20 bg-cyan-100/[0.055] px-8 py-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-cyan-50 shadow-[0_0_40px_rgba(101,216,255,0.12)] backdrop-blur-md transition duration-300 hover:border-cyan-100/40 hover:bg-cyan-100/[0.09]"
          >
            <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-500 group-hover:left-full group-hover:opacity-100" />
            <span className="relative">探索项目宇宙</span>
          </a>

          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/32">
            Scroll to pilot the frame
          </span>
        </div>
      </div>
    </ScrollScrubHero>
  );
}

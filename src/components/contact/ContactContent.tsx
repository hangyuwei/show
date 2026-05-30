'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(
  () => import('@/components/three/ParticleBackground'),
  {
    ssr: false,
  }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function ContactContent() {
  return (
    <>
      <ParticleBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex items-center justify-center px-4 sm:px-6"
      >
        <div className="w-full max-w-lg">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">联系我</h1>
            <p className="text-sm sm:text-base text-white/50">
              期待与你的交流与合作
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            {/* GitHub Card */}
            <a
              href="https://github.com/hangyuwei"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-white/70"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-white mb-0.5">
                    GitHub
                  </h2>
                  <p className="text-sm text-white/50 truncate">
                    github.com/hangyuwei
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:13811282241@163.com"
              className="block rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-white mb-0.5">
                    Email
                  </h2>
                  <p className="text-sm text-white/50 truncate">
                    13811282241@163.com
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </a>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-white/30 mt-10"
          >
            欢迎通过以上方式联系我
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}

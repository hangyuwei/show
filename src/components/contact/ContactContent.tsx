'use client';

import { useState } from 'react';
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
      staggerChildren: 0.12,
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

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/hangyuwei',
    label: 'github.com/hangyuwei',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:13811282241@163.com',
    label: '13811282241@163.com',
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
];

export default function ContactContent() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <ParticleBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12"
      >
        <div className="w-full max-w-lg">
          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-heading accent-gradient-text">
              联系我
            </h1>
            <p className="text-sm sm:text-base text-white/50">
              期待与你的交流与合作
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={itemVariants}
            className="space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name */}
            <div className="relative">
              <label
                htmlFor="name"
                className={`block text-xs font-medium mb-1.5 ml-1 transition-colors duration-300 ${
                  focused === 'name' ? 'text-[var(--accent)]' : 'text-white/50'
                }`}
              >
                姓名
              </label>
              <div
                className={`relative rounded-xl transition-all duration-500 ${
                  focused === 'name'
                    ? 'ring-1 ring-[var(--accent)]/40 shadow-[0_0_20px_rgba(33,150,255,0.2),0_0_40px_rgba(33,150,255,0.05)]'
                    : ''
                }`}
              >
                {/* Animated gradient border glow on focus */}
                {focused === 'name' && (
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-[var(--accent)]/30 via-[var(--color-accent-teal)]/20 to-[var(--accent)]/30 opacity-60 blur-sm animate-pulse pointer-events-none" />
                )}
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  placeholder="你的名字"
                  className="relative w-full rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-3 text-sm text-white/90 placeholder-white/25 outline-none backdrop-blur-xl transition-all duration-500 focus:border-[var(--accent)]/50 focus:bg-[var(--glass-bg-hover)]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label
                htmlFor="email"
                className={`block text-xs font-medium mb-1.5 ml-1 transition-colors duration-300 ${
                  focused === 'email' ? 'text-[var(--accent)]' : 'text-white/50'
                }`}
              >
                邮箱
              </label>
              <div
                className={`relative rounded-xl transition-all duration-500 ${
                  focused === 'email'
                    ? 'ring-1 ring-[var(--accent)]/40 shadow-[0_0_20px_rgba(33,150,255,0.2),0_0_40px_rgba(33,150,255,0.05)]'
                    : ''
                }`}
              >
                {focused === 'email' && (
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-[var(--accent)]/30 via-[var(--color-accent-teal)]/20 to-[var(--accent)]/30 opacity-60 blur-sm animate-pulse pointer-events-none" />
                )}
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="your@email.com"
                  className="relative w-full rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-3 text-sm text-white/90 placeholder-white/25 outline-none backdrop-blur-xl transition-all duration-500 focus:border-[var(--accent)]/50 focus:bg-[var(--glass-bg-hover)]"
                />
              </div>
            </div>

            {/* Message */}
            <div className="relative">
              <label
                htmlFor="message"
                className={`block text-xs font-medium mb-1.5 ml-1 transition-colors duration-300 ${
                  focused === 'message' ? 'text-[var(--accent)]' : 'text-white/50'
                }`}
              >
                留言
              </label>
              <div
                className={`relative rounded-xl transition-all duration-500 ${
                  focused === 'message'
                    ? 'ring-1 ring-[var(--accent)]/40 shadow-[0_0_20px_rgba(33,150,255,0.2),0_0_40px_rgba(33,150,255,0.05)]'
                    : ''
                }`}
              >
                {focused === 'message' && (
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-[var(--accent)]/30 via-[var(--color-accent-teal)]/20 to-[var(--accent)]/30 opacity-60 blur-sm animate-pulse pointer-events-none" />
                )}
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  placeholder="想对我说什么..."
                  className="relative w-full rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-3 text-sm text-white/90 placeholder-white/25 outline-none backdrop-blur-xl transition-all duration-500 resize-none focus:border-[var(--accent)]/50 focus:bg-[var(--glass-bg-hover)]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(33,150,255,0.4),0_0_60px_rgba(0,229,255,0.15)] active:shadow-[0_0_15px_rgba(33,150,255,0.3)]"
            >
              {/* Multi-stop gradient with purple midpoint */}
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] via-[var(--color-accent-purple)]/70 to-[var(--color-accent-teal)] opacity-90 hover:opacity-100 transition-opacity duration-300" />
              {/* Shimmer sweep effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                发送消息
              </span>
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 my-8"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs text-white/30">或通过</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>

          {/* Social Links as icon cards */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 rounded-xl px-5 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--accent)]/30 hover:bg-[var(--glass-bg-hover)] hover:shadow-[0_0_24px_rgba(33,150,255,0.15),0_8px_32px_rgba(0,0,0,0.3)]"
              >
                {/* Gradient underline accent on hover */}
                <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/0 to-transparent group-hover:via-[var(--accent)]/60 transition-all duration-500" />
                <span className="text-white/60 group-hover:text-[var(--accent)] transition-colors duration-300">
                  {link.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors duration-300">
                    {link.name}
                  </span>
                  <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors duration-300">
                    {link.label}
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-white/30 mt-8"
          >
            欢迎通过以上方式联系我
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}

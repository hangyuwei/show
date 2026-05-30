import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StarFieldWrapper from '@/components/three/StarFieldWrapper';
import Navbar from '@/components/ui/Navbar';
import PageTransition from '@/components/PageTransition';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Hang's Portfolio",
  description: '全栈开发 · AI应用 · 大健康行业 - 探索项目宇宙',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StarFieldWrapper />
        <Navbar />
        <main className="flex-1 pt-16">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}

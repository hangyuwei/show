import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import StarFieldWrapper from '@/components/three/StarFieldWrapper';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#06091a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <StarFieldWrapper />
        <Navbar />
        <main className="flex-1 pt-14 sm:pt-16 md:pt-18">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        {/* Scroll-triggered reveal utility — applied globally, respects reduced-motion */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof IntersectionObserver === 'undefined') return;
                var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                /* If user prefers reduced motion, reveal everything immediately */
                if (prefersReduced) {
                  document.querySelectorAll('[data-reveal]').forEach(function(el) {
                    el.setAttribute('data-revealed', '');
                  });
                  /* Also handle dynamically added elements in reduced-motion mode */
                  var reducedMutObs = new MutationObserver(function(mutations) {
                    mutations.forEach(function(m) {
                      m.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                          if (node.hasAttribute && node.hasAttribute('data-reveal')) {
                            node.setAttribute('data-revealed', '');
                          }
                          if (node.querySelectorAll) {
                            node.querySelectorAll('[data-reveal]').forEach(function(el) {
                              el.setAttribute('data-revealed', '');
                            });
                          }
                        }
                      });
                    });
                  });
                  reducedMutObs.observe(document.body, { childList: true, subtree: true });
                  return;
                }

                var obs = new IntersectionObserver(function(entries) {
                  entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                      entry.target.setAttribute('data-revealed', '');
                      obs.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
                document.querySelectorAll('[data-reveal]').forEach(function(el) {
                  obs.observe(el);
                });
                /* Also observe dynamically added elements */
                var mutObs = new MutationObserver(function(mutations) {
                  mutations.forEach(function(m) {
                    m.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1) {
                        if (node.hasAttribute && node.hasAttribute('data-reveal')) {
                          obs.observe(node);
                        }
                        if (node.querySelectorAll) {
                          node.querySelectorAll('[data-reveal]').forEach(function(el) {
                            obs.observe(el);
                          });
                        }
                      }
                    });
                  });
                });
                mutObs.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

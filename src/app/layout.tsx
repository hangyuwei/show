import type { Metadata, Viewport } from 'next';
import './globals.css';
import StarFieldWrapper from '@/components/three/StarFieldWrapper';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import PageTransition from '@/components/PageTransition';

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
      className="h-full antialiased scroll-smooth"
    >
      <body
        className="min-h-full flex flex-col overflow-x-hidden"
        suppressHydrationWarning
      >
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

                /* Responsive threshold: less on mobile for earlier reveals */
                var isMobile = window.innerWidth < 640;
                var threshold = isMobile ? 0.05 : 0.1;
                var rootMargin = isMobile ? '0px 0px -10px 0px' : '0px 0px -30px 0px';

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
                      var delay = entry.target.getAttribute('data-reveal-delay');
                      if (delay) {
                        setTimeout(function() {
                          entry.target.setAttribute('data-revealed', '');
                        }, parseInt(delay, 10) || 0);
                      } else {
                        entry.target.setAttribute('data-revealed', '');
                      }
                      obs.unobserve(entry.target);
                    }
                  });
                }, { threshold: threshold, rootMargin: rootMargin });
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

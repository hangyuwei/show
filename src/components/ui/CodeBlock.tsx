import { Geist_Mono } from 'next/font/google';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-700/50">
      <div className="flex items-center gap-2 border-b border-zinc-700/50 bg-[#181825] px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-zinc-500">{language}</span>
      </div>
      <div className="relative bg-[#1e1e2e] p-4">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 to-teal-500" />
        <pre className={`${geistMono.className} overflow-x-auto pl-4 text-sm leading-relaxed text-zinc-300`}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

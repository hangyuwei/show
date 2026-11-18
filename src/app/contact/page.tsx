import type { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: '联系',
  description: '联系 Hang：GitHub、Email 等联系方式。',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: '联系',
    description: '联系 Hang：GitHub、Email 等联系方式。',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <ContactContent />
    </div>
  );
}

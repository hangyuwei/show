import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: '联系 - Hang 的作品集',
  description: '联系 Hang：GitHub、Email 等联系方式。',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <ContactContent />

      <Footer />
    </div>
  );
}

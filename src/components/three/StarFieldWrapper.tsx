'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const StarField = dynamic(() => import('@/components/three/StarField'), {
  ssr: false,
});

export default function StarFieldWrapper() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return <StarField />;
}

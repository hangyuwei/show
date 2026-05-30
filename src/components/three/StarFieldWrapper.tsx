'use client';

import { usePathname } from 'next/navigation';
import StarField from '@/components/three/StarField';

export default function StarFieldWrapper() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return <StarField />;
}

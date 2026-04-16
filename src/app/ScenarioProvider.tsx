'use client';

import { usePathname } from 'next/navigation';
import { ScenarioBar } from '@/components/layout/ScenarioBar';

export function ScenarioProvider() {
  const pathname = usePathname();
  // Don't show on landing page
  if (pathname === '/') return null;
  return <ScenarioBar />;
}

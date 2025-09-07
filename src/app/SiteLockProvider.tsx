'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PAGE_TOKENS } from './tokens';
import { COOKIE_SITE_LOCKED } from './constants';

export default function SiteLockProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the lock cookie exists
    if (document.cookie.includes(`${COOKIE_SITE_LOCKED}=true`)) {
      // If the user is not already on the final page, redirect them
      if (pathname !== '/End') {
        router.replace(`/End?token=${PAGE_TOKENS.End}`);
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}

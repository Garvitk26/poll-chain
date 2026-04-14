'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/creator/settings/account');
  }, [router]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="spin-ring opacity-20" />
    </div>
  );
}

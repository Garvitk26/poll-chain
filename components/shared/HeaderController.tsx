'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import WalletStatusBar from './WalletStatusBar';

export default function HeaderController() {
  const pathname = usePathname();

  // Hide headers on dashboard and auth pages
  const isDashboard = pathname?.startsWith('/voter') || pathname?.startsWith('/creator');
  const isAuth = pathname?.startsWith('/login') || pathname?.startsWith('/signup');

  if (isDashboard || isAuth) {
    return null;
  }

  return (
    <>
      <WalletStatusBar />
      <Navbar />
    </>
  );
}

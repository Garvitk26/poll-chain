'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import SessionWatcher from '@/components/shared/SessionWatcher';
import WalletButton from '@/components/shared/WalletButton';

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

  if (status === 'unauthenticated' || !session) {
    router.push('/login?returnUrl=' + pathname);
    return null;
  }

  if (session.user.role !== 'voter') {
    router.push('/creator/dashboard');
    return null;
  }

  const navLinks = [
    { label: 'Discover', href: '/voter/dashboard' },
    { label: 'My Votes', href: '/voter/history' },
    { label: 'Profile', href: '/voter/profile' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#00080f]">
      <SessionWatcher />
      
      {/* Secondary Voter Navbar */}
      <div className="w-full bg-[#001224] border-b border-cyan-500/10 px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-slate-200">
            PollChain <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full ml-2">Voter</span>
          </Link>
          
          <div className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm ${pathname === link.href ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <WalletButton />
          <div 
            className="w-8 h-8 rounded-full border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: session.user.avatarColor || '#6366f1' }}
          >
            {session.user.name?.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}

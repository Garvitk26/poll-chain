'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import SessionWatcher from '@/components/shared/SessionWatcher';
import WalletButton from '@/components/shared/WalletButton';
import WalletStatusBar from '@/components/shared/WalletStatusBar';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Networks } from '@stellar/stellar-sdk';

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    async function checkNetwork() {
      if (typeof window === 'undefined') return
      try {
        const { getNetworkDetails } = await import('@stellar/freighter-api')
        const details = await getNetworkDetails()
        if (details.networkPassphrase !== Networks.TESTNET) {
          setWrongNetwork(true)
        } else {
          setWrongNetwork(false)
        }
      } catch {
        // Freighter not installed
      }
    }
    checkNetwork()
    const interval = setInterval(checkNetwork, 10000)
    return () => clearInterval(interval)
  }, [])

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
    <div className="flex flex-col min-h-screen bg-[#00080f] relative overflow-hidden">
      <SessionWatcher />
      
      {/* Secondary Voter Navbar */}
      <nav className="w-full bg-[#001224] border-b border-rose-500/10 px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <ShieldCheck className="text-white w-5 h-5" />
             </div>
             <span className="text-xl font-black italic tracking-tighter text-slate-200">
               PollChain <span className="text-[10px] font-black not-italic text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full ml-1 uppercase tracking-widest">Protocol</span>
             </span>
          </Link>
          
          <div className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${pathname === link.href ? 'text-violet-400 shadow-[0_0_10px_rgba(129,140,248,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <WalletButton />
          
          <div className="h-8 w-px bg-white/10 hidden md:block" />

          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-xl border border-violet-500/30 flex items-center justify-center text-sm font-black text-white shadow-xl italic"
              style={{ backgroundColor: session.user.avatarColor || '#6366f1' }}
            >
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-right">
                <p className="text-xs font-black text-slate-200 uppercase leading-none mb-1">{session.user.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Consensus Voter</p>
            </div>
          </div>
        </div>
      </nav>

      {wrongNetwork && (
        <div className="w-full bg-rose-600 text-white py-2 px-4 flex items-center justify-center gap-2 z-[100] animate-in slide-in-from-top duration-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider text-center">
            Wrong Network: Switch Freighter to Stellar Testnet to use PollChain
          </span>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
        {children}
      </main>

    </div>
  );
}

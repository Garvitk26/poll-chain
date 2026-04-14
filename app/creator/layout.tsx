'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, PlusCircle, List, BarChart3, Settings, LogOut, AlertTriangle, ShieldCheck, Menu, X } from 'lucide-react';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import SessionWatcher from '@/components/shared/SessionWatcher';
import WalletStatusBar from '@/components/shared/WalletStatusBar';
import { cn } from '@/lib/utils';
import { Networks } from '@stellar/stellar-sdk';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (session.user.role !== 'creator') {
    router.push('/voter/dashboard');
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/creator/dashboard', icon: LayoutDashboard, color: 'text-rose-400', activeBg: 'bg-rose-500/10', activeBorder: 'border-rose-400' },
    { label: 'Create Poll', href: '/creator/polls/new', icon: PlusCircle, color: 'text-violet-400', activeBg: 'bg-violet-500/10', activeBorder: 'border-violet-400' },
    { label: 'My Polls', href: '/creator/polls', icon: List, color: 'text-violet-400', activeBg: 'bg-violet-500/10', activeBorder: 'border-violet-400' },
    { label: 'Analytics', href: '/creator/analytics', icon: BarChart3, color: 'text-amber-400', activeBg: 'bg-amber-500/10', activeBorder: 'border-amber-400' },
    { label: 'Settings', href: '/creator/settings/account', icon: Settings, color: 'text-slate-400', activeBg: 'bg-slate-500/10', activeBorder: 'border-slate-400' },
  ];

  return (
    <div className="flex min-h-screen bg-[#00080f] relative overflow-hidden">
      <SessionWatcher />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-[#000d1a] border-r border-rose-500/10 flex flex-col shrink-0 transition-transform duration-300 z-50 overflow-y-auto",
        "fixed inset-y-0 left-0 md:static md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <Link href="/" className="text-2xl font-black italic tracking-tighter flex items-center gap-2 group">
            <div className="h-8 w-8 bg-rose-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
               <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="gradient-text uppercase">PollChain</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/creator/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-r-md border-l-2 transition-colors ${
                  isActive 
                    ? `${item.activeBg} ${item.activeBorder} text-slate-100` 
                    : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                <span className="font-bold text-xs uppercase tracking-widest leading-none">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-rose-500/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black border border-white/10 italic shadow-lg"
              style={{ backgroundColor: session.user.avatarColor || '#f43f5e' }}
            >
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-200 truncate uppercase tracking-tight">{session.user.name}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase font-bold">Protocol Creator</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2.5 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            Logout of Protocol
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full">
        {/* Mobile Toggle */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-[60] bg-rose-600 text-white p-2 rounded-lg md:hidden shadow-lg border border-rose-400/50"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {wrongNetwork && (
          <div className="w-full bg-rose-600 text-white py-2 px-4 flex items-center justify-center gap-2 z-[100] animate-in slide-in-from-top duration-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-center">
              Wrong Network: Switch Freighter to Stellar Testnet to use PollChain
            </span>
          </div>
        )}
        <main className="flex-1 overflow-y-auto pt-4 md:pt-8 px-4 md:px-8 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
